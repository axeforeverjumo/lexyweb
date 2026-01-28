/**
 * API Routes para conversación específica
 * GET: Obtener conversación por ID
 * PATCH: Actualizar conversación (renombrar, cambiar color, etc.)
 * DELETE: Eliminar conversación
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UpdateConversacionInput } from '@/types/conversacion.types';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/conversaciones/[id] - Obtener conversación
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener conversación
    const { data: conversacion, error } = await supabase
      .from('conversaciones')
      .select(
        `
        *,
        cliente:clientes(id, nombre, apellidos, email),
        contrato:contratos!conversaciones_contrato_id_fkey(id, titulo, tipo_contrato, inmueble_direccion)
      `
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversacion });
  } catch (error) {
    console.error('Error en GET /api/conversaciones/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/conversaciones/[id] - Actualizar conversación
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Parsear body
    const body: UpdateConversacionInput = await request.json();

    // Construir objeto de actualización (solo campos presentes)
    const updates: any = {};
    if (body.titulo !== undefined) updates.titulo = body.titulo;
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
    if (body.is_pinned !== undefined) updates.is_pinned = body.is_pinned;
    if (body.color !== undefined) updates.color = body.color;
    if (body.estado !== undefined) updates.estado = body.estado;

    // Actualizar conversación
    const { data: conversacion, error } = await supabase
      .from('conversaciones')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !conversacion) {
      return NextResponse.json(
        { error: 'Error al actualizar conversación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversacion });
  } catch (error) {
    console.error('Error en PATCH /api/conversaciones/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/conversaciones/[id] - Eliminar conversación
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Eliminar conversación (cascade eliminará mensajes automáticamente)
    const { error } = await supabase
      .from('conversaciones')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al eliminar conversación:', error);
      return NextResponse.json(
        { error: 'Error al eliminar conversación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/conversaciones/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
