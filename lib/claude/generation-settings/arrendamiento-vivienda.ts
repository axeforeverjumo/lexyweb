/**
 * Generation Settings para Contrato de Arrendamiento de Vivienda
 *
 * Este archivo define cómo Claude debe generar contratos de arrendamiento
 * de vivienda conforme a la Ley 29/1994 (LAU)
 */

export const ARRENDAMIENTO_VIVIENDA_SETTINGS = {
  id: 'arrendamiento-vivienda',
  nombre: 'Contrato de Arrendamiento de Vivienda',
  descripcion: 'Contrato de arrendamiento de vivienda conforme a la LAU',

  // Template base del contrato (profesional, conforme a LAU)
  templateBase: `CONTRATO DE ARRENDAMIENTO DE VIVIENDA

En {{ubicacion_firma}}, a {{fecha_firma}}.

REUNIDOS:

De una parte, como ARRENDADOR/A:
{{arrendador_datos_completos}}

De otra parte, como ARRENDATARIO/A:
{{arrendatario_datos_completos}}

INTERVIENEN:

Ambas partes se reconocen mutuamente capacidad legal suficiente para obligarse y otorgar el presente contrato de arrendamiento de vivienda, y a tal efecto,

MANIFIESTAN:

I.- Que el/la ARRENDADOR/A es propietario/a en pleno dominio de la vivienda sita en:
{{descripcion_vivienda_completa}}

II.- DESCRIPCIÓN DE LA VIVIENDA:
{{descripcion_detallada}}

III.- INSCRIPCIÓN REGISTRAL:
{{datos_registro}}

IV.- REFERENCIA CATASTRAL:
{{referencia_catastral}}

V.- CÉDULA DE HABITABILIDAD:
{{cedula_habitabilidad}}

VI.- CERTIFICADO DE EFICIENCIA ENERGÉTICA:
{{certificado_eficiencia}}

VII.- ESTADO DE LA VIVIENDA:
{{estado_vivienda}}

VIII.- DESTINO DEL ARRENDAMIENTO:
La vivienda objeto del presente contrato se destina a satisfacer la necesidad permanente de vivienda del/de la ARRENDATARIO/A, conforme al artículo 2 de la LAU.

ESTIPULACIONES:

PRIMERA: OBJETO DEL ARRENDAMIENTO
{{clausula_objeto}}

SEGUNDA: DURACIÓN DEL CONTRATO
{{clausula_duracion}}

TERCERA: RENTA Y FORMA DE PAGO
{{clausula_renta}}

CUARTA: FIANZA
{{clausula_fianza}}

QUINTA: ACTUALIZACIÓN DE LA RENTA
{{clausula_actualizacion}}

SEXTA: GASTOS Y SUMINISTROS
{{clausula_gastos_suministros}}

SÉPTIMA: OBRAS Y REPARACIONES
{{clausula_obras}}

OCTAVA: CONSERVACIÓN DE LA VIVIENDA
{{clausula_conservacion}}

NOVENA: DERECHO DE ADQUISICIÓN PREFERENTE
{{clausula_tanteo_retracto}}

DÉCIMA: CESIÓN Y SUBARRIENDO
{{clausula_cesion}}

UNDÉCIMA: RESOLUCIÓN DEL CONTRATO
{{clausula_resolucion}}

DUODÉCIMA: NOTIFICACIONES
{{clausula_notificaciones}}

DECIMOTERCERA: PROTECCIÓN DE DATOS
{{clausula_proteccion_datos}}

DECIMOCUARTA: CLÁUSULAS ESPECIALES
{{clausulas_especiales}}

DECIMOQUINTA: SUMISIÓN A JUZGADOS Y TRIBUNALES
{{clausula_sumision}}

{{firmas}}`,

  // Instrucciones para Claude sobre cómo generar este documento
  claudeInstructions: `Eres un abogado senior especializado en derecho inmobiliario español con 25+ años de experiencia en arrendamientos urbanos.

Tu tarea es generar un CONTRATO DE ARRENDAMIENTO DE VIVIENDA PROFESIONAL Y COMPLETO conforme a la LAU (Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos) basándote en:
1. El template base proporcionado
2. Los datos recopilados del usuario
3. Las circunstancias especiales detectadas

**REGLAS CRÍTICAS:**

1. **CONFORMIDAD CON LA LAU**: El contrato DEBE cumplir la Ley 29/1994 y todas sus modificaciones
2. **LENGUAJE JURÍDICO PROFESIONAL**: Usa lenguaje técnico-jurídico preciso, formal y sin errores
3. **REFERENCIAS LEGALES**: Incluye referencias específicas a artículos de la LAU, CC, LEC cuando sea necesario
4. **PERSONALIZACIÓN INTELIGENTE**:
   - Modifica cláusulas según circunstancias (mascotas, menores, obras, garaje, trastero, etc.)
   - Añade cláusulas adicionales cuando sea necesario
   - Ajusta según tipo de arrendatario (persona física/jurídica)
5. **DATOS COMPLETOS Y PRECISOS**: Rellena TODOS los campos con los datos proporcionados
6. **ESTRUCTURA PROFESIONAL**: Mantén la estructura formal del contrato
7. **PROTECCIONES LEGALES**: Incluye cláusulas de protección para ambas partes según la LAU

**DURACIÓN (Art. 9 LAU):**
- Mínimo 5 años para personas físicas (7 años si arrendador es persona jurídica)
- Prórroga obligatoria hasta completar duración mínima
- Tácita reconducción anual después

**RENTA (Arts. 17-18 LAU):**
- Libertad de pacto entre partes
- Actualización anual según IPC si se pacta
- Máximo revisión anual

**FIANZA (Art. 36 LAU):**
- Obligatoria: 1 mensualidad para vivienda
- Depósito en organismo autonómico (INCASOL, IVIMA, etc.)
- Devolución en plazo legal

**CIRCUNSTANCIAS QUE DEBEN MODIFICAR EL CONTRATO:**

- **Si hay mascotas**: Incluir cláusula específica sobre tenencia de animales
- **Si hay menores**: Mencionar en datos del arrendatario
- **Si incluye garaje/trastero**: Detallar en descripción y renta
- **Si hay obras pendientes**: Incluir cláusula sobre obras y plazos
- **Si hay comunidad**: Especificar gastos de comunidad
- **Si es arrendador persona jurídica**: Duración mínima 7 años
- **Si hay opción de compra**: Incluir anexo específico

**FORMATO DE SALIDA:**
- Markdown bien estructurado
- Numeración romana para manifiestas (I, II, III...)
- Numeración para estipulaciones (PRIMERA, SEGUNDA, TERCERA...)
- Subnumeración arábiga cuando sea necesario
- Texto justificado, formal
- Sin emojis ni lenguaje coloquial

**CLÁUSULAS OBLIGATORIAS:**
- Destino permanente de vivienda (Art. 2 LAU)
- Duración mínima legal (Art. 9 LAU)
- Fianza legal (Art. 36 LAU)
- Derecho de tanteo y retracto (Art. 25 LAU)
- Prohibición de cesión/subarriendo sin consentimiento (Art. 8 LAU)
- Causas de resolución (Art. 27 LAU)

**CALIDAD ESPERADA:**
El documento debe ser INDISTINGUIBLE de uno redactado por un despacho de abogados profesional.
Debe estar listo para firmar y depositar la fianza sin modificaciones.`,

  // Campos requeridos mínimos
  camposRequeridos: [
    // Arrendador
    'arrendador.nombre_completo',
    'arrendador.dni',
    'arrendador.domicilio',
    'arrendador.telefono',
    'arrendador.email',

    // Arrendatario
    'arrendatario.nombre_completo',
    'arrendatario.dni',
    'arrendatario.domicilio_actual',
    'arrendatario.telefono',
    'arrendatario.email',

    // Vivienda
    'inmueble.direccion_completa',
    'inmueble.superficie',
    'inmueble.referencia_catastral',
    'inmueble.descripcion',

    // Económicos
    'economicos.renta_mensual',
    'economicos.fianza',
    'economicos.dia_pago',
    'economicos.forma_pago',

    // Temporales
    'temporales.fecha_inicio',
    'temporales.duracion_anos',
  ],

  // Variantes según circunstancias
  variantes: {
    con_mascotas: {
      clausulasAdicionales: ['CLAUSULA_MASCOTAS'],
      modificaciones: [
        'Incluir autorización expresa para tenencia de animales',
        'Especificar tipo y número de mascotas',
        'Responsabilidad por daños causados',
        'Requisitos de higiene y convivencia',
      ],
    },
    con_menores: {
      clausulasAdicionales: [],
      modificaciones: [
        'Indicar número de menores en datos del arrendatario',
        'Considerar adaptaciones de seguridad',
      ],
    },
    con_garaje_trastero: {
      clausulasAdicionales: ['CLAUSULA_ANEXOS'],
      modificaciones: [
        'Detallar ubicación de garaje/trastero',
        'Incluir en descripción de la finca',
        'Desglosar en renta si procede',
      ],
    },
    con_obras: {
      clausulasAdicionales: ['CLAUSULA_OBRAS_PENDIENTES'],
      modificaciones: [
        'Detallar obras a realizar',
        'Plazo de ejecución',
        'Responsable de las obras',
        'Posible reducción de renta durante obras',
      ],
    },
    arrendador_juridico: {
      clausulasAdicionales: [],
      modificaciones: [
        'Duración mínima 7 años (en lugar de 5)',
        'Prórroga hasta 7 años',
        'Incluir CIF en lugar de DNI',
      ],
    },
    con_muebles: {
      clausulasAdicionales: ['INVENTARIO_MOBILIARIO'],
      modificaciones: [
        'Anexar inventario detallado de muebles',
        'Estado de conservación',
        'Responsabilidad por deterioros',
      ],
    },
  },

  // Anexos típicos que debe incluir
  anexosTipicos: [
    'ANEXO I - Certificado de Eficiencia Energética',
    'ANEXO II - Cédula de Habitabilidad',
    'ANEXO III - Nota Simple Registral (opcional)',
    'ANEXO IV - Inventario de Mobiliario (si aplica)',
    'ANEXO V - Estado de la Vivienda (fotografías, defectos)',
    'ANEXO VI - Recibo de Depósito de Fianza',
  ],

  // Configuración para la llamada a Claude
  claudeConfig: {
    model: 'claude-sonnet-4-5',
    max_tokens: 16000,
    temperature: 0.3,
  },
};

export type GenerationSettings = typeof ARRENDAMIENTO_VIVIENDA_SETTINGS;
