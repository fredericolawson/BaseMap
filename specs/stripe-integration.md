# Stripe Integration Specification for BaseMap

## Overview

This document outlines the implementation plan for integrating Stripe payments into the BaseMap application, enabling users to purchase the BaseMap product ($10/month subscription) from the account page. The integration leverages existing Stripe foreign tables in Supabase for real-time data access.

## Architecture Overview

### Key Design Decisions

1. **Foreign Table Approach**: Utilize existing Stripe foreign tables wrapper in Supabase to access Stripe data in real-time
2. **Minimal Data Duplication**: Only store user-to-customer mapping in Supabase
3. **Server-Side Security**: All Stripe API operations handled through secure Next.js API routes
4. **Real-Time Data**: Subscription status pulled directly from Stripe via foreign tables

## Stripe Packages & Elements

### NPM Packages

#### 1. `stripe` (v14.x)
**Purpose**: Server-side Stripe SDK for Node.js
**Usage**:
- Creating checkout sessions
- Managing customer portal sessions
- Webhook event handling
- Customer creation and management

**Key Features Used**:
- `Stripe()` constructor for initialization
- `stripe.checkout.sessions.create()` for payment flow
- `stripe.billingPortal.sessions.create()` for subscription management
- `stripe.webhooks.constructEvent()` for webhook security
- `stripe.customers.create()` for new customer setup

#### 2. `@stripe/stripe-js` (v3.x)
**Purpose**: Client-side Stripe.js loader
**Usage**:
- Loading Stripe.js asynchronously
- Redirecting to Stripe Checkout
- Ensuring PCI compliance

**Key Features Used**:
- `loadStripe()` for initializing Stripe on client
- `stripe.redirectToCheckout()` for payment flow
- Type definitions for TypeScript support

#### 3. `@stripe/react-stripe-js` (v2.x) - Optional
**Purpose**: React components for Stripe Elements
**Usage**: 
- If we need embedded payment forms in the future
- Currently not needed for Checkout-based flow

**Potential Future Use**:
- `<Elements>` provider component
- `<PaymentElement>` for embedded checkout
- `useStripe()` and `useElements()` hooks

### Stripe Products Configuration

**BaseMap Product Details**:
- Product ID: `prod_SulPdX3GzogaRv`
- Price ID: `price_1RyvsD0e0YMbbSLn3uDqkHtX`
- Amount: $10.00/month
- Currency: USD
- Billing: Monthly recurring

### Stripe Checkout Features

**Checkout Session Configuration**:
```typescript
{
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_1RyvsD0e0YMbbSLn3uDqkHtX',
    quantity: 1
  }],
  success_url: '/account?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: '/account',
  customer_email: user.email, // Pre-fill from Supabase auth
  metadata: {
    user_id: user.id // Link to Supabase user
  }
}
```

**Features Utilized**:
- Hosted checkout page (no PCI compliance burden)
- Automatic tax calculation (if configured)
- SCA/3D Secure handling
- Multiple payment methods support
- Mobile-optimized checkout

### Stripe Customer Portal Features

**Portal Configuration**:
- Subscription management (pause/cancel)
- Update payment methods
- Download invoices
- View billing history
- Update billing address

## Database Schema

### 1. User-Customer Mapping Table (Public Schema)

Since this Supabase instance serves multiple projects, we'll create the user-customer mapping in the `public` schema for reusability:

```sql
-- Create a shared user-to-Stripe-customer mapping table
CREATE TABLE IF NOT EXISTS user_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT, -- Store email for reference
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_customer UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_customers_user_id ON user_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_customers_stripe_id ON user_customers(stripe_customer_id);
```

### 2. Generic User Subscriptions View (Public Schema)

Create a general-purpose view for all user subscriptions across all products:

```sql
-- View for ALL user subscriptions (any product)
CREATE OR REPLACE VIEW user_subscriptions AS
SELECT 
  uc.user_id,
  uc.stripe_customer_id,
  s.id as subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.created,
  s.canceled_at,
  s.cancel_at,
  s.items,
  p.id as product_id,
  p.name as product_name,
  p.description as product_description,
  pr.id as price_id,
  pr.unit_amount as price_cents,
  pr.currency,
  pr.recurring
FROM user_customers uc
INNER JOIN stripe.subscriptions s ON s.customer = uc.stripe_customer_id
LEFT JOIN LATERAL (
  SELECT items->0->>'price' as price_id
  FROM jsonb_array_elements(s.items->'data') as items
  LIMIT 1
) as item ON true
LEFT JOIN stripe.prices pr ON pr.id = item.price_id
LEFT JOIN stripe.products p ON p.id = pr.product;
```

