'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, Eye, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ContractCard from './ContractCard';
import DeleteContractDialog from './DeleteContractDialog';
import ContractFilters from './ContractFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Contract {
  id: string;
  titulo: string;
  estado: 'borrador' | 'generado' | 'revisado' | 'firmado' | 'enviado' | 'cancelado';
  created_at: string;
  idioma: 'es' | 'ca';
  template_id?: string;
}

interface ContractsListProps {
  userId: string;
}

export default function ContractsList({ userId }: ContractsListProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, selectedEstado]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contracts/list');

      if (!response.ok) {
        throw new Error('Error al cargar contratos');
      }

      const data = await response.json();
      setContracts(data.contracts || []);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los contratos');
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = () => {
    let filtered = [...contracts];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(contract => contract.estado === selectedEstado);
    }

    setFilteredContracts(filtered);
    setCurrentPage(1); // Reset a primera página
  };

  const handleDelete = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar contrato');
      }

      // Recargar lista
      await loadContracts();
      setContractToDelete(null);
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo eliminar el contrato');
    }
  };

  const handleUpdateTitle = async (contractId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/update-title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: newTitle }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar título');
      }

      // Actualizar en el estado local
      setContracts(prev =>
        prev.map(c => (c.id === contractId ? { ...c, titulo: newTitle } : c))
      );
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo actualizar el nombre del contrato');
      throw err;
    }
  };

  // Paginación
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContracts = filteredContracts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Cargando contratos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Button variant="primary" onClick={loadContracts}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Botón de filtros */}
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <ContractFilters
              selectedEstado={selectedEstado}
              onEstadoChange={setSelectedEstado}
            />
          </div>
        )}

        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-slate-600">
          Mostrando {currentContracts.length} de {filteredContracts.length} contratos
          {searchTerm || selectedEstado !== 'todos' ? ' (filtrados)' : ''}
        </div>
      </div>

      {/* Lista de contratos */}
      {currentContracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No hay contratos
          </h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || selectedEstado !== 'todos'
              ? 'No se encontraron contratos con los filtros seleccionados'
              : 'Aún no has generado ningún contrato'}
          </p>
          {(searchTerm || selectedEstado !== 'todos') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedEstado('todos');
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {currentContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onDelete={() => setContractToDelete(contract)}
              onUpdateTitle={handleUpdateTitle}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      {contractToDelete && (
        <DeleteContractDialog
          contract={contractToDelete}
          onConfirm={() => handleDelete(contractToDelete.id)}
          onCancel={() => setContractToDelete(null)}
        />
      )}
    </div>
  );
}
