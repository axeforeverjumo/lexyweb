# LEXY Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-converting, ultra-minimalist landing page for LEXY targeting real estate agents with Stripe payment integration.

**Architecture:** Next.js 15 app with App Router, Tailwind CSS for styling, Framer Motion for animations, Stripe Checkout for payments. Apple-style minimalism with white background and warm orange accent (#FF6B35).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Stripe, Vercel deployment

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `.env.local`
- Create: `.gitignore`

**Step 1: Initialize Next.js with TypeScript**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Expected: Creates Next.js 15 project structure

**Step 2: Install additional dependencies**

```bash
npm install framer-motion stripe @stripe/stripe-js
npm install -D @types/node
```

**Step 3: Create environment variables file**

Create `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 4: Update next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lexy.plus'],
  },
}

module.exports = nextConfig
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project for LEXY landing"
```

---

## Task 2: Configure Tailwind with Brand Colors

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/globals.css`

**Step 1: Configure Tailwind with custom colors**

Update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0',
          100: '#FFE5D9',
          200: '#FFCBB3',
          300: '#FFB08C',
          400: '#FF9666',
          500: '#FF6B35', // Main orange
          600: '#E65A2B',
          700: '#CC4922',
          800: '#B33818',
          900: '#99270F',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        }
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Create globals.css with base styles**

Update `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-manrope: 'Manrope', system-ui, sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white text-gray-900 antialiased;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind with LEXY brand colors"
```

---

## Task 3: Setup Fonts and Layout

**Files:**
- Create: `app/layout.tsx`
- Modify: `app/page.tsx`

**Step 1: Configure Manrope font**

Update `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "LEXY - Tu Asistente Legal Inmobiliario con IA",
  description: "De conversación a contrato firmado en 3 pasos. IA legal especializada para agentes inmobiliarios. Genera contratos profesionales en 30 segundos.",
  keywords: "contratos inmobiliarios, IA legal, asistente legal, agentes inmobiliarios, firmas digitales",
  authors: [{ name: "LEXY Plus" }],
  openGraph: {
    title: "LEXY - Tu Asistente Legal Inmobiliario con IA",
    description: "De conversación a contrato firmado en 3 pasos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={manrope.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Step 2: Create basic page structure**

Update `app/page.tsx`:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold text-center py-20">
        LEXY Landing Page
      </h1>
    </main>
  );
}
```

**Step 3: Test the setup**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000 with "LEXY Landing Page" visible

**Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: setup fonts and basic layout"
```

---

## Task 4: Create Navigation Component

**Files:**
- Create: `components/Navigation.tsx`
- Create: `components/Button.tsx`

**Step 1: Create reusable Button component**

Create `components/Button.tsx`:
```typescript
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
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
```

**Step 2: Create Navigation component**

Create `components/Navigation.tsx`:
```typescript
'use client';

import Link from 'next/link';
import Button from './Button';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-gray-900">
            LEXY
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#como-funciona" className="text-gray-600 hover:text-gray-900 transition-colors">
            Cómo funciona
          </Link>
          <Link href="#precios" className="text-gray-600 hover:text-gray-900 transition-colors">
            Precios
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
            FAQ
          </Link>
        </div>

        {/* CTA Button */}
        <Button size="sm" href="#pricing">
          Empezar ahora
        </Button>
      </div>
    </nav>
  );
}
```

**Step 3: Add Navigation to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <h1 className="text-4xl font-bold text-center py-20">
          LEXY Landing Page
        </h1>
      </main>
    </>
  );
}
```

**Step 4: Test navigation**

Run: `npm run dev`
Expected: Navigation bar visible at top, becomes opaque on scroll

**Step 5: Commit**

```bash
git add components/Navigation.tsx components/Button.tsx app/page.tsx
git commit -m "feat: add navigation and button components"
```

---

## Task 5: Create Hero Section

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Step 1: Create Hero component**

Create `components/sections/Hero.tsx`:
```typescript
'use client';

