// Types for subscription data from the user_subscriptions view
export interface SubscriptionData {
  subscription_id: string;
  status: 'active' | 'trialing' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  product_name: string;
  price_cents: number;
  currency: string;
  user_id: string;
  stripe_customer_id: string;
}

// Types for customer data from user_customers table
export interface CustomerData {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Types for server action responses
export interface StripeActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// Types for webhook events
export interface WebhookEventData {
  type: string;
  id: string;
  object: unknown;
  created: number;
}

// Subscription status for display
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';

// Product configuration
export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  price_id: string;
  price_cents: number;
  currency: string;
  interval: 'month' | 'year';
}
