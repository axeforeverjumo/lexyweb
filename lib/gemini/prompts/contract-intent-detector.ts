/**
 * Prompt para detectar si Gemini ha sugerido crear un contrato
 *
 * Analiza la última respuesta generada para determinar si:
 * 1. Se mencionó la necesidad de un contrato
 * 2. Se recomendó formalizar algo por escrito
 * 3. El usuario preguntó explícitamente por un contrato
 */

export const CONTRACT_INTENT_DETECTOR_PROMPT = `
Eres Lexy, un asistente legal experto. Analiza SOLO tu ÚLTIMA RESPUESTA que acabas de generar.

**PREGUNTA CRÍTICA:**
¿En tu última respuesta sugeriste, mencionaste o recomendaste que el usuario necesita crear un contrato o documento legal?

**INDICADORES CLAVE DE NECESIDAD DE CONTRATO:**

1. **Menciones Directas:**
   - "necesitas un contrato de..."
   - "te recomiendo redactar un contrato..."
   - "deberías formalizar con un contrato..."
   - "vamos a crear/preparar un contrato..."

2. **Formalización Legal:**
   - "lo ideal es firmarlo por escrito"
   - "debes documentarlo legalmente"
   - "necesitas un documento que recoja..."
   - "conveniente plasmarlo en un contrato"

3. **Petición Explícita del Usuario:**
   - Usuario dice: "quiero hacer un contrato"
   - Usuario dice: "necesito un arrendamiento"
   - Usuario dice: "cómo redacto un contrato..."

**TIPOS DE CONTRATO DISPONIBLES (detectar cuál):**

**1. ENCARGOS Y GESTIÓN:**
- **Encargo venta sin exclusiva:** mandato sin exclusividad para vender
- **Encargo venta con exclusiva:** mandato exclusivo de venta
- **Encargo alquiler:** mandato para gestionar alquiler
- **Administración vertical:** gestión integral de propiedades

**2. COMPRAVENTA Y ARRAS:**
- **Arras penitenciales:** señal con derecho a desistir
- **Arras confirmatorias:** señal sin derecho a desistir
- **Arras penales:** señal con penalización por incumplimiento
- **Oferta de compra:** propuesta formal de adquisición
- **Contrato compraventa:** bienes inmuebles o muebles

**3. ARRENDAMIENTOS:**
- **Arrendamiento vivienda:** persona física o jurídica
- **Arrendamiento local comercial:** uso comercial
- **Arrendamiento temporada:** corta duración, estudiantes
- **Arrendamiento turístico:** vacacional (LAU o CC)
- **Arrendamiento con opción compra:** derecho preferente
- **Cesión de negocio:** traspaso local con negocio
- **Finca rústica:** terrenos agrícolas
- **Renuncia arrendamiento:** terminación anticipada

**4. SERVICIOS INMOBILIARIOS:**
- **PSI Compra:** Personal Shopper Inmobiliario compra
- **PSI Alquiler:** Personal Shopper Inmobiliario alquiler
- **Hoja de visita:** registro visitas con/sin comisión comprador
- **Acuerdo colaboración agencias:** cooperación entre APIs

**5. DOCUMENTACIÓN LEGAL:**
- **LOI (Letter of Intent):** carta de intenciones
- **Confidencialidad (NDA):** acuerdo no divulgación
- **KYC blanqueo capitales:** identificación cliente
- **Información mínima:** compra o alquiler (obligatorio)

**6. OTROS CONTRATOS:**
- **Cesión derechos imagen:** uso comercial imágenes
- **Préstamo entre particulares:** mutuo dinerario
- **Autorización cambio suministros:** agua, luz, gas
- **Bienes muebles:** compraventa muebles

**SITUACIONES QUE NO REQUIEREN CONTRATO:**
- Consultas teóricas sobre leyes (LAU, CC)
- Explicaciones de conceptos legales
- Dudas sobre procedimientos
- Preguntas generales sin intención de formalizar

**FORMATO DE RESPUESTA (JSON estricto):**
{
  "needsContract": boolean,
  "confidence": number,  // 0.0 a 1.0
  "contractType": string | null,  // ej: "arrendamiento vivienda"
  "userExplicitRequest": boolean,  // ¿Usuario pidió directamente?
  "reasoning": string  // Explicación breve (1-2 líneas)
}

**EJEMPLOS:**

Respuesta: "Para alquilar tu piso necesitas un contrato de arrendamiento de vivienda. Según la LAU..."
→ {
  "needsContract": true,
  "confidence": 0.95,
  "contractType": "arrendamiento vivienda",
  "userExplicitRequest": true,
  "reasoning": "Mencioné explícitamente crear contrato de arrendamiento"
}

Respuesta: "La LAU regula los arrendamientos urbanos. Sus principales características son..."
→ {
  "needsContract": false,
  "confidence": 0.0,
  "contractType": null,
  "userExplicitRequest": false,
  "reasoning": "Solo expliqué conceptos teóricos, no sugerí crear contrato"
}

Respuesta: "Te ayudo con el contrato de compraventa. Lo ideal es que incluya cláusulas de..."
→ {
  "needsContract": true,
  "confidence": 0.98,
  "contractType": "compraventa",
  "userExplicitRequest": true,
  "reasoning": "Usuario pidió ayuda con contrato y yo ofrecí asistencia directa"
}

Respuesta: "Si decides vender, deberás firmar un contrato de compraventa..."
→ {
  "needsContract": true,
  "confidence": 0.75,
  "contractType": "compraventa",
  "userExplicitRequest": false,
  "reasoning": "Mencioné necesidad de contrato pero es condicional (si decides)"
}

**IMPORTANTE:**
- Sé conservador: Solo marca needsContract=true si es clara la necesidad
- confidence < 0.7 → No sugerir automáticamente
- confidence >= 0.7 y < 0.85 → Sugerir con cautela
- confidence >= 0.85 → Sugerir con confianza
- Si hay duda, needsContract = false

RESPONDE SOLO EL JSON, sin explicaciones adicionales.
`;

export interface ContractIntentDetection {
  needsContract: boolean;
  confidence: number;
  contractType: string | null;
  userExplicitRequest: boolean;
  reasoning: string;
}

/**
 * Parsea la respuesta del detector de intención
 */
export function parseIntentDetection(response: string): ContractIntentDetection {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      needsContract: parsed.needsContract ?? false,
      confidence: parsed.confidence ?? 0,
      contractType: parsed.contractType ?? null,
      userExplicitRequest: parsed.userExplicitRequest ?? false,
      reasoning: parsed.reasoning ?? 'No reasoning provided',
    };
  } catch (error) {
    console.error('Error parsing intent detection:', error);
    return {
      needsContract: false,
      confidence: 0,
      contractType: null,
      userExplicitRequest: false,
      reasoning: 'Error al analizar respuesta',
    };
  }
}
