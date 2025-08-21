import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/logout-button';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
