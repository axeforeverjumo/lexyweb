'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type EstadoContrato = 'borrador' | 'generado' | 'revisado' | 'pendiente_firma' | 'firmado' | 'enviado' | 'cancelado';

interface DashboardFiltersProps {
  currentFilter?: EstadoContrato;
  stats: {
    borradores: number;
    generados: number;
    revisados: number;
    pendientes_firma: number;
    firmados: number;
    cancelados: number;
    total: number;
  } | null;
}

interface FilterOption {
  value: EstadoContrato | null;
  label: string;
  count: number;
  color: string;
}

export default function DashboardFilters({ currentFilter, stats }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: FilterOption[] = [
    {
      value: null,
      label: 'Todos',
      count: stats?.total || 0,
      color: 'text-slate-700 border-slate-200 hover:bg-slate-50',
    },
    {
      value: 'borrador',
      label: 'Borradores',
      count: stats?.borradores || 0,
      color: 'text-slate-700 border-slate-200 hover:bg-slate-50',
    },
    {
      value: 'generado',
      label: 'Generados',
      count: stats?.generados || 0,
      color: 'text-blue-700 border-blue-200 hover:bg-blue-50',
    },
    {
      value: 'revisado',
      label: 'Revisados',
      count: stats?.revisados || 0,
      color: 'text-purple-700 border-purple-200 hover:bg-purple-50',
    },
    {
      value: 'pendiente_firma',
      label: 'Pendientes Firma',
      count: stats?.pendientes_firma || 0,
      color: 'text-amber-700 border-amber-200 hover:bg-amber-50',
    },
    {
      value: 'firmado',
      label: 'Firmados',
      count: stats?.firmados || 0,
      color: 'text-green-700 border-green-200 hover:bg-green-50',
    },
    {
      value: 'cancelado',
      label: 'Cancelados',
      count: stats?.cancelados || 0,
      color: 'text-red-700 border-red-200 hover:bg-red-50',
    },
  ];

  const handleFilterClick = (value: EstadoContrato | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('estado', value);
    } else {
      params.delete('estado');
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = currentFilter === filter.value || (!currentFilter && filter.value === null);

            return (
              <Button
                key={filter.label}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`${isActive ? '' : filter.color}`}
                onClick={() => handleFilterClick(filter.value)}
              >
                {filter.label}
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {filter.count}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
