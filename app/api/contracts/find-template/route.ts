/**
 * API: Buscar plantilla de contrato apropiada
 * POST /api/contracts/find-template
 *
 * Body: {
 *   userDescription: string;
 *   idioma: 'es' | 'ca';
 *   region: 'España' | 'Cataluña';
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
    const { userDescription, idioma, region } = body;

    // 3. Validar parámetros
    if (!userDescription || !idioma || !region) {
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

    if (!['España', 'Cataluña'].includes(region)) {
      return NextResponse.json(
        { error: 'Región debe ser "España" o "Cataluña"' },
        { status: 400 }
      );
    }

    // 4. Buscar plantilla
    const template = await contractGenerator.findAppropriateTemplate({
      userDescription,
      idioma,
      region,
      userId: user.id
    });

    if (!template) {
      return NextResponse.json(
        {
          error: 'No se encontró plantilla apropiada',
          message: 'No encontramos un contrato que coincida con tu descripción. Por favor, intenta describir tu necesidad de otra forma.'
        },
        { status: 404 }
      );
    }

    // 5. Retornar plantilla encontrada
    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Error en /api/contracts/find-template:', error);

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
