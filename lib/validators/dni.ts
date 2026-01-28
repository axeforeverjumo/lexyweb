/**
 * Validador de DNI/NIE español
 * Valida el formato y la letra de control según el algoritmo oficial
 */

const DNI_REGEX = /^[0-9]{8}[A-Z]$/;
const NIE_REGEX = /^[XYZ][0-9]{7}[A-Z]$/;
const VALID_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Valida un DNI español (8 dígitos + letra)
 * Verifica el formato y la letra de control
 */
export function validateDNI(dni: string): boolean {
  if (!dni) return false;

  const upperDNI = dni.toUpperCase().trim();

  if (DNI_REGEX.test(upperDNI)) {
    const number = parseInt(upperDNI.substring(0, 8), 10);
    const letter = upperDNI.charAt(8);
    const expectedLetter = VALID_LETTERS.charAt(number % 23);
    return expectedLetter === letter;
  }

  if (NIE_REGEX.test(upperDNI)) {
    return validateNIE(upperDNI);
  }

  return false;
}

/**
 * Valida un NIE español (X/Y/Z + 7 dígitos + letra)
 * Verifica el formato y la letra de control
 */
export function validateNIE(nie: string): boolean {
  if (!nie) return false;

  const upperNIE = nie.toUpperCase().trim();

  if (!NIE_REGEX.test(upperNIE)) {
    return false;
  }

  // Convertir primera letra a número
  let nieNumber = upperNIE.substring(0, 8);
  nieNumber = nieNumber.replace('X', '0').replace('Y', '1').replace('Z', '2');

  const number = parseInt(nieNumber, 10);
  const letter = upperNIE.charAt(8);
  const expectedLetter = VALID_LETTERS.charAt(number % 23);

  return expectedLetter === letter;
}

/**
 * Formatea un DNI/NIE eliminando espacios y convirtiendo a mayúsculas
 */
export function formatDNI(dni: string): string {
  return dni.toUpperCase().replace(/[^0-9XYZTRWAGMYFPDXBNJZSQVHLCKE]/g, '');
}

/**
 * Formatea un DNI/NIE para mostrar (con guión)
 * Ejemplo: 12345678A -> 12345678-A
 */
export function formatDNIDisplay(dni: string): string {
  const formatted = formatDNI(dni);
  if (DNI_REGEX.test(formatted)) {
    return `${formatted.substring(0, 8)}-${formatted.charAt(8)}`;
  }
  if (NIE_REGEX.test(formatted)) {
    return `${formatted.substring(0, 8)}-${formatted.charAt(8)}`;
  }
  return formatted;
}

/**
 * Extrae el número de un DNI/NIE (sin letra)
 */
export function extractDNINumber(dni: string): string {
  const formatted = formatDNI(dni);
  if (DNI_REGEX.test(formatted)) {
    return formatted.substring(0, 8);
  }
  if (NIE_REGEX.test(formatted)) {
    return formatted.substring(1, 8);
  }
  return '';
}
