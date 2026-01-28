'use client';

import { useState } from 'react';
import { X, Check, Sparkles, Crown, Building2, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/types/subscription.types';
import type { SubscriptionTier } from '@/types/subscription.types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: SubscriptionTier;
}

export default function PricingModal({ isOpen, onClose, currentTier = 'none' }: PricingModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    if (tier === 'none') return;
    if (tier === currentTier) return;

    setSelectedTier(tier);
    setIsLoading(true);

    try {
      const plan = SUBSCRIPTION_PLANS[tier];

      // Crear sesión de checkout en Stripe
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription/plans`,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear sesión de checkout');
      }

      const { url } = await response.json();

      // Redirigir a Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  const plans = [
    {
      ...SUBSCRIPTION_PLANS.pro,
      icon: Zap,
      gradient: 'from-slate-500 to-slate-700',
      recommended: false,
    },
    {
      ...SUBSCRIPTION_PLANS.team,
      icon: Sparkles,
      gradient: 'from-emerald-500 to-emerald-700',
      recommended: true,
    },
    {
      ...SUBSCRIPTION_PLANS.business,
      icon: Building2,
      gradient: 'from-blue-500 to-blue-700',
      recommended: false,
    },
    {
      ...SUBSCRIPTION_PLANS.enterprise,
      icon: Crown,
      gradient: 'from-purple-500 to-purple-700',
      recommended: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Planes de Suscripción</h2>
              <p className="text-sm text-gray-600 mt-1">
                Elige el plan que mejor se adapte a tus necesidades
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Plans Grid */}
        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.tier === currentTier;
              const isSelected = plan.tier === selectedTier;
              const isLoadingThisPlan = isLoading && isSelected;

              return (
                <div
                  key={plan.tier}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    plan.recommended
                      ? 'border-emerald-500 ring-4 ring-emerald-100'
                      : 'border-gray-200 hover:border-emerald-300'
                  } ${isCurrentPlan ? 'opacity-75' : ''}`}
                >
                  {/* Recommended Badge */}
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                        RECOMENDADO
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4 z-10">
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        PLAN ACTUAL
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-6">
                    {/* Icon + Name */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-lg text-gray-600">€/mes</span>
                      </div>
                      <p className="text-sm text-gray-500">Facturación mensual</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Características
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Max Users Badge */}
                      {plan.maxUsers > 1 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                            <span className="font-bold">{plan.maxUsers}</span>
                            <span>usuarios máximo</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.tier)}
                      disabled={isCurrentPlan || isLoading}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
                        isCurrentPlan
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl active:scale-95'
                          : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg active:scale-95'
                      } ${isLoadingThisPlan ? 'animate-pulse' : ''}`}
                    >
                      {isLoadingThisPlan ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Procesando...
                        </span>
                      ) : isCurrentPlan ? (
                        'Plan Actual'
                      ) : (
                        'Seleccionar Plan'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-emerald-200 rounded-lg">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-emerald-900">Todos los planes incluyen:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-emerald-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Generación ilimitada con IA
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    97 templates legales profesionales
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Firmas digitales válidas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Actualizaciones automáticas
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Pago seguro procesado por Stripe. Cancela en cualquier momento.</p>
            <p className="mt-1">
              ¿Tienes dudas?{' '}
              <a href="mailto:soporte@lexyapp.com" className="text-emerald-600 hover:underline">
                Contacta con soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
