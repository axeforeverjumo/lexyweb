'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Scale,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';

const quickActions = [
  {
    title: 'Nuevo Contrato',
    description: 'Genera un contrato legal con IA',
    href: '/contratos',
    icon: FileText,
    color: 'emerald',
  },
  {
    title: 'Consultar Abogado IA',
    description: 'Resuelve tus dudas legales',
    href: '/abogado',
    icon: Scale,
    color: 'blue',
  },
];

const stats = [
  {
    label: 'Contratos generados',
    value: '0',
    change: '+0%',
    icon: FileText,
  },
  {
    label: 'Consultas realizadas',
    value: '0',
    change: '+0%',
    icon: Scale,
  },
  {
    label: 'Tiempo ahorrado',
    value: '0h',
    change: '+0h',
    icon: Clock,
  },
];

const recentActivity = [
  {
    title: 'Bienvenido a LEXY',
    description: 'Tu plataforma de servicios legales está lista',
    time: 'Ahora',
    icon: Sparkles,
    color: 'text-emerald-600 bg-emerald-50',
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-6 h-6" />
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                Cuenta activa
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenido a tu Dashboard
            </h1>
            <p className="text-emerald-50 text-lg">
              Gestiona tus contratos y consultas legales desde un solo lugar
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones rápidas
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isEmerald = action.color === 'emerald';
            const bgClass = isEmerald ? 'bg-emerald-50' : 'bg-blue-50';
            const textClass = isEmerald ? 'text-emerald-600' : 'text-blue-600';

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${textClass}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Estadísticas
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad reciente
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Help Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Necesitas ayuda para empezar?
              </h3>
              <p className="text-gray-600 mb-4">
                Explora nuestras funcionalidades o consulta con nuestro abogado IA para resolver tus dudas legales.
              </p>
              <Link
                href="/abogado"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Consultar ahora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
