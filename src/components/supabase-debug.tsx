'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SupabaseDebug() {
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      console.log('[Supabase Debug] Checking configuration...');
      
      // Check environment variables
      console.log('[Supabase Debug] Environment:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ? 'Set' : 'Missing',
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
      });

      // Test Supabase client
      try {
        const supabase = createClient();
        console.log('[Supabase Debug] Client created successfully');

        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[Supabase Debug] Current session:', {
          hasSession: !!session,
          userId: session?.user?.id,
          provider: session?.user?.app_metadata?.provider,
          error: sessionError,
        });

        // Check auth settings
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('[Supabase Debug] Current user:', {
          hasUser: !!user,
          userId: user?.id,
          email: user?.email,
          error: userError,
        });
      } catch (error) {
        console.error('[Supabase Debug] Error checking client:', error);
      }
    };

    checkSupabaseConfig();
  }, []);

  return null; // This component doesn't render anything
}