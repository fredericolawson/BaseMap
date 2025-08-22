'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function AccountMessages() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const portal = searchParams.get('portal');
  
  // Clear URL params after displaying message
  useEffect(() => {
    if (success || canceled || portal) {
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/account');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, canceled, portal]);
  
  if (success === 'true') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Welcome to BaseMap!</CardTitle>
          <CardDescription className="text-green-700">
            Your subscription is now active. You have full access to all BaseMap features.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (canceled === 'true') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Checkout Canceled</CardTitle>
          <CardDescription className="text-yellow-700">
            Your checkout session was canceled. You can subscribe anytime to access BaseMap features.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (portal === 'true') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Subscription Updated</CardTitle>
          <CardDescription className="text-blue-700">
            Your subscription changes have been saved.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return null;
}