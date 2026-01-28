/**
 * Generation Settings para Contrato de Arras Penitenciales
 *
 * Este archivo define cómo Claude debe generar este tipo específico de contrato
 */

export const ARRAS_PENITENCIALES_SETTINGS = {
  id: 'arras-penitenciales',
  nombre: 'Contrato de Arras Penitenciales',
  descripcion: 'Contrato de arras penitenciales condicionadas según Art. 1454 CC',

  // Template base del contrato (el real, profesional)
  templateBase: `CONTRATO DE ARRAS PENITENCIALES, CONDICIONADAS ex Art.1454 CC

(Condicionado a OFERTA de PRECIO / AMPLIACIÓN ARRAS / AUTORIZACIÓN JUDICIAL / CANCELACIÓN USUFRUCTO O CONDICIÓN RESOLUTORIA, CONDICIONADAS/SIN CONDICIONAR al PRÉSTAMO HIPOTECARIO)

En la oficina del Agente, sita en {{ubicacion_firma}}, {{fecha_firma}}.

COMPARECEN:

De una parte:
    {{parte_compradora_datos_completos}}

De otra:
    {{parte_vendedora_datos_completos}}

INTERVIENEN:
    {{agente_datos_completos}}

MANIFIESTAN:

I.- {{parte_vendedora_nombre}}, es propietaria de la siguiente finca:

{{descripcion_finca_completa}}

II.- CARGAS: Según la nota registral obtenida de la finca en venta (ANEXO I), se observan las siguientes cargas: {{cargas_finca}}

III.- SITUACIÓN ARRENDATICIA: {{situacion_arrendaticia}}

IV.- INSCRIPCIÓN REGISTRAL: {{datos_registro}}

V.- TÍTULO: {{titulo_propiedad}}

VI.- CÉDULA DE HABITABILIDAD: {{cedula_habitabilidad}}

VII.- CERTIFICADO DE EFICIENCIA ENERGÉTICA: {{certificado_eficiencia}}

VIII.- TRANSMISIÓN: {{clausula_transmision}}

IX.- SUMINISTROS: {{clausula_suministros}}

X.- SITUACIÓN MEDIOAMBIENTAL Y URBANÍSTICA: {{clausula_medioambiental}}

PACTOS:

PRIMERO: PRECIO Y FORMA DE PAGO
{{pacto_precio_detallado}}

SEGUNDO: ESCRITURA PÚBLICA
{{pacto_escritura}}

TERCERO: GASTOS E IMPUESTOS
{{pacto_gastos_impuestos}}

CUARTO: EVICCIÓN Y SANEAMIENTO
{{pacto_eviccion}}

QUINTO: ESTADO DE LA FINCA
{{pacto_estado_finca}}

SEXTO: CAUSAS RESOLUTORIAS
{{pacto_causas_resolutorias}}

SÉPTIMO: ARRAS PENITENCIALES (Art. 1454 CC)
{{pacto_arras_penitenciales}}

OCTAVO: CONDICIONES ESPECIALES
{{condiciones_especiales}}

NOVENO: NOTIFICACIONES ELECTRÓNICAS
{{pacto_notificaciones}}

DÉCIMO: BLANQUEO DE CAPITALES
{{pacto_blanqueo}}

UNDÉCIMO: PROTECCIÓN DE DATOS
{{pacto_proteccion_datos}}

DUODÉCIMO: MASC - Medios Adecuados de Solución de Controversias
{{pacto_masc}}

DECIMOTERCERO: SUMISIÓN A JUZGADOS Y TRIBUNALES
{{pacto_sumision}}

{{firmas}}`,

  // Instrucciones para Claude sobre cómo generar este documento
  claudeInstructions: `Eres un abogado senior especializado en derecho inmobiliario español con 25+ años de experiencia.

Tu tarea es generar un CONTRATO DE ARRAS PENITENCIALES PROFESIONAL Y COMPLETO basándote en:
1. El template base proporcionado
2. Los datos recopilados del usuario
3. Las circunstancias especiales detectadas

**REGLAS CRÍTICAS:**

1. **LENGUAJE JURÍDICO PROFESIONAL**: Usa lenguaje técnico-jurídico preciso, formal y sin errores
2. **REFERENCIAS LEGALES**: Incluye referencias específicas a artículos del CC, LAU, leyes aplicables
3. **PERSONALIZACIÓN INTELIGENTE**:
   - Modifica cláusulas según circunstancias (mascotas, hipoteca, obras, etc.)
   - Añade cláusulas adicionales cuando sea necesario
   - Incluye condiciones suspensivas/resolutorias según el caso
4. **DATOS COMPLETOS Y PRECISOS**: Rellena TODOS los campos con los datos proporcionados
5. **ESTRUCTURA PROFESIONAL**: Mantén la estructura formal del contrato
6. **ANEXOS**: Enumera todos los anexos necesarios (nota simple, certificados, etc.)
7. **PROTECCIONES LEGALES**: Incluye cláusulas de protección según el perfil del cliente

**CIRCUNSTANCIAS QUE DEBEN MODIFICAR EL CONTRATO:**

- **Si hay hipoteca**: Incluir CONDICIÓN HIPOTECA completa (apartado f del PACTO OCTAVO)
- **Si hay oferta de precio**: Incluir CONDICIÓN OFERTA PRECIO (apartado a del PACTO OCTAVO)
- **Si hay ampliación de arras**: Incluir AMPLIACIÓN DE ARRAS (apartado e del PACTO OCTAVO)
- **Si hay obras**: Incluir CONDICIÓN OBRAS (apartado b del PACTO OCTAVO)
- **Si hay autorización judicial**: Incluir CONDICIÓN AUTORIZACIÓN JUDICIAL (apartado c)
- **Si hay usufructo**: Incluir CONDICIÓN CANCELACIÓN USUFRUCTO (apartado d)

**FORMATO DE SALIDA:**
- Markdown bien estructurado
- Numeración romana para manifiestas (I, II, III...)
- Numeración para pactos (PRIMERO, SEGUNDO, TERCERO...)
- Subnumeración arábiga cuando sea necesario (3.1, 3.2...)
- Texto justificado, formal
- Sin emojis ni lenguaje coloquial

**CALIDAD ESPERADA:**
El documento debe ser INDISTINGUIBLE de uno redactado por un despacho de abogados profesional.
Debe estar listo para firmar sin modificaciones.`,

  // Campos requeridos mínimos
  camposRequeridos: [
    // Partes
    'compradora.nombre_completo',
    'compradora.dni',
    'compradora.domicilio',
    'compradora.telefono',
    'compradora.email',
    'vendedora.nombre_completo',
    'vendedora.dni',
    'vendedora.domicilio',
    'vendedora.telefono',
    'vendedora.email',

    // Finca
    'finca.descripcion',
    'finca.referencia_catastral',
    'finca.registro.tomo',
    'finca.registro.libro',
    'finca.registro.folio',
    'finca.registro.finca',
    'finca.registro.registro_propiedad',

    // Económicos
    'precio.total',
    'precio.arras.cantidad',
    'precio.arras.porcentaje',
    'precio.resto.cantidad',

    // Temporales
    'fechas.firma_arras',
    'fechas.escritura_maxima',

    // Agente (opcional si hay)
    'agente.nombre',
    'agente.empresa',
    'agente.cif',
  ],

  // Variantes según circunstancias
  variantes: {
    con_hipoteca: {
      clausulasAdicionales: ['CONDICION_HIPOTECA'],
      modificaciones: [
        'Incluir plazo para concesión hipoteca',
        'Añadir condición resolutoria si no se concede',
        'Especificar entidades bancarias consultadas',
      ],
    },
    con_oferta_precio: {
      clausulasAdicionales: ['CONDICION_OFERTA_PRECIO'],
      modificaciones: [
        'Incluir precio ofertado vs PVP',
        'Proceso de negociación con plazos',
        'Depósito en cuenta del agente',
      ],
    },
    con_obras: {
      clausulasAdicionales: ['CONDICION_OBRAS'],
      modificaciones: [
        'Anexar proyecto de obras',
        'Incluir licencia municipal',
        'Plazo máximo para ejecución',
      ],
    },
    con_ampliacion_arras: {
      clausulasAdicionales: ['AMPLIACION_ARRAS'],
      modificaciones: [
        'Fechas de ampliación',
        'Cantidades adicionales',
        'Consecuencias de incumplimiento',
      ],
    },
  },

  // Anexos típicos que debe incluir
  anexosTipicos: [
    'ANEXO I - Nota Simple Registral',
    'ANEXO II - Referencia Catastral',
    'ANEXO III - Cédula de Habitabilidad',
    'ANEXO IV - Certificado Eficiencia Energética',
    'ANEXO V - Certificado Cancelación Hipoteca (si aplica)',
    'ANEXO VI - Certificado Saldo Deudor (si aplica)',
  ],

  // Configuración para la llamada a Claude
  claudeConfig: {
    model: 'claude-sonnet-4-5', // El mejor modelo para documentos largos
    max_tokens: 16000, // Documentos extensos
    temperature: 0.3, // Más determinista para contratos legales
  },
};

export type GenerationSettings = typeof ARRAS_PENITENCIALES_SETTINGS;
