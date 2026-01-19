# RESTYLING.md - Lexy Visual Redesign
**Fecha**: 2026-01-19
**Objetivo**: Elevar confianza visual al nivel de Apple con verde esmeralda como diferenciador único

---

## 📊 Análisis Competitivo

### **Maite.ai** - Benchmark Principal

**Fortalezas identificadas:**
- ✅ Paleta turquesa/azul (#3A9FB6) transmite confianza legal profesional
- ✅ Tipografía distintiva: Plus Jakarta Sans + georgiapro crea jerarquía clara
- ✅ Social proof prominente: logos de clientes validados (entidades públicas)
- ✅ Casos de uso específicos: ejemplos conversacionales reales
- ✅ Microinteracciones: gradientes animados, transiciones suaves
- ✅ Espaciado generoso: 80px entre secciones, respiración visual
- ✅ Microcopy efectivo: "Ahorra horas, no minutos"
- ✅ Validación de expertise: "Mejor nota en test de acceso a judicatura"
- ✅ Estructura de conversión: CTA freemium sin fricción

**Oportunidades para Lexy:**
- Diferenciación cromática (ellos azul → nosotros verde esmeralda)
- Nicho ultra-específico (ellos legal genérico → nosotros inmobiliario)
- Firma digital integrada (ellos no lo tienen destacado)
- Precio disruptivo más visible (65€/mes ilimitado)

---

## 🔍 Diagnóstico Lexy Actual

### Problemas identificados:
❌ **Inconsistencia**: Hero dice "3 pasos" pero HowItWorks muestra 4
❌ **Tipografía genérica**: Manrope es común, falta carácter distintivo
❌ **Color problemático**: Naranja #FF6B35 no transmite confianza legal
❌ **Falta social proof**: Sin logos de clientes, testimonios o validación
❌ **Diseño seguro**: Limpio pero predecible, sin memorabilidad
❌ **Sin diferenciadores visuales**: Parece otra landing genérica SaaS
❌ **Poca jerarquía visual**: Todo tiene el mismo peso visual

### Fortalezas a potenciar:
✅ **Nicho ultra-específico**: Inmobiliario (vs legal genérico)
✅ **Firma digital integrada**: WhatsApp + validez legal
✅ **Canvas de edición**: Tiempo real, visual
✅ **Precio disruptivo**: 65€/mes ilimitado
✅ **4 pasos completos**: Desde consulta hasta firma

---

## 🎨 Visión de Diseño: **Apple-level Minimalism + Emerald Accent**

### Concepto Central
**"Sofisticación absoluta con propósito"**

- Inspiración: Apple.com, Linear.app, Arc Browser
- Principio: Cada pixel tiene un propósito. Nada es decorativo.
- Diferenciador: Verde esmeralda como ÚNICO acento de color
- Filosofía: Blanco infinito + negro profundo + verde quirúrgico

### Características distintivas:
1. **Minimalismo extremo**: Solo lo esencial
2. **Espaciado generoso**: Respiro visual masivo (96-128px entre secciones)
3. **Tipografía perfecta**: Inter variable con kerning impecable
4. **Color quirúrgico**: Verde esmeralda usado con extrema moderación
5. **Animaciones sutiles**: Fade, slide, scale (nada llamativo)
6. **Precisión matemática**: Grid de 8px, todo alineado perfectamente

---

## 🎯 Sistema de Diseño Técnico

### **Paleta de Color**

```css
/* Base - Apple-style purity */
--white: #FFFFFF;           /* Backgrounds principales */
--black: #000000;           /* Texto principal, bordes */
--gray-50: #F9FAFB;         /* Backgrounds alternos */
--gray-900: #111827;        /* Texto secundario */

/* Emerald Accent - Usado con moderación quirúrgica */
--emerald-600: #059669;     /* Primary CTA, hover states */
--emerald-700: #047857;     /* CTA hover */
--emerald-50: #ECFDF5;      /* Backgrounds sutiles */
--emerald-100: #D1FAE5;     /* Badges, highlights */

/* Semantic */
--text-primary: var(--black);
--text-secondary: var(--gray-900);
--bg-primary: var(--white);
--bg-secondary: var(--gray-50);
--accent: var(--emerald-600);
--accent-hover: var(--emerald-700);
--accent-subtle: var(--emerald-50);
```

**Reglas de uso del verde esmeralda:**
- ✅ CTAs principales (solo 1-2 por pantalla)
- ✅ Hover states en elementos interactivos
- ✅ Badges de estado ("Precio de lanzamiento")
- ✅ Underlines en links importantes
- ❌ NO usar en fondos grandes
- ❌ NO usar en tipografía de párrafos
- ❌ NO mezclar con otros colores de acento

### **Tipografía**

```css
/* Inter Variable - Sistema completo */
@import url('https://rsms.me/inter/inter.css');

--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Escala tipográfica - Perfecta jerarquía */
--text-xs: 0.75rem;      /* 12px - Metadata, legales */
--text-sm: 0.875rem;     /* 14px - Captions, secundarios */
--text-base: 1rem;       /* 16px - Body principal */
--text-lg: 1.125rem;     /* 18px - Body destacado */
--text-xl: 1.25rem;      /* 20px - Subtítulos */
--text-2xl: 1.5rem;      /* 24px - H3 */
--text-3xl: 1.875rem;    /* 30px - H2 */
--text-4xl: 2.25rem;     /* 36px - H2 destacado */
--text-5xl: 3rem;        /* 48px - H1 secundario */
--text-6xl: 3.75rem;     /* 60px - H1 principal */
--text-7xl: 4.5rem;      /* 72px - Hero */

/* Pesos tipográficos */
--font-normal: 400;      /* Body */
--font-medium: 500;      /* Destacados */
--font-semibold: 600;    /* Subtítulos */
--font-bold: 700;        /* Títulos */

/* Line heights */
--leading-tight: 1.2;    /* Headlines */
--leading-snug: 1.4;     /* Subtítulos */
--leading-normal: 1.6;   /* Body */
--leading-relaxed: 1.8;  /* Párrafos largos */

/* Letter spacing */
--tracking-tight: -0.02em;   /* Títulos grandes */
--tracking-normal: 0;        /* Body */
--tracking-wide: 0.02em;     /* Small caps, botones */
```

**Reglas tipográficas:**
- Headlines: Bold (700), tight leading (1.2), tracking tight (-0.02em)
- Body: Normal (400), normal leading (1.6)
- Botones: Medium (500), tracking wide (0.02em), uppercase
- Nunca más de 2 pesos en un mismo componente

### **Espaciado**

Sistema de 8px base. Todo es múltiplo de 8.

```css
--space-1: 0.5rem;    /* 8px */
--space-2: 1rem;      /* 16px */
--space-3: 1.5rem;    /* 24px */
--space-4: 2rem;      /* 32px */
--space-6: 3rem;      /* 48px */
--space-8: 4rem;      /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */
--space-20: 10rem;    /* 160px */
--space-24: 12rem;    /* 192px */
```

**Uso recomendado:**
- Entre secciones: `--space-16` o `--space-20` (128-160px)
- Dentro de secciones: `--space-12` (96px)
- Entre elementos relacionados: `--space-6` o `--space-8` (48-64px)
- Padding de componentes: `--space-4` o `--space-6` (32-48px)

### **Sombras**

Minimalistas, casi imperceptibles.

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05);

