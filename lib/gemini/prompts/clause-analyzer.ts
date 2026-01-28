/**
 * Prompt para análisis profesional de cláusulas contractuales
 */

export const CLAUSE_ANALYZER_PROMPT = `Eres un experto en derecho contractual español especializado en análisis de cláusulas inmobiliarias.

Analiza la siguiente cláusula desde una perspectiva profesional y jurídica rigurosa.

## CLÁUSULA A ANALIZAR:

{clausula}

## ANÁLISIS REQUERIDO:

### 1. Validez Legal
- ¿Es conforme a la legislación española vigente?
- ¿Infringe alguna normativa (LAU, CC, Ley de Consumidores)?
- ¿Es una cláusula permitida o prohibida?

### 2. Carácter Abusivo
- Según Directiva 93/13/CEE y Ley de Consumidores
- ¿Genera desequilibrio importante en perjuicio del consumidor?
- ¿Es contraria a la buena fe?
- Jurisprudencia del TJUE y TS sobre cláusulas similares

### 3. Equilibrio Contractual
- ¿Favorece excesivamente a una parte?
- ¿Hay reciprocidad en obligaciones?
- ¿Está justificado legalmente el desequilibrio (si existe)?

### 4. Claridad y Redacción
- ¿Es comprensible y transparente?
- ¿Puede generar ambigüedad interpretativa?
- ¿Cumple con el requisito de información precontractual?

### 5. Riesgos Legales
- Probabilidad de impugnación judicial
- Consecuencias de su nulidad
- Afectación al resto del contrato

### 6. Mejoras Sugeridas
- Redacción alternativa más segura
- Añadidos necesarios para mayor protección
- Ajustes para cumplimiento legal

## FORMATO DE RESPUESTA:

Devuelve tu análisis EXCLUSIVAMENTE en formato JSON válido:

\`\`\`json
{
  "validez": "valida" | "cuestionable" | "abusiva" | "nula",
  "base_legal": "Normativa aplicable y artículos relevantes",

  "problemas": [
    {
      "tipo": "abusiva" | "ambigua" | "ilegal" | "desequilibrada",
      "descripcion": "Descripción detallada del problema",
      "articulo_infringido": "Artículo legal específico (si aplica)",
      "gravedad": 1-10,
      "jurisprudencia": "Sentencia relevante que aplica (si existe)"
    }
  ],

  "equilibrio": {
    "perjudicado": "arrendador" | "arrendatario" | "vendedor" | "comprador" | "equilibrado",
    "justificacion": "Por qué es o no equilibrado"
  },

  "riesgos": [
    {
      "tipo": "nulidad" | "impugnacion" | "interpretacion",
      "descripcion": "Descripción del riesgo",
      "probabilidad": "alta" | "media" | "baja"
    }
  ],

  "recomendaciones": [
    {
      "accion": "modificar" | "eliminar" | "añadir" | "aclarar",
      "razon": "Fundamento jurídico de la recomendación",
      "prioridad": "alta" | "media" | "baja"
    }
  ],

  "clausula_mejorada": "Redacción alternativa sugerida (solo si hay problemas)",

  "jurisprudencia_aplicable": [
    {
      "tribunal": "TS" | "TJUE" | "AP",
      "sentencia": "STS 15/03/2018, Rec. 2145/2016",
      "doctrina": "Resumen de la doctrina aplicable"
    }
  ]
}
\`\`\`

## IMPORTANTE:
- Sé riguroso y técnico en el análisis
- Cita artículos específicos de leyes
- Incluye jurisprudencia real cuando sea relevante
- Prioriza la seguridad jurídica
- Si la cláusula es válida, dilo claramente
- NO devuelvas texto antes o después del JSON, SOLO el JSON`;

export const formatClauseAnalyzerPrompt = (clausula: string): string => {
  return CLAUSE_ANALYZER_PROMPT.replace('{clausula}', clausula);
};

export default CLAUSE_ANALYZER_PROMPT;
