'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '💬',
    title: 'Consultas legales 24/7',
    subtitle: 'Respuestas verificadas por abogados',
    description: 'Pregunta cualquier duda inmobiliaria. IA entrenada por juristas expertos. Respuestas precisas al instante.',
  },
  {
    icon: '📄',
    title: 'Contratos profesionales',
    subtitle: 'En 30 segundos, no 3 días',
    description: '97 plantillas verificadas. 10+ páginas personalizadas. Listo para firmar.',
  },
  {
    icon: '📚',
    title: 'Todo centralizado',
    subtitle: 'Contratos + Chats + Firmas',
    description: 'Tus contratos organizados. Historial de consultas tuyas y de clientes. Firmas digitales integradas.',
  },
];

export default function ValueProposition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20"
        >
          Tu asistente legal completo,
          <br />
          no solo contratos
        </motion.h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <div className="h-1 w-12 bg-primary-500 mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-primary-600 mb-4">
                {feature.subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-center text-gray-700"
        >
          De 300€ por contrato a{' '}
          <span className="font-bold text-primary-500">65€/mes ilimitado</span>.
          Todo incluido.
        </motion.p>
      </div>
    </section>
  );
}
