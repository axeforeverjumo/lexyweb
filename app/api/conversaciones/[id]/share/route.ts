/**
 * API Route para compartir conversación con otro usuario
 * POST /api/conversaciones/[id]/share
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

    const { id: conversacionId } = await params;
    const body = await request.json();

    // Validar campos requeridos
    if (!body.nick) {
      return NextResponse.json(
        { error: 'El campo "nick" es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la conversación existe y pertenece al usuario
    const { data: conversacion, error: convError } = await supabase
      .from('conversaciones')
      .select('user_id, titulo')
      .eq('id', conversacionId)
      .single();

    if (convError || !conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    if (conversacion.user_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para compartir esta conversación' },
        { status: 403 }
      );
    }

    // Buscar usuario por nick
    const { data: sharedWithUser, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('nick', body.nick)
      .single();

    if (userError || !sharedWithUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // No puede compartirse a sí mismo
    if (sharedWithUser.id === user.id) {
      return NextResponse.json(
        { error: 'No puedes compartir la conversación contigo mismo' },
        { status: 400 }
      );
    }

    // Verificar límite de 3 compartidos (PRO plan)
    const { count: currentShares } = await supabase
      .from('conversacion_participants')
      .select('*', { count: 'exact', head: true })
      .eq('conversacion_id', conversacionId)
      .neq('role', 'owner');

    if ((currentShares || 0) >= 3) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de 3 usuarios compartidos' },
        { status: 400 }
      );
    }

    // Verificar que no existe ya
    const { data: existing } = await supabase
      .from('conversacion_participants')
      .select('id')
      .eq('conversacion_id', conversacionId)
      .eq('user_id', sharedWithUser.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'El usuario ya tiene acceso a esta conversación' },
        { status: 400 }
      );
    }

    // Crear registro en chat_shares
    const { data: chatShare, error: shareError } = await supabase
      .from('chat_shares')
      .insert({
        conversacion_id: conversacionId,
        owner_id: user.id,
        shared_with_nick: body.nick,
        shared_with_id: sharedWithUser.id,
        status: 'pending',
        can_edit: body.can_edit || false,
      })
      .select()
      .single();

    if (shareError) {
      console.error('Error al crear chat_share:', shareError);
      return NextResponse.json(
        { error: 'Error al compartir conversación' },
        { status: 500 }
      );
    }

    // Crear notificación
    await supabase.from('notifications').insert({
      user_id: sharedWithUser.id,
      type: 'chat_share_invite',
      title: 'Chat compartido contigo',
      message: `Te han compartido: "${conversacion.titulo}"`,
      related_id: chatShare.id,
      action_url: `/chat?accept_share=${chatShare.id}`,
    });

    // Marcar conversación como compartida
    await supabase
      .from('conversaciones')
      .update({ is_shared: true })
      .eq('id', conversacionId);

    return NextResponse.json({ success: true, chat_share: chatShare }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/conversaciones/[id]/share:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
