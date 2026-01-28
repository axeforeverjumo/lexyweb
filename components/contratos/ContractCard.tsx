'use client';

import { useState } from 'react';
import { FileText, Download, Trash2, Eye, Calendar, Globe, Edit2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Contract {
  id: string;
  titulo: string;
  estado: 'borrador' | 'generado' | 'revisado' | 'firmado' | 'enviado' | 'cancelado';
  created_at: string;
  idioma: 'es' | 'ca';
}

interface ContractCardProps {
  contract: Contract;
  onDelete: () => void;
  onUpdateTitle?: (id: string, newTitle: string) => Promise<void>;
}

const estadoConfig = {
  borrador: {
    label: 'Borrador',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  generado: {
    label: 'Generado',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  revisado: {
    label: 'Revisado',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  firmado: {
    label: 'Firmado',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  enviado: {
    label: 'Enviado',
    className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

const idiomaConfig = {
  es: 'Español',
  ca: 'Català',
};

export default function ContractCard({ contract, onDelete, onUpdateTitle }: ContractCardProps) {
  const estadoInfo = estadoConfig[contract.estado] || {
    label: 'Desconocido',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  const idiomaLabel = idiomaConfig[contract.idioma] || 'Español';

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(contract.titulo);
  const [isSaving, setIsSaving] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(contract.created_at), {
    addSuffix: true,
    locale: es,
  });

  const handleSaveTitle = async () => {
    if (!onUpdateTitle || editedTitle.trim() === contract.titulo) {
      setIsEditingTitle(false);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateTitle(contract.id, editedTitle.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
      setEditedTitle(contract.titulo); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(contract.titulo);
    setIsEditingTitle(false);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="flex-1 min-w-0">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 px-2 py-1 text-lg font-semibold border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      disabled={isSaving}
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={isSaving}
                      className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                      {contract.titulo}
                    </h3>
                    {onUpdateTitle && (
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                        title="Editar nombre"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{idiomaLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de estado */}
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${estadoInfo.className}`}
            >
              {estadoInfo.label}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" href={`/contratos/${contract.id}`} className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Ver detalles
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              // TODO: Implementar descarga PDF en FASE 4
              alert('La descarga de PDF estará disponible pronto');
            }}
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
