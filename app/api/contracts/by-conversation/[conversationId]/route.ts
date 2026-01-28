import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const conversationId = resolvedParams.conversationId;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener los contratos de esta conversación
    const { data: contracts, error: contractsError } = await supabase
      .from('contract_generations')
      .select('id, titulo, estado, created_at')
      .eq('conversacion_id', conversationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (contractsError) {
      console.error('[Get Contracts by Conversation] Error:', contractsError);
      return NextResponse.json(
        { error: 'Error al obtener contratos' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        contracts: contracts || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Get Contracts by Conversation] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Error inesperado al obtener contratos',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
