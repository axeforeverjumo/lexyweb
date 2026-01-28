/**
 * API Routes para gestión de conversaciones
 * GET: Listar conversaciones del usuario
 * POST: Crear nueva conversación
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateConversacionInput } from '@/types/conversacion.types';

// GET /api/conversaciones - Listar conversaciones
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
    const tipo = searchParams.get('tipo');
    const estado = searchParams.get('estado');
    const cliente_id = searchParams.get('cliente_id');
    const contrato_id = searchParams.get('contrato_id');
    const pinned_only = searchParams.get('pinned_only') === 'true';

    // Query base - conversaciones propias (sin participants para evitar recursión RLS)
    let query = supabase
      .from('conversaciones')
      .select(
        `
        *,
        cliente:clientes(id, nombre, apellidos),
        contrato:contratos!conversaciones_contrato_id_fkey(id, titulo, tipo_contrato)
      `
      )
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false });

    // Filtros opcionales
    if (tipo) query = query.eq('tipo', tipo);
    if (estado) query = query.eq('estado', estado);
    if (cliente_id) query = query.eq('cliente_id', cliente_id);
    if (contrato_id) query = query.eq('contrato_id', contrato_id);
    if (pinned_only) query = query.eq('is_pinned', true);

    const { data: myConversaciones, error } = await query;

    if (error) {
      console.error('Error al obtener conversaciones propias:', error);
      return NextResponse.json(
        { error: 'Error al obtener conversaciones' },
        { status: 500 }
      );
    }

    // Obtener conversaciones compartidas (como colaborador) - simplificado para evitar recursión RLS
    const { data: sharedParticipations, error: sharedError } = await supabase
      .from('conversacion_participants')
      .select(
        `
        conversacion:conversaciones(
          *,
          cliente:clientes(id, nombre, apellidos),
          contrato:contratos!conversaciones_contrato_id_fkey(id, titulo, tipo_contrato)
        )
      `
      )
      .eq('user_id', user.id)
      .neq('role', 'owner')
      .order('joined_at', { ascending: false });

    const sharedConversaciones = sharedParticipations?.map((p: any) => p.conversacion).filter(Boolean) || [];

    // Obtener perfil para verificar organización
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    let organizationConversaciones: any[] = [];
    if (profile?.organization_id) {
      // Obtener chats de organización (sin participants para evitar recursión RLS)
      const { data: orgChats } = await supabase
        .from('conversaciones')
        .select(
          `
          *,
          cliente:clientes(id, nombre, apellidos),
          contrato:contratos!conversaciones_contrato_id_fkey(id, titulo, tipo_contrato)
        `
        )
        .eq('organization_id', profile.organization_id)
        .eq('is_organization_chat', true)
        .order('last_message_at', { ascending: false });

      organizationConversaciones = orgChats || [];
    }

    // Combinar todas las conversaciones
    const allConversaciones = [
      ...(myConversaciones || []),
      ...sharedConversaciones,
      ...organizationConversaciones,
    ];

    // Deduplicar por ID
    const uniqueConversaciones = Array.from(
      new Map(allConversaciones.map((c: any) => [c.id, c])).values()
    );

    return NextResponse.json({
      conversaciones: uniqueConversaciones,
      my_chats: myConversaciones || [],
      shared_chats: sharedConversaciones,
      organization_chats: organizationConversaciones,
    });
  } catch (error) {
    console.error('Error en GET /api/conversaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/conversaciones - Crear nueva conversación
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

    // Parsear body
    const body: CreateConversacionInput = await request.json();

    // Validar campos requeridos
    if (!body.tipo) {
      return NextResponse.json(
        { error: 'El campo "tipo" es requerido' },
        { status: 400 }
      );
    }

    // Crear conversación
    const { data: conversacion, error } = await supabase
      .from('conversaciones')
      .insert({
        user_id: user.id,
        cliente_id: body.cliente_id || null,
        contrato_id: body.contrato_id || null,
        titulo: body.titulo || 'Nueva conversación',
        descripcion: body.descripcion || null,
        tipo: body.tipo,
        color: body.color || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear conversación:', error);
      return NextResponse.json(
        { error: 'Error al crear conversación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversacion }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/conversaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
