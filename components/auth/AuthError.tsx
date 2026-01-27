'use client';

import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface AuthErrorProps {
  message: string;
  onDismiss?: () => void;
}

export default function AuthError({ message, onDismiss }: AuthErrorProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-300 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
          aria-label="Cerrar mensaje"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
