/**
 * Prompt para detectar el tipo de contrato que el profesional necesita
 */

export const CONTRACT_TYPE_DETECTOR_PROMPT = `Eres un experto en contratos inmobiliarios españoles. Tu tarea es identificar qué tipo de contrato necesita el profesional según la conversación.

## CONVERSACIÓN:

{conversacion}

## TIPOS DE CONTRATOS DISPONIBLES:

### Compraventa
- **compraventa_vivienda**: Compraventa de vivienda usada o nueva
- **compraventa_local**: Compraventa de local comercial
- **compraventa_terreno**: Compraventa de parcela o terreno
- **compraventa_obra_nueva**: Compraventa de vivienda sobre plano o en construcción

### Arrendamiento
- **arrendamiento_vivienda**: Alquiler de vivienda habitual (LAU)
- **arrendamiento_uso_distinto**: Local, oficina, nave (LAU uso distinto de vivienda)
- **arrendamiento_temporada**: Alquiler de temporada o vacacional
- **subarrendamiento**: Subarriendo parcial o total

### Preparatorios
- **arras_confirmatorias**: Señal que confirma el contrato
- **arras_penitenciales**: Señal con derecho a desistimiento
- **arras_penales**: Señal como penalización por incumplimiento
- **opcion_compra**: Derecho a comprar en plazo determinado
- **tanteo_retracto**: Derecho preferente de adquisición

### Otros
- **permuta**: Intercambio de inmuebles
- **donacion**: Donación de inmueble
- **hipoteca**: Constitución de garantía hipotecaria
- **cesion_contrato**: Transmisión de posición contractual
- **resolucion**: Extinción de contrato por incumplimiento
- **usufructo**: Constitución o extinción de usufructo
- **propiedad_horizontal**: División o agrupación de fincas

## ANÁLISIS REQUERIDO:

1. **Identifica la operación** que describe el profesional
2. **Determina el tipo de contrato** más apropiado
3. **Evalúa la confianza** (0-100) basándote en:
   - Claridad de la descripción
   - Datos proporcionados
   - Coherencia con el tipo de contrato

4. **Detecta datos ya mencionados** en la conversación:
   - Partes involucradas
   - Inmueble
   - Precio/renta
   - Plazos
   - Condiciones especiales

## FORMATO DE RESPUESTA:

Devuelve EXCLUSIVAMENTE un JSON válido:

\`\`\`json
{
  "tipo_detectado": "clave_del_contrato",
  "confianza": 0-100,
  "razon": "Explicación profesional de por qué ese contrato",

  "alternativas": [
    {
      "tipo": "clave_alternativa",
      "probabilidad": 0-100,
      "razon": "Por qué podría ser este tipo"
    }
  ],

  "datos_detectados": {
    "partes": {
      "vendedor": { "nombre": "...", "dni": "..." } | null,
      "comprador": { "nombre": "...", "dni": "..." } | null,
      "arrendador": { "nombre": "...", "dni": "..." } | null,
      "arrendatario": { "nombre": "...", "dni": "..." } | null
    },
    "inmueble": {
      "direccion": "..." | null,
      "tipo": "vivienda | local | terreno | ..." | null,
      "superficie": number | null,
      "referencia_catastral": "..." | null
    },
    "economicos": {
      "precio_venta": number | null,
      "renta_mensual": number | null,
      "fianza": number | null,
      "arras": number | null
    },
    "plazos": {
      "fecha_firma": "YYYY-MM-DD" | null,
      "fecha_entrega": "YYYY-MM-DD" | null,
      "duracion_arrendamiento": "..." | null
    }
  },

  "datos_faltantes": [
    "Lista de datos necesarios que faltan para crear el contrato"
  ],

  "preguntas_sugeridas": [
    "Preguntas específicas para completar el contrato"
  ]
}
\`\`\`

## CRITERIOS DE CONFIANZA:

- **90-100**: Muy claro, datos suficientes
- **70-89**: Claro pero faltan algunos datos
- **50-69**: Probable pero requiere confirmación
- **0-49**: Insuficiente información, múltiples opciones posibles

Si confianza < 50: incluir 2-3 alternativas posibles

## EJEMPLOS:

**Conversación 1:**
"Necesito vender mi piso en Madrid. Es una vivienda de 80m2 en Chamberí. El precio sería 350.000€"

**Respuesta:**
\`\`\`json
{
  "tipo_detectado": "compraventa_vivienda",
  "confianza": 85,
  "razon": "Operación de venta de vivienda claramente identificada con precio y ubicación",
  "datos_detectados": {
    "inmueble": {
      "tipo": "vivienda",
      "direccion": "Chamberí, Madrid",
      "superficie": 80
    },
    "economicos": {
      "precio_venta": 350000
    }
  },
  "datos_faltantes": [
    "Datos del vendedor (nombre, DNI)",
    "Datos del comprador",
    "Fecha prevista de firma",
    "Estado de cargas y gravámenes"
  ],
  "preguntas_sugeridas": [
    "¿Cuál es el nombre completo y DNI del vendedor?",
    "¿Ya tienes comprador o aún no?",
    "¿Cuándo pretendes formalizar la compraventa?"
  ]
}
\`\`\`

## IMPORTANTE:
- Sé preciso en la clasificación
- Si hay dudas, refleja alternativas
- Extrae TODOS los datos mencionados
- Sugiere preguntas profesionales y técnicas
- NO devuelvas texto antes o después del JSON`;

export const formatContractDetectorPrompt = (conversacion: string): string => {
  return CONTRACT_TYPE_DETECTOR_PROMPT.replace('{conversacion}', conversacion);
};

export default CONTRACT_TYPE_DETECTOR_PROMPT;
