/**
 * API Route para obtener participantes de una conversación
 * GET /api/conversaciones/[id]/participants
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const conversacionId = resolvedParams.id;

    // Verificar que el usuario tiene acceso a la conversación
    const { data: conversacion, error: convError } = await supabase
      .from('conversaciones')
      .select('user_id')
      .eq('id', conversacionId)
      .single();

    if (convError || !conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que es owner o participante
    const { data: participant } = await supabase
      .from('conversacion_participants')
      .select('id')
      .eq('conversacion_id', conversacionId)
      .eq('user_id', user.id)
      .single();

    if (conversacion.user_id !== user.id && !participant) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }

    // Obtener participantes (sin join anidado para evitar recursión RLS)
    const { data: participants, error: participantsError } = await supabase
      .from('conversacion_participants')
      .select('*')
      .eq('conversacion_id', conversacionId)
      .order('joined_at', { ascending: true });

    if (participantsError) {
      console.error('Error al obtener participantes:', participantsError);
      return NextResponse.json(
        { error: 'Error al obtener participantes' },
        { status: 500 }
      );
    }

    // Obtener datos de perfil por separado para cada participante
    const participantsWithProfiles = await Promise.all(
      (participants || []).map(async (participant) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, nick, avatar_url, email')
          .eq('id', participant.user_id)
          .single();

        return {
          ...participant,
          user: profile || null,
        };
      })
    );

    return NextResponse.json({ participants: participantsWithProfiles });
  } catch (error) {
    console.error('Error en GET /api/conversaciones/[id]/participants:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
