/**
 * Field Extractor - Extracción de campos con IA
 * Usa Gemini Flash para extraer datos estructurados del chat
 * Costo: ~1,000 tokens
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ExtractedFields {
  tipoContrato: string;
  vendedor?: PersonaFields;
  comprador?: PersonaFields;
  arrendador?: PersonaFields;
  arrendatario?: PersonaFields;
  inmueble?: InmuebleFields;
  economicos?: EconomicosFields;
  fechas?: FechasFields;
  [key: string]: any;
}

export interface PersonaFields {
  nombre?: string;
  apellidos?: string;
  nombre_completo?: string;
  dni?: string;
  domicilio?: string;
  email?: string;
  telefono?: string;
}

export interface InmuebleFields {
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  referencia_catastral?: string;
  superficie?: number;
  tipo?: 'piso' | 'casa' | 'local' | 'garaje' | 'trastero';
  descripcion?: string;
}

export interface EconomicosFields {
  precio_venta?: number;
  precio_venta_letras?: string;
  forma_pago?: string;
  renta_mensual?: number;
  fianza?: number;
  importe_arras?: number;
  porcentaje_arras?: number;
  responsable_gastos?: 'vendedor' | 'comprador' | 'compartido';
}

export interface FechasFields {
  firma?: string;  // ISO format
  entrega?: string;
  inicio_arrendamiento?: string;
  fin_arrendamiento?: string;
}

/**
 * Extrae campos estructurados del chat
 * Usa Gemini Flash (~1,000 tokens)
 */
export async function extractFieldsFromChat(
  chatMessages: { role: string; content: string }[],
  deepAnalysis?: any
): Promise<ExtractedFields> {
  const prompt = buildExtractionPrompt(chatMessages, deepAnalysis);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.1,  // Muy bajo para resultados consistentes
      maxOutputTokens: 2000
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Limpiar y parsear JSON
  const json = cleanJsonResponse(responseText);
  const parsed = JSON.parse(json);

  // Post-procesamiento
  return postProcessFields(parsed);
}

/**
 * Construye el prompt de extracción
 */
function buildExtractionPrompt(
  messages: { role: string; content: string }[],
  deepAnalysis?: any
): string {
  const chatText = messages
    .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
    .join('\n\n');

  return `
Eres un asistente experto en extracción de datos de conversaciones sobre contratos inmobiliarios.

CONVERSACIÓN:
${chatText}

${deepAnalysis?.datosBasicos ? `
DATOS YA EXTRAÍDOS (usar como referencia):
${JSON.stringify(deepAnalysis.datosBasicos, null, 2)}
` : ''}

TAREA:
Extrae TODOS los datos mencionados en la conversación sobre el contrato.

REGLAS CRÍTICAS:
1. Extrae SOLO datos mencionados explícitamente
2. Si un dato no está en la conversación, usa null
3. NO inventes ni asumas ningún dato
4. Nombres completos separar en nombre/apellidos cuando sea posible
5. Precios siempre en formato numérico (sin símbolos)
6. Fechas en formato ISO (YYYY-MM-DD)
7. DNI sin guiones ni espacios

ESQUEMA DE SALIDA (JSON):
{
  "tipoContrato": "compraventa | arrendamiento | arras | otro",
  "vendedor": {
    "nombre": "string | null",
    "apellidos": "string | null",
    "dni": "string | null",
    "domicilio": "string | null",
    "email": "string | null",
    "telefono": "string | null"
  },
  "comprador": {
    "nombre": "string | null",
    "apellidos": "string | null",
    "dni": "string | null",
    "domicilio": "string | null",
    "email": "string | null",
    "telefono": "string | null"
  },
  "inmueble": {
    "direccion": "string | null",
    "ciudad": "string | null",
    "provincia": "string | null",
    "codigo_postal": "string | null",
    "referencia_catastral": "string | null",
    "superficie": "number | null",
    "tipo": "piso | casa | local | garaje | null",
    "descripcion": "string | null"
  },
  "economicos": {
    "precio_venta": "number | null",
    "forma_pago": "string | null",
    "renta_mensual": "number | null",
    "fianza": "number | null",
    "importe_arras": "number | null",
    "porcentaje_arras": "number | null",
    "responsable_gastos": "vendedor | comprador | compartido | null"
  },
  "fechas": {
    "firma": "YYYY-MM-DD | null",
    "entrega": "YYYY-MM-DD | null",
    "inicio_arrendamiento": "YYYY-MM-DD | null",
    "fin_arrendamiento": "YYYY-MM-DD | null"
  }
}

IMPORTANTE: Devuelve SOLO el JSON válido, sin explicaciones ni texto adicional.
`;
}

/**
 * Limpia la respuesta para extraer JSON válido
 */
function cleanJsonResponse(text: string): string {
  // Remover markdown code blocks
  let clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Encontrar el JSON (entre { ... })
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }

  return clean.trim();
}

/**
 * Post-procesa campos extraídos
 */
function postProcessFields(fields: any): ExtractedFields {
  // Combinar nombre y apellidos si están separados
  ['vendedor', 'comprador', 'arrendador', 'arrendatario'].forEach(rol => {
    if (fields[rol]) {
      if (fields[rol].nombre && fields[rol].apellidos) {
        fields[rol].nombre_completo = `${fields[rol].nombre} ${fields[rol].apellidos}`;
      } else if (fields[rol].nombre_completo) {
        // Intentar separar
        const parts = fields[rol].nombre_completo.split(' ');
        if (parts.length >= 2) {
          fields[rol].nombre = parts[0];
          fields[rol].apellidos = parts.slice(1).join(' ');
        }
      }
    }
  });

  // Calcular porcentaje de arras si no está
  if (fields.economicos?.importe_arras && fields.economicos?.precio_venta) {
    if (!fields.economicos.porcentaje_arras) {
      fields.economicos.porcentaje_arras =
        Math.round((fields.economicos.importe_arras / fields.economicos.precio_venta) * 100);
    }
  }

  return fields;
}
