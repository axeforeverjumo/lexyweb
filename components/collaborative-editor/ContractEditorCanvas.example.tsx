/**
 * Ejemplo de integración del editor colaborativo con Lexy Sidebar
 *
 * Este archivo muestra cómo integrar todos los componentes:
 * - CollaborativeEditor (editor principal con Yjs)
 * - LexyAssistantSidebar (chat con IA)
 * - EditorPresenceBar (usuarios conectados)
 * - EditorToolbar (formato)
 *
 * USO:
 * 1. Copiar este código a tu componente real de edición de contratos
 * 2. Ajustar rutas de importación según tu estructura
 * 3. Conectar con tus APIs existentes
 */

'use client';

import { useState, useCallback } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
import LexyAssistantSidebar from './LexyAssistantSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContractEditorCanvasProps {
  contractId: string;
  initialContent: string;
  onBack?: () => void;
  onShareClick?: () => void;
}

export default function ContractEditorCanvas({
  contractId,
  initialContent,
  onBack,
  onShareClick,
}: ContractEditorCanvasProps) {
  const router = useRouter();
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Handler para guardar el contrato en la base de datos
  const handleSave = useCallback(async (content: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el contrato');
      }

      setLastSaved(new Date());
      console.log('[ContractEditor] Saved successfully');
    } catch (error) {
      console.error('[ContractEditor] Error saving:', error);
      throw error; // Re-throw para que el editor maneje el error
    } finally {
      setIsSaving(false);
    }
  }, [contractId]);

  // Handler para actualizar contenido cuando cambia en el editor
  const handleContentChange = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  // Handler para aplicar ediciones sugeridas por Lexy
  const handleApplyEdit = useCallback((newContent: string) => {
    setCurrentContent(newContent);
    // El editor colaborativo sincronizará automáticamente el cambio
    console.log('[ContractEditor] Applied edit from Lexy');
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBack?.() || router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="h-6 w-px bg-gray-300"></div>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Editar Contrato
            </h1>
            {lastSaved && (
              <p className="text-xs text-gray-500">
                Guardado hace{' '}
                {Math.round((Date.now() - lastSaved.getTime()) / 1000)}s
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-sm text-gray-500">Guardando...</span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onShareClick}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleSave(currentContent)}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar ahora
          </Button>
        </div>
      </div>

      {/* Main Content: Sidebar + Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lexy Sidebar (450px) */}
        <div className="w-[450px] border-r border-gray-200 flex-shrink-0">
          <LexyAssistantSidebar
            contractId={contractId}
            contractContent={currentContent}
            onApplyEdit={handleApplyEdit}
          />
        </div>

        {/* Collaborative Editor (flex-1) */}
        <div className="flex-1 overflow-hidden">
          <CollaborativeEditor
            contractId={contractId}
            initialContent={initialContent}
            onContentChange={handleContentChange}
            onSave={handleSave}
            maxCollaborators={3}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * EJEMPLO DE USO EN UNA PÁGINA:
 *
 * // app/(dashboard)/contratos/[id]/editar/page.tsx
 *
 * import ContractEditorCanvas from '@/components/collaborative-editor/ContractEditorCanvas';
 * import { createClient } from '@/lib/supabase/server';
 * import { notFound } from 'next/navigation';
 *
 * export default async function ContractEditPage({ params }: { params: { id: string } }) {
 *   const supabase = await createClient();
 *
 *   // Cargar contrato desde BD
 *   const { data: contract, error } = await supabase
 *     .from('contract_generations')
 *     .select('*')
 *     .eq('id', params.id)
 *     .single();
 *
 *   if (error || !contract) {
 *     notFound();
 *   }
 *
 *   return (
 *     <ContractEditorCanvas
 *       contractId={contract.id}
 *       initialContent={contract.content || ''}
 *       onShareClick={() => {
 *         // Abrir modal de compartir
 *       }}
 *     />
 *   );
 * }
 */
