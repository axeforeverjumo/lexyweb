import { DatosExtraidosContrato, Message } from './contrato.types';

export interface GeminiChatRequest {
  messages: Message[];
}

export interface GeminiChatResponse {
  response: string;
  conversationId?: string;
}

export interface GeminiExtractionRequest {
  conversation: string;
}

export interface GeminiExtractionResponse {
  success: boolean;
  data?: DatosExtraidosContrato;
  error?: string;
  confidence?: number;
  warnings?: string[];
}

export interface GeminiGenerateRequest {
  extractedData: DatosExtraidosContrato;
  contractType: string;
}

export interface GeminiGenerateResponse {
  success: boolean;
  contract?: string;
  error?: string;
}

export interface GeminiPromptConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}
