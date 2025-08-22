import { getSubscriptionStatus } from '@/app/actions/stripe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SubscriptionStatus() {
  const subscription = await getSubscriptionStatus();
  
  if (!subscription) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(cents / 100);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>
          {subscription.product_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium capitalize">
            {subscription.status === 'active' ? (
              <span className="text-green-600">Active</span>
            ) : (
              subscription.status
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">
            {formatPrice(subscription.price_cents, subscription.currency)}/month
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Period</span>
          <span className="font-medium">
            {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Renews on</span>
          <span className="font-medium">
            {formatDate(subscription.current_period_end)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}