### 3. BaseMap-Specific Subscription View (Public Schema)

Create a filtered view specifically for BaseMap subscriptions:

```sql
-- View specifically for BaseMap subscriptions
CREATE OR REPLACE VIEW basemap_subscriptions AS
SELECT * FROM user_subscriptions
WHERE product_id = 'prod_SulPdX3GzogaRv';  -- Filter for BaseMap product only
```

### 4. Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_customers ENABLE ROW LEVEL SECURITY;

-- Users can only see their own customer mapping
CREATE POLICY "Users can view own customer mapping" ON user_customers
  FOR SELECT USING (auth.uid() = user_id);

-- Only system can insert/update (via service role in API routes)
CREATE POLICY "System can manage customer mappings" ON user_customers
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions on views
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT SELECT ON basemap_subscriptions TO authenticated;
```

## Server Actions & API Implementation

### Server Actions (Replacing Traditional API Routes)

We can simplify most Stripe operations into server actions, keeping only the webhook as an API route:

### 1. `/app/actions/stripe.ts` - Server Actions File

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
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
      email: user.email,
      metadata: { user_id: user.id }
    });
    customerId = customer.id;
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.NEXT_PUBLIC_BASEMAP_PRICE_ID,
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    metadata: { user_id: user.id }
  });
  
  // Redirect to Stripe Checkout
  redirect(session.url!);
}

export async function createPortalSession() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Get customer ID
  const { data: customer } = await supabase
    .from('user_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  
  if (!customer?.stripe_customer_id) {
    throw new Error('No subscription found');
  }
  
  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`
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
  const { data: subscription } = await supabase
    .from('basemap_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return subscription;
}
```

### 2. `/app/api/stripe/webhook/route.ts` - Webhook Handler (Still Needed as API Route)

**Why Keep as API Route**: Webhooks must be POST endpoints that Stripe can call, so they can't be server actions.

**Functionality**:
- Verify webhook signature
- Handle checkout completion
- Create user-customer mapping

**Webhook Events Handled**:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create user-customer mapping in database |
| `customer.subscription.updated` | No action needed (foreign tables auto-update) |
| `customer.subscription.deleted` | Optional: Log cancellation for analytics |
| `invoice.payment_succeeded` | Optional: Send receipt email |
| `invoice.payment_failed` | Optional: Send payment failure notification |

**Security**:
- Verify webhook signature using `stripe.webhooks.constructEvent()`
- Use `STRIPE_WEBHOOK_SECRET` environment variable
- Return 400 for invalid signatures

## Frontend Components

### 1. `SubscriptionStatus.tsx`

**Usage with Server Actions**:
```typescript
import { getSubscriptionStatus } from '@/app/actions/stripe';

