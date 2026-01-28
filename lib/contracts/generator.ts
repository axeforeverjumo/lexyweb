/**
 * Generador de Contratos con IA
 * Sistema RAG (Retrieval Augmented Generation)
 *
 * Flujo:
 * 1. Usuario describe necesidad → Buscar plantilla apropiada
 * 2. Devolver campos requeridos → Usuario completa datos
 * 3. Generar contrato final con Gemini
 */

import { geminiClient } from '@/lib/gemini/client';
import { embeddingsClient } from '@/lib/gemini/embeddings';
import { createClient } from '@/lib/supabase/server';

// ========================================
// TIPOS
// ========================================

export interface TemplateMatch {
  templateId: string;
  templateCodigo: string;
  templateNombre: string;
  categoria: string;
  subcategoria?: string;
  camposRequeridos: CampoRequerido[];
  similarity: number;
}

export interface CampoRequerido {
  nombre: string;
  tipo: 'text' | 'number' | 'date' | 'email';
  label: string;
  requerido: boolean;
}

export interface ContractGenerationParams {
  userDescription: string;
  idioma: 'es' | 'ca';
  region: 'España' | 'Cataluña';
  userId: string;
  conversacionId?: string;
}

export interface GenerateFinalContractParams {
  templateId: string;
  datosCompletados: Record<string, any>;
  idioma: 'es' | 'ca';
  userId: string;
  conversacionId?: string;
  titulo: string;
}

// ========================================
// CLASE PRINCIPAL
// ========================================

export class ContractGenerator {

  /**
   * PASO 1: Buscar plantilla apropiada según descripción del usuario
   *
   * @param params - Parámetros de búsqueda
   * @returns Plantilla más apropiada con campos requeridos
   */
  async findAppropriateTemplate(
    params: ContractGenerationParams
  ): Promise<TemplateMatch | null> {
    console.log('🔍 Buscando plantilla apropiada...');
    console.log('   Descripción:', params.userDescription);
    console.log('   Idioma:', params.idioma);
    console.log('   Región:', params.region);

    // 1. Crear embedding de la consulta del usuario
    const queryEmbedding = await embeddingsClient.createEmbedding(
      params.userDescription
    );

    // 2. Buscar en Supabase con búsqueda vectorial
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('match_contract_templates', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // 50% similitud mínima
      match_count: 1, // Solo el mejor match
      filter_idioma: params.idioma,
      filter_region: params.region
    });

