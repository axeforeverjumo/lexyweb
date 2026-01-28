/**
 * API Route para obtener detalles de organización
 * GET /api/organizations/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const organizationId = params.id;

    // Obtener organización
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario pertenece a la organización
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profile?.organization_id !== organizationId) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta organización' },
        { status: 403 }
      );
    }

    // Obtener miembros
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, nick, avatar_url, subscription_status, created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true });

    if (membersError) {
      console.error('Error al obtener miembros:', membersError);
    }

    // Obtener invitaciones pendientes
    const { data: pendingInvitations, error: invitesError } = await supabase
      .from('organization_invitations')
      .select(
        `
        *,
        invited_by:profiles!organization_invitations_invited_by_id_fkey(id, full_name, email)
      `
      )
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (invitesError) {
      console.error('Error al obtener invitaciones:', invitesError);
    }

    return NextResponse.json({
      organization,
      members: members || [],
      pending_invitations: pendingInvitations || [],
    });
  } catch (error) {
    console.error('Error en GET /api/organizations/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
