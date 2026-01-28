'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import ContractsList from '@/components/contratos/ContractsList';
import ContractFilters from '@/components/contratos/ContractFilters';
import ContractCreationSelector from '@/components/contratos/ContractCreationSelector';
import type { Contrato } from '@/types/contrato.types';

type FilterStatus = 'todos' | 'borrador' | 'generado' | 'firmado' | 'archivado';
type FilterType = string;

export default function ContratosPage() {
  const router = useRouter();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filteredContratos, setFilteredContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreationModal, setShowCreationModal] = useState(false);

  // Filtros
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [filterType, setFilterType] = useState<FilterType>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch contratos
  useEffect(() => {
    fetchContratos();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...contratos];

    // Filtro por estado
    if (filterStatus !== 'todos') {
      filtered = filtered.filter((c) => c.estado === filterStatus);
    }

    // Filtro por tipo
    if (filterType !== 'todos') {
      filtered = filtered.filter((c) => c.tipo_contrato === filterType);
    }

    // Búsqueda por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(query) ||
          c.tipo_contrato.toLowerCase().includes(query)
      );
    }

    setFilteredContratos(filtered);
  }, [contratos, filterStatus, filterType, searchQuery]);

  const fetchContratos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contracts/list');
      if (response.ok) {
        const { contracts } = await response.json();
        setContratos(contracts || []);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContract = () => {
    setShowCreationModal(true);
  };

  const handleContractCreated = (contractId: string) => {
    setShowCreationModal(false);
    router.push(`/contratos/${contractId}`);
  };

  // Estadísticas
  const stats = {
    total: contratos.length,
    borradores: contratos.filter((c) => c.estado === 'borrador').length,
    generados: contratos.filter((c) => c.estado === 'generado').length,
    firmados: contratos.filter((c) => c.estado === 'firmado').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Contratos
          </h1>
          <p className="text-gray-600">
            Gestiona y genera contratos legales con IA
          </p>
        </div>
        <button
          onClick={handleCreateContract}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nuevo Contrato
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid sm:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
          <p className="text-sm text-gray-600">Contratos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500">Borradores</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.borradores}</p>
          <p className="text-sm text-gray-600">En edición</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500">Generados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.generados}</p>
          <p className="text-sm text-gray-600">Listos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500">Firmados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.firmados}</p>
          <p className="text-sm text-gray-600">Completados</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ContractFilters
          filterStatus={filterStatus}
          filterType={filterType}
          searchQuery={searchQuery}
          onFilterStatusChange={setFilterStatus}
          onFilterTypeChange={setFilterType}
          onSearchChange={setSearchQuery}
          availableTypes={[
            'todos',
            ...Array.from(new Set(contratos.map((c) => c.tipo_contrato))),
          ]}
        />
      </motion.div>

      {/* Contracts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ContractsList
          contratos={filteredContratos}
          isLoading={isLoading}
          onRefresh={fetchContratos}
          emptyMessage={
            searchQuery || filterStatus !== 'todos' || filterType !== 'todos'
              ? 'No se encontraron contratos con los filtros aplicados'
              : undefined
          }
        />
      </motion.div>

      {/* Creation Modal */}
      {showCreationModal && (
        <ContractCreationSelector
          onClose={() => setShowCreationModal(false)}
          onContractCreated={handleContractCreated}
        />
      )}
    </div>
  );
}