/* Emerald glow - Solo para CTAs en hover */
--shadow-emerald: 0 0 0 3px rgba(5, 150, 105, 0.1);
```

**Regla**: Las sombras son sutiles. Opacidad máxima 0.05.

### **Bordes**

```css
--border-width: 1px;
--border-color: rgba(0, 0, 0, 0.08);
--border-radius-sm: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
--border-radius-xl: 24px;
--border-radius-full: 9999px;
```

### **Animaciones**

Sutiles, rápidas, Apple-style.

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Keyframes permitidos */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

**Regla**: Solo fade, slide, scale. Nada rebota, nada gira.

---

## 🔧 Componentes a Rediseñar

### 1. **Navigation** - `components/Navigation.tsx`

**Estado actual**: Genérico, fondo blanco sólido
**Nuevo diseño**: Glassmorphism ultra-sutil

```tsx
// Especificaciones:
- Fondo: backdrop-blur-xl con bg-white/80
- Altura: 64px (--space-8)
- Logo: Negro puro, tipografía Inter Bold
- Links: text-sm, font-medium, text-gray-900, hover con emerald-600
- CTA: Botón emerald-600 con shadow-emerald al hover
- Sin border-bottom (usar box-shadow sutil)
- Sticky en scroll con shadow-md
```

**Elementos:**
- Logo "LEXY" (Inter Bold, tracking tight)
- Links: Cómo funciona · Precios · FAQ
- CTA: "Probar gratis" (emerald-600, rounded-full)

---

### 2. **Hero** - `components/sections/Hero.tsx`

**Problema actual**: Inconsistencia (dice "3 pasos"), naranja, layout genérico
**Nuevo diseño**: Minimalismo Apple, máximo impacto

```tsx
// Estructura:
<section className="min-h-screen flex items-center justify-center px-6 bg-white">
  <div className="max-w-5xl mx-auto text-center">

    {/* Overline - Nuevo */}
    <motion.p className="text-sm font-medium tracking-wide uppercase text-gray-900 mb-6">
      Asistente Legal IA · Especializado en Inmobiliario
    </motion.p>

    {/* Headline - Corregido a 4 pasos */}
    <motion.h1 className="text-7xl font-bold text-black leading-tight tracking-tight mb-8">
      De conversación a contrato firmado
      <br />
      <span className="text-emerald-600">en 4 pasos</span>
    </motion.h1>

    {/* Subheadline - Más conciso */}
    <motion.p className="text-xl text-gray-900 font-medium mb-12 max-w-2xl mx-auto">
      Genera contratos profesionales en 30 segundos.
      <br />
      Verificado por abogados inmobiliarios.
    </motion.p>

    {/* Pricing - Minimalista */}
    <motion.div className="inline-flex items-center gap-4 mb-12 text-lg">
      <span className="font-bold text-black">65€/mes</span>
      <span className="text-gray-900">·</span>
      <span className="text-gray-900">Contratos ilimitados</span>
      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
        Precio de lanzamiento
      </span>
    </motion.div>

    {/* CTA - Único, prominente */}
    <motion.div className="mb-20">
      <Button
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-emerald transition-all"
      >
        Construye tus primeros contratos gratis
      </Button>
      <p className="text-sm text-gray-900 mt-4">
        Sin tarjeta de crédito · 14 días de prueba
      </p>
    </motion.div>

    {/* Demo Visual - Más prominente */}
    <motion.div className="rounded-2xl overflow-hidden shadow-xl border border-black/5">
      <Image
        src="/images/dashboard.png"
        alt="LEXY Dashboard"
        width={1400}
        height={700}
        className="w-full h-auto"
        priority
      />
    </motion.div>

  </div>
