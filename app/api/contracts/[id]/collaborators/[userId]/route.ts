import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/contracts/[id]/collaborators/[userId] - Aceptar o rechazar invitación
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: contractId, userId } = await params;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario está actualizando su propia invitación
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Solo puedes actualizar tus propias invitaciones' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status debe ser "accepted" o "rejected"' },
        { status: 400 }
      );
    }

    // Actualizar estado de la invitación
    const updateData: any = { status };
    if (status === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
    }

    const { data: collaboration, error: updateError } = await supabase
      .from('contract_collaborators')
      .update(updateData)
      .eq('contract_id', contractId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('[Collaborators] Error updating invitation:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar invitación' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        collaboration,
        message: status === 'accepted' ? 'Invitación aceptada' : 'Invitación rechazada',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Collaborators] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// DELETE /api/contracts/[id]/collaborators/[userId] - Eliminar colaborador
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: contractId, userId } = await params;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es el owner del contrato
    const { data: contract } = await supabase
      .from('contract_generations')
      .select('id, user_id')
      .eq('id', contractId)
      .single();

    if (!contract || contract.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Solo el propietario puede eliminar colaboradores' },
        { status: 403 }
      );
    }

    // Eliminar colaborador
    const { error: deleteError } = await supabase
      .from('contract_collaborators')
      .delete()
      .eq('contract_id', contractId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('[Collaborators] Error deleting collaborator:', deleteError);
      return NextResponse.json(
        { error: 'Error al eliminar colaborador' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Colaborador eliminado correctamente',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Collaborators] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
