import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { ARRAS_PENITENCIALES_SETTINGS } from '@/lib/claude/generation-settings/arras-penitenciales';
import { ARRENDAMIENTO_VIVIENDA_SETTINGS } from '@/lib/claude/generation-settings/arrendamiento-vivienda';

// Mapa de settings por tipo de contrato
const GENERATION_SETTINGS_MAP: Record<string, any> = {
  'arras-penitenciales': ARRAS_PENITENCIALES_SETTINGS,
  'arrendamiento-vivienda': ARRENDAMIENTO_VIVIENDA_SETTINGS,
  // Aquí se añadirán más tipos: 'psi-compra', 'loi', 'nda', etc.
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      contractType, // 'arras-penitenciales', 'arrendamiento-vivienda', etc.
      contractData, // Datos recopilados del sidebar
      deepAnalysis, // Análisis profundo de Gemini
      templateId, // ID del template en la BD (opcional)
      conversacionId, // ID de la conversación para poder volver
    } = body;

    if (!contractType) {
      return NextResponse.json(
        { error: 'Tipo de contrato requerido' },
        { status: 400 }
      );
    }

    // ⭐ NUEVO: Priorizar template de la BD si está disponible
    let settings = GENERATION_SETTINGS_MAP[contractType];
    let templateFromDB = null;

    // Si el análisis profundo incluyó un template sugerido, usarlo
    if (deepAnalysis?.suggestedTemplate?.contenido_markdown) {
      templateFromDB = deepAnalysis.suggestedTemplate;
      console.log('[Claude Generation] Using template from DB:', templateFromDB.nombre);

      // Crear settings dinámicos basados en el template de la BD
      settings = {
        id: templateFromDB.codigo || contractType,
        nombre: templateFromDB.nombre,
        descripcion: `Template seleccionado de la base de datos`,
        templateBase: templateFromDB.contenido_markdown,
        claudeInstructions: `Eres un abogado senior especializado en derecho inmobiliario español con 25+ años de experiencia.

Tu tarea es generar un CONTRATO PROFESIONAL Y COMPLETO basándote en:
1. El template base proporcionado
2. Los datos recopilados del usuario
3. Las circunstancias especiales detectadas

**REGLAS CRÍTICAS:**
1. **LENGUAJE JURÍDICO PROFESIONAL**: Usa lenguaje técnico-jurídico preciso y formal
2. **REFERENCIAS LEGALES**: Incluye referencias específicas a artículos del CC, LAU, leyes aplicables
3. **PERSONALIZACIÓN INTELIGENTE**: Modifica cláusulas según circunstancias detectadas
4. **DATOS COMPLETOS**: Rellena TODOS los campos con los datos proporcionados
5. **ESTRUCTURA PROFESIONAL**: Mantén la estructura formal del contrato
6. **PROTECCIONES LEGALES**: Incluye cláusulas de protección según el perfil del cliente

**FORMATO DE SALIDA:**
- Markdown bien estructurado
- Numeración según el template original
- Texto formal y profesional
- Sin emojis ni lenguaje coloquial

El documento debe estar LISTO PARA FIRMAR sin modificaciones.`,
        camposRequeridos: templateFromDB.campos_requeridos || [],
        claudeConfig: {
          model: 'claude-sonnet-4-5',
          max_tokens: 16000,
          temperature: 0.3,
        },
      };
    } else if (!settings) {
      // No hay template de BD ni settings hardcodeados
      return NextResponse.json(
        { error: `No hay settings ni template disponible para: ${contractType}` },
        { status: 400 }
      );
    }

    // Inicializar Claude (Anthropic)
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    // Preparar el prompt para Claude
    const systemPrompt = settings.claudeInstructions;

    // Construir el contexto con todos los datos
    const userPrompt = buildUserPrompt(settings, contractData, deepAnalysis);

    console.log('[Claude Generation] Generating contract:', {
      contractType,
      model: settings.claudeConfig.model,
      dataCompleteness: contractData?.completitud || 0,
      hasContractData: !!contractData,
      hasDeepAnalysis: !!deepAnalysis,
      datosBasicosCount: contractData?.datosBasicos ? Object.keys(contractData.datosBasicos).length : 0,
    });

    // Log detallado para debugging
    console.log('[Claude Generation] Contract Data:', JSON.stringify(contractData?.datosBasicos, null, 2));
    console.log('[Claude Generation] Deep Analysis:', JSON.stringify(deepAnalysis, null, 2));
    console.log('[Claude Generation] User Prompt Preview:', userPrompt.substring(0, 1000));

    // Llamar a Claude para generar el contrato
    const message = await anthropic.messages.create({
      model: settings.claudeConfig.model,
      max_tokens: settings.claudeConfig.max_tokens,
      temperature: settings.claudeConfig.temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extraer el contenido generado
    const generatedContent =
      message.content[0].type === 'text' ? message.content[0].text : '';

    if (!generatedContent) {
      throw new Error('Claude no generó contenido');
    }

    // Guardar el contrato generado en la base de datos
    const { data: contract, error: dbError } = await supabase
      .from('contract_generations')
      .insert({
        user_id: user.id,
        template_id: templateId,
        conversacion_id: conversacionId, // Para poder volver a la conversación
        titulo: `${settings.nombre} - ${new Date().toLocaleDateString('es-ES')}`,
        contenido_markdown: generatedContent,
        datos_completados: {
          ...contractData?.datosBasicos,
          _metadata: {
            generated_with: 'claude',
            model: settings.claudeConfig.model,
            deep_analysis: deepAnalysis,
            contract_type: contractType,
            generation_date: new Date().toISOString(),
            tokens_used: message.usage,
          },
        },
        idioma: 'es',
        estado: 'generado',
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Claude Generation] Error saving contract:', dbError);
      throw dbError;
    }

    console.log('[Claude Generation] Contract generated successfully:', contract.id);

    return NextResponse.json(
      {
        success: true,
        contract: {
          id: contract.id,
          titulo: contract.titulo,
          contenido: generatedContent,
          datos_completados: contract.datos_completados,
        },
        usage: message.usage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Claude Generation] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al generar contrato con Claude',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Construye el prompt del usuario para Claude con todos los datos
 */
function buildUserPrompt(
  settings: any,
  contractData: any,
  deepAnalysis: any
): string {
  const parts: string[] = [];

  parts.push('# GENERAR CONTRATO PROFESIONAL\n');
  parts.push(`Tipo de contrato: **${settings.nombre}**\n`);
  parts.push('---\n');

  // PARTE 1: Template base
  parts.push('## TEMPLATE BASE\n');
  parts.push('```\n');
  parts.push(settings.templateBase);
  parts.push('\n```\n\n');

  // PARTE 2: Datos recopilados
  parts.push('## DATOS RECOPILADOS DEL USUARIO\n');

  if (contractData?.datosBasicos) {
    Object.entries(contractData.datosBasicos).forEach(([section, fields]: [string, any]) => {
      if (fields && Object.keys(fields).length > 0) {
        parts.push(`\n### ${section.toUpperCase()}\n`);
        Object.entries(fields).forEach(([fieldName, fieldData]: [string, any]) => {
          if (fieldData?.valor) {
            parts.push(`- **${fieldName}**: ${fieldData.valor}\n`);
          }
        });
      }
    });
  }

  parts.push('\n---\n');

  // PARTE 3: Circunstancias especiales
  if (deepAnalysis?.circunstanciasEspeciales?.length > 0) {
    parts.push('## CIRCUNSTANCIAS ESPECIALES DETECTADAS\n');
    deepAnalysis.circunstanciasEspeciales.forEach((circ: any, idx: number) => {
      parts.push(`${idx + 1}. **${circ.tipo}**: ${circ.descripcion}\n`);
    });
    parts.push('\n---\n');
  }

  // PARTE 4: Cláusulas adicionales sugeridas
  if (deepAnalysis?.clausulasAdicionales?.length > 0) {
    parts.push('## CLÁUSULAS ADICIONALES SUGERIDAS\n');
    deepAnalysis.clausulasAdicionales.forEach((clausula: any) => {
      parts.push(`\n### ${clausula.nombre}\n`);
      parts.push(`**Razón**: ${clausula.razon}\n`);
      parts.push(`**Texto sugerido**: ${clausula.textoSugerido}\n`);
      if (clausula.impactoEconomico) {
        parts.push(`**Impacto económico**: ${clausula.impactoEconomico}\n`);
      }
    });
    parts.push('\n---\n');
  }

  // PARTE 5: Modificaciones a cláusulas estándar
  if (deepAnalysis?.modificacionesClausulas?.length > 0) {
    parts.push('## MODIFICACIONES A CLÁUSULAS ESTÁNDAR\n');
    deepAnalysis.modificacionesClausulas.forEach((mod: any) => {
      parts.push(`\n### ${mod.clausulaEstandar}\n`);
      parts.push(`**Modificación necesaria**: ${mod.modificacionNecesaria}\n`);
      parts.push(`**Razón**: ${mod.razon}\n`);
      if (mod.textoModificado) {
        parts.push(`**Texto modificado**: ${mod.textoModificado}\n`);
      }
    });
    parts.push('\n---\n');
  }

  // PARTE 6: Instrucciones finales
  parts.push('## INSTRUCCIONES PARA LA GENERACIÓN\n\n');
  parts.push('**CRÍTICO - Personalización del Template:**\n\n');
  parts.push('1. **ELIMINAR TODOS LOS PLACEHOLDERS**: El template base contiene placeholders genéricos como "DOMICILIO DE LA EMPRESA", "LOCALIZACIÓN DE ALQUILERES", etc. Debes REEMPLAZARLOS completamente con los datos reales proporcionados arriba.\n\n');
  parts.push('2. **RELLENAR DATOS REALES**: Para cada campo del template:\n');
  parts.push('   - Si el dato está en "DATOS RECOPILADOS", úsalo EXACTAMENTE\n');
  parts.push('   - Si NO hay dato disponible, usa un placeholder descriptivo en formato: [descripción del dato]\n');
  parts.push('   - Ejemplos de placeholders: [nombre del vendedor], [dirección del inmueble], [importe de arras]\n');
  parts.push('   - NUNCA inventes datos que no te han proporcionado\n');
  parts.push('   - NUNCA dejes placeholders genéricos como "DOMICILIO DE LA EMPRESA" o "___€"\n');
  parts.push('   - Los placeholders deben ser DESCRIPTIVOS y en español entre corchetes\n\n');
  parts.push('3. **APLICAR MODIFICACIONES**: Modifica las cláusulas estándar según lo indicado en "MODIFICACIONES A CLÁUSULAS ESTÁNDAR"\n\n');
  parts.push('4. **AÑADIR CLÁUSULAS ADICIONALES**: Inserta las cláusulas sugeridas en la sección apropiada del contrato\n\n');
  parts.push('5. **INCLUIR CIRCUNSTANCIAS ESPECIALES**: Asegúrate de que cada circunstancia especial detectada esté reflejada en el contrato\n\n');
  parts.push('6. **MANTENER PROFESIONALISMO**: Lenguaje jurídico formal, referencias legales precisas (CC, LAU, etc.)\n\n');
  parts.push('7. **ESTRUCTURA FINAL**: El contrato debe ser coherente, completo y listo para firmar SIN modificaciones\n\n');
  parts.push('8. El documento debe estar LISTO PARA FIRMAR\n\n');

  parts.push('**IMPORTANTE**: Devuelve SOLO el contrato completo en formato Markdown, sin explicaciones adicionales.\n');

  return parts.join('');
}
