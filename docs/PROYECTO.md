# PROYECTO LEXY - Landing Page

**Última actualización**: 2026-01-19
**Estado**: Implementado y mejorado con efectos visuales modernos
**URL Producción**: https://www.lexy.plus
**Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion

---

## 📋 Índice

1. [Visión y Objetivos](#visión-y-objetivos)
2. [Diseño Visual](#diseño-visual)
3. [Sistema de Diseño](#sistema-de-diseño)
4. [Estructura de Contenido](#estructura-de-contenido)
5. [Componentes Implementados](#componentes-implementados)
6. [Mejoras Recientes](#mejoras-recientes)

---

## Visión y Objetivos

### Propuesta de Valor
LEXY es un asistente legal con IA especializado en el sector inmobiliario español que permite:
- **Generar contratos profesionales en 30 segundos** (vs 3-5 días tradicional)
- **Consultas legales 24/7** con IA verificada por 250+ abogados
- **Firmas digitales integradas** con validez legal certificada
- **Precio disruptivo**: 65€/mes ilimitado vs 300€+ por contrato

### Público Objetivo
Agentes inmobiliarios y pequeñas agencias que necesitan:
- Contratos urgentes sin esperar abogados
- Reducir costos legales (de 300€/contrato a 65€/mes)
- Mantener validez legal certificada
- Herramientas disponibles 24/7

### Diferenciadores Clave
1. **Nicho ultra-específico**: Solo inmobiliario (vs legal genérico)
2. **Velocidad extrema**: 30 segundos vs 3 días
3. **Firma digital integrada**: WhatsApp + validez eIDAS
4. **Canvas de edición**: Tiempo real con IA asistente
5. **Color único**: Verde esmeralda (vs azules genéricos legaltechColor único**: Verde esmeralda (vs azules genéricos legaltech)

---

## Diseño Visual

### Filosofía: "Modern Minimalism with Impact"

**Evolución del diseño:**
- ✅ **Fase 1** (Inicial): Minimalismo Apple con naranja (#FF6B35)
- ✅ **Fase 2** (Restyling): Cambio a verde esmeralda (#059669) - Mayor confianza legal
- ✅ **Fase 3** (Urgencia): Incorporación de elementos dramáticos y urgentes
- ✅ **Fase 4** (Actual): **Efectos visuales modernos con grid patterns y gradientes**

### Concepto Visual Actual

**"Sophistication meets urgency"**

El diseño combina:
1. **Minimalismo refinado** - Limpio pero no vacío
2. **Urgencia controlada** - Dramático pero profesional
3. **Profundidad visual** - Capas de gradientes y efectos
4. **Grid pattern unificador** - Textura sutil que conecta toda la página

### Inspiración
- **Apple.com** - Minimalismo extremo, espaciado generoso
- **Linear.app** - Tipografía impecable, animaciones sutiles
- **HubSpot** - Alternancia blanco/negro, secciones bien definidas
- **Odoo** - Estructura clara con variación visual
- **Arc Browser** - Detalles sutiles pero memorables

---

## Sistema de Diseño

### Paleta de Color

```css
/* Base Colors */
--white: #FFFFFF;
--black: #000000;
--gray-50: #F9FAFB;
--gray-900: #111827;

/* Emerald Accent - Identidad única */
--emerald-400: #34D399;  /* Gradientes, highlights */
--emerald-500: #10B981;  /* Accents secundarios */
--emerald-600: #059669;  /* Primary CTA, main accent */
--emerald-700: #047857;  /* Hover states */
--emerald-50: #ECFDF5;   /* Backgrounds sutiles */
--emerald-100: #D1FAE5;  /* Badges, pills */
```

**Reglas de uso del verde esmeralda:**
- ✅ CTAs principales (1-2 por sección)
- ✅ Gradientes en texto destacado
- ✅ Hover states de elementos interactivos
- ✅ Badges y pills de estado
- ✅ Iconos en contenedores
- ❌ NO usar en fondos grandes
- ❌ NO saturar la página

### Tipografía

**Familia**: Inter Variable Font
```css
@import url('https://rsms.me/inter/inter.css');

--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Escala Tipográfica */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Reglas tipográficas:**
- Headlines: Bold (700), tight leading (0.95-1.2)
- Body: Normal (400), relaxed leading (1.6)
- Botones: Medium (500), tracking wide
- Gradient text para énfasis máximo

### Espaciado

Sistema de 8px base reducido por feedback de usuario:

```css
/* Espaciado COMPACTO (actualizado) */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px - Entre secciones */
--space-16: 4rem;     /* 64px */
```

**Uso:**
- Entre secciones: `py-12` (48px) - MÁS COMPACTO
- Dentro de secciones: `py-8` (32px)
- Entre elementos: `gap-6` o `gap-8` (24-32px)
- Padding componentes: `p-6` o `p-8` (24-32px)

### Efectos Visuales Modernos ✨ NUEVO

#### 1. **Grid Pattern** (Elemento unificador)

El grid pattern corre por TODA la página, conectando secciones:

```css
/* Secciones NEGRAS/OSCURAS */
bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),
    linear-gradient(to_bottom,#80808008_1px,transparent_1px)]
bg-[size:24px_24px]

/* Secciones BLANCAS */
bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),
    linear-gradient(to_bottom,#00000008_1px,transparent_1px)]
bg-[size:24px_24px]
```

**Beneficios:**
- Continuidad visual entre secciones
- Transición fluida blanco ↔ negro
- Textura sutil pero presente
- Identidad unificada

#### 2. **Gradient Mesh Backgrounds**

Capas de gradientes con blur para profundidad:

```tsx
{/* Decorative gradient orbs */}
<div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
```

**Uso:**
- Fondos blancos: emerald/5 (muy sutil)
- Fondos negros: emerald/10 o emerald/20 (más visible)

#### 3. **Glassmorphism**

Efectos de cristal con backdrop-blur:

```css
bg-white/5 backdrop-blur-sm border border-white/10
```

**Aplicado en:**
- Stats cards en Hero y UrgentCTA
- FAQ cards en fondo negro
- Overlays de hover en imágenes

#### 4. **Gradient Text**

Texto con gradiente para máximo impacto:

```css
bg-gradient-to-r from-emerald-400 to-emerald-600
text-transparent bg-clip-text
```

**Usado en:**
- Keywords clave en headlines ("30 segundos", "CRÍTICOS", "AHORA")
- Números en stats
- Títulos de secciones específicas

#### 5. **Hover Effects**

Transiciones sutiles pero notables:

```css
hover:scale-105 hover:rotate-3 transition-transform duration-300
hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10
```

**Aplicado en:**
- Cards de features
- Imágenes en HowItWorks
- Iconos en badges
- Botones con gradient

### Animaciones

Framework: **Framer Motion**

```typescript
// Stagger pattern consistente
initial={{ opacity: 0, y: 20 }}
animate={isInView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.35, delay: index * 0.1, ease: [0, 0, 0.2, 1] }}
```

**Tipos de animaciones:**
- `fadeIn` - Entrada suave
- `slideUp` - Desde abajo (20px)
- `scaleIn` - Desde 95% a 100%
- `rotate` - Hover en iconos (3deg)

**Duración:**
- Fast: 0.25s
- Normal: 0.35s
- Slow: 0.5s

---

## Estructura de Contenido

### Arquitectura de Página

```
┌─────────────────────────────────────┐
│ Navigation (Fixed, Glassmorphic)    │
├─────────────────────────────────────┤
│ Hero (Negro + Grid Pattern)         │ ← Impacto máximo
│ - Headline dramático                │
│ - Stats glassmórficos               │
│ - Dashboard screenshot              │
├─────────────────────────────────────┤
│ SocialProof (Blanco + Grid)         │ ← Trust signals
│ - Stats cards con iconos           │
├─────────────────────────────────────┤
│ ValueProposition (Blanco + Grid)    │ ← Por qué LEXY
│ - 3 features con hover effects     │
├─────────────────────────────────────┤
│ HowItWorks (Negro + Grid)           │ ← 4 pasos
│ - Alternating layout                │
│ - Screenshots de producto           │
├─────────────────────────────────────┤
│ TrustBadges (Blanco + Grid)         │ ← Validación legal
│ - 3 badges circulares              │
├─────────────────────────────────────┤
│ UrgentCTA (Negro + Grid)            │ ← Conversión urgente
│ - Gradient button destacado         │
├─────────────────────────────────────┤
│ Pricing (Blanco + Grid)             │ ← Single plan focus
│ - Card con badge "Popular"          │
│ - Comparativa tradicional           │
├─────────────────────────────────────┤
│ FAQ (Negro + Grid)                  │ ← Objeciones
│ - Accordion glassmórfico            │
├─────────────────────────────────────┤
│ Footer (Negro + Grid)               │ ← Links + Legal
└─────────────────────────────────────┘
```

**Patrón de alternancia:**
- Negro → Blanco → Blanco → Negro → Blanco → Negro → Blanco → Negro → Negro
- Grid pattern en TODAS las secciones para continuidad

### Contenido por Sección

#### 1. Hero

**Headline:**
```
Tu próxima operación urgente
está a 30 segundos
```

**Subheadline:**
```
Tienes una operación a cerrar. Necesitas el contrato YA.
En 30 segundos, listo para firmar.
```

**Elementos clave:**
- Badge pill con dot pulsante: "Disponible 24/7 · Legal garantizado"
- Gradient en "30 segundos"
- Stats glassmórficos: 30s · 97 · 100%
- CTA: "Empezar AHORA - 30 segundos →"
- Dashboard screenshot con hover effect

**Keywords SEO:**
- contratos inmobiliarios rápido
- generar contrato legal online
- contratos automaticos

#### 2. SocialProof

**Stats:**
- 97 plantillas legales verificadas
- 30s de consulta a contrato listo
- 100% validez legal certificada

**Diseño:**
- Cards con iconos SVG
- Hover effects: scale + shadow
- Muy compacto (py-8)

#### 3. ValueProposition

**Headline:**
```
Por qué los contratos en 30 segundos
son CRÍTICOS para tu negocio
```

**Features:**

1. **Consultas legales 24/7**
   - Respuestas verificadas por abogados
   - IA entrenada por juristas expertos

2. **Contratos profesionales**
   - En 30 segundos, no 3 días
   - 97 plantillas verificadas

3. **Todo centralizado**
   - Contratos + Chats + Firmas
   - Historial completo

**Bottom CTA:**
```
De 300€ por contrato a 65€/mes ilimitado
```

#### 4. HowItWorks

**Headline:**
```
4 pasos. Desde la duda hasta
el contrato firmado.
```

**Steps:**

**Paso 01: Abre Lexy**
- Acceso instantáneo. No descargas.
- Panel con chats, contratos, historial.

**Paso 02: Escribe tu caso**
- "Necesito compraventa de vivienda, 450k euros, Barcelona..."
- IA entiende EXACTAMENTE qué necesitas.

**Paso 03: Recibe contrato validado**
- BOOM. Contrato completo. Todas las cláusulas.
- Canvas editor para cambios.

**Paso 04: Genera firma y cierra**
- Link de firma. Cliente entra desde WhatsApp.
- PDF certificado automático.

**Screenshots:**
- dashboard.png
- chat-con-lexy.png
- canvas.png
- firma-digital.png

#### 5. TrustBadges

**Badges:**
1. Verificado por abogados inmobiliarios
2. Validez legal certificada
3. Cumplimiento normativa vigente

#### 6. UrgentCTA

**Headline:**
```
¿Necesitas el contrato AHORA?
```

**Subheadline:**
```
No esperes 3 días. No pierdas la operación.
Genera tu contrato en 30 segundos.
```

**Stats:**
- 30s Generación
- 24/7 Disponible
- 100% Legal

**CTA:** "Empezar AHORA →"

#### 7. Pricing

**Headline:**
```
Empieza AHORA. Un precio. Todo incluido.
```

**Plan Único: PRO**
- **65€/mes**
- "Precio de lanzamiento · Cancela cuando quieras"
- Badge "Popular"

**Features:**
- Contratos ilimitados
- 97 plantillas legales verificadas
- Consultas legales 24/7 ilimitadas
- Canvas de edición en tiempo real
- Firmas digitales integradas
- Validez legal certificada
- Soporte prioritario
- Actualizaciones normativas automáticas

**Comparativa:**
```
300€ por contrato → 65€ Ilimitados/mes
```

**CTA:** "Empezar AHORA - Gratis 14 días"

#### 8. FAQ

**Preguntas clave:**

1. ¿Pero es REALMENTE legal si es tan rápido?
2. ¿Qué pasa si el cliente cuestiona el contrato?
3. ¿No pierdo control del contrato?
4. ¿Tengo que cambiar mi flujo de trabajo?
5. ¿Cómo funciona la prueba gratuita de 14 días?
6. ¿Los contratos son legalmente válidos?
7. ¿Puedo cancelar mi suscripción en cualquier momento?

#### 9. Footer

**Columnas:**
1. Producto (Cómo funciona, Precios, FAQ)
2. Recursos (Blog, Centro de ayuda, Contacto)
3. Legal (Términos, Privacidad, Cookies)
4. Social + Logo

**Copyright:** © 2026 LEXY Plus. Todos los derechos reservados.

---

## Componentes Implementados

### Core Components

#### 1. Button.tsx
```typescript
variants: 'primary' | 'secondary' | 'ghost'
sizes: 'sm' | 'md' | 'lg'
```

**Variantes:**
- `primary` - Emerald con gradient, sombras
- `secondary` - White con border
- `ghost` - Transparent hover

#### 2. Navigation.tsx
- Fixed con glassmorphism
- Mobile hamburger menu
- Scroll detection para backdrop-blur
- Links: Cómo funciona, Precios, FAQ

### Section Components

#### 3. Hero.tsx
- Background: Negro con gradient mesh
- Grid pattern overlay
- Animated gradient orbs
- Pill badge con pulsing dot
- Gradient text en headline
- Glassmorphic stats cards
- Dashboard image con hover scale

#### 4. SocialProof.tsx
- Cards con iconos SVG
- Hover effects: border, shadow, scale
- Grid 3 columnas responsivo
- Background gradient sutil

#### 5. ValueProposition.tsx
- Background con gradient orbs
- Cards con hover: scale, rotate, shadow
- Features en grid 3 columnas
- CTA box con gradient background

#### 6. HowItWorks.tsx
- Background gradient mesh oscuro
- Grid pattern sutil (32px)
- Alternating layout (imagen izq/derecha)
- Quote boxes con borde emerald
- Imágenes con hover overlay + scale

#### 7. TrustBadges.tsx
- Cards con gradient backgrounds
- Iconos en contenedores circulares
- Hover: scale, rotate, color
- Border stripe top/bottom

#### 8. UrgentCTA.tsx
- Multiple gradient layers
- Badge pill animado
- Glassmorphic stats cards
- Button con gradient + sombra dramática

#### 9. Pricing.tsx
- Card principal con badge "Popular"
- Gradient text en precio
- Features en grid 2 columnas
- Comparativa con círculo central icon

#### 10. FAQ.tsx
- Gradient mesh background
- Cards glassmórficos con backdrop-blur
- Chevron icon con background emerald
- Hover states mejorados

#### 11. Footer.tsx
- Background negro puro
- Grid 4 columnas + logo
- Links con hover emerald
- Grid pattern sutil

---

## Mejoras Recientes

### 2026-01-19: Visual Enhancement Sprint ✨

**Objetivo:** Mejorar diseño de "maso" a "increíble" con efectos modernos.

**Implementaciones:**

#### 1. Grid Pattern Global
- Añadido a TODAS las secciones (blancas y negras)
- Líneas negras sutiles en blanco (#00000008)
- Líneas blancas/grises en negro (#80808008)
- Tamaño consistente: 24px x 24px
- **Resultado:** Continuidad visual perfecta, transiciones fluidas

#### 2. Gradient Mesh Backgrounds
- Orbes con blur-3xl en cada sección
- Emerald/5 en fondos blancos
- Emerald/10-20 en fondos negros
- **Resultado:** Profundidad sin saturar

#### 3. Glassmorphism Effects
- Stats cards en Hero y UrgentCTA
- FAQ accordion items
- Overlays en imágenes
- **Resultado:** Modernidad y elegancia

#### 4. Enhanced Cards
- ValueProposition: hover con scale + rotate
- SocialProof: iconos con animación
- TrustBadges: efectos de profundidad
- Pricing: badge "Popular" + gradientes
- **Resultado:** Interactividad mejorada

#### 5. Gradient Text Strategic
- Headlines clave ("CRÍTICOS", "AHORA", "4 pasos")
- Precios y números destacados
- **Resultado:** Jerarquía visual clara

#### 6. Hover Interactions
- Transform: scale, rotate en iconos
- Shadow transitions en cards
- Border color shifts
- Image overlays + scale
- **Resultado:** Feedback visual rico

**User Feedback Incorporado:**

- ✅ "Muy separado" → Reducido spacing 40-50%
- ✅ "No tiene mucha relevancia" → Añadidos efectos visuales
- ✅ "Mola maso" → Mejorado con gradientes y glassmorphism
- ✅ "Grid pattern" → Extendido a toda la página para continuidad

**Métricas de Éxito:**
- Spacing reducido: py-32 → py-12, py-24 → py-16
- Visual depth: 5+ capas de efectos por sección
- Consistency: Grid pattern en 100% de secciones
- Performance: Animaciones < 0.35s

---

## Próximos Pasos

### Contenido
- [ ] Reemplazar placeholders de imágenes con screenshots reales
- [ ] Añadir logos de clientes en SocialProof
- [ ] Crear video demo para Hero
- [ ] Expandir casos de uso

### Marketing
- [ ] Setup email capture
- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] Launch Product Hunt

### Iteraciones de Diseño
- [ ] A/B testing de headlines
- [ ] Optimizar conversión de CTAs
- [ ] Test de color de botones
- [ ] Mejoras de micro-copy

---

**Documento Vivo** - Actualizado continuamente con cambios del proyecto.
