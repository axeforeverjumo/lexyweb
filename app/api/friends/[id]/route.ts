/**
 * API Route para gestión individual de amistades
 * PATCH /api/friends/[id] - Aceptar/rechazar/bloquear solicitud
 * DELETE /api/friends/[id] - Eliminar amistad
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
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

    const resolvedParams = await params;
    const friendshipId = resolvedParams.id;

    const body = await request.json();
    const { action } = body; // 'accept', 'reject', 'block'

    if (!action || !['accept', 'reject', 'block'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida. Debe ser: accept, reject, o block' },
        { status: 400 }
      );
    }

    // Obtener la solicitud de amistad
    const { data: friendship, error: fetchError } = await supabase
      .from('user_friends')
      .select('*')
      .eq('id', friendshipId)
      .single();

    if (fetchError || !friendship) {
      return NextResponse.json(
        { error: 'Solicitud de amistad no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene permiso para actualizar
    // Puede aceptar/rechazar si es el receptor (friend_id)
    // Puede bloquear si es cualquiera de los dos
    const isReceiver = friendship.friend_id === user.id;
    const isInvolved =
      friendship.user_id === user.id || friendship.friend_id === user.id;

    if (action === 'block' && !isInvolved) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if ((action === 'accept' || action === 'reject') && !isReceiver) {
      return NextResponse.json(
        { error: 'Solo el receptor puede aceptar o rechazar la solicitud' },
        { status: 403 }
      );
    }

    // Mapear acción a status
    const statusMap: Record<string, string> = {
      accept: 'accepted',
      reject: 'rejected',
      block: 'blocked',
    };

    const newStatus = statusMap[action];

    // Actualizar status
    const { data: updatedFriendship, error: updateError } = await supabase
      .from('user_friends')
      .update({ status: newStatus })
      .eq('id', friendshipId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar solicitud:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar solicitud' },
        { status: 500 }
      );
    }

    // TODO: Crear notificación para el otro usuario

    return NextResponse.json({
      friendship: updatedFriendship,
      message: `Solicitud ${action === 'accept' ? 'aceptada' : action === 'reject' ? 'rechazada' : 'bloqueada'}`,
    });
  } catch (error) {
    console.error('Error en PATCH /api/friends/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const resolvedParams = await params;
    const friendshipId = resolvedParams.id;

    // Verificar que la amistad existe y el usuario está involucrado
    const { data: friendship, error: fetchError } = await supabase
      .from('user_friends')
      .select('*')
      .eq('id', friendshipId)
      .single();

    if (fetchError || !friendship) {
      return NextResponse.json(
        { error: 'Amistad no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario está involucrado en la amistad
    if (friendship.user_id !== user.id && friendship.friend_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Eliminar amistad
    const { error: deleteError } = await supabase
      .from('user_friends')
      .delete()
      .eq('id', friendshipId);

    if (deleteError) {
      console.error('Error al eliminar amistad:', deleteError);
      return NextResponse.json(
        { error: 'Error al eliminar amistad' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Amistad eliminada correctamente',
    });
  } catch (error) {
    console.error('Error en DELETE /api/friends/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
