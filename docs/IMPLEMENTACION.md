# IMPLEMENTACIÓN TÉCNICA - LEXY Landing Page

**Última actualización**: 2026-01-19
**Estado**: Producción en Vercel
**URL**: https://www.lexy.plus
**Repositorio**: [GitHub URL]

---

## 📋 Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Integración Stripe](#integración-stripe)
4. [SEO y Performance](#seo-y-performance)
5. [Deployment](#deployment)
6. [Integración Sanity CMS](#integración-sanity-cms)
7. [Troubleshooting](#troubleshooting)

---

## Stack Tecnológico

### Core

```json
{
  "framework": "Next.js 15",
  "react": "19.0.0",
  "typescript": "5.3.3",
  "node": ">=18.17.0"
}
```

### Styling & Animation

```json
{
  "tailwindcss": "4.0.0",
  "framer-motion": "11.0.0",
  "postcss": "8.4.0"
}
```

### Payments & CMS

```json
{
  "stripe": "^14.0.0",
  "@stripe/stripe-js": "^2.0.0",
  "@sanity/client": "^6.0.0",
  "next-sanity": "^7.0.0"
}
```

### Build & Deploy

```json
{
  "vercel": "Latest",
  "sharp": "^0.33.0"
}
```

---

## Configuración del Proyecto

### 1. Inicialización

```bash
# Clonar repositorio
git clone [repo-url]
cd lexyweb

# Instalar dependencias
npm install

# Crear .env.local
cp .env.example .env.local
```

### 2. Variables de Entorno

Crear `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_ID_PRO=price_xxx

# Sanity (Opcional - para blog)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Configuración Tailwind v4

**`app/globals.css`:**

```css
@import url('https://rsms.me/inter/inter.css');
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  /* Emerald Palette */
  --color-emerald-50: #ECFDF5;
  --color-emerald-100: #D1FAE5;
  --color-emerald-400: #34D399;
  --color-emerald-500: #10B981;
  --color-emerald-600: #059669;
  --color-emerald-700: #047857;

  /* Spacing System (8px base) */
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Border Radius */
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white text-gray-900 antialiased;
  }
}
```

**IMPORTANTE - Error común:**

❌ **INCORRECTO:**
```css
@import "tailwindcss";
@import url('https://rsms.me/inter/inter.css');
```

✅ **CORRECTO:**
```css
@import url('https://rsms.me/inter/inter.css');
@import "tailwindcss";
```

La importación de fuentes DEBE ir ANTES de Tailwind.

### 4. Next.js Configuration

**`next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lexy.plus',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
```

### 5. TypeScript Configuration

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6. Ejecutar Localmente

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## Integración Stripe

### 1. Setup Stripe

**Crear productos en Stripe Dashboard:**

1. Ir a https://dashboard.stripe.com/products
2. Crear producto "LEXY PRO"
   - Tipo: Recurring
   - Precio: 65 EUR/mes
   - Trial: 14 días
   - ID del precio: Copiar para .env

### 2. Implementación Checkout

**`lib/stripe.ts`:**

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

**`app/api/checkout/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#precios`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3. Hook de Checkout

**`components/useCheckout.ts`:**

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

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { sessionId } = await response.json();
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

### 4. Página de Éxito

**`app/success/page.tsx`:**

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a LEXY PRO!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu suscripción se ha activado correctamente.
        </p>
        <Button size="lg" href="https://app.lexy.plus/login">
          Acceder a la aplicación
        </Button>
      </div>
    </div>
  );
}
```

### 5. Testing Stripe

**Tarjetas de prueba:**

```
Éxito: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Fecha: Cualquier futuro
CVC: Cualquier 3 dígitos
```

---

## SEO y Performance

### 1. Metadata Optimization

**`app/layout.tsx`:**

```typescript
export const metadata: Metadata = {
  title: "Generador Contratos Inmobiliarios | 30 Segundos | Lexy IA",
  description: "¿Necesitas un contrato YA? Genera contratos inmobiliarios legales en 30 segundos. IA validada por 250+ abogados. Firma digital integrada.",
  keywords: [
    "contratos inmobiliarios",
    "generar contrato legal online",
    "contratos automaticos",
    "firma digital inmobiliaria",
    "IA legal inmobiliaria"
  ],
  authors: [{ name: "LEXY Plus" }],
  openGraph: {
    title: "LEXY - Contratos Inmobiliarios en 30 Segundos",
    description: "IA legal especializada para agentes inmobiliarios",
    type: "website",
    url: "https://www.lexy.plus",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEXY - Contratos Inmobiliarios IA",
    description: "Genera contratos en 30 segundos",
    images: ["/og-image.png"],
  },
};
```

### 2. Sitemap

**`app/sitemap.ts`:**

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

### 3. Robots.txt

**`app/robots.ts`:**

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.lexy.plus/sitemap.xml',
  };
}
```

### 4. Structured Data

**`app/layout.tsx` - JSON-LD:**

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LEXY',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '65',
    priceCurrency: 'EUR',
    priceValidUntil: '2026-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '127',
  },
};

// En el HTML
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### 5. Performance Optimizations

**Image Optimization:**

```typescript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}

// Uso en componentes
<Image
  src="/dashboard.png"
  alt="LEXY Dashboard"
  width={1400}
  height={700}
  priority // Para hero images
  placeholder="blur" // Si tienes blurDataURL
/>
```

**Font Optimization:**

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap", // Mejora CLS
  preload: true,
});
```

**Lazy Loading Components:**

```typescript
// Para componentes pesados
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### 6. Keywords Strategy

