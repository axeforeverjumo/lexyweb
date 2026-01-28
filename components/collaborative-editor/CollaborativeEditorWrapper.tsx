'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';

interface CollaborativeEditorWrapperProps {
  contractId: string;
  initialContent: string;
  readOnly?: boolean;
}

export default function CollaborativeEditorWrapper({
  contractId,
  initialContent,
  readOnly = false,
}: CollaborativeEditorWrapperProps) {
  const router = useRouter();

  const handleSave = async (content: string) => {
    const response = await fetch(`/api/contracts/${contractId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contenido_markdown: content,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar contrato');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/contratos/${contractId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver al contrato</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              Edición Colaborativa
            </h1>
            {readOnly && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                Solo lectura
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CollaborativeEditor
          contractId={contractId}
          initialContent={initialContent}
          onSave={handleSave}
          maxCollaborators={3}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
