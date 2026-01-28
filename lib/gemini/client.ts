/**
 * Cliente Gemini AI para LexyApp
 * Maneja toda la interacción con Google Gemini Flash
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { RolMensaje } from '@/types/mensaje.types';

// Lazy initialization para evitar errores al importar antes de cargar .env
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada en variables de entorno');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Cliente Gemini singleton
 */
class GeminiClient {
  private modelName: string;

  constructor(modelName: string = 'gemini-3-flash-preview') {
    this.modelName = modelName;
  }

  private getModel(): GenerativeModel {
    return getGenAI().getGenerativeModel({ model: this.modelName });
  }

  /**
   * Chat conversacional con historial
   *
   * @param messages - Historial de mensajes
   * @param systemPrompt - Prompt del sistema (opcional)
   * @param newMessage - Nuevo mensaje del usuario
   * @returns Respuesta de la IA
   */
  async chat(
    messages: Array<{ role: RolMensaje; content: string }>,
    systemPrompt?: string,
    newMessage?: string
  ): Promise<string> {
    try {
      // Convertir mensajes al formato de Gemini
      const history = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Configurar modelo con system instruction si existe
      const modelWithConfig = systemPrompt
        ? getGenAI().getGenerativeModel({
            model: this.modelName,
            systemInstruction: systemPrompt,
          })
        : this.getModel();

      // Iniciar chat con historial
      const chat = modelWithConfig.startChat({ history });

      // Enviar mensaje si existe
      if (newMessage) {
        const result = await chat.sendMessage(newMessage);
        return result.response.text();
      }

      throw new Error('Se requiere newMessage para enviar al chat');
    } catch (error) {
      console.error('Error en Gemini chat:', error);
      throw new Error(
        `Error al comunicarse con Gemini: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Generar contenido sin historial
   *
   * @param prompt - Prompt completo
   * @returns Respuesta de la IA
   */
  async generate(prompt: string): Promise<string> {
    try {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error en Gemini generate:', error);
      throw new Error(
        `Error al generar contenido con Gemini: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Generar contenido con respuesta JSON
   *
   * @param prompt - Prompt que solicita JSON
   * @returns Objeto parseado desde JSON
   */
  async generateJSON<T = any>(prompt: string): Promise<T> {
    try {
      const text = await this.generate(prompt);

      // Intentar extraer JSON del texto
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error al generar JSON con Gemini:', error);
      throw new Error(
        `Error al generar JSON: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Generar con streaming (para futuro)
   */
  async *generateStream(prompt: string): AsyncGenerator<string> {
    const model = this.getModel();
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}

// Exportar instancia singleton
export const geminiClient = new GeminiClient();

// Exportar clase para testing
export { GeminiClient };
