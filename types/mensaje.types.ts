/**
 * Tipos para mensajes del chat con IA
 */

export type RolMensaje = 'user' | 'assistant' | 'system';

export interface Mensaje {
  id: string;
  conversacion_id: string;
  role: RolMensaje;
  content: string;
  metadata?: MensajeMetadata;
  created_at: string;
}

// Metadata del mensaje (almacenado como JSONB)
export interface MensajeMetadata {
  // Si este mensaje generó un contrato
  generated_contract?: boolean;
  contract_id?: string;
  contract_type?: string;

  // Si cita fuentes legales
  cites_sources?: string[]; // ["LAU Art. 25", "CC Art. 1445"]

  // Si sugiere una acción
  suggested_action?: 'crear_contrato' | 'analizar_clausula' | 'consultar_ley';
  suggested_action_data?: any;

  // Análisis de cláusula
  clause_analysis?: {
    validez: 'valida' | 'cuestionable' | 'abusiva';
    problemas: Array<{
      tipo: string;
      descripcion: string;
      gravedad: number; // 1-10
    }>;
    recomendaciones: Array<{
      accion: string;
      razon: string;
    }>;
    clausula_mejorada?: string;
  };

  // Metadata adicional
  [key: string]: any;
}

// Input para crear mensaje
export interface CreateMensajeInput {
  conversacion_id: string;
  role: RolMensaje;
  content: string;
  metadata?: MensajeMetadata;
}

// Mensaje formateado para UI
export interface MensajeUI extends Mensaje {
  isTyping?: boolean;
  hasError?: boolean;
  timestamp_relativo?: string; // "hace 5 min"
}
