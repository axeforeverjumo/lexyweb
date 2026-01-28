import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/contracts/[id]/collaborators/heartbeat
 * Update last_seen_at timestamp for a collaborator
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: contractId } = await params;

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Parse request body (optional - can send user_id explicitly)
    const body = await request.json().catch(() => ({}));
    const userId = body.user_id || user.id;

    // Update last_seen_at in contract_collaborators
    const { error: updateError } = await supabase
      .from('contract_collaborators')
      .update({
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('contract_id', contractId)
      .eq('user_id', userId);

    if (updateError) {
      // If collaborator doesn't exist yet, create it
      if (updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('contract_collaborators')
          .insert({
            contract_id: contractId,
            user_id: userId,
            role: 'editor',
            last_seen_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating collaborator:', insertError);
          return NextResponse.json(
            { error: 'Error al crear colaborador' },
            { status: 500 }
          );
        }
      } else {
        console.error('Error updating presence:', updateError);
        return NextResponse.json(
          { error: 'Error al actualizar presencia' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
