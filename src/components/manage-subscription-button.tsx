'use client';

import { createPortalSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface ManageSubscriptionButtonProps {
  hasSubscription?: boolean;
}

export default function ManageSubscriptionButton({ hasSubscription = false }: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleManageSubscription() {
    try {
      setIsLoading(true);
      await createPortalSession();
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to open billing portal. Please try again.');
      setIsLoading(false);
    }
  }
  
  if (!hasSubscription) {
    return null;
  }
  
  return (
    <form action={handleManageSubscription}>
      <Button 
        type="submit" 
        variant="outline"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Loading...' : 'Manage Subscription'}
      </Button>
    </form>
  );
}