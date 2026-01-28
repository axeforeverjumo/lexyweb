'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const mockContracts = [
  {
    id: 1,
    title: 'Contrato de Arrendamiento',
    status: 'Completado',
    date: '2024-01-15',
    type: 'Arrendamiento',
    icon: FileText,
    statusColor: 'emerald',
  },
];

export default function ContratosPage() {
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
        <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105">
          <Plus className="w-5 h-5" />
          Nuevo Contrato
        </button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contratos..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generación de Contratos con IA
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Estamos preparando una experiencia revolucionaria para la generación de contratos legales.
                Pronto podrás crear contratos personalizados en minutos con la ayuda de inteligencia artificial.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Generación automática</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Personalización inteligente</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Validación legal</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Clock className="w-4 h-4" />
                Próximamente disponible
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid sm:grid-cols-3 gap-4"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
          <p className="text-sm text-gray-600">Contratos generados</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">En proceso</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
          <p className="text-sm text-gray-600">Borradores</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Completados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
          <p className="text-sm text-gray-600">Finalizados</p>
        </div>
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aún no tienes contratos
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Cuando esta función esté disponible, podrás generar contratos legales personalizados en minutos.
          </p>
          <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30">
            <Plus className="w-5 h-5" />
            Crear primer contrato
            <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded-full">Próximamente</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
