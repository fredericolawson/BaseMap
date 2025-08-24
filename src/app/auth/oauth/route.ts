import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  console.log('[OAuth Callback Debug] Received callback request');

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  console.log('[OAuth Callback Debug] Query params:', {
    code: code ? 'present' : 'missing',
    error,
    errorDescription,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }
  console.log('[OAuth Callback Debug] Next redirect path:', next);

  // Check for OAuth errors first
  if (error) {
    console.error('[OAuth Callback Debug] OAuth provider error:', {
      error,
      errorDescription,
    });
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (code) {
    console.log('[OAuth Callback Debug] Exchanging code for session...');
    const supabase = await createClient();

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      console.log('[OAuth Callback Debug] Exchange result:', {
        success: !exchangeError,
        error: exchangeError,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
      });

      if (!exchangeError && data?.session) {
        console.log('[OAuth Callback Debug] Session created successfully');
        const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === 'development';

        let redirectUrl;
        if (isLocalEnv) {
          // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
          redirectUrl = `${origin}${next}`;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        } else {
          redirectUrl = `${origin}${next}`;
        }

        console.log('[OAuth Callback Debug] Redirecting to:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      } else {
        console.error('[OAuth Callback Debug] Failed to exchange code:', exchangeError);
        return NextResponse.redirect(
          `${origin}/auth/error?error=exchange_failed&message=${encodeURIComponent(exchangeError?.message || 'Unknown error')}`
        );
      }
    } catch (err) {
      console.error('[OAuth Callback Debug] Unexpected error during exchange:', err);
      return NextResponse.redirect(`${origin}/auth/error?error=unexpected&message=${encodeURIComponent(String(err))}`);
    }
  }

  console.error('[OAuth Callback Debug] No code or error in callback');
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?error=no_code`);
}
