/**
 * Validador de fechas
 */

import { isValid, isFuture, isPast, isAfter, isBefore, format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Valida que una fecha sea válida
 */
export function validateDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return isValid(date);
}

/**
 * Valida que una fecha sea futura
 */
export function validateFutureDate(dateString: string): boolean {
  if (!validateDate(dateString)) return false;
  const date = new Date(dateString);
  return isFuture(date);
}

/**
 * Valida que una fecha sea pasada
 */
export function validatePastDate(dateString: string): boolean {
  if (!validateDate(dateString)) return false;
  const date = new Date(dateString);
  return isPast(date);
}

/**
 * Valida que una fecha de fin sea posterior a una fecha de inicio
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  if (!validateDate(startDate) || !validateDate(endDate)) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return isAfter(end, start);
}

/**
 * Formatea una fecha para mostrar en español
 * Ejemplo: "2024-01-15" -> "15 de enero de 2024"
 */
export function formatDateES(dateString: string): string {
  if (!validateDate(dateString)) return '';

  const date = new Date(dateString);
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formatea una fecha en formato corto español
 * Ejemplo: "2024-01-15" -> "15/01/2024"
 */
export function formatDateShort(dateString: string): string {
  if (!validateDate(dateString)) return '';

  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy', { locale: es });
}

/**
 * Parsea una fecha en formato español a ISO
 * Ejemplo: "15/01/2024" -> "2024-01-15"
 */
export function parseDateES(dateString: string): string | null {
  if (!dateString) return null;

  try {
    const date = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: es });
    if (!isValid(date)) return null;
    return format(date, 'yyyy-MM-dd');
  } catch {
    return null;
  }
}

/**
 * Obtiene la fecha actual en formato ISO
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Calcula la diferencia en días entre dos fechas
 */
export function daysBetween(startDate: string, endDate: string): number {
  if (!validateDate(startDate) || !validateDate(endDate)) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Añade días a una fecha
 */
export function addDays(dateString: string, days: number): string {
  if (!validateDate(dateString)) return '';

  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return format(date, 'yyyy-MM-dd');
}

/**
 * Valida que una fecha sea válida y no sea anterior a una fecha mínima
 */
export function validateDateAfter(dateString: string, minDate: string): boolean {
  if (!validateDate(dateString) || !validateDate(minDate)) return false;

  const date = new Date(dateString);
  const min = new Date(minDate);

  return isAfter(date, min) || date.getTime() === min.getTime();
}

/**
 * Valida que una fecha sea válida y no sea posterior a una fecha máxima
 */
export function validateDateBefore(dateString: string, maxDate: string): boolean {
  if (!validateDate(dateString) || !validateDate(maxDate)) return false;

  const date = new Date(dateString);
  const max = new Date(maxDate);

  return isBefore(date, max) || date.getTime() === max.getTime();
}
