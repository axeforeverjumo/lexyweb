'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCheckout } from '../useCheckout';
import PricingCard from './PricingCard';
import type { PricingPlan, ComparisonFeature } from '@/types/pricing';

// Pricing plans data
const plans: PricingPlan[] = [
  {
    id: 'pro',
    name: 'PRO',
    price: 65,
    tagline: 'Todo lo que necesitas para operar legalmente sin límites',
    description: 'Para agentes inmobiliarios individuales',
    cta: 'Empieza AHORA',
    maxUsers: 1,
    features: [
      'Contratos ilimitados',
      'Consultas IA 24/7 ilimitadas',
      '97 plantillas legales verificadas',
      'Canvas de edición en tiempo real',
      'Firmas digitales integradas',
      'Verificación legal continua',
      'Soporte 24/7 por Telegram',
      'Sin permanencia',
    ],
  },
  {
    id: 'team',
    name: 'TEAM',
    price: 150,
    tagline: 'Tu equipo. Tus contratos. Una sola plataforma.',
    description: 'Para agencias pequeñas (2-3 agentes)',
    cta: 'Prueba TEAM gratis',
    badge: 'Más popular',
    highlighted: true,
    maxUsers: 3,
    features: [
      'Hasta 3 usuarios',
      'Chats compartidos entre equipo',
      'Gestión de permisos',
      'Dashboard de administración',
      'Todo lo de PRO incluido',
      'Soporte prioritario (12h)',
      'Onboarding inicial',
    ],
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: 299,
    tagline: 'Tu marca. Tus contratos. Tu forma de trabajar.',
    description: 'Para agencias medianas',
    cta: 'Solicita demo',
    badge: 'Recomendado',
    recommended: true,
    maxUsers: 4,
    features: [
      'Hasta 4 usuarios',
      'Whitelabel: Tu logo en contratos',
      'Sube tus contratos propios',
      'Modifica plantillas a tu gusto',
      'Formación personalizada',
      'Videollamadas de apoyo',
      'Soporte prioritario (4h)',
      'Reportes y analytics',
    ],
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 500,
    tagline: 'Solución enterprise con soporte dedicado',
    description: 'Para grandes grupos inmobiliarios',
    cta: 'Hablar con ventas',
    badge: 'Enterprise',
    maxUsers: 7,
    contactSales: true,
    features: [
      'Hasta 7 usuarios',
      'Success Manager dedicado',
      'Integración con ERP*',
      'API access',
      'Formación continua',
      'Soporte VIP (2h)',
      'SLA garantizado 99.9%',
      'Dashboard avanzado',
      'SSO disponible',
    ],
  },
];

// Comparison table features
const comparisonFeatures: ComparisonFeature[] = [
  { name: 'Usuarios', pro: '1', team: '3', business: '4', enterprise: '7' },
  { name: 'Contratos ilimitados', pro: true, team: true, business: true, enterprise: true },
  { name: 'Consultas IA ilimitadas', pro: true, team: true, business: true, enterprise: true },
  { name: 'Plantillas legales', pro: '97', team: '97', business: '97', enterprise: '97' },
  { name: 'Chats compartidos equipo', pro: false, team: true, business: true, enterprise: true },
  { name: 'Gestión permisos', pro: false, team: true, business: true, enterprise: true },
  { name: 'Sube contratos propios', pro: false, team: false, business: true, enterprise: true },
  { name: 'Whitelabel (tu logo)', pro: false, team: false, business: true, enterprise: true },
  { name: 'Formación personalizada', pro: false, team: false, business: true, enterprise: true },
  { name: 'Videollamadas apoyo', pro: false, team: false, business: true, enterprise: true },
  { name: 'Success Manager', pro: false, team: false, business: false, enterprise: true },
  { name: 'API access', pro: false, team: false, business: false, enterprise: true },
  { name: 'Integración ERP', pro: false, team: false, business: false, enterprise: '✓*' },
  { name: 'Soporte', pro: 'Chat 24h', team: 'Chat 12h', business: 'Chat+Video 4h', enterprise: 'VIP 2h' },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { startCheckout, loading, loadingTier } = useCheckout();
  const [showComparison, setShowComparison] = useState(false);

  const handleCheckout = (tier: typeof plans[number]['id']) => {
    startCheckout(tier);
  };

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-emerald-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return <span className="text-sm text-gray-900">{value}</span>;
  };

  return (
    <section
      id="precios"
      ref={ref}
      className="py-20 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Encuentra el plan{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-transparent bg-clip-text">
                perfecto
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sin límites artificiales. Sin sorpresas. Escala cuando tu negocio crezca.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              isInView={isInView}
              onCheckout={() => handleCheckout(plan.id)}
              isLoading={loading && loadingTier === plan.id}
            />
          ))}
        </div>

        {/* Comparison Table Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-900 font-medium hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
          >
            {showComparison ? 'Ocultar' : 'Ver'} comparación detallada
            <svg
              className={`w-5 h-5 transition-transform ${showComparison ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Característica</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-900">PRO</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-900 bg-emerald-50">TEAM</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-indigo-900">BUSINESS</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-amber-900">ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.name}</td>
                      <td className="px-6 py-4 text-center">{renderValue(feature.pro)}</td>
                      <td className="px-6 py-4 text-center bg-emerald-50/30">{renderValue(feature.team)}</td>
                      <td className="px-6 py-4 text-center">{renderValue(feature.business)}</td>
                      <td className="px-6 py-4 text-center">{renderValue(feature.enterprise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-600">
            Todos los planes incluyen <span className="font-semibold">14 días de prueba gratis</span> · Sin tarjeta de crédito requerida
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ¿Necesitas más de 7 usuarios o funcionalidades específicas?{' '}
            <a href="mailto:ventas@lexy.plus" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contáctanos
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
