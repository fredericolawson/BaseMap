import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { LogoutButton } from '@/components/logout-button';
import SubscriptionStatus from '@/components/subscription-status';
import PurchaseButton from '@/components/purchase-button';
import ManageSubscriptionButton from '@/components/manage-subscription-button';
import { AccountMessages } from '@/components/account-messages';
import { createClient } from '@/lib/supabase/server';
import { getSubscriptionStatus } from '@/app/actions/stripe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Check subscription status
  const subscription = await getSubscriptionStatus();
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* User Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{data.claims.email}</p>
              </div>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Subscription Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">BaseMap Subscription</h2>
          
          {hasActiveSubscription ? (
            <div className="space-y-4">
              <Suspense fallback={<div>Loading subscription...</div>}>
                <SubscriptionStatus />
              </Suspense>
              <ManageSubscriptionButton hasSubscription={true} />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Get BaseMap</CardTitle>
                <CardDescription>
                  Subscribe to BaseMap for unlimited access to all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">What&apos;s included:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Unlimited Airtable base analysis</li>
                      <li>AI-powered schema insights with Google Gemini</li>
                      <li>Export and share analysis results</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <PurchaseButton hasSubscription={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Success/Cancel Messages */}
        <Suspense fallback={null}>
          <AccountMessages />
        </Suspense>
      </div>
    </div>
  );
}
