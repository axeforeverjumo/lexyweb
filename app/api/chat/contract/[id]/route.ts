import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/chat/contract/[id] - Cargar historial de chat de un contrato
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const contractId = resolvedParams.id;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es dueño del contrato
    const { data: contract, error: contractError } = await supabase
      .from('contract_generations')
      .select('id, user_id')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    if (contract.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Cargar historial de mensajes
    const { data: messages, error: messagesError } = await supabase
      .from('contract_chat_history')
      .select('id, role, content, edit_suggestion, created_at')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('[Chat History] Error loading messages:', messagesError);
      return NextResponse.json(
        { error: 'Error al cargar el historial' },
        { status: 500 }
      );
    }

    // Transformar mensajes al formato esperado por el componente
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      editSuggestion: msg.edit_suggestion || null,
      appliedAutomatically: false, // Este flag es solo para UI, no se persiste
    }));

    console.log('[Chat History] Loaded:', {
      contractId,
      messageCount: formattedMessages.length,
    });

    return NextResponse.json(
      {
        messages: formattedMessages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Chat History] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/contract/[id] - Limpiar historial de chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const contractId = resolvedParams.id;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es dueño del contrato
    const { data: contract, error: contractError } = await supabase
      .from('contract_generations')
      .select('id, user_id')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    if (contract.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Eliminar todos los mensajes del contrato
    const { error: deleteError } = await supabase
      .from('contract_chat_history')
      .delete()
      .eq('contract_id', contractId);

    if (deleteError) {
      console.error('[Chat History] Error deleting messages:', deleteError);
      return NextResponse.json(
        { error: 'Error al limpiar el historial' },
        { status: 500 }
      );
    }

    console.log('[Chat History] Cleared:', { contractId });

    return NextResponse.json(
      {
        success: true,
        message: 'Historial limpiado correctamente',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Chat History] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