</section>
```

**Animaciones:**
- Stagger: 0ms → 100ms → 200ms → 300ms → 400ms → 600ms
- Duración: 350ms
- Easing: ease-out
- Efectos: fadeIn + slideUp (20px)

**Métricas clave:**
- Espaciado entre secciones: 96px (--space-12)
- Max-width contenido: 80rem (1280px)
- Imagen: shadow-xl + border sutil

---

### 3. **SocialProof** - `components/sections/SocialProof.tsx` ⭐ **NUEVO**

**Rationale**: Maite.ai usa social proof efectivamente. Lexy necesita validación.

```tsx
// Estructura:
<section className="py-16 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">

    {/* Overline */}
    <p className="text-center text-sm font-medium tracking-wide uppercase text-gray-900 mb-12">
      Confían en Lexy
    </p>

    {/* Logos Grid - Placeholder por ahora */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-40">
      {/* Logos de agencias inmobiliarias en escala de grises */}
      {/* Por ahora usar placeholders, reemplazar con logos reales */}
    </div>

    {/* Stats - Impactantes */}
    <div className="grid md:grid-cols-3 gap-12 mt-20">
      <div className="text-center">
        <div className="text-5xl font-bold text-black mb-2">97</div>
        <div className="text-sm text-gray-900 font-medium">Plantillas legales verificadas</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-black mb-2">30s</div>
        <div className="text-sm text-gray-900 font-medium">De consulta a contrato listo</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-black mb-2">100%</div>
        <div className="text-sm text-gray-900 font-medium">Validez legal certificada</div>
      </div>
    </div>

  </div>
</section>
```

**Notas:**
- Logos: Escala de grises (filter: grayscale(1)), opacidad 40%
- Stats: Números bold, descripciones medium
- Background: gray-50 para contrastar con secciones blancas

---

### 4. **ValueProposition** - `components/sections/ValueProposition.tsx`

**Problema actual**: Layout simétrico 3 columnas, emojis, naranja
**Nuevo diseño**: Minimalista, iconos abstractos, jerarquía clara

```tsx
// Estructura:
<section className="py-24 px-6 bg-white">
  <div className="max-w-6xl mx-auto">

    {/* Headline */}
    <h2 className="text-5xl font-bold text-black text-center mb-20 leading-tight">
      Tu asistente legal completo,
      <br />
      no solo contratos
    </h2>

    {/* Features - Minimalista */}
    <div className="grid md:grid-cols-3 gap-16">

      {/* Feature 1 */}
      <div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Icono chat */}
          </svg>
        </div>
        <h3 className="text-xl font-bold text-black mb-3">
          Consultas legales 24/7
        </h3>
        <p className="text-sm font-medium text-emerald-600 mb-4">
          Respuestas verificadas por abogados
        </p>
        <p className="text-base text-gray-900 leading-relaxed">
          Pregunta cualquier duda inmobiliaria. IA entrenada por juristas expertos.
          Respuestas precisas al instante.
        </p>
      </div>

      {/* Feature 2 - Similar estructura */}
      {/* Feature 3 - Similar estructura */}

    </div>

    {/* Bottom CTA Statement */}
    <p className="text-2xl text-center text-black font-medium mt-20">
      De 300€ por contrato a{' '}
      <span className="text-emerald-600 font-bold">65€/mes ilimitado</span>
    </p>

  </div>
