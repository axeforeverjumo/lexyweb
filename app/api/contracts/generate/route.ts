/**
 * API: Generar contrato final con datos completados
 * POST /api/contracts/generate
 *
 * Body: {
 *   templateId: string;
 *   datosCompletados: Record<string, any>;
 *   idioma: 'es' | 'ca';
 *   titulo: string;
 *   conversacionId?: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { contractGenerator } from '@/lib/contracts/generator';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Parsear body
    const body = await request.json();
    const {
      templateId,
      datosCompletados,
      idioma,
      titulo,
      conversacionId
    } = body;

    // 3. Validar parámetros
    if (!templateId || !datosCompletados || !idioma || !titulo) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    if (!['es', 'ca'].includes(idioma)) {
      return NextResponse.json(
        { error: 'Idioma debe ser "es" o "ca"' },
        { status: 400 }
      );
    }

    // 4. Validar que datosCompletados sea un objeto
    if (typeof datosCompletados !== 'object' || Array.isArray(datosCompletados)) {
      return NextResponse.json(
        { error: 'datosCompletados debe ser un objeto' },
        { status: 400 }
      );
    }

    // 5. Generar contrato
    const result = await contractGenerator.generateFinalContract({
      templateId,
      datosCompletados,
      idioma,
      titulo,
      userId: user.id,
      conversacionId
    });

    // 6. Retornar contrato generado
    return NextResponse.json({
      success: true,
      generationId: result.generationId,
      contenidoMarkdown: result.contenidoMarkdown,
      contenidoHtml: result.contenidoHtml,
      message: '¡Contrato generado exitosamente!'
    });

  } catch (error) {
    console.error('Error en /api/contracts/generate:', error);

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
