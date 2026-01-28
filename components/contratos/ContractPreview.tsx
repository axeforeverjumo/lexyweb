'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import {
  X,
  Download,
  FileText,
  Calendar,
  Globe,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ContractData {
  id: string;
  titulo: string;
  estado: string;
  contenido_markdown: string;
  contenido_html: string;
  datos_completados: Record<string, any>;
  idioma: string;
  created_at: string;
  updated_at: string;
  template_id: string;
  contract_templates: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    subcategoria: string;
  } | null;
}

interface ContractPreviewProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
}

const estadoConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  borrador: { label: 'Borrador', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: <FileText className="w-4 h-4" /> },
  generado: { label: 'Generado', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <CheckCircle className="w-4 h-4" /> },
  revisado: { label: 'Revisado', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: <CheckCircle className="w-4 h-4" /> },
  firmado: { label: 'Firmado', color: 'text-green-600', bgColor: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
  enviado: { label: 'Enviado', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: <CheckCircle className="w-4 h-4" /> },
  cancelado: { label: 'Cancelado', color: 'text-red-600', bgColor: 'bg-red-100', icon: <AlertCircle className="w-4 h-4" /> },
};

const idiomaConfig: Record<string, { label: string; flag: string }> = {
  es: { label: 'Espanol', flag: '🇪🇸' },
  ca: { label: 'Catala', flag: '🏴' },
};

export default function ContractPreview({ contractId, isOpen, onClose }: ContractPreviewProps) {
  const [contrato, setContrato] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && contractId) {
      fetchContrato();
    }
  }, [isOpen, contractId]);

  const fetchContrato = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/contracts/${contractId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar contrato');
      }

      setContrato(data.contrato);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

  const handleCopyMarkdown = async () => {
    if (!contrato) return;

    try {
      await navigator.clipboard.writeText(contrato.contenido_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Error al copiar al portapapeles');
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implementar descarga PDF en FASE 4
    alert('Descarga PDF - Proximamente en FASE 4');
  };

  if (!isOpen) return null;

  const estadoInfo = contrato ? estadoConfig[contrato.estado] || estadoConfig.borrador : null;
  const idiomaInfo = contrato ? idiomaConfig[contrato.idioma] || idiomaConfig.es : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-white shadow-xl flex flex-col relative">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {loading ? 'Cargando...' : contrato?.titulo || 'Contrato'}
              </h2>
              {contrato && (
                <p className="text-sm text-slate-500">
                  ID: {contrato.id.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              disabled={!contrato}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={!contrato}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Cargando contrato...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 font-medium mb-2">Error al cargar contrato</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchContrato}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : contrato ? (
            <div className="p-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Estado */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                  {estadoInfo && (
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${estadoInfo.bgColor} ${estadoInfo.color}`}>
                      {estadoInfo.icon}
                      <span>{estadoInfo.label}</span>
                    </span>
                  )}
                </div>

                {/* Idioma */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Idioma</p>
                  {idiomaInfo && (
                    <span className="inline-flex items-center space-x-1 text-sm text-slate-700">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>{idiomaInfo.flag} {idiomaInfo.label}</span>
                    </span>
                  )}
                </div>

                {/* Fecha creacion */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Creado</p>
                  <span className="inline-flex items-center space-x-1 text-sm text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{formatDate(contrato.created_at)}</span>
                  </span>
                </div>

                {/* Plantilla */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Plantilla</p>
                  {contrato.contract_templates ? (
                    <span className="inline-flex items-center space-x-1 text-sm text-slate-700">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span>{contrato.contract_templates.codigo}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </div>
              </div>

              {/* Datos completados (colapsable) */}
              {contrato.datos_completados && Object.keys(contrato.datos_completados).length > 0 && (
                <details className="mb-6 bg-slate-50 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                    Ver datos del contrato ({Object.keys(contrato.datos_completados).length} campos)
                  </summary>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(contrato.datos_completados).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-slate-900 font-medium">
                            {String(value) || '-'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}

              {/* Contenido del contrato */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700">Contenido del Contrato</h3>
                </div>
                <div className="p-6 prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900">
                  <ReactMarkdown>
                    {contrato.contenido_markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