</section>
```

**Cambios clave:**
- ❌ Emojis → ✅ Iconos SVG minimalistas
- ❌ Barra naranja → ✅ Icono en contenedor emerald-50
- ❌ text-primary-600 → ✅ text-emerald-600
- Espaciado: gap-16 (64px) entre cards

---

### 5. **HowItWorks** - `components/sections/HowItWorks.tsx`

**Problema actual**: Naranja, layout predecible
**Nuevo diseño**: Alternating layout, numeración prominente

```tsx
// Estructura:
<section className="py-24 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">

    {/* Headline */}
    <h2 className="text-5xl font-bold text-black text-center mb-20 leading-tight">
      4 pasos. Desde la duda hasta
      <br />
      el contrato firmado.
    </h2>

    {/* Steps - Alternating */}
    <div className="space-y-32">

      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          } items-center gap-16`}
        >

          {/* Content */}
          <div className="flex-1">
            <div className="text-8xl font-bold text-emerald-600 mb-6 opacity-20">
              0{index + 1}
            </div>
            <h3 className="text-3xl font-bold text-black mb-4">
              {step.title}
            </h3>
            <p className="text-lg text-gray-900 font-medium mb-6 italic">
              "{step.description}"
            </p>
            <p className="text-base text-gray-900 leading-relaxed">
              {step.details}
            </p>
          </div>

          {/* Image */}
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-black/5">
              <Image
                src={step.image}
                alt={step.alt}
                width={700}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>
      ))}

    </div>

    {/* CTA */}
    <div className="text-center mt-24">
      <Button
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-emerald transition-all"
      >
        Probar gratis 14 días
      </Button>
    </div>

  </div>
</section>
```

