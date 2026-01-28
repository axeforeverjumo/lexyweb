/**
 * API Route para chat legal con Gemini AI
 * POST: Enviar mensaje y recibir respuesta del abogado IA
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { geminiClient } from '@/lib/gemini/client';
import LEXY_OPTIMIZED_PROMPT from '@/lib/gemini/prompts/lexy-optimized';

interface ChatRequest {
  conversacion_id: string;
  mensaje: string;
}

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
    const body: ChatRequest = await request.json();
    const { conversacion_id, mensaje } = body;

    // Validar campos requeridos
    if (!conversacion_id || !mensaje) {
      return NextResponse.json(
        { error: 'Los campos "conversacion_id" y "mensaje" son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la conversación pertenece al usuario
    const { data: conversacion } = await supabase
      .from('conversaciones')
      .select('id, tipo, contrato_id')
      .eq('id', conversacion_id)
      .eq('user_id', user.id)
      .single();

    if (!conversacion) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Obtener historial de mensajes
    const { data: historial } = await supabase
      .from('mensajes')
      .select('role, content')
      .eq('conversacion_id', conversacion_id)
      .order('created_at', { ascending: true });

    // Si es una conversación vinculada a un contrato, agregar contexto
    let systemPromptWithContext = LEXY_OPTIMIZED_PROMPT;

    if (conversacion.contrato_id) {
      const { data: contrato } = await supabase
        .from('contratos')
        .select('*')
        .eq('id', conversacion.contrato_id)
        .single();

      if (contrato) {
        systemPromptWithContext += `\n\n## CONTEXTO DEL CONTRATO

Estás consultando sobre un contrato específico con los siguientes datos:

**Tipo:** ${contrato.tipo_contrato}
**Título:** ${contrato.titulo}
**Estado:** ${contrato.estado}
**Inmueble:** ${contrato.inmueble_direccion || 'No especificado'}
**Importe:** ${contrato.importe_total ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(contrato.importe_total) : 'No especificado'}

Ten en cuenta este contexto al responder las consultas del profesional.`;
      }
    }

    // Llamar a Gemini con el historial
    const respuestaIA = await geminiClient.chat(
      historial || [],
      systemPromptWithContext,
      mensaje
    );

    // Guardar mensaje del usuario
    const { error: errorUser } = await supabase.from('mensajes').insert({
      conversacion_id,
      role: 'user',
      content: mensaje,
    });

    if (errorUser) {
      console.error('[Gemini Chat] Error guardando mensaje de usuario:', errorUser);
    } else {
      console.log('[Gemini Chat] Mensaje de usuario guardado correctamente');
    }

    // Guardar respuesta de la IA
    const { error: errorAssistant } = await supabase.from('mensajes').insert({
      conversacion_id,
      role: 'assistant',
      content: respuestaIA,
    });

    if (errorAssistant) {
      console.error('[Gemini Chat] Error guardando respuesta de IA:', errorAssistant);
    } else {
      console.log('[Gemini Chat] Respuesta de IA guardada correctamente');
    }

    // Detectar si la IA sugiere crear un contrato
    const suggestedContract = detectContractSuggestion(respuestaIA);

    return NextResponse.json({
      respuesta: respuestaIA,
      suggested_contract: suggestedContract,
    });
  } catch (error) {
    console.error('Error en POST /api/gemini/chat:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el mensaje',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * Detecta si la respuesta de la IA sugiere crear un contrato
 * Busca patrones como "📄 **Puedo ayudarte a crear"
 */
function detectContractSuggestion(respuesta: string): {
  tipo: string;
  confianza: number;
} | null {
  // Buscar patrones que indiquen sugerencia de contrato
  const patterns = [
    /crear.*contrato.*de\s+(\w+)/i,
    /📄.*crear/i,
    /redact.*contrato/i,
    /preparar.*contrato/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(respuesta)) {
      // Intentar extraer tipo de contrato
      const tipoMatch = respuesta.match(/contrato\s+de\s+(\w+)/i);
      if (tipoMatch) {
        return {
          tipo: tipoMatch[1].toLowerCase(),
          confianza: 80,
        };
      }
      return {
        tipo: 'general',
        confianza: 60,
      };
    }
  }

  return null;
}
