/**
 * API Route para gestión de amigos/contactos
 * GET /api/friends - Lista amigos y solicitudes
 * POST /api/friends - Enviar solicitud de amistad
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'accepted', 'all'

    // Construir query base
    let query = supabase
      .from('user_friends')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    // Filtrar por status si se especifica
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: friendships, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Error al obtener amigos:', error);
      return NextResponse.json(
        { error: 'Error al obtener lista de amigos' },
        { status: 500 }
      );
    }

    // Enriquecer con datos de perfil
    const enrichedFriendships = await Promise.all(
      (friendships || []).map(async (friendship) => {
        // Determinar quién es el "otro" usuario
        const otherUserId =
          friendship.user_id === user.id
            ? friendship.friend_id
            : friendship.user_id;

        // Obtener perfil del otro usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, nick, avatar_url, email')
          .eq('id', otherUserId)
          .single();

        return {
          ...friendship,
          friend: profile,
          is_sender: friendship.user_id === user.id,
        };
      })
    );

    return NextResponse.json({
      friendships: enrichedFriendships,
      total: enrichedFriendships.length,
    });
  } catch (error) {
    console.error('Error en GET /api/friends:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { friendId, friendEmail } = body;

    // Buscar usuario por ID o email
    let targetUserId = friendId;

    if (!targetUserId && friendEmail) {
      const { data: targetUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', friendEmail)
        .single();

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      targetUserId = targetUser.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Se requiere friendId o friendEmail' },
        { status: 400 }
      );
    }

    // Verificar que no sea a sí mismo
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: 'No puedes enviarte solicitud a ti mismo' },
        { status: 400 }
      );
    }

    // Verificar que no exista ya una relación
    const { data: existing } = await supabase
      .from('user_friends')
      .select('id, status')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`
      )
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.status === 'accepted'
              ? 'Ya son amigos'
              : 'Ya existe una solicitud pendiente',
        },
        { status: 400 }
      );
    }

    // Crear solicitud de amistad
    const { data: friendship, error: insertError } = await supabase
      .from('user_friends')
      .insert({
        user_id: user.id,
        friend_id: targetUserId,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear solicitud:', insertError);
      return NextResponse.json(
        { error: 'Error al enviar solicitud de amistad' },
        { status: 500 }
      );
    }

    // TODO: Crear notificación para el usuario receptor

    return NextResponse.json({
      friendship,
      message: 'Solicitud de amistad enviada',
    }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/friends:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
