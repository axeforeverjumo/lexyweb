'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      number: '97',
      label: 'Plantillas legales verificadas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '30s',
      label: 'De consulta a contrato listo',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      number: '100%',
      label: 'Validez legal certificada',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section ref={ref} className="py-8 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Stats - Cards style */}
        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.1, ease: [0, 0, 0.2, 1] }}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg mb-3 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-black mb-1">{stat.number}</div>
              <div className="text-xs text-gray-600 leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
