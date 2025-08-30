'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

export function Footer() {
  const { user } = useUser();

  return (
    <footer className="py-6 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center text-sm text-muted-foreground">
          {user ? (
            <Link href="/account" className="hover:text-foreground transition-colors">
              {user.email}
            </Link>
          ) : (
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Login
            </Link>
          )}
          <div className="mx-2">•</div>
          <p>&copy; {new Date().getFullYear()} BaseMap</p>
          <div className="mx-2">•</div>
          <Link href="/security" className="hover:text-foreground transition-colors">
            Privacy & Security
          </Link>
        </div>
      </div>
    </footer>
  );
}