import Button from '../Button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          De conversación a contrato firmado
          <br />
          <span className="text-primary-500">En 3 pasos</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          IA legal especializada para agentes inmobiliarios.
          <br />
          Genera contratos profesionales en 30 segundos.
        </motion.p>

        {/* Pricing Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-3 bg-gray-50 rounded-full px-6 py-3 mb-12"
        >
          <span className="text-2xl font-bold text-gray-900">65€/mes</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">Contratos ilimitados</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">Sin permanencia</span>
          <span className="ml-2 bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
            Precio de lanzamiento
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <Button size="lg" href="#pricing" className="text-lg">
            Construye tus primeros contratos gratis
          </Button>
          <p className="text-sm text-gray-500">
            Sin tarjeta de crédito · 14 días de prueba
          </p>
        </motion.div>

        {/* Demo Visual Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 rounded-2xl bg-gray-100 h-96 flex items-center justify-center shadow-2xl"
        >
          <p className="text-gray-400 text-lg">
            [Canvas Demo Screenshot]
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Add Hero to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

**Step 3: Test Hero section**

Run: `npm run dev`
Expected: Hero section with animations visible

**Step 4: Commit**

```bash
git add components/sections/Hero.tsx app/page.tsx
git commit -m "feat: add hero section with animations"
```

---

## Task 6: Create Value Proposition Section

**Files:**
- Create: `components/sections/ValueProposition.tsx`

**Step 1: Create ValueProposition component**

Create `components/sections/ValueProposition.tsx`:
```typescript
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
```

**Step 2: Add to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValueProposition />
      </main>
    </>
  );
}
```

**Step 3: Test section**

Run: `npm run dev`
Expected: Value proposition section visible with scroll animations

**Step 4: Commit**

```bash
git add components/sections/ValueProposition.tsx app/page.tsx
git commit -m "feat: add value proposition section"
```

---

## Task 7: Create How It Works Section

**Files:**
- Create: `components/sections/HowItWorks.tsx`

**Step 1: Create HowItWorks component**

Create `components/sections/HowItWorks.tsx`:
```typescript
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
    image: '[Screenshot del chat con Lexy]',
  },
  {
    number: '02',
    title: 'Genera tu contrato',
    description: 'En 30 segundos tienes un contrato de 10+ páginas.',
    details: 'Personalizado con tus datos. Listo para firmar. Edita en tiempo real con el Canvas si necesitas cambios.',
    image: '[Screenshot del Canvas: chat izquierda + contrato derecha]',
  },
  {
    number: '03',
    title: 'Firma digital integrada',
    description: 'Envía por WhatsApp a tus clientes.',
    details: 'Firmas desde móvil con PIN seguro. PDF certificado automático.',
    image: '[Screenshot de la página de firma en móvil]',
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
                  <p className="text-gray-400">{step.image}</p>
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
          <Button size="lg" href="#pricing">
            Probar gratis 14 días
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';
import HowItWorks from '@/components/sections/HowItWorks';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValueProposition />
        <HowItWorks />
      </main>
    </>
  );
}
```

**Step 3: Test section**

Run: `npm run dev`
Expected: How it works section with 3 steps visible

**Step 4: Commit**

```bash
git add components/sections/HowItWorks.tsx app/page.tsx
git commit -m "feat: add how it works section"
```

---

## Task 8: Create Pricing Section

**Files:**
- Create: `components/sections/Pricing.tsx`

**Step 1: Create Pricing component**

Create `components/sections/Pricing.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';

const plans = [
  {
    name: 'GRATIS',
    price: '0€',
    period: '/siempre',
    features: [
      '3 chats de consultas al año',
      '(preguntas ilimitadas por chat)',
      '2 contratos al mes',
      '97 plantillas profesionales',
      'Canvas de edición',
      'Firmas digitales',
      'Gestión de contratos',
    ],
    cta: 'Empezar gratis',
    ctaVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'PRO',
    price: '65€',
    period: '/mes',
    badge: 'POPULAR',
    priceNote: 'Precio de lanzamiento',
    features: [
      'Chats ilimitados 24/7',
      'Contratos ilimitados',
      'Todo del plan gratuito',
      'Soporte prioritario',
      'Sin permanencia',
    ],
    cta: 'Probar gratis 14 días',
    ctaVariant: 'primary' as const,
    ctaNote: 'Sin tarjeta · Cancela cuando quieras',
    popular: true,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="precios" ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Empieza gratis. Escala cuando lo necesites.
          </h2>
          <p className="text-xl text-gray-600">
            Sin trucos. Sin límites. Sin sorpresas.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-xl scale-105'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <div className="h-1 w-full bg-gray-200"></div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-xl text-gray-600">{plan.period}</span>
              </div>
              {plan.priceNote && (
                <p className="text-sm text-gray-500 mb-6">
                  └─ {plan.priceNote}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="space-y-2">
                <Button
                  variant={plan.ctaVariant}
                  className="w-full"
                  href={plan.popular ? '/api/checkout' : '/signup'}
                >
                  {plan.cta}
                </Button>
                {plan.ctaNote && (
                  <p className="text-xs text-center text-gray-500">
                    {plan.ctaNote}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Link */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-600 mb-16"
        >
          ¿Necesitas a Lexy personalizado dentro de tu negocio?{' '}
          <a href="#contact" className="text-primary-500 font-semibold hover:underline">
            Contáctanos para Plan Enterprise →
          </a>
        </motion.p>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-10 max-w-3xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 text-center mb-8">
            {/* Left Side */}
            <div>
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ABOGADO TRADICIONAL
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>600€+ al mes</li>
                <li className="text-sm">(consultoría + contratos)</li>
                <li>Horario de oficina</li>
                <li>Esperas de días</li>
                <li>Contratos limitados</li>
              </ul>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-4xl text-primary-500">→</span>
            </div>

            {/* Right Side */}
            <div>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-primary-500 mb-4">
                LEXY PRO
              </h3>
              <ul className="space-y-2 text-gray-900 font-medium">
                <li>65€/mes</li>
                <li className="text-sm">(todo incluido)</li>
                <li>24/7 disponible</li>
                <li>Respuesta en 30 segundos</li>
                <li>Contratos ilimitados</li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <p className="text-center text-lg text-gray-700">
              Un abogado 24/7 en tu bolsillo por el precio de una comida.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValueProposition />
        <HowItWorks />
        <Pricing />
      </main>
    </>
  );
}
```

**Step 3: Test section**

Run: `npm run dev`
Expected: Pricing section with 2 cards and comparison visible

**Step 4: Commit**

```bash
git add components/sections/Pricing.tsx app/page.tsx
git commit -m "feat: add pricing section with freemium and pro plans"
```

---

## Task 9: Create FAQ Section

**Files:**
- Create: `components/sections/FAQ.tsx`

**Step 1: Create FAQ component**

Create `components/sections/FAQ.tsx`:
```typescript
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
```

**Step 2: Add to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValueProposition />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
    </>
  );
}
```

