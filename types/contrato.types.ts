// Enums
export type TipoContrato =
  | 'compraventa'
  | 'arrendamiento'
  | 'arras'
  | 'opcion_compra'
  | 'hipoteca'
  | 'permuta'
  | 'donacion'
  | 'obra_nueva'
  | 'otro';

export type EstadoContrato =
  | 'borrador'
  | 'pendiente_revision'
  | 'en_revision'
  | 'pendiente_firma'
  | 'firmado'
  | 'completado'
  | 'cancelado'
  | 'archivado';

// Estructura de datos extraídos por Gemini
export interface DatosExtraidosContrato {
  // Tipo de contrato detectado
  tipoContrato?: TipoContrato;

  // Partes del contrato
  partes?: {
    vendedor?: ParteContrato;
    comprador?: ParteContrato;
    arrendador?: ParteContrato;
    arrendatario?: ParteContrato;
  };

  // Datos del inmueble
  inmueble?: {
    direccion?: string;
    ciudad?: string;
    codigoPostal?: string;
    provincia?: string;
    referencia_catastral?: string;
    superficie?: number;
    tipo?: string;
    descripcion?: string;
    linderos?: string;
    cargas?: string[];
  };

  // Datos económicos
  economicos?: {
    precio_total?: number;
    forma_pago?: string;
    gastos_notaria?: number;
    gastos_registro?: number;
    impuestos?: number;
    renta_mensual?: number; // Para arrendamientos
    fianza?: number; // Para arrendamientos
    importe_arras?: number; // Para arras
  };

  // Fechas relevantes
  fechas?: {
    firma?: string;
    entrega?: string;
    inicio_arrendamiento?: string;
    fin_arrendamiento?: string;
    vencimiento?: string;
  };

  // Cláusulas especiales
  clausulas?: {
    especiales?: string[];
    condiciones?: string[];
    garantias?: string[];
  };

  // Otros datos
  otros?: {
    notario?: string;
    registro_propiedad?: string;
    numero_protocolo?: string;
    observaciones?: string[];
  };
}

export interface ParteContrato {
  nombre?: string;
  apellidos?: string;
  dni_nie?: string;
  direccion?: string;
  estado_civil?: string;
  representante?: string;
  poder?: string;
  email?: string;
  telefono?: string;
}

// Tipos para documentos adjuntos
export interface DocumentoAdjunto {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  tamano: number;
  fecha_subida: string;
}

// Tipos para filtros y búsqueda
export interface FiltrosContratos {
  tipo?: TipoContrato[];
  estado?: EstadoContrato[];
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  busqueda?: string;
  tags?: string[];
}

// Tipos para formularios
export interface ContratoFormData {
  cliente_id?: string;
  tipo_contrato: TipoContrato;
  titulo: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  inmueble_direccion?: string;
  inmueble_referencia_catastral?: string;
  inmueble_superficie?: number;
  inmueble_tipo?: string;
  importe_total?: number;
  tags?: string[];
  notas_privadas?: string;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
  type: 'dni' | 'amount' | 'date' | 'required';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Tipos para estadísticas
export interface EstadisticasContratos {
  total: number;
  por_estado: Record<EstadoContrato, number>;
  por_tipo: Record<TipoContrato, number>;
  valor_total: number;
  proximos_vencimientos: number;
}

// Tipo para mensaje de chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Tipo para el contrato completo
export interface Contrato {
  id: string;
  user_id: string;
  cliente_id: string | null;
  tipo_contrato: TipoContrato;
  titulo: string;
  descripcion: string | null;
  estado: EstadoContrato;
  fecha_creacion: string;
  fecha_revision: string | null;
  fecha_firma: string | null;
  fecha_vencimiento: string | null;
  datos_extraidos: DatosExtraidosContrato;
  inmueble_direccion: string | null;
  inmueble_referencia_catastral: string | null;
  inmueble_superficie: number | null;
  inmueble_tipo: string | null;
  importe_total: number | null;
  moneda: string;
  contrato_markdown: string | null;
  contrato_html: string | null;
  pdf_url: string | null;
  pdf_firmado_url: string | null;
  firma_data: string | null;
  documentos_adjuntos: DocumentoAdjunto[];
  tags: string[];
  notas_privadas: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
