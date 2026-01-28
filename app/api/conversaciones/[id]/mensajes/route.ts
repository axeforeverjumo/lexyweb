/**
 * API Routes para mensajes de una conversación
 * GET: Obtener mensajes de la conversación
 * POST: Crear nuevo mensaje
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateMensajeInput } from '@/types/mensaje.types';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/conversaciones/[id]/mensajes - Obtener mensajes
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: conversacion_id } = await params;

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que la conversación pertenece al usuario
    const { data: conversacion } = await supabase
      .from('conversaciones')
      .select('id')
      .eq('id', conversacion_id)
      .eq('user_id', user.id)
      .single();

    if (!conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Obtener parámetros de paginación
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener mensajes
    const { data: mensajes, error } = await supabase
      .from('mensajes')
      .select('*')
      .eq('conversacion_id', conversacion_id)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error al obtener mensajes:', error);
      return NextResponse.json(
        { error: 'Error al obtener mensajes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ mensajes });
  } catch (error) {
    console.error('Error en GET /api/conversaciones/[id]/mensajes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/conversaciones/[id]/mensajes - Crear mensaje
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: conversacion_id } = await params;

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que la conversación pertenece al usuario
    const { data: conversacion } = await supabase
      .from('conversaciones')
      .select('id')
      .eq('id', conversacion_id)
      .eq('user_id', user.id)
      .single();

    if (!conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Parsear body
    const body: CreateMensajeInput = await request.json();

    // Validar campos requeridos
    if (!body.role || !body.content) {
      return NextResponse.json(
        { error: 'Los campos "role" y "content" son requeridos' },
        { status: 400 }
      );
    }

    // Crear mensaje
    const { data: mensaje, error } = await supabase
      .from('mensajes')
      .insert({
        conversacion_id,
        role: body.role,
        content: body.content,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear mensaje:', error);
      return NextResponse.json(
        { error: 'Error al crear mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json({ mensaje }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/conversaciones/[id]/mensajes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
