/**
 * Validador de importes y cantidades monetarias
 */

/**
 * Valida que un importe sea un número válido mayor que 0
 */
export function validateAmount(amount: number): boolean {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    isFinite(amount) &&
    amount > 0
  );
}

/**
 * Valida que un importe esté dentro de un rango
 */
export function validateAmountRange(
  amount: number,
  min: number,
  max: number
): boolean {
  return validateAmount(amount) && amount >= min && amount <= max;
}

/**
 * Formatea un importe para mostrar en formato español
 * Ejemplo: 1000000 -> "1.000.000,00 EUR"
 */
export function formatAmountES(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formatea un importe sin símbolo de moneda
 * Ejemplo: 1000000 -> "1.000.000,00"
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parsea un string en formato español a número
 * Ejemplo: "1.000.000,00" -> 1000000
 */
export function parseAmountES(amountString: string): number | null {
  if (!amountString) return null;

  // Eliminar espacios y símbolo de moneda
  let cleaned = amountString.trim().replace(/[€$\s]/g, '');

  // Reemplazar punto (separador de miles) por nada
  cleaned = cleaned.replace(/\./g, '');

  // Reemplazar coma (separador decimal) por punto
  cleaned = cleaned.replace(/,/g, '.');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Convierte un número a texto en español (para contratos)
 * Ejemplo: 1500 -> "mil quinientos"
 */
export function numberToText(num: number): string {
  if (num === 0) return 'cero';

  const unidades = [
    '',
    'uno',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
  ];

  const decenas = [
    '',
    'diez',
    'veinte',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  ];

  const especiales = [
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve',
  ];

  const centenas = [
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  ];

  function convertHundreds(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'cien';

    let result = '';

    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) result += centenas[c];

    if (d === 1 && u > 0) {
      result += (result ? ' ' : '') + especiales[u];
    } else {
      if (d > 0) result += (result ? ' ' : '') + decenas[d];
      if (u > 0) {
        if (d === 2 || d === 3) {
          result += 'i' + unidades[u];
        } else {
          result += (result && d > 0 ? ' y ' : result ? ' ' : '') + unidades[u];
        }
      }
    }

    return result;
  }

  function convertThousands(n: number): string {
    if (n === 0) return '';

    const mil = Math.floor(n / 1000);
    const resto = n % 1000;

    let result = '';

    if (mil === 1) {
      result = 'mil';
    } else if (mil > 0) {
      result = convertHundreds(mil) + ' mil';
    }

    if (resto > 0) {
      result += (result ? ' ' : '') + convertHundreds(resto);
    }

    return result;
  }

  function convertMillions(n: number): string {
    const millones = Math.floor(n / 1000000);
    const resto = n % 1000000;

    let result = '';

    if (millones === 1) {
      result = 'un millón';
    } else if (millones > 0) {
      result = convertThousands(millones) + ' millones';
    }

    if (resto > 0) {
      result += (result ? ' ' : '') + convertThousands(resto);
    }

    return result;
  }

  if (num < 1000) {
    return convertHundreds(num);
  } else if (num < 1000000) {
    return convertThousands(num);
  } else {
    return convertMillions(num);
  }
}

/**
 * Convierte un importe a texto completo con decimales
 * Ejemplo: 1500.50 -> "mil quinientos euros con cincuenta céntimos"
 */
export function amountToText(amount: number, currency: string = 'euros'): string {
  const entero = Math.floor(amount);
  const decimales = Math.round((amount - entero) * 100);

  let text = numberToText(entero) + ' ' + currency;

  if (decimales > 0) {
    text += ' con ' + numberToText(decimales) + ' céntimos';
  }

  return text;
}
