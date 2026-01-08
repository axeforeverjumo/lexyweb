# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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

### [1.1.0] - Próximamente
- [ ] Configuración de variables de entorno de Stripe en Vercel
- [ ] Dominio personalizado (www.lexy.plus)
- [ ] Vercel Analytics habilitado
- [ ] Tests E2E con Playwright
- [ ] Lighthouse score 100/100

### [1.2.0] - Futuro
- [ ] Internacionalización (i18n) - Español/Inglés
- [ ] Blog integrado para SEO
- [ ] Testimonios de clientes
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
