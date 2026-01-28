import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  variant?: 'white' | 'black';
  withPattern?: boolean;
  withGradientOrbs?: boolean;
  className?: string;
}

/**
 * Section Wrapper with Grid Pattern
 *
 * The grid pattern creates visual continuity across the entire interface.
 * It's the signature element of the LEXY design system.
 *
 * Variants:
 * - white: White background with subtle grid (default)
 * - black: Black background with visible grid
 *
 * @example
 * <Section variant="white" withPattern>
 *   <div className="max-w-7xl mx-auto px-6 py-12">
 *     // Content here
 *   </div>
 * </Section>
 */
export function Section({
  children,
  variant = 'white',
  withPattern = true,
  withGradientOrbs = false,
  className = ''
}: SectionProps) {
  const bgColor = variant === 'white' ? 'bg-white' : 'bg-black';
  const textColor = variant === 'white' ? 'text-black' : 'text-white';
  const gridPattern = variant === 'white'
    ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]'
    : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]';

  return (
    <section className={`relative ${bgColor} ${textColor} ${className}`}>
      {/* Grid Pattern Background */}
      {withPattern && (
        <div className={`absolute inset-0 ${gridPattern}`} />
      )}

      {/* Optional Gradient Orbs for Depth */}
      {withGradientOrbs && (
        <>
          <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${variant === 'white' ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`} />
          <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${variant === 'white' ? 'bg-emerald-600/5' : 'bg-emerald-600/10'}`} />
        </>
      )}

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

interface HeroSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Pre-configured Hero Section
 *
 * Dark background with gradient orbs and grid pattern
 *
 * @example
 * <HeroSection>
 *   <div className="max-w-5xl mx-auto text-center py-24">
 *     <h1>Welcome to LEXY</h1>
 *   </div>
 * </HeroSection>
 */
export function HeroSection({ children, className = '' }: HeroSectionProps) {
  return (
    <section className={`relative flex items-center justify-center px-6 pt-24 pb-12 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden ${className}`}>
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}
