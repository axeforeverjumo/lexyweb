/**
 * API Route para buscar usuarios por nick
 * GET /api/users/search?nick=username
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

    // Obtener parámetro de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const nick = searchParams.get('nick');

    if (!nick || nick.length < 2) {
      return NextResponse.json(
        { error: 'El nick debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuarios por nick (case-insensitive, partial match)
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, nick, avatar_url, subscription_status')
      .ilike('nick', `%${nick}%`)
      .not('id', 'eq', user.id) // Excluir usuario actual
      .limit(10);

    if (error) {
      console.error('Error al buscar usuarios:', error);
      return NextResponse.json(
        { error: 'Error al buscar usuarios' },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error en GET /api/users/search:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