**Cambios clave:**
- Numeración: text-8xl, emerald-600, opacity-20 (watermark style)
- Layout: Alternating (imagen izquierda/derecha)
- ❌ primary-500 → ✅ emerald-600
- Espaciado: space-y-32 (128px) entre steps

---

### 6. **TrustBadges** - `components/sections/TrustBadges.tsx` ⭐ **NUEVO**

**Rationale**: Maite.ai enfatiza "validación de expertise". Lexy necesita badges legales.

```tsx
// Estructura:
<section className="py-16 px-6 bg-white border-y border-black/5">
  <div className="max-w-4xl mx-auto">

    <div className="grid md:grid-cols-3 gap-8 text-center">

      {/* Badge 1 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Icono shield check */}
          </svg>
        </div>
        <p className="text-sm font-medium text-black">
          Verificado por abogados inmobiliarios
        </p>
      </div>

      {/* Badge 2 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Icono document check */}
          </svg>
        </div>
        <p className="text-sm font-medium text-black">
          Validez legal certificada
        </p>
      </div>

      {/* Badge 3 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Icono lock */}
          </svg>
        </div>
        <p className="text-sm font-medium text-black">
          Cumplimiento normativa vigente
        </p>
      </div>

    </div>

  </div>
</section>
```

**Notas:**
- Sección breve, impactante
- Bordes top/bottom sutiles
- Background blanco (entre gray-50 sections)

---

### 7. **Pricing** - `components/sections/Pricing.tsx`

**Problema actual**: Layout genérico
**Nuevo diseño**: Single plan destacado, comparativa clara

```tsx
// Estructura:
<section id="precios" className="py-24 px-6 bg-white">
  <div className="max-w-4xl mx-auto">

    {/* Headline */}
    <h2 className="text-5xl font-bold text-black text-center mb-6">
      Un precio. Todo incluido.
    </h2>
    <p className="text-xl text-gray-900 text-center mb-16">
      Sin sorpresas, sin límites, sin permanencia.
    </p>

    {/* Pricing Card - Single, prominente */}
    <div className="bg-gray-50 rounded-2xl p-12 border border-black/5 mb-16">

      <div className="text-center mb-12">
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-6xl font-bold text-black">65€</span>
          <span className="text-xl text-gray-900">/mes</span>
        </div>
        <p className="text-sm font-medium text-emerald-600 mb-8">
          Precio de lanzamiento · Cancela cuando quieras
        </p>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-full font-medium shadow-lg hover:shadow-emerald transition-all"
        >
          Empezar 14 días gratis
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              {/* Check icon */}
            </svg>
            <span className="text-base text-gray-900">{feature}</span>
          </div>
        ))}
      </div>

    </div>

    {/* Comparativa - Impactante */}
    <div className="text-center">
      <p className="text-sm font-medium text-gray-900 mb-4">
        VS. Método tradicional
      </p>
      <div className="inline-flex items-center gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-black mb-1">300€</div>
          <div className="text-sm text-gray-900">Por contrato</div>
        </div>
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Arrow right */}
        </svg>
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-600 mb-1">65€</div>
          <div className="text-sm text-emerald-600">Ilimitados/mes</div>
        </div>
      </div>
    </div>

  </div>
</section>

const features = [
  "Contratos ilimitados",
  "97 plantillas legales verificadas",
  "Consultas legales 24/7 ilimitadas",
  "Canvas de edición en tiempo real",
  "Firmas digitales integradas",
  "Validez legal certificada",
  "Soporte prioritario",
  "Actualizaciones normativas automáticas"
];
```

