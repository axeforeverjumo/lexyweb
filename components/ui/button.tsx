import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
}

/**
 * Modern Button Component with Emerald Design System
 *
 * Variants:
 * - primary: Solid emerald background with hover shadow
 * - gradient: Eye-catching gradient with emerald tones
 * - secondary: White background with subtle border
 * - ghost: Transparent with hover effect
 *
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="gradient" size="lg">Get Started →</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed tracking-wide';

  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)]',
    gradient: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40',
    secondary: 'bg-white text-black border border-black/10 hover:border-black/20 hover:bg-gray-50',
    ghost: 'bg-transparent text-black hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
