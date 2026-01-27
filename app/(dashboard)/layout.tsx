import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;
  const userEmail = user.email || '';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';

  return <DashboardLayout user={{ email: userEmail, name: userName }}>{children}</DashboardLayout>;
}
