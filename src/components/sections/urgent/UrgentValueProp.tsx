'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const benefits = [
  {
    number: '01',
    title: 'Cierra Operaciones Hoy',
    description: 'En inmobiliario, el tiempo es dinero. Un cliente que quiere cerrar hoy no espera 3 días. Con Lexy, cierra la operación en las próximas 2 horas. Contrato perfecto, legal, firmado. Tu cliente satisfecho. Tu comisión segura.',
    impact: 'Recupera operaciones que "casi se pierden"',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Flexibilidad Total',
    description: 'Cada operación es diferente. Compraventa simple. Compraventa con múltiples condiciones. Alquiler estacional. Intermediación con garantía. En vez de "esperar al abogado que hace lo suyo", TÚ controlas el contrato. En 30 segundos tienes lo que necesitas. Lo personalizas, lo firmas, cierras.',
    impact: 'No depender de terceros. Control total de operaciones.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Más Operaciones = Más Dinero',
    description: 'Si antes cerraba 4 operaciones al mes (por tiempo + costos legales), ahora puedo cerrar 10-15. Mismo esfuerzo, más ingresos. Cada operación genera 300€+ en comisiones. Ahora puedo hacer en 1 hora lo que antes tomaba 1 día.',
    impact: 'Escalabilidad. Sin contratar abogados internos. Sin depender de terceros.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Cero Riesgo Legal',
    description: '¿Y si algo falla? No pasa. Cada contrato es validado por 250+ abogados inmobiliarios españoles. Verificado semanalmente. Actualizado con cambios normativos. Es más legal que un PDF descargado de internet o que esperar al abogado cansado a las 18:00.',
    impact: 'Duerme tranquilo. Operaciones protegidas legalmente.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function UrgentValueProp() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            Por qué 30 segundos<br />es CRÍTICO en inmobiliario
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="space-y-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-8"
            >
              {/* Number + Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Big number background */}
                  <div className="text-8xl font-bold text-emerald-600 opacity-10 leading-none">
                    {benefit.number}
                  </div>
                  {/* Icon overlay */}
                  <div className="absolute top-8 left-8 text-emerald-600">
                    {benefit.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-4">
                <h3 className="text-3xl font-bold text-black mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-900 leading-relaxed mb-6">
                  {benefit.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-emerald-700">
                    {benefit.impact}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
