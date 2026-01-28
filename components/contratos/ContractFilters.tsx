'use client';

import { Label } from '@/components/ui/label';

interface ContractFiltersProps {
  selectedEstado: string;
  onEstadoChange: (estado: string) => void;
}

const estados = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'generado', label: 'Generado' },
  { value: 'revisado', label: 'Revisado' },
  { value: 'firmado', label: 'Firmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function ContractFilters({
  selectedEstado,
  onEstadoChange,
}: ContractFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-2 block">
          Estado del contrato
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {estados.map((estado) => (
            <button
              key={estado.value}
              onClick={() => onEstadoChange(estado.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedEstado === estado.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {estado.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
