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

  // Use getUser() instead of getSession() for security
  // getUser() verifies with Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userEmail = user.email || '';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';

  return <DashboardLayout user={{ email: userEmail, name: userName }}>{children}</DashboardLayout>;
}
