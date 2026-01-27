'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthFormProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export default function AuthForm({ children, title, subtitle, footer }: AuthFormProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">

      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors group z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <div className="max-w-md w-full relative z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text mb-2">
            LEXY
          </h1>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Legal garantizado</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-6 pt-6 border-t border-white/10">
              {footer}
            </div>
          )}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          <p>🔒 Conexión segura SSL · 🛡️ Datos protegidos · ⚡ Acceso instantáneo</p>
        </motion.div>
      </div>
    </div>
  );
}
