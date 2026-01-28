import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/contracts/[id]
 * Obtener un contrato específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const contractId = id;

    // Obtener el contrato
    const { data: contract, error } = await supabase
      .from('contract_generations')
      .select('*')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error obteniendo contrato:', error);
      return NextResponse.json(
        { error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contract }, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contracts/[id]
 * Eliminar un contrato específico
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const contractId = id;

    // Verificar que el contrato existe y pertenece al usuario
    const { data: existingContract } = await supabase
      .from('contract_generations')
      .select('id')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single();

    if (!existingContract) {
      return NextResponse.json(
        { error: 'Contrato no encontrado o no tienes permiso para eliminarlo' },
        { status: 404 }
      );
    }

    // Eliminar el contrato
    const { error: deleteError } = await supabase
      .from('contract_generations')
      .delete()
      .eq('id', contractId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error eliminando contrato:', deleteError);
      return NextResponse.json(
        { error: 'Error al eliminar el contrato' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Contrato eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en DELETE /api/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/contracts/[id]
 * Actualizar un contrato (por ejemplo, cambiar el estado)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const contractId = id;
    const body = await request.json();

    // Campos permitidos para actualizar
    const allowedFields = ['estado', 'titulo'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      );
    }

    // Actualizar el contrato
    const { data: updatedContract, error } = await supabase
      .from('contract_generations')
      .update(updates)
      .eq('id', contractId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando contrato:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el contrato' },
        { status: 500 }
      );
    }

    return NextResponse.json({ contract: updatedContract }, { status: 200 });
  } catch (error) {
    console.error('Error en PATCH /api/contracts/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
