'use client';

import { motion } from 'framer-motion';
import type { PricingPlan } from '@/types/pricing';
import Button from '../Button';

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  isInView: boolean;
  onCheckout: () => void;
  isLoading: boolean;
}

const tierColors = {
  pro: {
    gradient: 'from-slate-600 to-slate-500',
    border: 'border-slate-200',
    badge: 'bg-slate-600',
    accent: 'text-slate-600',
    shadow: 'shadow-slate-500/10',
    hoverShadow: 'hover:shadow-slate-500/20',
    feature: 'bg-slate-50',
  },
  team: {
    gradient: 'from-emerald-600 to-emerald-500',
    border: 'border-emerald-300',
    badge: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
    accent: 'text-emerald-600',
    shadow: 'shadow-emerald-500/20',
    hoverShadow: 'hover:shadow-emerald-500/30',
    feature: 'bg-emerald-50',
  },
  business: {
    gradient: 'from-indigo-600 to-purple-600',
    border: 'border-indigo-200',
    badge: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    accent: 'text-indigo-600',
    shadow: 'shadow-indigo-500/10',
    hoverShadow: 'hover:shadow-indigo-500/20',
    feature: 'bg-indigo-50',
  },
  enterprise: {
    gradient: 'from-amber-600 to-orange-600',
    border: 'border-amber-200',
    badge: 'bg-gradient-to-r from-amber-600 to-orange-600',
    accent: 'text-amber-600',
    shadow: 'shadow-amber-500/10',
    hoverShadow: 'hover:shadow-amber-500/20',
    feature: 'bg-amber-50',
  },
};

export default function PricingCard({ plan, index, isInView, onCheckout, isLoading }: PricingCardProps) {
  const colors = tierColors[plan.id];
  const isHighlighted = plan.highlighted || plan.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full"
    >
      {/* Card */}
      <div
        className={`
          relative h-full bg-white rounded-2xl p-8
          border-2 ${isHighlighted ? colors.border : 'border-gray-200'}
          ${colors.shadow} ${colors.hoverShadow}
          transition-all duration-300
          hover:-translate-y-2
          ${isHighlighted ? 'ring-2 ring-offset-4 ring-opacity-20 ring-current scale-105' : ''}
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Decorative gradient overlay */}
        {isHighlighted && (
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
        )}

        {/* Badge */}
        {plan.badge && (
          <div
            className={`
              absolute top-4 right-4
              ${colors.badge}
              text-white text-xs font-bold
              px-3 py-1.5 rounded-full
              backdrop-blur-sm bg-opacity-90
              shadow-lg
            `}
          >
            {plan.badge}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-5xl font-bold bg-gradient-to-r ${colors.gradient} text-transparent bg-clip-text`}>
              {plan.price}€
            </span>
            <span className="text-xl text-gray-600">/mes</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{plan.maxUsers} {plan.maxUsers === 1 ? 'usuario' : 'usuarios'}</p>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-700 mb-6 min-h-[40px]">
          {plan.tagline}
        </p>

        {/* CTA Button */}
        <div className="mb-8">
          <Button
            size="lg"
            onClick={onCheckout}
            disabled={isLoading}
            className={`
              w-full
              ${isHighlighted ? `bg-gradient-to-r ${colors.gradient} hover:opacity-90` : 'bg-gray-900 hover:bg-gray-800'}
              shadow-lg ${colors.shadow}
              transition-all duration-300
            `}
          >
            {isLoading ? 'Procesando...' : plan.cta}
          </Button>
          {!plan.contactSales && (
            <p className="text-xs text-gray-500 text-center mt-2">14 días de prueba gratis</p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 flex-grow">
          {plan.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-start gap-3 ${colors.feature} rounded-lg p-2.5`}
            >
              <svg className={`w-5 h-5 ${colors.accent} mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-900">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Footer note for Enterprise */}
        {plan.id === 'enterprise' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              * Integración ERP bajo presupuesto adicional según complejidad
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
