# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [2.0.0] - 2026-01-19

### 🎉 Major Update - Blog CMS + Landing Urgente

#### Added - Sanity CMS Blog Completo

**CMS Headless Profesional:**
- ✅ Sanity.io integration (Project ID: s5r9o1yx)
- ✅ Visual Editor tipo Notion sin código
- ✅ Rich Text Editor (Portable Text) con H1-H4, images, code blocks
- ✅ SEO fields completos (meta title, description, keywords, OG images)
- ✅ TypeScript types para Post, Author, Category
- ✅ Image CDN optimización automática global

**Schemas Implementados:**
- `post.ts` - Blog posts con SEO, author, categories, reading time
- `author.ts` - Autores con bio, slug, avatar
- `category.ts` - Categorización de artículos
- `blockContent.ts` - Editor rico (headings, lists, images, code)

**Frontend Blog:**
- `app/blog/page.tsx` - Lista artículos (grid 3 col, Apple-style)
- `app/blog/[slug]/page.tsx` - Artículo individual (editorial layout)
- `app/studio/[[...index]]/page.tsx` - Sanity Studio embebido
- `components/blog/PortableTextComponents.tsx` - Renderizado custom

**Cliente & Utils:**
- `lib/sanity.client.ts` - Queries GROQ, fetch functions
- `lib/sanity.types.ts` - TypeScript interfaces completas
- `sanity.config.ts` - Config Studio con plugins
- `sanity.cli.ts` - CLI configuration

**Diseño Blog:**
- Apple-style minimalism (Blanco + Negro + Emerald #059669)
- Tipografía Inter Variable con jerarquía perfecta
- Espaciado generoso (128px entre secciones)
- Imágenes optimizadas con aspect ratios
- Hover effects sutiles con transitions
- Mobile-first responsive (320px+)

**Documentación:**
- `docs/SANITY-IMPLEMENTACION-COMPLETA.md` (21 páginas - guía maestra)
- `docs/SETUP-SANITY-PERSONAL.md` (config específica s5r9o1yx)
- `docs/SANITY-QUICKSTART.md` (quick start 5 min)
- `docs/SANITY-BLOG-SETUP.md` (guía completa general)
- `docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md` (5,200 palabras ready)
- `EMPEZAR-AQUI.md` (onboarding rápido)

**Dependencias:**
```
sanity: ^5.4.0
@sanity/client, @sanity/image-url, @sanity/vision
@sanity/code-input, next-sanity, @portabletext/react
```
Total: +990 packages

#### Added - Landing /urgente

**Nueva landing especializada en conversión inmediata:**
- Diseño "Urgencia Quirúrgica" - Emerald green surgical accents
- Contador en tiempo real de 30 segundos (interactive)
- 10 componentes custom:
  - `UrgentHero.tsx` - Countdown interactivo con pulse animation
  - `UrgentProblem.tsx` - 3 escenarios (Frustración, Alt, Lexy)
  - `UrgentValueProp.tsx` - 4 beneficios con numeración gigante
  - `UrgentHowItWorks.tsx` - 4 pasos con tiempos (5s, 20s, 5s)
  - `UrgentUseCases.tsx` - 5 casos reales con savings
  - `UrgentSocialProof.tsx` - 3 testimonials agentes
  - `UrgentObjections.tsx` - 5 objeciones con accordion
  - `UrgentPricing.tsx` - ROI focus (65€/mes ilimitado)
  - `UrgentFinalCTA.tsx` - CTA maximalista fondo negro
- Keywords target: "contratos rápidos", "urgente", "30 segundos"
- Docs: `docs/LANDING-URGENTE-IMPLEMENTACION.md`

#### Changed

- **Color system** - Migración Naranja → Emerald-600 (#059669)
- **Button component** - Nuevo variant "primary" con emerald
- **Navigation** - Link a /blog agregado
- **README.md** - Sección Sanity CMS + actualización badges
- **next.config.js** - Soporte cdn.sanity.io para images

#### Fixed

- CORS configuration para Sanity API (localhost:3000)
- Image optimization remotePatterns para Sanity CDN
- TypeScript errors en Sanity schemas
- Missing dependency @sanity/vision
- Missing dependency @sanity/code-input
- Code block type configuration en blockContent

#### Documentation

- 6 nuevas guías de Sanity (50+ páginas total)
- README actualizado con setup Sanity
- EMPEZAR-AQUI.md para onboarding
- CHANGELOG actualizado

---

## [1.0.0] - 2026-01-08

### 🎉 Lanzamiento inicial

#### Added
- **Landing page completa** con 6 secciones:
  - Hero con CTA principal
  - Value Proposition (3 características principales)
  - How It Works (4 pasos del flujo)
  - Pricing (Plan Gratis + Plan Pro 65€/mes)
  - FAQ (7 preguntas frecuentes)
  - Footer completo con links
- **Imágenes reales del producto**:
  - Dashboard principal
  - Chat conversacional con Lexy
  - Generación automática de contratos
  - Editor Canvas en tiempo real
  - Sistema de firma digital
- **Integración con Stripe**:
  - Checkout sessions para suscripciones
  - Trial de 14 días configurado
  - Validación de ambiente (permite build sin keys)
- **Diseño ultra-minimalista**:
  - Inspiración Apple-style
  - Fondo blanco con acento naranja (#FF6B35)
  - Tipografía Manrope (200-800)
  - Animaciones con Framer Motion
- **SEO optimization**:
  - Sitemap dinámico
  - robots.txt
  - Meta tags completos
  - JSON-LD structured data
- **Deployment en Vercel**:
  - Auto-deploy desde GitHub
  - Build optimizado con Turbopack
  - Zero downtime deployments

#### Tech Stack
- Next.js 16.1.1 (App Router + Turbopack)
- React 19.2.3 (Server & Client Components)
- TypeScript 5.9.3
- Tailwind CSS 4.1.18 (nueva sintaxis con @theme)
- Framer Motion 12.24.12
- Stripe 20.1.2 + @stripe/stripe-js 8.6.1

#### Fixed
- Migración completa a Tailwind CSS 4 (uso de @tailwindcss/postcss)
- Actualización de images.domains → images.remotePatterns (Next.js 16 compatibility)
- TypeScript build errors en Stripe checkout
- Validación de variables de entorno en build time vs runtime

#### Documentation
- README.md completo con badges, screenshots, instrucciones
- Licencia ISC
- CHANGELOG.md para tracking de versiones

---

## Roadmap próximas versiones

### [2.1.0] - Próximamente
- [ ] Deploy Studio a Sanity Cloud (https://lexy.sanity.studio)
- [ ] Crear 8-10 artículos de blog
- [ ] Configurar Google Search Console
- [ ] Internal linking entre artículos
- [ ] A/B testing CTAs blog
- [ ] Analytics tracking eventos blog

### [2.2.0] - Futuro
- [ ] Configuración Stripe en Vercel (pagos activos)
- [ ] Dominio personalizado (www.lexy.plus)
- [ ] Vercel Analytics habilitado
- [ ] Tests E2E con Playwright
- [ ] Lighthouse score 100/100
- [ ] Internacionalización (i18n) - Español/Inglés
- [ ] Video demo del producto
- [ ] Calculadora de ahorro interactiva

---

**Formato:**
- `Added` - Nuevas características
- `Changed` - Cambios en funcionalidad existente
- `Deprecated` - Características que serán eliminadas
- `Removed` - Características eliminadas
- `Fixed` - Corrección de bugs
- `Security` - Parches de seguridad