export default async function SubscriptionStatus() {
  const subscription = await getSubscriptionStatus();
  
  if (!subscription) return null;
  
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{subscription.product_name}</h3>
      <p>Status: {subscription.status}</p>
      <p>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
    </div>
  );
}
```

**Features**:
- Server component that directly calls server action
- No client-side state management needed
- Automatic revalidation on navigation

### 2. `PurchaseButton.tsx`

**Usage with Server Actions**:
```typescript
import { createCheckoutSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';

export default function PurchaseButton() {
  return (
    <form action={createCheckoutSession}>
      <Button type="submit">
        Subscribe to BaseMap - $10/month
      </Button>
    </form>
  );
}
```

**Features**:
- Simple form submission to server action
- Automatic loading state via form submission
- Server-side redirect to Stripe Checkout
- No client-side API calls needed

### 3. `ManageSubscriptionButton.tsx`

**Usage with Server Actions**:
```typescript
import { createPortalSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';

export default function ManageSubscriptionButton() {
  return (
    <form action={createPortalSession}>
      <Button type="submit" variant="outline">
        Manage Subscription
      </Button>
    </form>
  );
}
```

**Features**:
- Direct form submission to server action
- Server-side redirect to customer portal
- Automatic error handling via error boundaries

## Custom Hooks

### 1. `useSubscription.ts`

```typescript
interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useSubscription(): UseSubscriptionReturn
```

**Features**:
- Real-time subscription query from foreign tables
- Automatic refetch on window focus
- Cache with SWR or React Query
- Error handling

### 2. `useStripeCheckout.ts`

```typescript
interface UseStripeCheckoutReturn {
  createCheckout: () => Promise<void>;
  isCreating: boolean;
  error: Error | null;
}

function useStripeCheckout(priceId: string): UseStripeCheckoutReturn
```

**Features**:
- Handle checkout session creation
- Redirect to Stripe Checkout
- Error handling
- Loading states

## Environment Variables

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_... # Server-side secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # Client-side publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret

# Product Configuration
NEXT_PUBLIC_BASEMAP_PRICE_ID=price_1RyvsD0e0YMbbSLn3uDqkHtX
NEXT_PUBLIC_BASEMAP_PRODUCT_ID=prod_SulPdX3GzogaRv

# Existing Supabase Config
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # For server-side operations
```

## File Structure

```
/src
├── app/
│   ├── account/
│   │   └── page.tsx (modified)
│   ├── actions/
│   │   └── stripe.ts (new) - Server actions for Stripe operations
│   └── api/
│       └── stripe/
│           └── webhook/
│               └── route.ts (new) - Only webhook needs API route
├── components/
│   ├── subscription-status.tsx (new) - Server component
│   ├── purchase-button.tsx (new) - Server component  
│   └── manage-subscription-button.tsx (new) - Server component
├── lib/
│   ├── stripe/
│   │   └── server.ts (new) - Stripe SDK initialization
│   └── supabase/
│       ├── server.ts (existing)
│       └── client.ts (existing)
└── types/
    └── stripe.ts (new) - TypeScript types for Stripe data
```

**Note**: With server actions, we've eliminated the need for:
- Multiple API route files (replaced by single `actions/stripe.ts`)
- Client-side Stripe initialization (`stripe/client.ts` not needed)
- Custom hooks for API calls (server components handle data fetching)
- Complex state management (server actions handle redirects)

## Implementation Timeline

### Phase 1: Infrastructure Setup (Day 1)
- [ ] Create basemap schema and tables
- [ ] Set up environment variables
- [ ] Install Stripe packages
- [ ] Create Stripe lib files

### Phase 2: Backend Implementation (Day 2)
- [ ] Implement checkout session API
- [ ] Implement portal session API
- [ ] Set up webhook handler
- [ ] Test with Stripe CLI

### Phase 3: Frontend Components (Day 3)
- [ ] Build SubscriptionStatus component
- [ ] Build PurchaseButton component
- [ ] Build ManageSubscriptionButton component
- [ ] Create custom hooks

### Phase 4: Integration (Day 4)
- [ ] Integrate with account page
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add success notifications

### Phase 5: Testing & Deployment (Day 5)
- [ ] Test full payment flow in test mode
- [ ] Test subscription management
- [ ] Test webhook reliability
- [ ] Deploy and switch to live keys

## Testing Strategy

### Test Scenarios

1. **New User Purchase Flow**:
   - User without subscription clicks purchase
   - Successful payment creates mapping
   - Subscription appears immediately

2. **Existing Subscriber Access**:
   - User with active subscription sees status
   - Can access customer portal
   - Cannot purchase again

3. **Subscription Cancellation**:
   - User cancels in portal
   - Status updates in app
   - Access continues until period end

4. **Payment Failure Handling**:
   - Card decline in checkout
   - Expired card for renewal
   - Insufficient funds

### Stripe Test Cards

| Scenario | Card Number | 
|----------|------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0025 0000 3155 |
| Insufficient Funds | 4000 0000 0000 9995 |

## Security Considerations

1. **API Route Protection**:
   - Verify Supabase auth token
   - Use service role key for database writes
   - Rate limiting on checkout creation

2. **Webhook Security**:
   - Verify Stripe signature
   - Idempotency handling
   - Retry logic for failures

3. **Data Privacy**:
   - No card details stored
   - Minimal PII in database
   - Stripe handles PCI compliance

4. **RLS Policies**:
   - Users see only their data
   - Service role for system operations
   - No direct table access from client

## Monitoring & Analytics

### Key Metrics to Track

1. **Conversion Metrics**:
   - Checkout abandonment rate
   - Successful subscription rate
   - Time to purchase

2. **Subscription Metrics**:
   - Monthly recurring revenue (MRR)
   - Churn rate
   - Customer lifetime value (CLV)

3. **Technical Metrics**:
   - Webhook success rate
   - API response times
   - Error rates

### Error Monitoring

- Log webhook failures
- Track API errors
- Monitor foreign table query performance
- Alert on payment failures

## Future Enhancements

1. **Multiple Pricing Tiers**:
   - Add annual billing option
   - Student discounts
   - Team/enterprise plans

2. **Enhanced Features**:
   - Usage-based billing
   - Metered billing for API calls
   - Add-on products

3. **Improved UX**:
   - Embedded checkout (Stripe Elements)
   - Payment method management in-app
   - Invoice downloads in-app

4. **Analytics Dashboard**:
   - Revenue charts
   - Subscription analytics
   - Customer insights

## References

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Foreign Data Wrappers](https://supabase.com/docs/guides/database/extensions/wrappers)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)