**Cambios clave:**
- Single card (no múltiples planes)
- Precio prominente: text-6xl
- Features con checkmarks emerald-600
- Comparativa visual vs método tradicional

---

### 8. **FAQ** - `components/sections/FAQ.tsx`

**Problema actual**: Layout estándar
**Nuevo diseño**: Minimalista, acordeón limpio

```tsx
// Estructura:
<section className="py-24 px-6 bg-gray-50">
  <div className="max-w-3xl mx-auto">

    {/* Headline */}
    <h2 className="text-4xl font-bold text-black text-center mb-16">
      Preguntas frecuentes
    </h2>

    {/* FAQs - Accordion */}
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 border border-black/5"
        >
          <button
            className="w-full flex items-center justify-between text-left"
            onClick={() => toggleFaq(index)}
          >
            <h3 className="text-lg font-semibold text-black pr-8">
              {faq.question}
            </h3>
            <svg
              className={`w-5 h-5 text-gray-900 flex-shrink-0 transition-transform ${
                openFaq === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Chevron down */}
            </svg>
          </button>

          {openFaq === index && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-base text-gray-900 leading-relaxed"
            >
              {faq.answer}
            </motion.div>
          )}
        </div>
      ))}
    </div>

  </div>
</section>
```

**Cambios clave:**
- Cards blancas sobre gray-50
- Bordes sutiles (border-black/5)
- Animación smooth de apertura
- Sin colores de acento (solo emerald si hay links)

---

### 9. **Footer** - `components/sections/Footer.tsx`

**Problema actual**: Genérico
**Nuevo diseño**: Minimalista Apple-style

```tsx
// Estructura:
<footer className="bg-black text-white py-16 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Top - Links */}
    <div className="grid md:grid-cols-4 gap-12 mb-12">

      {/* Producto */}
      <div>
        <h4 className="text-sm font-semibold mb-4 text-white/60">Producto</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Cómo funciona</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Precios</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Plantillas</a></li>
        </ul>
      </div>

      {/* Empresa */}
      <div>
        <h4 className="text-sm font-semibold mb-4 text-white/60">Empresa</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Sobre nosotros</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Blog</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Contacto</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="text-sm font-semibold mb-4 text-white/60">Legal</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Privacidad</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Términos</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Cookies</a></li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h4 className="text-sm font-semibold mb-4 text-white/60">Social</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Twitter</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">LinkedIn</a></li>
          <li><a href="#" className="text-sm text-white/80 hover:text-white transition">Instagram</a></li>
        </ul>
      </div>

    </div>

    {/* Bottom - Logo + Copyright */}
    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-xl font-bold text-white">LEXY</div>
      <div className="text-sm text-white/60">
        © 2026 LEXY. Todos los derechos reservados.
      </div>
    </div>

  </div>
</footer>
```

**Cambios clave:**
- Fondo negro puro (#000000)
- Texto: white con opacidades (60%, 80%, 100%)
- Sin emerald (footer es neutral)
- Tipografía pequeña, minimalista

---

### 10. **Button** - `components/Button.tsx`

**Problema actual**: Naranja, genérico
**Nuevo diseño**: Emerald, múltiples variantes

```tsx
// Variantes:
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

// Estilos base:
const baseStyles = 'inline-flex items-center justify-center font-medium transition-all rounded-full';

const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald',
  secondary: 'bg-white text-black border border-black/10 hover:border-black/20',
  ghost: 'bg-transparent text-black hover:bg-gray-50'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};
```

**Uso:**
```tsx
// CTA principal
<Button variant="primary" size="lg">Probar gratis</Button>

// CTA secundario
<Button variant="secondary" size="md">Saber más</Button>