**Step 3: Test section**

Run: `npm run dev`
Expected: FAQ section with accordion functionality

**Step 4: Commit**

```bash
git add components/sections/FAQ.tsx app/page.tsx
git commit -m "feat: add FAQ section with accordion"
```

---

## Task 10: Create Footer Section

**Files:**
- Create: `components/sections/Footer.tsx`

**Step 1: Create Footer component**

Create `components/sections/Footer.tsx`:
```typescript
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Logo + Tagline */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              LEXY
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              Tu asistente legal inmobiliario con IA verificada por abogados.
            </p>
            <p className="text-xs text-gray-500">
              © 2026 LEXY Plus
              <br />
              Todos los derechos reservados
            </p>
          </div>

          {/* Column 2 - Producto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#como-funciona" className="hover:text-primary-400 transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-primary-400 transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/plantillas" className="hover:text-primary-400 transition-colors">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="/firmas" className="hover:text-primary-400 transition-colors">
                  Firmas digitales
                </Link>
              </li>
              <li>
                <Link href="/casos-uso" className="hover:text-primary-400 transition-colors">
                  Casos de uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Recursos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-primary-400 transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-primary-400 transition-colors">
                  API Docs
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary-400 transition-colors">
                  Estado del servicio
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="hover:text-primary-400 transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-primary-400 transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary-400 transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-primary-400 transition-colors">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/rgpd" className="hover:text-primary-400 transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="https://linkedin.com" className="hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="https://twitter.com" className="hover:text-primary-400 transition-colors" aria-label="Twitter">
                Twitter
              </a>
              <a href="https://youtube.com" className="hover:text-primary-400 transition-colors" aria-label="YouTube">
                YouTube
              </a>
              <a href="mailto:hola@lexy.plus" className="hover:text-primary-400 transition-colors">
                Email
              </a>
            </div>

            {/* Credits */}
            <p className="text-xs text-gray-500">
              Hecho con ❤️ en Barcelona · Powered by Anthropic Claude & Google Gemini
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add to page**

Update `app/page.tsx`:
```typescript
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValueProposition />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Test footer**

Run: `npm run dev`
Expected: Footer with 4 columns and social links visible

**Step 4: Commit**

```bash
git add components/sections/Footer.tsx app/page.tsx
git commit -m "feat: add footer section"
```

