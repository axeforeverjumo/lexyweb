import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTRACT_DEEP_ANALYZER_PROMPT,
  parseDeepAnalysis,
  type ContractDeepAnalysis,
} from '@/lib/gemini/prompts/contract-deep-analyzer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AnalyzeRequest {
  conversacionId?: string;
  mensajes?: Array<{ role: string; content: string }>;
}

/**
 * POST /api/contracts/analyze-conversation
 *
 * Analiza una conversación completa para:
 * - Extraer datos estructurados
 * - Identificar circunstancias especiales
 * - Detectar preocupaciones del usuario
 * - Sugerir cláusulas adicionales
 * - Recomendar modificaciones a cláusulas estándar
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: AnalyzeRequest = await request.json();
    const { conversacionId, mensajes } = body;

    // Obtener mensajes de la conversación
    let conversationMessages: Array<{ role: string; content: string }> = [];

    if (conversacionId) {
      // Obtener mensajes de la base de datos
      const { data: mensajesDB, error } = await supabase
        .from('mensajes')
        .select('role, content')
        .eq('conversacion_id', conversacionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
          { error: 'Error al obtener mensajes' },
          { status: 500 }
        );
      }

      conversationMessages = mensajesDB || [];
    } else if (mensajes && mensajes.length > 0) {
      // Usar mensajes proporcionados directamente
      conversationMessages = mensajes;
    } else {
      return NextResponse.json(
        { error: 'Debe proporcionar conversacionId o mensajes' },
        { status: 400 }
      );
    }

    if (conversationMessages.length === 0) {
      return NextResponse.json(
        { error: 'No hay mensajes para analizar' },
        { status: 400 }
      );
    }

    // Formatear conversación para el análisis
    const conversationText = conversationMessages
      .map((msg) => {
        const roleLabel = msg.role === 'user' ? 'Usuario' : 'Lexy';
        return `${roleLabel}: "${msg.content}"`;
      })
      .join('\n\n');

    // Llamar a Gemini con el prompt de análisis profundo
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const fullPrompt = `${CONTRACT_DEEP_ANALYZER_PROMPT}

---

**CONVERSACIÓN A ANALIZAR:**

${conversationText}

---

**ANALIZA AHORA Y RESPONDE CON EL JSON COMPLETO:**`;

    console.log('[Analyze Conversation] Calling Gemini for deep analysis...');
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const analysisText = response.text();

    console.log('[Analyze Conversation] Raw response:', analysisText);

    // Parsear el análisis
    const analysis = parseDeepAnalysis(analysisText);

    if (!analysis) {
      console.error('[Analyze Conversation] Failed to parse analysis');
      return NextResponse.json(
        { error: 'Error al analizar la conversación' },
        { status: 500 }
      );
    }

    // ⭐ NUEVO: Búsqueda inteligente de template usando embeddings + híbrido
    let suggestedTemplate = null;
    if (analysis.resumenAnalisis.tipoContrato) {
      try {
        // 1. Crear query de búsqueda enriquecida
        const searchQuery = `${analysis.resumenAnalisis.tipoContrato}. ${conversationText.substring(0, 500)}`;

        // 2. Generar embedding de la conversación con Gemini
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embeddingResult = await embeddingModel.embedContent(searchQuery);
        const queryEmbedding = embeddingResult.embedding.values;

        console.log('[Template Search] Generated embedding with', queryEmbedding.length, 'dimensions');

        // 3. Buscar con híbrido: embedding + keywords + metadata
        const { data: templates, error: searchError } = await supabase.rpc(
          'match_contract_templates_hybrid',
          {
            query_embedding: queryEmbedding,
            query_text: analysis.resumenAnalisis.tipoContrato,
            match_threshold: 0.3,
            match_count: 5,
            filter_idioma: 'es',
            filter_region: 'España'
          }
        );

        if (searchError) {
          console.error('[Template Search] Error:', searchError);
        } else if (templates && templates.length > 0) {
          // 4. Seleccionar el mejor template (mayor final_score)
          const bestTemplate = templates[0];

          suggestedTemplate = {
            id: bestTemplate.id,
            codigo: bestTemplate.codigo,
            nombre: bestTemplate.nombre,
            categoria: bestTemplate.categoria,
            subcategoria: bestTemplate.subcategoria,
            contenido_markdown: bestTemplate.contenido_markdown,
            campos_requeridos: bestTemplate.campos_requeridos,
            similarity: bestTemplate.similarity,
            keyword_score: bestTemplate.keyword_score,
            final_score: bestTemplate.final_score,
          };

          console.log('[Template Search] Best match:', {
            nombre: bestTemplate.nombre,
            final_score: bestTemplate.final_score,
            similarity: bestTemplate.similarity,
            keyword_score: bestTemplate.keyword_score,
          });

          // Log top 3 para debugging
          console.log('[Template Search] Top 3 templates:');
          templates.slice(0, 3).forEach((t: any, idx: number) => {
            console.log(`  ${idx + 1}. ${t.nombre} (score: ${t.final_score.toFixed(3)})`);
          });
        } else {
          console.log('[Template Search] No templates found');
        }
      } catch (error) {
        console.error('[Template Search] Error during hybrid search:', error);
        // No fallar toda la request, solo no devolver template
      }
    }

    // Construir respuesta completa
    const fullAnalysis = {
      ...analysis,
      suggestedTemplate,
      metadata: {
        conversacionId: conversacionId || null,
        totalMensajes: conversationMessages.length,
        analyzedAt: new Date().toISOString(),
      },
    };

    console.log('[Analyze Conversation] Analysis complete:', {
      tipoContrato: analysis.resumenAnalisis.tipoContrato,
      complejidad: analysis.resumenAnalisis.complejidad,
      datosCompletos: analysis.resumenAnalisis.datosCompletos,
      clausulasAdicionales: analysis.clausulasAdicionales.length,
      modificaciones: analysis.modificacionesClausulas.length,
    });

    return NextResponse.json(fullAnalysis, { status: 200 });
  } catch (error) {
    console.error('Error analyzing conversation:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
