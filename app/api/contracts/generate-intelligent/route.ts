import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTRACT_PERSONALIZER_PROMPT,
  parsePersonalizacion,
  type PersonalizacionResult,
} from '@/lib/gemini/prompts/contract-personalizer';
import type { ContractDeepAnalysis } from '@/lib/gemini/prompts/contract-deep-analyzer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GenerateIntelligentRequest {
  templateId: string;
  deepAnalysis: ContractDeepAnalysis;
  language?: 'es' | 'en';
}

/**
 * POST /api/contracts/generate-intelligent
 *
 * Genera un contrato INTELIGENTE y PERSONALIZADO basado en:
 * 1. Plantilla base seleccionada
 * 2. Análisis profundo de la conversación
 * 3. Personalización de cláusulas según circunstancias
 * 4. Adición de cláusulas específicas
 *
 * Este es el endpoint que implementa la "verdadera personalización",
 * no solo rellenando campos sino modificando el contrato.
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

    const body: GenerateIntelligentRequest = await request.json();
    const { templateId, deepAnalysis, language = 'es' } = body;

    if (!templateId || !deepAnalysis) {
      return NextResponse.json(
        { error: 'templateId y deepAnalysis son requeridos' },
        { status: 400 }
      );
    }

    // 1. Obtener la plantilla
    const { data: template, error: templateError } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      );
    }

    console.log('[Generate Intelligent] Using template:', {
      codigo: template.codigo,
      titulo: template.titulo,
    });

    // 2. Preparar contexto del análisis profundo
    const analysisContext = prepareAnalysisContext(deepAnalysis);

    // 3. Llamar al personalizador para obtener modificaciones
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const personalizerPrompt = `${CONTRACT_PERSONALIZER_PROMPT}

---

**PLANTILLA BASE:**
Título: ${template.titulo}
Categoría: ${template.categoria}
Subcategoría: ${template.subcategoria}

**CONTENIDO DE LA PLANTILLA:**
\`\`\`
${template.contenido.substring(0, 8000)}
\`\`\`

---

**ANÁLISIS PROFUNDO DEL USUARIO:**

${analysisContext}

---

**ANALIZA LA PLANTILLA Y EL CONTEXTO, Y RESPONDE CON EL JSON DE PERSONALIZACIÓN:**`;

    console.log('[Generate Intelligent] Calling personalizer...');
    const personalizerResult = await model.generateContent(personalizerPrompt);
    const personalizerResponse = personalizerResult.response;
    const personalizerText = personalizerResponse.text();

    console.log('[Generate Intelligent] Personalizer response length:', personalizerText.length);

    // 4. Parsear personalización
    const personalizacion = parsePersonalizacion(personalizerText);

    if (!personalizacion) {
      console.error('[Generate Intelligent] Failed to parse personalization');
      // Fallback: generar sin personalización avanzada
      return await generateBasicContract(supabase, user.id, template, deepAnalysis, language);
    }

    console.log('[Generate Intelligent] Personalization:', {
      modificaciones: personalizacion.modificaciones.length,
      clausulasAdicionales: personalizacion.clausulasAdicionales.length,
      anexos: personalizacion.anexos.length,
      complejidad: personalizacion.resumen.complejidad,
    });

    // 5. Aplicar personalizaciones al template
    let finalContent = template.contenido;

    // Aplicar modificaciones de cláusulas
    for (const mod of personalizacion.modificaciones) {
      // Intentar encontrar y reemplazar la cláusula
      if (mod.textoOriginal && finalContent.includes(mod.textoOriginal)) {
        finalContent = finalContent.replace(mod.textoOriginal, mod.textoModificado);
        console.log('[Generate Intelligent] Applied modification:', mod.clausulaOriginal);
      }
    }

    // 6. Rellenar campos con datos del análisis
    finalContent = fillContractFields(finalContent, deepAnalysis);

    // 7. Añadir cláusulas adicionales al final (antes de firmas)
    if (personalizacion.clausulasAdicionales.length > 0) {
      const additionalClauses = personalizacion.clausulasAdicionales
        .map((clausula) => `\n\n## ${clausula.titulo}\n\n${clausula.texto}`)
        .join('\n');

      // Insertar antes de la sección de firmas
      const firmasIndex = finalContent.toLowerCase().indexOf('## firmas');
      if (firmasIndex > -1) {
        finalContent =
          finalContent.substring(0, firmasIndex) +
          additionalClauses +
          '\n\n' +
          finalContent.substring(firmasIndex);
      } else {
        finalContent += additionalClauses;
      }

      console.log('[Generate Intelligent] Added', personalizacion.clausulasAdicionales.length, 'additional clauses');
    }

    // 8. Añadir anexos si existen
    if (personalizacion.anexos.length > 0) {
      const anexosSection = personalizacion.anexos
        .map(
          (anexo, idx) =>
            `\n\n## ${anexo.titulo}\n\n${anexo.descripcion}\n\n${anexo.obligatorio ? '**Este anexo es obligatorio para la validez del contrato.**' : '**Anexo recomendado.**'}`
        )
        .join('\n');

      finalContent += '\n\n---\n\n# ANEXOS' + anexosSection;
      console.log('[Generate Intelligent] Added', personalizacion.anexos.length, 'annexes');
    }

    // 9. Generar título del contrato
    const contractTitle = generateContractTitle(template, deepAnalysis);

    // 10. Guardar en base de datos
    const { data: contract, error: insertError } = await supabase
      .from('contract_generations')
      .insert({
        user_id: user.id,
        template_id: template.id,
        titulo: contractTitle,
        contenido: finalContent,
        estado: 'generado',
        idioma: language,
        metadata: {
          personalizacion,
          deepAnalysis: {
            tipoContrato: deepAnalysis.resumenAnalisis.tipoContrato,
            complejidad: deepAnalysis.resumenAnalisis.complejidad,
            datosCompletos: deepAnalysis.resumenAnalisis.datosCompletos,
          },
        },
      })
      .select()
      .single();

    if (insertError || !contract) {
      console.error('[Generate Intelligent] Error saving contract:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar el contrato' },
        { status: 500 }
      );
    }

    console.log('[Generate Intelligent] Contract generated successfully:', contract.id);

    return NextResponse.json(
      {
        contract,
        personalizacion,
        message: 'Contrato generado con personalización inteligente',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating intelligent contract:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Prepara el contexto del análisis profundo para el personalizador
 */
