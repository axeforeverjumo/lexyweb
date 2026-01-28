/**
 * Template Filler - Sistema de Fill-in-the-Blanks
 * Rellena placeholders en plantillas SIN usar IA
 * Costo: 0 tokens
 */

export interface ContractField {
  key: string;
  value: string | number | Date;
  formatter?: (val: any) => string;
}

/**
 * Rellena todos los placeholders en una plantilla de contrato
 * NO REQUIERE IA - Operación de texto puro
 */
export function fillTemplatePlaceholders(
  template: string,
  fields: Record<string, any>
): string {
  let result = template;

  // Convertir objeto anidado a plano
  const flatFields = flattenObject(fields);

  // Reemplazar cada campo
  for (const [key, value] of Object.entries(flatFields)) {
    if (value === null || value === undefined) continue;

    const formatted = formatValue(key, value);

    // Probar múltiples formatos de placeholder
    const variations = [
      `[${key}]`,
      `[${key.toUpperCase()}]`,
      `{${key}}`,
      `{{${key}}}`
    ];

    variations.forEach(placeholder => {
      result = result.replaceAll(placeholder, formatted);
    });
  }

  return result;
}

/**
 * Formatea un valor según su tipo y key
 */
function formatValue(key: string, value: any): string {
  // Fechas
  if (key.includes('fecha') && value) {
    const date = new Date(value);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  // Moneda
  if (key.includes('precio') || key.includes('importe') || key.includes('renta')) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(num);
  }

  // Porcentaje
  if (key.includes('porcentaje')) {
    return `${value}%`;
  }

  // Superficie
  if (key.includes('superficie')) {
    return `${value} m²`;
  }

  // DNI/NIE
  if (key.includes('dni') || key.includes('nie')) {
    return formatDNI(String(value));
  }

  return String(value);
}

/**
 * Formatea DNI con guion antes de la letra
 */
function formatDNI(dni: string): string {
  const clean = dni.replace(/[^0-9A-Z]/gi, '').toUpperCase();
  if (clean.length === 9) {
    return `${clean.slice(0, 8)}-${clean.slice(8)}`;
  }
  return clean;
}

/**
 * Aplana un objeto anidado a un solo nivel
 * { vendedor: { nombre: "Juan" } } → { "vendedor_nombre": "Juan" }
 */
function flattenObject(
  obj: Record<string, any>,
  prefix = '',
  result: Record<string, any> = {}
): Record<string, any> {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Detecta placeholders que NO fueron rellenados
 */
export function findUnfilledPlaceholders(content: string): string[] {
  const placeholderPattern = /\[[\w_]+\]|\{[\w_]+\}|\{\{[\w_]+\}\}/g;
  return Array.from(new Set(content.match(placeholderPattern) || []));
}

/**
 * Cuenta el porcentaje de campos rellenados
 */
export function calculateCompleteness(
  template: string,
  filled: string
): number {
  const originalPlaceholders = findUnfilledPlaceholders(template);
  const remainingPlaceholders = findUnfilledPlaceholders(filled);

  if (originalPlaceholders.length === 0) return 100;

  const filledCount = originalPlaceholders.length - remainingPlaceholders.length;
  return Math.round((filledCount / originalPlaceholders.length) * 100);
}

/**
 * Convierte número a texto en español (básico)
 * Para producción usar librería como 'numero-a-letras'
 */
export function numberToSpanishWords(num: number): string {
  // Implementación muy básica
  const thousands = Math.floor(num / 1000);
  const hundreds = num % 1000;

  let result = '';

  if (thousands > 0) {
    if (thousands === 1) {
      result += 'mil';
    } else {
      result += `${thousands} mil`;
    }
  }

  if (hundreds > 0) {
    if (result) result += ' ';
    result += `${hundreds}`;
  }

  // En producción usar librería especializada
  return `${num.toLocaleString('es-ES')} euros`;
}
