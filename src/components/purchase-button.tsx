'use client';

import { createCheckoutSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface PurchaseButtonProps {
  hasSubscription?: boolean;
}

export default function PurchaseButton({ hasSubscription = false }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handlePurchase() {
    try {
      setIsLoading(true);
      await createCheckoutSession();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  }
  
  if (hasSubscription) {
    return null;
  }
  
  return (
    <form action={handlePurchase}>
      <Button 
        type="submit" 
        size="lg"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Loading...' : 'Subscribe to BaseMap - $10/month'}
      </Button>
    </form>
  );
}