function prepareAnalysisContext(analysis: ContractDeepAnalysis): string {
  let context = '';

  // Datos básicos
  if (analysis.datosBasicos && Object.keys(analysis.datosBasicos).length > 0) {
    context += '**DATOS EXTRAÍDOS:**\n';
    for (const [categoria, campos] of Object.entries(analysis.datosBasicos)) {
      if (!campos || Object.keys(campos).length === 0) continue;
      context += `\n${categoria.toUpperCase()}:\n`;
      for (const [campo, dato] of Object.entries(campos)) {
        if (typeof dato === 'object' && dato !== null && 'valor' in dato) {
          context += `- ${campo}: ${dato.valor} (confianza: ${dato.confianza})\n`;
        }
      }
    }
  }

  // Circunstancias especiales
  if (analysis.circunstanciasEspeciales.length > 0) {
    context += '\n**CIRCUNSTANCIAS ESPECIALES:**\n';
    analysis.circunstanciasEspeciales.forEach((circ, idx) => {
      context += `${idx + 1}. ${circ.tipo.toUpperCase()}: ${circ.descripcion}\n`;
    });
  }

  // Preocupaciones del usuario
  if (analysis.preocupacionesUsuario.length > 0) {
    context += '\n**PREOCUPACIONES DEL USUARIO:**\n';
    analysis.preocupacionesUsuario.forEach((preoc, idx) => {
      context += `${idx + 1}. [${preoc.categoria}] "${preoc.preocupacion}"\n`;
    });
  }

  // Resumen
  context += '\n**RESUMEN:**\n';
  context += `- Tipo de contrato: ${analysis.resumenAnalisis.tipoContrato}\n`;
  context += `- Complejidad: ${analysis.resumenAnalisis.complejidad}\n`;
  context += `- Datos completos: ${analysis.resumenAnalisis.datosCompletos}%\n`;

  return context;
}

/**
 * Rellena los campos del contrato con datos del análisis
 */
function fillContractFields(content: string, analysis: ContractDeepAnalysis): string {
  let result = content;

  // Recorrer datos básicos y reemplazar placeholders
  if (analysis.datosBasicos) {
    for (const [categoria, campos] of Object.entries(analysis.datosBasicos)) {
      if (!campos) continue;
      for (const [campo, dato] of Object.entries(campos)) {
        if (typeof dato === 'object' && dato !== null && 'valor' in dato && dato.valor) {
          // Buscar placeholders tipo [CAMPO] o {CAMPO} o {{CAMPO}}
          const variations = [
            `[${campo.toUpperCase()}]`,
            `{${campo.toUpperCase()}}`,
            `{{${campo.toUpperCase()}}}`,
            `[${campo}]`,
            `{${campo}}`,
          ];

          variations.forEach((placeholder) => {
            result = result.replace(new RegExp(placeholder, 'g'), dato.valor);
          });
        }
      }
    }
  }

  return result;
}

/**
 * Genera título descriptivo del contrato
 */
function generateContractTitle(template: any, analysis: ContractDeepAnalysis): string {
  const tipoContrato = analysis.resumenAnalisis.tipoContrato || template.subcategoria;

  // Intentar extraer ubicación o nombres
  let detail = '';
  if (analysis.datosBasicos?.inmueble?.direccion?.valor) {
    const direccion = analysis.datosBasicos.inmueble.direccion.valor;
    // Extraer solo calle o primeras palabras
    const parts = direccion.split(',');
    detail = ` - ${parts[0].substring(0, 30)}`;
  }

  const fecha = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `Contrato de ${tipoContrato}${detail} (${fecha})`;
}

/**
 * Fallback: generar contrato básico sin personalización avanzada
 */
async function generateBasicContract(
  supabase: any,
  userId: string,
  template: any,
  analysis: ContractDeepAnalysis,
  language: string
) {
  console.log('[Generate Intelligent] Using basic generation (fallback)');

  let content = template.contenido;
  content = fillContractFields(content, analysis);

  const title = generateContractTitle(template, analysis);

  const { data: contract, error } = await supabase
    .from('contract_generations')
    .insert({
      user_id: userId,
      template_id: template.id,
      titulo: title,
      contenido: content,
      estado: 'generado',
      idioma: language,
      metadata: {
        generationMethod: 'basic',
        deepAnalysis: {
          tipoContrato: analysis.resumenAnalisis.tipoContrato,
          complejidad: analysis.resumenAnalisis.complejidad,
        },
      },
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return NextResponse.json(
    {
      contract,
      message: 'Contrato generado (modo básico)',
    },
    { status: 201 }
  );
}
