'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackToDashboardProps {
  className?: string;
  variant?: 'button' | 'link';
  href?: string;
  label?: string;
}

/**
 * Componente para volver al dashboard principal o a otra ruta
 * Puede usarse como botón flotante o como enlace
 */
export default function BackToDashboard({
  className = '',
  variant = 'button',
  href = '/dashboard',
  label = 'Dashboard'
}: BackToDashboardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium ${className}`}
      >
        <Home className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  }

  // variant === 'button' - Modern emerald design with hover effects
  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300 hover:scale-105 ${className}`}
      title={label}
    >
      <Home className="w-5 h-5 text-white" />
    </button>
  );
}
