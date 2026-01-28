/**
 * Tipos para el sistema de conversaciones con IA abogado
 */

export type TipoConversacion = 'consulta' | 'contrato' | 'creacion_contrato';
export type EstadoConversacion = 'activa' | 'archivada';

export interface Conversacion {
  id: string;
  user_id: string;
  cliente_id?: string | null;
  contrato_id?: string | null;

  // Metadata
  titulo: string;
  descripcion?: string | null;

  // Tipo
  tipo: TipoConversacion;

  // UI Features
  is_pinned: boolean;
  color?: string | null; // Hex color

  // Estado
  estado: EstadoConversacion;

  // Timestamps
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ConversacionConCliente extends Conversacion {
  cliente?: {
    id: string;
    nombre: string;
    apellidos?: string;
    email?: string;
  };
}

export interface ConversacionConContrato extends Conversacion {
  contrato?: {
    id: string;
    titulo: string;
    tipo_contrato: string;
  };
}

// Input para crear conversación
export interface CreateConversacionInput {
  cliente_id?: string;
  contrato_id?: string;
  titulo?: string;
  descripcion?: string;
  tipo: TipoConversacion;
  color?: string;
}

// Input para actualizar conversación
export interface UpdateConversacionInput {
  titulo?: string;
  descripcion?: string;
  is_pinned?: boolean;
  color?: string;
  estado?: EstadoConversacion;
}

// Conversación con estadísticas
export interface ConversacionConStats extends Conversacion {
  total_mensajes?: number;
  ultimo_mensaje_preview?: string;
}
