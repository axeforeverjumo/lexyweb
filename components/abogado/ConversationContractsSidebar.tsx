'use client';

import { useEffect, useState } from 'react';
import { FileText, X, Eye, Calendar, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Contract {
  id: string;
  titulo: string;
  estado: 'borrador' | 'generado' | 'revisado' | 'pendiente_firma' | 'firmado' | 'enviado' | 'cancelado';
  created_at: string;
}

interface ConversationContractsSidebarProps {
  conversacionId: string | null;
}

const estadoConfig = {
  borrador: {
    label: 'Borrador',
    className: 'bg-yellow-100 text-yellow-800',
  },
  generado: {
    label: 'Generado',
    className: 'bg-green-100 text-green-800',
  },
  revisado: {
    label: 'Revisado',
    className: 'bg-blue-100 text-blue-800',
  },
  pendiente_firma: {
    label: 'Pendiente Firma',
    className: 'bg-amber-100 text-amber-800',
  },
  firmado: {
    label: 'Firmado',
    className: 'bg-purple-100 text-purple-800',
  },
  enviado: {
    label: 'Enviado',
    className: 'bg-indigo-100 text-indigo-800',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800',
  },
};

export default function ConversationContractsSidebar({
  conversacionId,
}: ConversationContractsSidebarProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversacionId) {
      loadContracts();
    }
  }, [conversacionId]);

  const loadContracts = async () => {
    if (!conversacionId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/contracts/by-conversation/${conversacionId}`
      );

      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts || []);
      }
    } catch (error) {
      console.error('Error loading conversation contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!conversacionId) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">
              Contratos de esta conversación
            </h3>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {contracts.length} contrato{contracts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de contratos */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Cargando contratos...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Sin contratos aún</p>
            <p className="text-xs text-slate-500">
              Los contratos que generes en esta conversación aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <ContractItem key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContractItem({ contract }: { contract: Contract }) {
  const estadoInfo = estadoConfig[contract.estado];
  const timeAgo = formatDistanceToNow(new Date(contract.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Link href={`/contratos/${contract.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {contract.titulo}
              </h4>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estadoInfo.className}`}
          >
            {estadoInfo.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
