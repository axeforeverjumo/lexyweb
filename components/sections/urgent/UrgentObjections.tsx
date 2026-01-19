'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const objections = [
  {
    question: '¿Pero es REALMENTE legal si es tan rápido?',
    answer: 'Velocidad NO = falta de legalidad.\n\nLexy es rápido porque está pre-entrenada con 250+ abogados. La IA NO está "inventando" el contrato. Está seleccionando cláusulas verificadas + combinándolas según tu caso.\n\nComparación: Un abogado que copia un contrato anterior y cambia nombres toma 20 minutos. Lexy hace lo mismo en 20 segundos. Mismo resultado, menos tiempo.\n\nLa diferencia: Lexy verifica automáticamente cada cláusula. El abogado cansado a las 18:00, menos.',
  },
  {
    question: '¿Qué pasa si el cliente cuestiona el contrato?',
    answer: 'Tu cliente puede pedir revisión de su abogado personal. Sin problema. El contrato Lexy está 100% formalizado. Es perfectamente válido para que un abogado lo revise, lo entienda, y lo valide.\n\nMejor aún: Muchos clientes lo aceptan directamente porque es tan profesional como uno de abogado. Y si tienen dudas, pueden preguntarle a Lexy (que responde como abogado).\n\nResultado: Cliente protegido. Tú no eres responsable de validación legal. Lexy sí.',
  },
  {
    question: '¿No pierdo control del contrato?',
    answer: 'Al contrario. Ganas control total.\n\nAntes: Abogado genera documento. Tú lo recibes. Esperas cambios. Tira y afloja. Días de ciclo.\n\nCon Lexy: TÚ generas. Canvas editor. MODIFICAS TODO LO QUE QUIERAS. En tiempo real. El documento es 100% tuyo. Haces cambios SIN esperar a nadie. Solo tú decides cuándo está listo.\n\nEso es MÁXIMO control. No menos control.',
  },
  {
    question: '¿Tengo que cambiar mi flujo de trabajo?',
    answer: 'No. Complementas, no reemplazas.\n\nSi tienes abogado externo, Lexy genera borradores. El abogado valida. 0 tiempo perdido en redacción, 100% en validación.\n\nSi trabajas solo, Lexy es tu abogado 24/7.\n\nSi trabajas con plantillas Word, Lexy es la versión profesional que se actualiza sola.\n\nSin cambio de flujo. Optimización de flujo.',
  },
];

export default function UrgentObjections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            Tienes Prisa.<br />También tienes dudas.
          </h2>
        </motion.div>

        {/* Objections Accordion */}
        <div className="space-y-4">
          {objections.map((objection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-emerald-600 transition-colors"
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-black pr-4 group-hover:text-emerald-600 transition-colors">
                  {objection.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <svg
                    className={`w-5 h-5 text-gray-600 group-hover:text-white transition-all ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer Content */}
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-8 pb-6"
                >
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-base text-gray-900 leading-relaxed whitespace-pre-line">
                      {objection.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-900 mb-6">
            ¿Más preguntas sobre urgencia y legalidad?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/faq-expandido"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-black font-medium rounded-full transition-all"
            >
              Ver FAQ completo →
            </a>
            <a
              href="#urgente-pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all"
            >
              Resolver dudas 24/7 con Lexy
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
