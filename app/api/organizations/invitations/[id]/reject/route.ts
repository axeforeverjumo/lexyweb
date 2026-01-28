/**
 * API Route para rechazar invitación de organización
 * POST /api/organizations/invitations/[id]/reject
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
      .select('*, organization:organizations(owner_id)')
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

    // Actualizar invitación
    const { error: updateError } = await supabase
      .from('organization_invitations')
      .update({ status: 'rejected' })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Error al rechazar invitación:', updateError);
      return NextResponse.json(
        { error: 'Error al rechazar invitación' },
        { status: 500 }
      );
    }

    // Notificar al owner
    await supabase.from('notifications').insert({
      user_id: invitation.organization.owner_id,
      type: 'system',
      title: 'Invitación rechazada',
      message: 'Un usuario ha rechazado tu invitación',
      related_id: invitation.organization_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en POST /api/organizations/invitations/[id]/reject:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
