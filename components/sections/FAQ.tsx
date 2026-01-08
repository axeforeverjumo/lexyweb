'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const faqs = [
  {
    question: '¿Cómo funciona la prueba gratuita de 14 días?',
    answer: 'Acceso completo al plan PRO sin pagar. Sin tarjeta de crédito. Después de 14 días puedes continuar con el plan gratuito o suscribirte a PRO.',
  },
  {
    question: '¿Los contratos son legalmente válidos?',
    answer: 'Sí. Todas las plantillas están verificadas por abogados expertos en derecho inmobiliario español. Las firmas digitales cumplen con la Ley 6/2020 y regulación eIDAS.',
  },
  {
    question: '¿Qué tipos de contratos puedo generar?',
    answer: '97 plantillas profesionales: arrendamientos, compraventas, arras, encargos, PSI, LOI, NDA, y más. Si no encuentras el que necesitas, contáctanos.',
  },
  {
    question: '¿Puedo editar los contratos generados?',
    answer: 'Sí. El Canvas de edición te permite modificar cualquier parte del contrato en tiempo real con ayuda de Lexy. También puedes descargar en PDF o Word.',
  },
  {
    question: '¿Las respuestas de Lexy son fiables?',
    answer: 'Lexy está entrenada con legislación española actualizada y verificada por juristas expertos. No inventa información, solo usa datos verificados.',
  },
  {
    question: '¿Puedo cancelar mi suscripción en cualquier momento?',
    answer: 'Sí. Sin permanencia. Cancela cuando quieras desde tu cuenta. Si cancelas, vuelves automáticamente al plan gratuito.',
  },
  {
    question: '¿Necesito conocimientos legales para usar Lexy?',
    answer: 'No. Lexy te guía en lenguaje claro. Solo responde preguntas simples y ella se encarga de la complejidad legal.',
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
        >
          Preguntas frecuentes
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border-b border-gray-200 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-primary-500 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="text-2xl text-primary-500 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-6"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
