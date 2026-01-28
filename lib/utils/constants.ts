import { TipoContrato, EstadoContrato } from '@/types/contrato.types';

export const APP_NAME = 'LexyApp';
export const APP_DESCRIPTION = 'Asistente Legal Inmobiliario';

export const TIPOS_CONTRATO: Record<TipoContrato, string> = {
  compraventa: 'Compraventa',
  arrendamiento: 'Arrendamiento',
  arras: 'Arras/Señal',
  opcion_compra: 'Opción de Compra',
  hipoteca: 'Hipoteca',
  permuta: 'Permuta',
  donacion: 'Donación',
  obra_nueva: 'Obra Nueva',
  otro: 'Otro',
};

export const ESTADOS_CONTRATO: Record<
  EstadoContrato,
  { label: string; color: string }
> = {
  borrador: { label: 'Borrador', color: 'gray' },
  pendiente_revision: { label: 'Pendiente Revisión', color: 'yellow' },
  en_revision: { label: 'En Revisión', color: 'blue' },
  pendiente_firma: { label: 'Pendiente Firma', color: 'orange' },
  firmado: { label: 'Firmado', color: 'green' },
  completado: { label: 'Completado', color: 'green' },
  cancelado: { label: 'Cancelado', color: 'red' },
  archivado: { label: 'Archivado', color: 'gray' },
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];