// Link ghost
<Button variant="ghost" size="sm">Ver demo</Button>
```

---

## 📋 Orden de Implementación

### Fase 1: Fundaciones (2-3h)
1. ✅ Actualizar `globals.css` con nuevo sistema de diseño
2. ✅ Importar Inter font
3. ✅ Actualizar variables CSS (colores, tipografía, espaciado)
4. ✅ Actualizar componente `Button.tsx`

### Fase 2: Componentes Core (4-5h)
5. ✅ Rediseñar `Navigation.tsx`
6. ✅ Rediseñar `Hero.tsx` (corregir inconsistencia 3→4 pasos)
7. ✅ Crear `SocialProof.tsx` (nuevo)
8. ✅ Rediseñar `ValueProposition.tsx`

### Fase 3: Secciones Principales (4-5h)
9. ✅ Rediseñar `HowItWorks.tsx`
10. ✅ Crear `TrustBadges.tsx` (nuevo)
11. ✅ Rediseñar `Pricing.tsx`
12. ✅ Rediseñar `FAQ.tsx`

### Fase 4: Finalización (2h)
13. ✅ Rediseñar `Footer.tsx`
14. ✅ Testing responsive
15. ✅ Optimización animaciones
16. ✅ Accessibility audit

**Total estimado**: 12-15h de implementación

---

## 🎯 Métricas de Éxito

### Visuales:
- ✅ Paleta limitada a 5 colores (white, black, gray-50, emerald-600, emerald-50)
- ✅ Solo 1 familia tipográfica (Inter variable)
- ✅ Espaciado coherente (múltiplos de 8px)
- ✅ Sombras sutiles (opacidad ≤0.05)

### Contenido:
- ✅ Inconsistencia "3 pasos" corregida a "4 pasos"
- ✅ Social proof añadido (logos, stats, badges)
- ✅ Microcopy mejorado (inspirado en maite.ai)
- ✅ Propuesta de valor clara vs competencia

### Performance:
- ✅ Lighthouse score >95
- ✅ First Contentful Paint <1.5s
- ✅ No layout shifts (CLS <0.1)

### Conversión:
- ✅ CTAs destacados con emerald-600
- ✅ Precio prominente (65€/mes)
- ✅ Trial gratuito visible (14 días)
- ✅ Comparativa vs método tradicional

---

## 📦 Archivos a Modificar

### Modificar:
- `app/globals.css`
- `components/Button.tsx`
- `components/Navigation.tsx`
- `components/sections/Hero.tsx`
- `components/sections/ValueProposition.tsx`
- `components/sections/HowItWorks.tsx`
- `components/sections/Pricing.tsx`
- `components/sections/FAQ.tsx`
- `components/sections/Footer.tsx`

### Crear:
- `components/sections/SocialProof.tsx`
- `components/sections/TrustBadges.tsx`

### Actualizar estructura:
- `app/page.tsx` - Añadir nuevas secciones en orden correcto

---

## 🚀 Próximos Pasos

1. **Revisar y aprobar** este documento RESTYLING.md
2. **Crear git branch**: `git checkout -b feature/apple-restyling`
3. **Implementar Fase 1**: Sistema de diseño (globals.css, Button)
4. **Review parcial**: Validar colores/tipografía antes de continuar
5. **Implementar Fases 2-4**: Componentes
6. **Testing final**: Responsive, performance, accessibility
7. **Merge a main**: Después de QA completo

---

## 💡 Notas Finales

### Filosofía de diseño:
> "Cada pixel tiene un propósito. La sofisticación viene de la eliminación, no de la adición."

### Inspiración:
- Apple.com - Minimalismo extremo
- Linear.app - Tipografía impecable
- Arc Browser - Detalles sutiles pero memorables

### Diferenciador único:
El verde esmeralda no es solo un color de acento. Es nuestra firma visual que conecta con el sector inmobiliario (propiedad, inversión, crecimiento) y nos diferencia de la competencia legal-tech que usa azules genéricos.

---

**Documento creado**: 2026-01-19
**Versión**: 1.0
**Status**: Pendiente de implementación
