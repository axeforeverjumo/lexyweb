/**
 * API Route para aceptar invitación de organización
 * POST /api/organizations/invitations/[id]/accept
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
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

    const invitationId = params.id;

    // Obtener invitación
    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .select(
        `
        *,
        organization:organizations(id, name, owner_id, max_users, subscription_tier)
      `
      )
      .eq('id', invitationId)
      .eq('invited_user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invitación no encontrada o ya procesada' },
        { status: 404 }
      );
    }

    // Verificar que no ha expirado
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      // Marcar como expirada
      await supabase
        .from('organization_invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      return NextResponse.json(
        { error: 'La invitación ha expirado' },
        { status: 400 }
      );
    }

    // Verificar límite de miembros
    const { count: currentMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', invitation.organization_id);

    if ((currentMembers || 0) >= invitation.organization.max_users) {
      return NextResponse.json(
        { error: 'La organización ha alcanzado su límite de usuarios' },
        { status: 400 }
      );
    }

    // Actualizar perfil del usuario
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        organization_id: invitation.organization_id,
        subscription_status: 'team_member',
        subscription_tier: invitation.organization.subscription_tier,
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error al actualizar perfil:', profileError);
      return NextResponse.json(
        { error: 'Error al unirse a la organización' },
        { status: 500 }
      );
    }

    // Actualizar invitación
    const { error: updateError } = await supabase
      .from('organization_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Error al actualizar invitación:', updateError);
    }

    // Crear notificación para el owner
    await supabase.from('notifications').insert({
      user_id: invitation.organization.owner_id,
      type: 'system',
      title: 'Nuevo miembro en el equipo',
      message: `Un usuario ha aceptado tu invitación`,
      related_id: invitation.organization_id,
    });

    return NextResponse.json({
      success: true,
      organization: invitation.organization,
    });
  } catch (error) {
    console.error('Error en POST /api/organizations/invitations/[id]/accept:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
