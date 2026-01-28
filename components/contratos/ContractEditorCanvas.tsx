'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractCanvasSidebar from './ContractCanvasSidebar';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

interface ContractEditorCanvasProps {
  contractId: string;
  contractContent: string;
  conversacionId: string | null;
}

export default function ContractEditorCanvas({
  contractId,
  contractContent,
  conversacionId,
}: ContractEditorCanvasProps) {
  const router = useRouter();
  const [currentContent, setCurrentContent] = useState(contractContent);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyEdit = (newContent: string, changedText?: string) => {
    setCurrentContent(newContent);
    if (changedText) {
      setHighlightedText(changedText);
      // Quitar highlight después de 3 segundos
      setTimeout(() => setHighlightedText(null), 3000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido_markdown: currentContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar contrato');
      }

      // Opcional: mostrar notificación de éxito
      console.log('Contrato guardado exitosamente');
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar izquierdo - Chat con Lexy */}
      <ContractCanvasSidebar
        contractId={contractId}
        contractContent={currentContent}
        conversacionId={conversacionId}
        onApplyEdit={handleApplyEdit}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Documento a la derecha */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header del documento */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/contratos/${contractId}`)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al contrato</span>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">
              Edición de Contrato
            </h1>
          </div>
        </div>

        {/* Contenido del documento */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <ReactMarkdown>{currentContent}</ReactMarkdown>
            </div>

            {/* Highlight visual para cambios recientes */}
            {highlightedText && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                <p className="text-sm text-green-800">
                  ✨ Texto actualizado: <strong>{highlightedText.substring(0, 100)}...</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
