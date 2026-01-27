'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const scenarios = [
  {
    label: 'Escenario A',
    title: 'La Frustración',
    emoji: '😤',
    story: 'Son las 14:00 horas. Tu cliente está listo. El dinero está transferido. Solo falta el contrato. Llamas al abogado. No contesta. Envías un email. Respuesta: "Mañana." Tu cliente se va molesto. La comisión se va con él.',
    loss: 'Pérdida de la operación. Pérdida de 800-1200€ en comisiones.',
    negative: true,
  },
  {
    label: 'Escenario B',
    title: 'La Alternativa Genérica',
    emoji: '⚠️',
    story: 'Buscas "plantilla contrato compraventa". Encuentras un PDF. Copias, pegas en Word. Cambias nombres, montos, fechas. ¿Es legal? No sabes. ¿Protege al vendedor y comprador? Ojalá. El cliente firma. 3 meses después: problema legal.',
    loss: 'Riesgo de demanda. Daño a tu reputación.',
    negative: true,
  },
  {
    label: 'Escenario C',
    title: 'Lexy',
    emoji: '✅',
    story: '14:00 horas. Abres Lexy en tu móvil. Escribes: "Necesito compraventa 400k euros, Barcelona." 14:00:10 segundos. IA genera contrato completo. 14:00:20 segundos. Editas una cláusula. 14:00:30 segundos. Generas link de firma. Tu cliente entra desde WhatsApp, lee, firma.',
    loss: 'Operación cerrada. 65€/mes ilimitado. Cero problemas legales.',
    negative: false,
  },
];

export default function UrgentProblem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            El Problema: Tiempo vs Dinero<br />vs Legalidad
          </h2>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative p-8 rounded-2xl border ${
                scenario.negative
                  ? 'bg-white border-gray-200'
                  : 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-600/10'
              }`}
            >
              {/* Label */}
              <div className="text-xs font-semibold tracking-wider uppercase text-gray-600 mb-3">
                {scenario.label}
              </div>

              {/* Emoji + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{scenario.emoji}</div>
                <h3 className="text-2xl font-bold text-black">
                  {scenario.title}
                </h3>
              </div>

              {/* Story */}
              <p className="text-base text-gray-900 leading-relaxed mb-6">
                {scenario.story}
              </p>

              {/* Loss/Gain */}
              <div
                className={`p-4 rounded-xl ${
                  scenario.negative ? 'bg-gray-100' : 'bg-emerald-100'
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    scenario.negative ? 'text-black' : 'text-emerald-700'
                  }`}
                >
                  {scenario.loss}
                </p>
              </div>

              {/* Winner Badge */}
              {!scenario.negative && (
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  LA SOLUCIÓN
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
