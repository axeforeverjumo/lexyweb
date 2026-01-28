/**
 * API Route para buscar usuarios por nick o email
 * GET /api/users/search?nick=username
 * GET /api/users/search?email=user@example.com
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

    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const nick = searchParams.get('nick');
    const email = searchParams.get('email');

    if (!nick && !email) {
      return NextResponse.json(
        { error: 'Debes proporcionar nick o email' },
        { status: 400 }
      );
    }

    // Buscar por email (exacto)
    if (email) {
      const { data: userByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('id, email, full_name, nick, avatar_url, subscription_status, nombre, apellidos')
        .eq('email', email.toLowerCase())
        .not('id', 'eq', user.id)
        .single();

      if (emailError && emailError.code !== 'PGRST116') {
        console.error('Error al buscar usuario por email:', emailError);
        return NextResponse.json(
          { error: 'Error al buscar usuario' },
          { status: 500 }
        );
      }

      if (!userByEmail) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user: userByEmail });
    }

    // Buscar usuarios por nick (case-insensitive, partial match)
    if (nick && nick.length < 2) {
      return NextResponse.json(
        { error: 'El nick debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, nick, avatar_url, subscription_status, nombre, apellidos')
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
