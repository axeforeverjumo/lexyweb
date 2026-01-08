'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';

const steps = [
  {
    number: '01',
    title: 'Pregunta a Lexy',
    description: '"Necesito un contrato de arrendamiento con opción de compra"',
    details: 'Lexy analiza tu necesidad y te hace las preguntas correctas. Modo conversacional, sin formularios complejos.',
  },
  {
    number: '02',
    title: 'Genera tu contrato',
    description: 'En 30 segundos tienes un contrato de 10+ páginas.',
    details: 'Personalizado con tus datos. Listo para firmar. Edita en tiempo real con el Canvas si necesitas cambios.',
  },
  {
    number: '03',
    title: 'Firma digital integrada',
    description: 'Envía por WhatsApp a tus clientes.',
    details: 'Firmas desde móvil con PIN seguro. PDF certificado automático.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="como-funciona" ref={ref} className="py-32 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20"
        >
          3 pasos. Desde la duda hasta
          <br />
          el contrato firmado.
        </motion.h2>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              {/* Number + Content */}
              <div className="flex-1">
                <div className="flex items-start space-x-6">
                  <div className="text-6xl font-bold text-primary-500">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg font-medium text-primary-600 mb-4 italic">
                      {step.description}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="flex-1 w-full">
                <div className="bg-white rounded-xl shadow-lg h-64 flex items-center justify-center">
                  <p className="text-gray-400">Screenshot paso {step.number}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <Button size="lg" href="#precios">
            Probar gratis 14 días
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