---

## Task 11: Create Stripe Checkout API

**Files:**
- Create: `app/api/checkout/route.ts`
- Create: `lib/stripe.ts`

**Step 1: Create Stripe client**

Create `lib/stripe.ts`:
```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

**Step 2: Create checkout API route**

Create `app/api/checkout/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl } = await req.json();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID_PRO,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/#precios`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: undefined, // Will be collected in checkout
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan: 'pro',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Step 3: Update environment variables**

Add to `.env.local`:
```env
STRIPE_PRICE_ID_PRO=price_xxx  # Replace with actual Stripe Price ID
```

**Step 4: Create checkout hook**

Create `components/useCheckout.ts`:
```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    try {
      setLoading(true);

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}
```

**Step 5: Update Button component to handle checkout**

Update `components/Button.tsx` to accept onClick:
```typescript
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
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
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
```

**Step 6: Update Pricing section to use checkout**

Update `components/sections/Pricing.tsx` - modify the PRO plan button:
```typescript
// Add at top of file
'use client';
import { useCheckout } from '../useCheckout';

// Inside component
const { startCheckout, loading } = useCheckout();

// Update PRO plan button in the map
<Button
  variant={plan.ctaVariant}
  className="w-full"
  onClick={plan.popular ? startCheckout : undefined}
  href={plan.popular ? undefined : '/signup'}
  disabled={plan.popular && loading}
>
  {plan.popular && loading ? 'Procesando...' : plan.cta}
</Button>
```

**Step 7: Test checkout flow**

Run: `npm run dev`
Expected: Clicking "Probar gratis 14 días" redirects to Stripe Checkout

**Step 8: Commit**

```bash
git add lib/stripe.ts app/api/checkout/route.ts components/useCheckout.ts components/Button.tsx components/sections/Pricing.tsx .env.local
git commit -m "feat: integrate Stripe checkout for subscriptions"
```

---

## Task 12: Create Success Page

**Files:**
- Create: `app/success/page.tsx`

**Step 1: Create success page**

Create `app/success/page.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally verify session on backend
    setTimeout(() => setLoading(false), 2000);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Verificando tu suscripción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a LEXY PRO!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu suscripción se ha activado correctamente.
          Tienes 14 días de prueba gratuita para explorar todas las funcionalidades.
        </p>
        <div className="space-y-4">
          <Button size="lg" href="https://app.lexy.plus/login">
            Acceder a la aplicación
          </Button>
          <p className="text-sm text-gray-500">
            Recibirás un email de confirmación en breve con todos los detalles.
          </p>
        </div>
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Qué sigue?
          </h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✓ Accede a la plataforma con tu email</li>
            <li>✓ Crea tu primer contrato en 30 segundos</li>
            <li>✓ Pregunta cualquier duda legal a Lexy</li>
            <li>✓ Explora las 97 plantillas profesionales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test success page**

Navigate to: `http://localhost:3000/success?session_id=test`
Expected: Success page with celebration message

**Step 3: Commit**

```bash
git add app/success/page.tsx
git commit -m "feat: add subscription success page"
```

---

## Task 13: Mobile Responsive Optimization

**Files:**
- Modify: `components/Navigation.tsx`
- Modify: All section components

**Step 1: Add mobile menu to Navigation**

Update `components/Navigation.tsx`:
```typescript
'use client';

import Link from 'next/link';
import Button from './Button';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-gray-900">
            LEXY
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#como-funciona" className="text-gray-600 hover:text-gray-900 transition-colors">
            Cómo funciona
          </Link>
          <Link href="#precios" className="text-gray-600 hover:text-gray-900 transition-colors">
            Precios
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
            FAQ
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button size="sm" href="#precios">
            Empezar ahora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-900 p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="#como-funciona"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#precios"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Precios
            </Link>
            <Link
              href="#faq"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Button size="sm" href="#precios" className="w-full">
              Empezar ahora
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
```

**Step 2: Test mobile responsiveness**

Run: `npm run dev`
Resize browser to mobile size
Expected: Mobile menu hamburger visible, sections stack vertically

**Step 3: Commit**

```bash
git add components/Navigation.tsx
git commit -m "feat: add mobile responsive navigation"
```

---

