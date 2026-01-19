'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const faqs = [
  {
    question: '¿Pero es REALMENTE legal si es tan rápido?',
    answer: 'Velocidad NO = falta de legalidad. Lexy es rápido porque está pre-entrenada con 250+ abogados. La IA NO está "inventando" el contrato. Está seleccionando cláusulas verificadas + combinándolas según tu caso. Comparación: Un abogado que copia un contrato anterior y cambia nombres toma 20 minutos. Lexy hace lo mismo en 20 segundos. Mismo resultado, menos tiempo. La diferencia: Lexy verifica automáticamente cada cláusula. El abogado cansado a las 18:00, menos.',
  },
  {
    question: '¿Qué pasa si el cliente cuestiona el contrato?',
    answer: 'Tu cliente puede pedir revisión de su abogado personal. Sin problema. El contrato Lexy está 100% formalizado. Es perfectamente válido para que un abogado lo revise, lo entienda, y lo valide. Mejor aún: Muchos clientes lo aceptan directamente porque es tan profesional como uno de abogado. Y si tienen dudas, pueden preguntarle a Lexy (que responde como abogado). Resultado: Cliente protegido. Tú no eres responsable de validación legal. Lexy sí.',
  },
  {
    question: '¿No pierdo control del contrato?',
    answer: 'Al contrario. Ganas control total. Antes: Abogado genera documento. Tú lo recibes. Esperas cambios. Tira y afloja. Días de ciclo. Con Lexy: TÚ generas. Canvas editor. MODIFICAS TODO LO QUE QUIERAS. En tiempo real. El documento es 100% tuyo. Haces cambios SIN esperar a nadie. Solo tú decides cuándo está listo. Eso es MÁXIMO control. No menos control.',
  },
  {
    question: '¿Tengo que cambiar mi flujo de trabajo?',
    answer: 'No. Complementas, no reemplazas. Si tienes abogado externo, Lexy genera borradores. El abogado valida. 0 tiempo perdido en redacción, 100% en validación. Si trabajas solo, Lexy es tu abogado 24/7. Si trabajas con plantillas Word, Lexy es la versión profesional que se actualiza sola. Sin cambio de flujo. Optimización de flujo.',
  },
  {
    question: '¿Cómo funciona la prueba gratuita de 14 días?',
    answer: 'Acceso completo al plan PRO sin pagar. Sin tarjeta de crédito. Después de 14 días puedes continuar con el plan gratuito o suscribirte a PRO. Sin compromisos, sin permanencia.',
  },
  {
    question: '¿Los contratos son legalmente válidos?',
    answer: 'Sí. Todas las plantillas están verificadas por abogados expertos en derecho inmobiliario español. Las firmas digitales cumplen con la Ley 6/2020 y regulación eIDAS. Cada contrato es validado por 250+ abogados inmobiliarios españoles. Verificado semanalmente. Actualizado con cambios normativos.',
  },
  {
    question: '¿Puedo cancelar mi suscripción en cualquier momento?',
    answer: 'Sí. Sin permanencia. Cancela cuando quieras desde tu cuenta. Si cancelas, vuelves automáticamente al plan gratuito. Sin preguntas, sin complicaciones.',
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-12 px-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Decorative gradient mesh */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          className="text-4xl font-bold text-center text-white mb-10"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">Preguntas</span> frecuentes
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.25, delay: index * 0.05, ease: [0, 0, 0.2, 1] }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-lg font-semibold text-white pr-8 group-hover:text-emerald-400 transition-colors">
                  {faq.question}
                </h3>
                <div className={`w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 transition-all ${openIndex === index ? 'bg-emerald-500/20 rotate-180' : ''}`}>
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-white/10 text-base text-gray-400 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
