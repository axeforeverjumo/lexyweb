'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';
import { useCheckout } from '../useCheckout';

const plans = [
  {
    name: 'GRATIS',
    price: '0€',
    period: '/siempre',
    features: [
      '3 chats de consultas al año',
      '(preguntas ilimitadas por chat)',
      '2 contratos al mes',
      '97 plantillas profesionales',
      'Canvas de edición',
      'Firmas digitales',
      'Gestión de contratos',
    ],
    cta: 'Empezar gratis',
    ctaVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'PRO',
    price: '65€',
    period: '/mes',
    badge: 'POPULAR',
    priceNote: 'Precio de lanzamiento',
    features: [
      'Chats ilimitados 24/7',
      'Contratos ilimitados',
      'Todo del plan gratuito',
      'Soporte prioritario',
      'Sin permanencia',
    ],
    cta: 'Probar gratis 14 días',
    ctaVariant: 'primary' as const,
    ctaNote: 'Sin tarjeta · Cancela cuando quieras',
    popular: true,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { startCheckout, loading } = useCheckout();

  return (
    <section id="precios" ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Empieza gratis. Escala cuando lo necesites.
          </h2>
          <p className="text-xl text-gray-600">
            Sin trucos. Sin límites. Sin sorpresas.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-xl scale-105'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <div className="h-1 w-full bg-gray-200"></div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-xl text-gray-600">{plan.period}</span>
              </div>
              {plan.priceNote && (
                <p className="text-sm text-gray-500 mb-6">
                  └─ {plan.priceNote}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="space-y-2">
                <Button
                  variant={plan.ctaVariant}
                  className="w-full"
                  onClick={plan.popular ? startCheckout : undefined}
                  href={plan.popular ? undefined : '/signup'}
                  disabled={plan.popular && loading}
                >
                  {plan.popular && loading ? 'Procesando...' : plan.cta}
                </Button>
                {plan.ctaNote && (
                  <p className="text-xs text-center text-gray-500">
                    {plan.ctaNote}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Link */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-600 mb-16"
        >
          ¿Necesitas a Lexy personalizado dentro de tu negocio?{' '}
          <a href="#contact" className="text-primary-500 font-semibold hover:underline">
            Contáctanos para Plan Enterprise →
          </a>
        </motion.p>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-10 max-w-3xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 text-center mb-8">
            {/* Left Side */}
            <div>
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ABOGADO TRADICIONAL
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>600€+ al mes</li>
                <li className="text-sm">(consultoría + contratos)</li>
                <li>Horario de oficina</li>
                <li>Esperas de días</li>
                <li>Contratos limitados</li>
              </ul>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-4xl text-primary-500">→</span>
            </div>

            {/* Right Side */}
            <div>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-primary-500 mb-4">
                LEXY PRO
              </h3>
              <ul className="space-y-2 text-gray-900 font-medium">
                <li>65€/mes</li>
                <li className="text-sm">(todo incluido)</li>
                <li>24/7 disponible</li>
                <li>Respuesta en 30 segundos</li>
                <li>Contratos ilimitados</li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <p className="text-center text-lg text-gray-700">
              Un abogado 24/7 en tu bolsillo por el precio de una comida.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
