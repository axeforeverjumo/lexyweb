# Changelog

Todos los cambios notables del proyecto se documentan en este archivo.

## [2026-01-20] - Implementación Pricing Multi-Tier

### Añadido

#### Sistema de Pricing Multi-Tier
- **4 planes implementados**: PRO (65€), TEAM (150€), BUSINESS (299€), ENTERPRISE (500€)
- Sistema de tipos TypeScript para pricing (`types/pricing.ts`)
- Componente reutilizable `PricingCard.tsx` con diseño distintivo
- Tabla comparativa de features colapsable e interactiva
- Color coding por tier (Slate, Emerald, Indigo, Amber)

#### Componentes y Funcionalidad
- **Hook useCheckout actualizado** para soportar múltiples tiers
  - Manejo individual de loading state por tier
  - Redirección a email de ventas para plan Enterprise
  - Soporte para checkout de Stripe por tier

- **Componente PricingCard**
  - Animaciones stagger con Framer Motion
  - Hover effects con transformación 3D
  - Badges con glassmorphism (Popular, Recomendado, Enterprise)
  - Sistema de colores temático por tier
  - Loading states individuales

- **Sección Pricing refactorizada**
  - Grid responsive (1→2→4 columnas)
  - Tabla comparativa con toggle de visibilidad
  - 14 features comparadas entre tiers
  - Decorative elements (gradients, grid pattern)
  - Footer con información de trial y contacto

#### Diseño y Estética
- **Estética "Legal Futurista Refinado"**
  - Profesional pero memorable
  - Gradientes sutiles en backgrounds
  - Grid patterns overlays
  - Blur effects decorativos
  - Animaciones suaves con custom easing
  - Sombras y hover states refinados

### Técnico

#### Archivos Nuevos
- `types/pricing.ts` - Tipos TypeScript para el sistema de pricing
- `components/sections/PricingCard.tsx` - Componente individual de card de plan

#### Archivos Modificados
- `components/useCheckout.ts` - Actualizado para multi-tier
- `components/sections/Pricing.tsx` - Refactorizado completamente

#### Dependencias
- Usa Framer Motion (ya existente)
- Compatible con Next.js 16.1.1 + Turbopack
- TypeScript strict mode

### Pendiente (Backend)

#### Stripe Integration
- Crear productos en Stripe para cada tier
- Generar price IDs y añadir a variables de entorno:
  - `STRIPE_PRICE_ID_PRO`
  - `STRIPE_PRICE_ID_TEAM`
  - `STRIPE_PRICE_ID_BUSINESS`
  - `STRIPE_PRICE_ID_ENTERPRISE`

#### API Routes
- Actualizar `/api/checkout` para manejar múltiples tiers
- Implementar trial de 14 días en Stripe
- Añadir metadata de tier a las suscripciones

#### Base de Datos
- Extender schema de usuarios con `plan_tier` y `max_users`
- Crear tabla `team_members` para gestión de equipos
- Añadir columna `features` JSONB para control de acceso
- Implementar control de permisos por tier

### Fixes para Deployment en Vercel

#### Sanity CMS Opcional
- **Problema**: Build fallaba si no estaban configuradas las variables de entorno de Sanity
- **Solución**: Hecho Sanity completamente opcional
  - Cliente de Sanity solo se crea si existe `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - Todas las queries retornan arrays vacíos o `null` si Sanity no está configurado
  - Mock builder con métodos chainables (`width()`, `height()`, `url()`, etc.)
  - Warning en consola cuando se intenta usar sin configurar

#### TypeScript Compatibility
- Removida importación de tipos internos de Sanity (`@sanity/image-url/lib/types/types`)
- Uso de `any` para evitar conflictos con tipos internos no exportados
- Build exitoso sin dependencias opcionales configuradas

#### Archivos Modificados
- `lib/sanity.client.ts` - Hecho completamente opcional con mock builder

### Referencia

Documentación completa del diseño: `docs/plans/2026-01-20-pricing-multi-tier-design.md`

---

## [2026-01-20] - Proyecto inicial

### Añadido
- Estructura base del proyecto Next.js
- Componentes de landing page
- Integración con Stripe (plan único)
- Sistema de navegación
- Secciones: Hero, SocialProof, ValueProposition, HowItWorks, TrustBadges, UrgentCTA, FAQ, Footer
