/**
 * API Route para gestionar invitaciones de organización
 * POST /api/organizations/[id]/invitations - Invitar usuario
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

    const organizationId = params.id;
    const body = await request.json();

    // Validar campos requeridos
    if (!body.nick) {
      return NextResponse.json(
        { error: 'El campo "nick" es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es el owner
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('owner_id, max_users, subscription_tier')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    if (organization.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para invitar usuarios' },
        { status: 403 }
      );
    }

    // Verificar límite de miembros
    const { count: currentMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    if ((currentMembers || 0) >= organization.max_users) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de usuarios para tu plan' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const { data: invitedUser, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('nick', body.nick)
      .single();

    if (userError || !invitedUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario no está ya en una organización
    if (invitedUser.id === user.id) {
      return NextResponse.json(
        { error: 'No puedes invitarte a ti mismo' },
        { status: 400 }
      );
    }

    // Verificar invitaciones pendientes
    const { data: existingInvitation } = await supabase
      .from('organization_invitations')
      .select('id, status')
      .eq('organization_id', organizationId)
      .eq('invited_nick', body.nick)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Ya existe una invitación pendiente para este usuario' },
        { status: 400 }
      );
    }

    // Crear invitación
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días para aceptar

    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        invited_by_id: user.id,
        invited_nick: body.nick,
        invited_user_id: invitedUser.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error al crear invitación:', inviteError);
      return NextResponse.json(
        { error: 'Error al crear invitación' },
        { status: 500 }
      );
    }

    // Crear notificación para el usuario invitado
    await supabase.from('notifications').insert({
      user_id: invitedUser.id,
      type: 'organization_invite',
      title: 'Invitación a equipo',
      message: `Te han invitado a unirte a una organización`,
      related_id: invitation.id,
      action_url: `/subscription/blocked`, // Será redirigido para aceptar
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/organizations/[id]/invitations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