**Primary Keywords:**
- generador contratos inmobiliarios
- contratos inmobiliarios online
- crear contrato legal inmobiliario

**Secondary Keywords:**
- contratos automaticos inmobiliaria
- firma digital contratos
- IA legal inmobiliaria
- plantillas contratos inmobiliarios

**Long-tail:**
- generar contrato compraventa inmobiliaria rapido
- como hacer contrato arrendamiento online
- contratos inmobiliarios con firma digital

**Target:**
- Google Search Console: Submit sitemap
- Schema markup para rich snippets
- Internal linking strategy
- Meta descriptions < 155 caracteres

---

## Deployment

### 1. Preparación para Deploy

**Build local:**

```bash
# Test build
npm run build

# Verificar output
npm run start

# Check bundle size
npm run build -- --profile
```

**Checklist pre-deploy:**
- ✅ Build sin errores
- ✅ Variables de entorno configuradas
- ✅ .env.local NO commiteado
- ✅ Imágenes optimizadas
- ✅ Lighthouse score > 90

### 2. Deploy a Vercel

**Método 1: GitHub Integration**

1. Push a GitHub:
```bash
git remote add origin [repo-url]
git push -u origin main
```

2. Vercel Dashboard:
   - New Project → Import Git Repository
   - Select lexyweb
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. Environment Variables:
```
NEXT_PUBLIC_APP_URL=https://www.lexy.plus
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[live-key]
STRIPE_SECRET_KEY=[live-key]
STRIPE_PRICE_ID_PRO=[price-id]
```

4. Deploy

**Método 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Configuración Dominio

**DNS Configuration:**

1. Vercel Dashboard → Settings → Domains
2. Add domain: `www.lexy.plus` y `lexy.plus`
3. Configure DNS records en tu proveedor:

```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

4. Wait for SSL certificate (automático)
5. Verify HTTPS redirect

### 4. Continuous Deployment

**Auto-deploy setup:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 5. Monitoring

**Vercel Analytics:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Speed Insights:**
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

---

## Integración Sanity CMS

### 1. Setup Sanity Project

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Login
sanity login

# Init project (en carpeta separada)
sanity init
```

**Configuración:**
- Project name: lexy-blog
- Dataset: production
- Schema: Blog

### 2. Schema de Blog

**`sanity/schemas/post.ts`:**

```typescript
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
  ],
};
```

### 3. Cliente Sanity en Next.js

**`lib/sanity.ts`:**

```typescript
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

### 4. Fetch Posts

**`app/blog/page.tsx`:**

```typescript
import { client } from '@/lib/sanity';

async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      mainImage
    }
  `);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post._id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### 5. Deploy Sanity Studio

```bash
# Build studio
cd sanity-studio
sanity build

# Deploy
sanity deploy
```

Studio URL: https://lexy.sanity.studio

---

## Troubleshooting

### Errores Comunes

#### 1. CSS Import Order Error

**Error:**
```
Parsing CSS source code failed
@import rules must precede all rules
```

**Solución:**
```css
/* ✅ CORRECTO */
@import url('https://rsms.me/inter/inter.css');
@import "tailwindcss";

/* ❌ INCORRECTO */
@import "tailwindcss";
@import url('https://rsms.me/inter/inter.css');
```

#### 2. Stripe Webhook Local Testing

**Error:** Webhooks no llegan en local

**Solución:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### 3. Hydration Mismatch

**Error:** `Hydration failed because the initial UI does not match`

**Solución:**
- Usar `'use client'` en componentes con hooks
- Evitar `window` en server components
- Usar `useEffect` para código de cliente
- Verificar que HTML server === HTML client

#### 4. Image Optimization Error

**Error:** `Failed to optimize image`

**Solución:**
```bash
# Install sharp
npm install sharp

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### 5. Vercel Build Timeout

**Error:** Build excede tiempo límite

**Solución:**
```javascript
// next.config.js
module.exports = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};
```

### Performance Issues

#### Bundle Size Grande

```bash
# Analyze bundle
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

#### Slow Page Load

**Checklist:**
- [ ] Imágenes optimizadas (WebP, AVIF)
- [ ] Lazy load componentes pesados
- [ ] Code splitting adecuado
- [ ] Fonts preload
- [ ] CSS critical path
- [ ] No renderizar todo en cliente

---

## Comandos Útiles

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Git

```bash
# Create feature branch
git checkout -b feature/nombre

# Commit with convention
git commit -m "feat: add new section"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"

# Push and create PR
git push -u origin feature/nombre
```

### Vercel

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs [deployment-url]
```

### Stripe

```bash
# List products
stripe products list

# Create price
stripe prices create \
  --unit-amount=6500 \
  --currency=eur \
  --recurring[interval]=month \
  --product=[product-id]

# Test webhook
stripe trigger payment_intent.succeeded
```

---

## Métricas de Éxito

### Performance Targets

**Lighthouse Scores:**
- Performance: > 95
- Accessibility: > 95
- Best Practices: > 95
- SEO: 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Analytics Goals

**Conversion Funnel:**
1. Landing page view
2. Scroll to pricing
3. Click "Empezar AHORA"
4. Complete Stripe checkout
5. Success page view

**Target Metrics:**
- Bounce rate: < 60%
- Time on page: > 2 min
- CTA click rate: > 5%
- Checkout completion: > 40%

---

**Documento Técnico** - Referencia completa para implementación y mantenimiento.