## Task 14: SEO and Meta Tags Optimization

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/robots.txt`
- Create: `app/sitemap.ts`
- Create: `public/favicon.ico`

**Step 1: Update metadata in layout**

Already done in Task 3, but verify it's complete.

**Step 2: Create robots.txt**

Create `app/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://www.lexy.plus/sitemap.xml
```

**Step 3: Create sitemap**

Create `app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.lexy.plus',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.lexy.plus/#como-funciona',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.lexy.plus/#precios',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.lexy.plus/#faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
```

**Step 4: Add structured data**

Update `app/layout.tsx` to include JSON-LD:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LEXY',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '65',
      priceCurrency: 'EUR',
    },
    description: 'IA legal especializada para agentes inmobiliarios',
  };

  return (
    <html lang="es" className={manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Step 5: Commit**

```bash
git add app/layout.tsx app/robots.txt app/sitemap.ts
git commit -m "feat: add SEO optimization with sitemap and structured data"
```

---

## Task 15: Performance Optimization

**Files:**
- Modify: `next.config.js`
- Create: `components/ImagePlaceholder.tsx`

**Step 1: Update next.config.js for performance**

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lexy.plus'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

**Step 2: Create optimized image placeholder component**

Create `components/ImagePlaceholder.tsx`:
```typescript
interface ImagePlaceholderProps {
  label: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
}

export default function ImagePlaceholder({
  label,
  aspectRatio = 'video'
}: ImagePlaceholderProps) {
  const ratios = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div
      className={`${ratios[aspectRatio]} bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center`}
    >
      <p className="text-gray-400 text-center px-4">{label}</p>
    </div>
  );
}
```

**Step 3: Lazy load Framer Motion**

Update sections to use dynamic import for heavy components if needed (optional optimization).

**Step 4: Test performance**

Run: `npm run build`
Expected: Build succeeds, optimized bundle sizes shown

**Step 5: Commit**

```bash
git add next.config.js components/ImagePlaceholder.tsx
git commit -m "feat: add performance optimizations"
```

---

## Task 16: Deploy to Vercel

**Files:**
- Create: `vercel.json`
- Update: `.env.local` → Vercel environment variables

**Step 1: Create vercel.json**

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**Step 2: Push to GitHub**

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

**Step 3: Deploy to Vercel**

1. Go to https://vercel.com
2. Import Git repository
3. Add environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID_PRO`
   - `NEXT_PUBLIC_APP_URL`
4. Click Deploy

Expected: Site deployed successfully at vercel domain

**Step 4: Configure custom domain (lexy.plus)**

1. In Vercel dashboard: Settings → Domains
2. Add `www.lexy.plus` and `lexy.plus`
3. Configure DNS records as instructed by Vercel

**Step 5: Final commit**

```bash
git add vercel.json
git commit -m "chore: add Vercel deployment configuration"
git push
```

---

## Testing Checklist

**Manual Testing:**
- [ ] Hero section loads with animations
- [ ] Value proposition shows 3 features
- [ ] How it works shows 3 steps
- [ ] Pricing shows 2 plans (Free + Pro)
- [ ] FAQ accordion expands/collapses
- [ ] Footer has 4 columns + social links
- [ ] Navigation becomes opaque on scroll
- [ ] Mobile menu works on small screens
- [ ] Stripe checkout redirects to Stripe
- [ ] Success page displays after payment
- [ ] All sections are responsive
- [ ] Page loads fast (< 2s)

**Browser Testing:**
- [ ] Chrome/Edge (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox (desktop)

**Performance:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

---

## Post-Launch Tasks

**Monitoring:**
- [ ] Set up Google Analytics
- [ ] Configure Stripe webhooks for subscription events
- [ ] Monitor Vercel analytics
- [ ] Set up error tracking (Sentry optional)

**Content:**
- [ ] Replace image placeholders with actual screenshots
- [ ] Add demo video to hero section
- [ ] Create blog content
- [ ] Write help center articles

**Marketing:**
- [ ] Set up email capture (Mailchimp/ConvertKit)
- [ ] Create social media accounts
- [ ] Launch Product Hunt
- [ ] Run Google/Facebook ads

---

## Completion Criteria

✅ All 16 tasks completed
✅ Landing page deployed to production
✅ Stripe checkout working
✅ Mobile responsive
✅ Performance optimized
✅ SEO configured

**Estimated Time:** 8-10 hours

**Final Deliverables:**
- Ultra-minimalist landing page at lexy.plus
- Stripe subscription integration with 14-day trial
- Fully responsive design (mobile + desktop)
- SEO optimized with sitemap
- Production deployment on Vercel

---

**Last Updated:** 2026-01-08
