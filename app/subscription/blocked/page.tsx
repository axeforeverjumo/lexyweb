import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SubscriptionBlockedScreen from '@/components/subscription/SubscriptionBlockedScreen';
import type { Profile, OrganizationInvitation } from '@/types/subscription.types';

export const metadata = {
  title: 'Suscripción Requerida | Lexy',
  description: 'Activa tu suscripción para continuar usando Lexy',
};

export default async function SubscriptionBlockedPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obtener perfil completo del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Si tiene suscripción activa, redirigir a dashboard
  const validStatuses = ['trialing', 'active', 'team_member'];
  if (validStatuses.includes(profile.subscription_status)) {
    redirect('/dashboard');
  }

  // Obtener invitaciones pendientes
  const { data: invitations } = await supabase
    .from('organization_invitations')
    .select(`
      *,
      organization:organizations(*),
      invited_by:profiles!organization_invitations_invited_by_id_fkey(*)
    `)
    .eq('invited_nick', profile.nick)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString());

  return (
    <SubscriptionBlockedScreen
      user={profile as Profile}
      pendingInvitations={(invitations as OrganizationInvitation[]) || []}
    />
  );
}
