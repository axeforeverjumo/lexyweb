/**
 * Cliente de embeddings con Gemini
 * Modelo: text-embedding-004 (768 dimensiones)
 * https://ai.google.dev/gemini-api/docs/embeddings
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

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
 * Cliente de embeddings para búsqueda vectorial
 */
export class EmbeddingsClient {
  private getModel() {
    return getGenAI().getGenerativeModel({ model: 'text-embedding-004' });
  }

  /**
   * Crear embedding de un texto
   * @param text - Texto a vectorizar
   * @returns Vector de 768 dimensiones
   */
  async createEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.getModel();
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error creando embedding:', error);
      throw new Error(
        `Error al crear embedding: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crear embeddings en batch (múltiples textos)
   * Útil para cargar muchos contratos a la vez
   *
   * @param texts - Array de textos
   * @param delayMs - Delay entre llamadas para rate limiting (default: 100ms)
   * @returns Array de vectores
   */
  async createEmbeddingsBatch(
    texts: string[],
    delayMs: number = 100
  ): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (let i = 0; i < texts.length; i++) {
      console.log(`   Creando embedding ${i + 1}/${texts.length}...`);

      const embedding = await this.createEmbedding(texts[i]);
      embeddings.push(embedding);

      // Rate limiting: esperar entre llamadas
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return embeddings;
  }

  /**
   * Crear embedding optimizado para contratos
   * Combina título, categoría y contenido
   *
   * @param params - Datos del contrato
   * @returns Vector de 768 dimensiones
   */
  async createContractEmbedding(params: {
    nombre: string;
    categoria: string;
    subcategoria?: string;
    contenido: string;
    tags?: string[];
  }): Promise<number[]> {
    // Crear texto representativo del contrato
    const textToEmbed = [
      params.nombre,
      params.categoria,
      params.subcategoria || '',
      params.tags?.join(' ') || '',
      // Solo primeros 2000 caracteres del contenido para no exceder límites
      params.contenido.substring(0, 2000)
    ]
      .filter(Boolean)
      .join(' | ');

    return this.createEmbedding(textToEmbed);
  }
}

// Singleton
export const embeddingsClient = new EmbeddingsClient();
