import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { contractId, message, contractContent } = body;

    if (!message || !contractContent || !contractId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    console.log('[Contract Assist] Processing message:', {
      contractId,
      messageLength: message.length,
      contentLength: contractContent.length,
    });

    // 1. Guardar mensaje del usuario en BD
    const { error: userMsgError } = await supabase
      .from('contract_chat_history')
      .insert({
        contract_id: contractId,
        user_id: user.id,
        role: 'user',
        content: message,
      });

    if (userMsgError) {
      console.error('[Contract Assist] Error saving user message:', userMsgError);
      // Continuar aunque falle (no bloqueante)
    }

    // 2. Cargar historial de conversación desde BD
    const { data: chatHistory, error: historyError } = await supabase
      .from('contract_chat_history')
      .select('role, content')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: true })
      .limit(50); // Limitar a últimos 50 mensajes para evitar contexto muy largo

    if (historyError) {
      console.error('[Contract Assist] Error loading history:', historyError);
    }

    const conversationHistory = chatHistory || [];

    // Construir el system prompt
    const systemPrompt = `Eres un asistente legal experto especializado en ayudar con contratos inmobiliarios españoles.

Tu tarea es ayudar al usuario con el contrato que está editando. Puedes:

1. **RESPONDER DUDAS**: Explicar cláusulas, términos legales, obligaciones, etc.
2. **EDITAR CONTRATOS**: Hacer cambios precisos y quirúrgicos en el texto
3. **DAR CONSEJOS**: Recomendar mejoras, advertir sobre riesgos, sugerir cláusulas adicionales

**FORMATO DE RESPUESTA:**

Para EDICIONES, usa este formato JSON estricto:

\`\`\`json
{
  "search": "texto exacto a buscar en el contrato (puede incluir varias líneas)",
  "replace": "texto nuevo que lo reemplazará (mantén el formato Markdown)"
}
\`\`\`

**REGLAS CRÍTICAS para EDICIONES:**

1. **search** debe ser TEXTO EXACTO del contrato (copia tal cual, incluyendo formato Markdown)
2. **search** debe ser ÚNICO en el documento (suficientemente largo para no tener duplicados)
3. **search** debe incluir contexto suficiente (ej: título de sección + párrafo completo)
4. **replace** mantiene el mismo formato Markdown del original
5. NO devuelvas el contrato completo, solo search + replace
6. Después del JSON, explica el cambio en 2-3 líneas

**EJEMPLOS:**

Usuario: "Cambia el plazo de 30 a 15 días"

\`\`\`json
{
  "search": "### TERCERA. PLAZO\n\nEl presente contrato tendrá una duración de **30 días naturales**",
  "replace": "### TERCERA. PLAZO\n\nEl presente contrato tendrá una duración de **15 días naturales**"
}
\`\`\`

He actualizado el plazo de 30 a 15 días en la cláusula TERCERA.

---

Para DUDAS (sin edición), responde normal en 3-5 líneas sin JSON.

**IMPORTANTE:**
- Usa lenguaje jurídico profesional
- Referencias legales cuando sea relevante (CC, LAU, etc.)
- No inventes datos, solo trabaja con la información del contrato
- Si no estás seguro del texto exacto, pide aclaración en lugar de adivinar`;

    // Construir el contexto del contrato
    const contractContext = `# CONTRATO ACTUAL\n\n${contractContent}\n\n---\n`;

    // 3. Construir los mensajes para Claude
    const messages: Anthropic.MessageParam[] = [];

    // Añadir historial de conversación (excluyendo el mensaje que acabamos de guardar)
    if (conversationHistory && conversationHistory.length > 1) {
      // Tomar todos menos el último (que es el mensaje actual del usuario)
      conversationHistory.slice(0, -1).forEach((msg: { role: string; content: string }) => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      });
    }

    // Añadir el mensaje actual con el contexto del contrato
    messages.push({
      role: 'user',
      content: `${contractContext}\n**PREGUNTA/SOLICITUD DEL USUARIO:**\n${message}`,
    });

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      temperature: 0.3,
      system: systemPrompt,
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Detectar si hay una edición en formato JSON
    const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/);
    let editSuggestion = null;
    let searchText = null;
    let replaceText = null;

    if (jsonMatch) {
      try {
        const editData = JSON.parse(jsonMatch[1].trim());
        if (editData.search && editData.replace) {
          searchText = editData.search;
          replaceText = editData.replace;

          // Aplicar el replace al contenido del contrato
          if (contractContent.includes(searchText)) {
            editSuggestion = contractContent.replace(searchText, replaceText);
          } else {
            console.warn('[Contract Assist] Search text not found in contract:', {
              searchPreview: searchText.substring(0, 100),
            });
            // Si no se encuentra, intentar con una búsqueda más flexible (ignorando espacios múltiples)
            const normalizedSearch = searchText.replace(/\s+/g, ' ').trim();
            const normalizedContent = contractContent.replace(/\s+/g, ' ');
            if (normalizedContent.includes(normalizedSearch)) {
              // Encontrar el texto original con el formato correcto
              const regex = new RegExp(
                searchText.split(/\s+/).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'),
                'g'
              );
              editSuggestion = contractContent.replace(regex, replaceText);
            }
          }
        }
      } catch (error) {
        console.error('[Contract Assist] Error parsing edit JSON:', error);
      }
    }

    console.log('[Contract Assist] Response generated:', {
      hasEditSuggestion: !!editSuggestion,
      hasSearchReplace: !!(searchText && replaceText),
      responseLength: assistantMessage.length,
    });

    // 4. Guardar respuesta del asistente en BD
    const { error: assistantMsgError } = await supabase
      .from('contract_chat_history')
      .insert({
        contract_id: contractId,
        user_id: user.id,
        role: 'assistant',
        content: assistantMessage,
        edit_suggestion: editSuggestion,
      });

    if (assistantMsgError) {
      console.error('[Contract Assist] Error saving assistant message:', assistantMsgError);
      // Continuar aunque falle (no bloqueante)
    }

    return NextResponse.json(
      {
        message: assistantMessage,
        editSuggestion,
        changedText: replaceText, // Para highlight visual en el frontend
        usage: response.usage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Contract Assist] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
