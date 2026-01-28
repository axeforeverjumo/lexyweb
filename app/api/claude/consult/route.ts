import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { question, contractData, contractType } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Pregunta requerida' }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    // Preparar contexto del contrato
    const contextoParts: string[] = [];
    
    contextoParts.push(`# CONTEXTO DEL CONTRATO\n`);
    contextoParts.push(`Tipo de contrato: **${contractType || 'No especificado'}**\n\n`);

    if (contractData?.datosBasicos) {
      contextoParts.push(`## DATOS RECOPILADOS:\n`);
      Object.entries(contractData.datosBasicos).forEach(([section, fields]: [string, any]) => {
        if (fields && Object.keys(fields).length > 0) {
          contextoParts.push(`\n### ${section.toUpperCase()}\n`);
          Object.entries(fields).forEach(([fieldName, fieldData]: [string, any]) => {
            if (fieldData?.valor) {
              contextoParts.push(`- **${fieldName}**: ${fieldData.valor}\n`);
            } else {
              contextoParts.push(`- **${fieldName}**: ❌ NO COMPLETADO\n`);
            }
          });
        }
      });
    }

    const systemPrompt = `Eres un abogado senior experto en derecho inmobiliario español con 25+ años de experiencia.

El usuario está completando un contrato y tiene dudas sobre qué información debe proporcionar en ciertos campos.

**TU ROL:**
- Responder preguntas sobre campos del contrato
- Explicar QUÉ significa cada campo
- Dar EJEMPLOS concretos de qué poner
- Indicar DÓNDE encontrar esa información
- Advertir sobre ERRORES comunes

**CÓMO RESPONDER:**
1. SÉ BREVE Y CLARO (máximo 4-5 líneas)
2. USA EJEMPLOS concretos
3. Si es un dato registral, indica DÓNDE buscarlo
4. Si es complejo, simplifica SIN perder precisión legal

**EJEMPLOS DE BUENAS RESPUESTAS:**

Pregunta: "¿Qué es la referencia catastral?"
Respuesta: "Es un código único de 20 caracteres que identifica tu propiedad. Ejemplo: 1234567AB8901C0001AB. Lo encuentras en el IBI, escrituras o en la web del Catastro (sedecatastro.gob.es)."

Pregunta: "¿Qué pongo en datos registrales?"
Respuesta: "Necesitas: Tomo, Libro, Folio y Finca del Registro de la Propiedad. Ejemplo: Tomo 1234, Libro 567, Folio 89, Finca 12345. Lo encuentras en la nota simple registral."

**CONTEXTO ACTUAL:**
${contextoParts.join('')}

Responde la pregunta del usuario de forma práctica y útil.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json(
      {
        answer: response,
        usage: message.usage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Claude Consult] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al consultar con Claude',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
