'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Trash, CheckCircle } from 'lucide-react';

export default function PurgeStorage() {
  const { purgeStorage } = useLocalStorage();
  const [cleared, setCleared] = useState(false);

  const handlePurge = () => {
    purgeStorage();
    setCleared(true);

    // Reset the cleared state after 3 seconds
    setTimeout(() => {
      setCleared(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        type="button"
        variant={cleared ? 'secondary' : 'outline'}
        onClick={handlePurge}
        className={cleared ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' : ''}
      >
        {cleared ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Storage Cleared
          </>
        ) : (
          <>
            <Trash className="mr-2 h-4 w-4" />
            Clear Storage
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
        Remember to click here to clear your browser local storage when you are finished
      </p>
    </div>
  );
}
