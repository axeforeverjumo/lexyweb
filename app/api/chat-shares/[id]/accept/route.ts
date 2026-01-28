/**
 * API Route para aceptar chat compartido
 * POST /api/chat-shares/[id]/accept
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

    const { id: shareId } = await params;

    // Obtener chat_share
    const { data: chatShare, error: shareError } = await supabase
      .from('chat_shares')
      .select(
        `
        *,
        conversacion:conversaciones(id, titulo, user_id),
        owner:profiles!chat_shares_owner_id_fkey(full_name)
      `
      )
      .eq('id', shareId)
      .eq('shared_with_id', user.id)
      .eq('status', 'pending')
      .single();

    if (shareError || !chatShare) {
      return NextResponse.json(
        { error: 'Invitación no encontrada o ya procesada' },
        { status: 404 }
      );
    }

    // Actualizar estado del chat_share
    const { error: updateError } = await supabase
      .from('chat_shares')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', shareId);

    if (updateError) {
      console.error('Error al actualizar chat_share:', updateError);
      return NextResponse.json(
        { error: 'Error al aceptar invitación' },
        { status: 500 }
      );
    }

    // Agregar como participante
    const { error: participantError } = await supabase
      .from('conversacion_participants')
      .insert({
        conversacion_id: chatShare.conversacion_id,
        user_id: user.id,
        role: 'collaborator',
        can_write: chatShare.can_edit,
      });

    if (participantError) {
      console.error('Error al agregar participante:', participantError);
      return NextResponse.json(
        { error: 'Error al agregar como participante' },
        { status: 500 }
      );
    }

    // Notificar al owner
    await supabase.from('notifications').insert({
      user_id: chatShare.owner_id,
      type: 'system',
      title: 'Chat compartido aceptado',
      message: `Un usuario ha aceptado tu invitación al chat "${chatShare.conversacion.titulo}"`,
      related_id: chatShare.conversacion_id,
      action_url: `/chat?id=${chatShare.conversacion_id}`,
    });

    return NextResponse.json({
      success: true,
      conversacion: chatShare.conversacion,
    });
  } catch (error) {
    console.error('Error en POST /api/chat-shares/[id]/accept:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