    if (error) {
      console.error('❌ Error en búsqueda vectorial:', error);
      throw new Error(`Error buscando plantilla: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No se encontró plantilla apropiada');
      return null;
    }

    const template = data[0];

    console.log('✅ Plantilla encontrada:');
    console.log('   Nombre:', template.nombre);
    console.log('   Similitud:', (template.similarity * 100).toFixed(1) + '%');
    console.log('   Campos requeridos:', template.campos_requeridos.length);

    return {
      templateId: template.id,
      templateCodigo: template.codigo,
      templateNombre: template.nombre,
      categoria: template.categoria,
      subcategoria: template.subcategoria,
      camposRequeridos: template.campos_requeridos,
      similarity: template.similarity
    };
  }

  /**
   * PASO 2: Generar contrato final con datos completados
   *
   * @param params - Parámetros de generación
   * @returns Contrato generado en Markdown
   */
  async generateFinalContract(
    params: GenerateFinalContractParams
  ): Promise<{
    contenidoMarkdown: string;
    contenidoHtml: string;
    generationId: string;
  }> {
    console.log('📝 Generando contrato final...');
    console.log('   Template ID:', params.templateId);
    console.log('   Datos completados:', Object.keys(params.datosCompletados).length);

    // 1. Obtener plantilla de la BD
    const supabase = await createClient();

    const { data: template, error: templateError } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', params.templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Plantilla no encontrada');
    }

    // 2. Generar contrato con Gemini
    const contenidoMarkdown = await this.generateWithGemini(
      template.contenido_markdown,
      params.datosCompletados,
      params.idioma
    );

    // 3. Convertir a HTML (simple, puede mejorarse)
    const contenidoHtml = this.markdownToHtml(contenidoMarkdown);

    // 4. Guardar en BD (tabla contract_generations)
    const { data: generation, error: generationError } = await supabase
      .from('contract_generations')
      .insert({
        user_id: params.userId,
        template_id: params.templateId,
        conversacion_id: params.conversacionId || null,
        titulo: params.titulo,
        contenido_markdown: contenidoMarkdown,
        contenido_html: contenidoHtml,
        datos_completados: params.datosCompletados,
        idioma: params.idioma,
        estado: 'generado'
      })
      .select('id')
      .single();

    if (generationError) {
      throw new Error(`Error guardando contrato: ${generationError.message}`);
    }

    console.log('✅ Contrato generado y guardado');
    console.log('   Generation ID:', generation.id);

    return {
      contenidoMarkdown,
      contenidoHtml,
      generationId: generation.id
    };
  }

  /**
   * Generar contrato con Gemini usando RAG
   */
  private async generateWithGemini(
    templateMarkdown: string,
    datosCompletados: Record<string, any>,
    idioma: 'es' | 'ca'
  ): Promise<string> {
    const idiomaName = idioma === 'es' ? 'Español' : 'Català';

    const prompt = `
Eres un notario experto español/catalán. Debes generar un contrato legal EXACTAMENTE basado en esta plantilla.

## PLANTILLA BASE (${idiomaName}):

${templateMarkdown}

## DATOS DEL CLIENTE:

${JSON.stringify(datosCompletados, null, 2)}

## INSTRUCCIONES CRÍTICAS:

1. **MANTÉN LA ESTRUCTURA LEGAL**: No cambies la redacción legal de la plantilla. Es crítica para la validez jurídica del contrato.

2. **REEMPLAZA SOLO LAS VARIABLES**: Busca en la plantilla los espacios en blanco, guiones bajos (______) o cualquier indicador de "completar aquí" y reemplázalos con los datos proporcionados.

3. **NO AGREGUES NI QUITES CLÁUSULAS**: Mantén todas las cláusulas exactamente como están.

4. **NO CAMBIES REFERENCIAS LEGALES**: Mantén todos los artículos de leyes citados (LAU, CC, etc.) exactamente como aparecen.

5. **FORMATO**: Mantén el formato Markdown de la plantilla.

6. **FECHAS E IMPORTES**: Formatea correctamente:
   - Fechas: "15 de junio de 2024"
   - Importes: "1.500,00 EUR (mil quinientos euros)"

7. **COMPLETA TODOS LOS ESPACIOS**: Si hay espacios en blanco en la plantilla que correspondan a datos proporcionados, complétalos. Si hay espacios que no tienen datos correspondientes, déjalos como están para que el usuario los complete manualmente.

8. **IDIOMA**: Genera el contrato en ${idiomaName}. Si la plantilla está en ese idioma, mantén el idioma. Si recibes datos en otro idioma, tradúcelos apropiadamente.

Genera el contrato final en Markdown, manteniendo la estructura de la plantilla:
`.trim();

    console.log('   🤖 Llamando a Gemini...');
    const resultado = await geminiClient.generate(prompt);
    console.log('   ✅ Contrato generado por Gemini');

    return resultado;
  }

  /**
   * Convertir Markdown a HTML simple
   * (Para preview en el frontend)
   */
  private markdownToHtml(markdown: string): string {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    return html;
  }

  /**
   * Obtener contrato generado por ID
   */
  async getGeneratedContract(generationId: string, userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contract_generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Error obteniendo contrato: ${error.message}`);
    }

    return data;
  }

  /**
   * Listar contratos generados del usuario
   */
  async listUserContracts(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contract_generations')
      .select('id, titulo, estado, created_at, idioma, template_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error listando contratos: ${error.message}`);
    }

    return data;
  }

  /**
   * Actualizar estado del contrato
   */
  async updateContractStatus(
    generationId: string,
    userId: string,
    estado: 'borrador' | 'generado' | 'revisado' | 'firmado' | 'enviado' | 'cancelado'
  ) {
    const supabase = await createClient();

    const { error } = await supabase
      .from('contract_generations')
      .update({ estado })
      .eq('id', generationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error actualizando estado: ${error.message}`);
    }
  }
}

// Singleton
export const contractGenerator = new ContractGenerator();
