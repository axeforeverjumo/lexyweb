'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  Globe,
  Edit,
  Trash2,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import DeleteContractDialog from './DeleteContractDialog';
import ShareContractModal from './ShareContractModal';

interface Contract {
  id: string;
  titulo: string;
  estado: 'borrador' | 'generado' | 'revisado' | 'firmado' | 'enviado' | 'cancelado';
  created_at: string;
  updated_at?: string;
  idioma: 'es' | 'ca';
  contenido_markdown: string;
  contenido_html: string;
  datos_completados: Record<string, any>;
  template_id?: string;
  conversacion_id?: string | null;
}

interface ContractDetailViewProps {
  contract: Contract;
}

const estadoConfig = {
  borrador: {
    label: 'Borrador',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  generado: {
    label: 'Generado',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  revisado: {
    label: 'Revisado',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  firmado: {
    label: 'Firmado',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  enviado: {
    label: 'Enviado',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

const idiomaConfig = {
  es: 'Español',
  ca: 'Català',
};

export default function ContractDetailView({ contract }: ContractDetailViewProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const estadoInfo = estadoConfig[contract.estado] || {
    label: 'Desconocido',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  const idiomaLabel = idiomaConfig[contract.idioma] || 'Español';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/contracts/${contract.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar contrato');
      }

      router.push('/contratos');
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo eliminar el contrato');
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implementar en FASE 4
    alert('La descarga de PDF estará disponible pronto');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/contratos">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a contratos
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {contract.titulo}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Creado el{' '}
                      {format(new Date(contract.created_at), 'PPP', { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{idiomaLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${estadoInfo.className}`}
            >
              {estadoInfo.label}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {/* Botón Editar con Lexy - AI Asistida */}
            <Button
              onClick={() => router.push(`/contratos/${contract.id}/editar`)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Editar con Lexy</span>
              <span className="hidden sm:inline text-xs opacity-90 ml-1">(IA + Tiempo Real)</span>
            </Button>

            {/* Botón Edición Colaborativa - Google Docs Style */}
            <Button
              onClick={() => router.push(`/contratos/${contract.id}/editar-colaborativo`)}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Edición Colaborativa</span>
              <span className="hidden sm:inline text-xs opacity-75 ml-1">(Solo Editor)</span>
            </Button>

            {/* Botón Compartir */}
            <Button
              variant="outline"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir para editar
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Word
            </Button>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del contrato */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <ReactMarkdown>{contract.contenido_markdown}</ReactMarkdown>
        </div>
      </div>

      {/* Datos completados (opcional, para debug) */}
      {Object.keys(contract.datos_completados).length > 0 && (
        <div className="mt-6 bg-slate-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Datos utilizados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(contract.datos_completados).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium text-slate-700">{key}:</span>{' '}
                <span className="text-slate-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      {showDeleteDialog && (
        <DeleteContractDialog
          contract={contract}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      {/* Modal de compartir contrato */}
      <ShareContractModal
        contractId={contract.id}
        conversacionId={contract.conversacion_id || null}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
