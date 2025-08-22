import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Disable body parsing, we need the raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the user_id from metadata
        const userId = session.metadata?.user_id;
        const userEmail = session.metadata?.user_email || session.customer_email;
        
        if (!userId || !session.customer) {
          console.error('Missing user_id or customer in checkout session');
          break;
        }

        // Create user-customer mapping using service role
        const supabaseServiceRole = await createServiceRoleClient();
        
        const { error: upsertError } = await supabaseServiceRole
          .from('user_customers')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            email: userEmail,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (upsertError) {
          console.error('Error creating user-customer mapping:', upsertError);
          // Don't throw - we still want to return 200 to Stripe
        } else {
          console.log(`Successfully linked user ${userId} to Stripe customer ${session.customer}`);
        }
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription ${subscription.id} updated. Status: ${subscription.status}`);
        // No action needed - foreign tables will reflect the update
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription ${subscription.id} canceled for customer ${subscription.customer}`);
        // No action needed - foreign tables will reflect the cancellation
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        // Optional: Send receipt email
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for invoice ${invoice.id}`);
        // Optional: Send payment failure notification
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 200 to prevent Stripe from retrying
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// Helper function to create service role client
async function createServiceRoleClient() {
  const { createClient } = await import('@supabase/supabase-js');
  
  // You'll need to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}