/**
 * API Routes para gestión de notificaciones
 * GET: Listar notificaciones del usuario
 * POST: Crear notificación
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notifications - Listar notificaciones
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

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Query base
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filtros opcionales
    if (unreadOnly) {
      query = query.eq('is_read', false);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data: notifications, error, count } = await query;

    if (error) {
      console.error('Error al obtener notificaciones:', error);
      return NextResponse.json(
        { error: 'Error al obtener notificaciones' },
        { status: 500 }
      );
    }

    // Contar no leídas
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    return NextResponse.json({
      notifications,
      total: notifications?.length || 0,
      unread_count: unreadCount || 0,
    });
  } catch (error) {
    console.error('Error en GET /api/notifications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Crear notificación (internal use)
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

    // Validar campos requeridos
    if (!body.user_id || !body.type || !body.title) {
      return NextResponse.json(
        { error: 'Campos requeridos: user_id, type, title' },
        { status: 400 }
      );
    }

    // Crear notificación
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: body.user_id,
        type: body.type,
        title: body.title,
        message: body.message || null,
        action_url: body.action_url || null,
        related_id: body.related_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear notificación:', error);
      return NextResponse.json(
        { error: 'Error al crear notificación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/notifications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
