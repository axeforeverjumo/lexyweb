/**
 * API: Listar contratos generados del usuario
 * GET /api/contracts/list
 */

import { NextRequest, NextResponse } from 'next/server';
import { contractGenerator } from '@/lib/contracts/generator';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

    // 2. Listar contratos
    const contratos = await contractGenerator.listUserContracts(user.id);

    // 3. Retornar lista (usando "contracts" para consistencia con frontend)
    return NextResponse.json({
      success: true,
      contracts: contratos
    });

  } catch (error) {
    console.error('Error en /api/contracts/list:', error);

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
