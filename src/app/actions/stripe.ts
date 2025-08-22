'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('You must be logged in to subscribe');
  }
  
  // Check for existing customer
  const { data: existingCustomer } = await supabase
    .from('user_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  
  let customerId = existingCustomer?.stripe_customer_id;
  
  // Create Stripe customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { 
        user_id: user.id,
        supabase_user_id: user.id 
      }
    });
    customerId = customer.id;
    
    // Store the customer mapping (will be updated by webhook with proper service role)
    // This is a temporary mapping that webhook will properly create
  }
  
  // Check if user already has an active subscription
  const { data: existingSubscription } = await supabase
    .from('basemap_subscriptions')
    .select('subscription_id, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (existingSubscription) {
    // Redirect to portal if already subscribed
    return createPortalSession();
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.NEXT_PUBLIC_BASEMAP_PRICE_ID!,
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?canceled=true`,
    metadata: { 
      user_id: user.id,
      user_email: user.email!
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        product_id: process.env.NEXT_PUBLIC_BASEMAP_PRODUCT_ID!
      }
    }
  });
  
  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }
  
  // Redirect to Stripe Checkout
  redirect(session.url);
}

export async function createPortalSession() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('You must be logged in to manage your subscription');
  }
  
  // Get customer ID
  const { data: customer, error: customerError } = await supabase
    .from('user_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  
  if (customerError || !customer?.stripe_customer_id) {
    throw new Error('No subscription found. Please subscribe first.');
  }
  
  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?portal=true`
  });
  
  // Redirect to portal
  redirect(session.url);
}

export async function getSubscriptionStatus() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Query the basemap_subscriptions view
  const { data: subscription, error } = await supabase
    .from('basemap_subscriptions')
    .select(`
      subscription_id,
      status,
      current_period_start,
      current_period_end,
      product_name,
      price_cents,
      currency
    `)
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .single();
  
  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
  
  return subscription;
}

export async function checkUserHasCustomer() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  // Check if user has a customer record
  const { data: customer } = await supabase
    .from('user_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  
  return !!customer?.stripe_customer_id;
}