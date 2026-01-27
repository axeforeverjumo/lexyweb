# Sistema de Diseño LEXY - Guía de Implementación

**Última actualización**: 2026-01-20
**Fuente**: Análisis de lexyweb (Landing Page)
**Objetivo**: Replicar el diseño moderno y potente de lexyweb en lexyapp

---

## 📋 Índice

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Sistema de Color](#sistema-de-color)
3. [Tipografía](#tipografía)
4. [Espaciado y Layout](#espaciado-y-layout)
5. [Efectos Visuales Modernos](#efectos-visuales-modernos)
6. [Componentes Base](#componentes-base)
7. [Patrones de Diseño](#patrones-de-diseño)
8. [Implementación en lexyapp](#implementación-en-lexyapp)

---

## Filosofía de Diseño

### Concepto: "Modern Minimalism with Impact"

El diseño de LEXY combina:

1. **Minimalismo refinado** - Limpio pero no vacío
2. **Urgencia controlada** - Dramático pero profesional
3. **Profundidad visual** - Capas de gradientes y efectos
4. **Continuidad** - Grid pattern unificador en toda la interfaz

### Inspiración de Referencia

- **Apple.com** - Minimalismo extremo, espaciado generoso
- **Linear.app** - Tipografía impecable, animaciones sutiles
- **HubSpot** - Alternancia blanco/negro, secciones bien definidas
- **Arc Browser** - Detalles sutiles pero memorables

---

## Sistema de Color

### Paleta Principal

```css
/* Base Colors - Fundación pura */
--white: #FFFFFF;
--black: #000000;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;
--gray-950: #030712;

/* Emerald Accent - Identidad única de LEXY */
--emerald-50: #ECFDF5;   /* Backgrounds sutiles */
--emerald-100: #D1FAE5;  /* Badges, pills */
--emerald-400: #34D399;  /* Gradientes, highlights */
--emerald-500: #10B981;  /* Accents secundarios */
--emerald-600: #059669;  /* Primary CTA, main accent */
--emerald-700: #047857;  /* Hover states */
```

### Reglas de Uso del Verde Esmeralda

#### ✅ USAR en:
- CTAs principales (1-2 por sección)
- Gradientes en texto destacado
- Hover states de elementos interactivos
- Badges y pills de estado
- Iconos en contenedores
- Bordes de elementos importantes

#### ❌ NO USAR en:
- Fondos grandes (mantener blanco/negro/gris)
- Saturar la página (usar con moderación)
- Texto de lectura continua (solo para highlights)

### Ejemplos de Aplicación

```tsx
// CTA Principal
className="bg-emerald-600 hover:bg-emerald-700 text-white"

// Gradient Text (para máximo impacto)
className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text"

// Badge/Pill
className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"

// Hover Effect
className="hover:border-emerald-500/30 hover:shadow-emerald-500/10"
```

---

## Tipografía

### Familia Tipográfica

**Inter Variable Font** - Profesional, moderna, excelente legibilidad

```css
@import url('https://rsms.me/inter/inter.css');

font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

### Escala Tipográfica

```css
/* Escala perfecta para jerarquía */
--text-xs: 0.75rem;      /* 12px - Labels, hints */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Subheadlines */
--text-xl: 1.25rem;      /* 20px - Card titles */
--text-2xl: 1.5rem;      /* 24px - Section subtitles */
--text-3xl: 1.875rem;    /* 30px - Section titles */
--text-4xl: 2.25rem;     /* 36px - Page titles */
--text-5xl: 3rem;        /* 48px - Hero titles */
--text-6xl: 3.75rem;     /* 60px - Hero headlines */
--text-7xl: 4.5rem;      /* 72px - Maximum impact */
```

### Pesos Tipográficos

```css
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Emphasis, buttons */
--font-semibold: 600;    /* Subtitles, labels */
--font-bold: 700;        /* Headlines, CTAs */
```

### Reglas Tipográficas

```tsx
// Headlines - Impacto máximo
className="text-6xl font-bold leading-tight tracking-tight"

// Body Text - Legibilidad
className="text-base font-normal leading-relaxed"

// Botones - Claridad
className="text-sm font-medium tracking-wide"

// Gradient Text - Énfasis extremo
className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text"
```

---

## Espaciado y Layout

### Sistema de Espaciado Base 8px

**Filosofía**: Compacto pero respirable

```css
/* Espaciado Moderno (Reducido vs versiones anteriores) */
--space-2: 0.5rem;    /* 8px - Entre elementos pequeños */
--space-3: 0.75rem;   /* 12px - Padding interno pequeño */
--space-4: 1rem;      /* 16px - Gap estándar */
--space-6: 1.5rem;    /* 24px - Padding componentes */
--space-8: 2rem;      /* 32px - Dentro de secciones */
--space-10: 2.5rem;   /* 40px - Entre grupos */
--space-12: 3rem;     /* 48px - Entre secciones */
--space-16: 4rem;     /* 64px - Separación grande */
```

### Uso Práctico

```tsx
// Entre secciones principales
className="py-12"  // 48px vertical

// Dentro de secciones
className="py-8"   // 32px vertical

// Entre elementos
className="gap-6"  // 24px gap

// Padding de componentes
className="p-6"    // 24px padding

// Contenedor máximo
className="max-w-7xl mx-auto px-6"
```

---

## Efectos Visuales Modernos

### 1. Grid Pattern (Elemento Unificador) ✨

El grid pattern corre por TODA la interfaz, conectando secciones:

```tsx
// Para fondos BLANCOS
<div className="bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]">
  {/* Contenido */}
</div>

// Para fondos NEGROS/OSCUROS
<div className="bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
  {/* Contenido */}
</div>
```

**Beneficios:**
- Continuidad visual entre secciones
- Transición fluida blanco ↔ negro
- Textura sutil profesional
- Identidad unificada

### 2. Gradient Mesh Backgrounds

Capas de gradientes con blur para crear profundidad:

```tsx
// Ejemplo en Hero Section
<section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900">
  {/* Animated gradient orbs */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

  {/* Grid pattern overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

  <div className="relative z-10">
    {/* Contenido por encima */}
  </div>
</section>
```

**Uso:**
- Fondos blancos: `emerald/5` (muy sutil)
- Fondos negros: `emerald/10` o `emerald/20` (más visible)

### 3. Glassmorphism

Efectos de cristal con backdrop-blur:

```tsx
// Card glassmórfico
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
  <div className="text-2xl font-bold text-emerald-400">100%</div>
  <div className="text-sm text-gray-400">Legal</div>
</div>

// Navigation glassmórfica
<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl shadow-md">
  {/* Contenido */}
</nav>
```

**Aplicado en:**
- Navigation bar (scroll detection)
- Stats cards
- Overlays sobre imágenes
- Cards en fondos oscuros

### 4. Gradient Text

Texto con gradiente para máximo impacto:

```tsx
// Gradient en headline
<h1>
  Tu próxima operación urgente está a{' '}
  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
    30 segundos
  </span>
</h1>

// Gradient en número
<div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
  65€
</div>
```

**Usar en:**
- Keywords clave en headlines
- Números destacados
- CTAs especiales
- Títulos de secciones críticas

### 5. Hover Effects

Transiciones sutiles pero notables:

```tsx
// Card con hover effect completo
<div className="group border rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:rotate-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10">
  {/* Contenido */}
</div>

// Imagen con overlay hover
<div className="relative group">
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  <img className="transform group-hover:scale-105 transition-transform duration-500" />
</div>

// Botón con gradient hover
<button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40">
  {/* Contenido */}
</button>
```

---

## Componentes Base

### Button Component

```tsx
// Variantes principales
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Primary - CTA principal
<Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)]">
  Empezar AHORA →
</Button>

// Primary con gradient - Máximo impacto
<Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-2xl shadow-emerald-600/30">
  Acción Importante
</Button>

// Secondary - Acción secundaria
<Button className="bg-white text-black border border-black/10 hover:border-black/20 hover:bg-gray-50">
  Aprender más
</Button>

// Ghost - Acción terciaria
<Button className="bg-transparent text-black hover:bg-gray-50">
  Cancelar
</Button>
```

### Navigation Component

```tsx
// Navigation glassmórfica con scroll detection
<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-md' : 'bg-transparent'
}`}>
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="text-2xl font-bold text-black tracking-tight">
      LEXY
    </Link>

    {/* Links */}
    <div className="flex items-center space-x-8">
      <Link className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors">
        Dashboard
      </Link>
      {/* ... */}
    </div>

    {/* CTA */}
    <Button size="sm">Probar gratis</Button>
  </div>
</nav>
```

### Card Component

```tsx
// Card básico con hover
<div className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-105">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-emerald-600" />
    </div>
    <h3 className="text-xl font-semibold">Título</h3>
  </div>
  <p className="text-gray-600">Descripción...</p>
</div>

// Card glassmórfico (sobre fondo oscuro)
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
  <div className="text-2xl font-bold text-emerald-400">30s</div>
  <div className="text-sm text-gray-400">Generación</div>
</div>
```

### Badge/Pill Component

```tsx
// Badge con pulsing dot
<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
  <span className="text-xs font-medium text-emerald-400">
    Disponible 24/7
  </span>
</div>

// Badge simple
<div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
  Popular
</div>
```

---

## Patrones de Diseño

### Hero Section Pattern

```tsx
<section className="relative flex items-center justify-center px-6 pt-24 pb-12 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">

  {/* Gradient orbs */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

  <div className="max-w-5xl mx-auto text-center relative z-10">

    {/* Pill badge */}
    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      <span className="text-xs font-medium text-emerald-400">Estado/Info</span>
    </div>

    {/* Headline con gradient */}
    <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
      Headline principal
      <br />
      con <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">palabras clave</span>
    </h1>

    {/* Subheadline */}
    <p className="text-lg md:text-xl text-gray-400 font-medium mb-8 max-w-3xl mx-auto">
      Descripción clara del valor
    </p>

    {/* CTA */}
    <Button size="lg" className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-2xl shadow-emerald-600/30">
      Acción Principal →
    </Button>

    {/* Stats glassmórficos */}
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-10">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
        <div className="text-2xl font-bold text-emerald-400">30s</div>
        <div className="text-xs text-gray-400">Label</div>
      </div>
      {/* Repetir */}
    </div>

  </div>
</section>
```

### Content Section Pattern

```tsx
<section className="relative py-12 bg-white overflow-hidden">

  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

  {/* Gradient orbs opcionales */}
  <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">

    {/* Section header */}
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold text-black mb-4">
        Título de sección
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Descripción de la sección
      </p>
    </div>

    {/* Content grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cards aquí */}
    </div>

  </div>
</section>
```

### Alternating Sections Pattern

```tsx
// Patrón de alternancia: Negro → Blanco → Negro
// Grid pattern en TODAS para continuidad visual

// Sección 1 - Negro
<section className="py-12 bg-black">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
  {/* Contenido */}
</section>

// Sección 2 - Blanco
<section className="py-12 bg-white">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
  {/* Contenido */}
</section>

// Sección 3 - Negro
<section className="py-12 bg-black">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
  {/* Contenido */}
</section>
```

---

## Implementación en lexyapp

### 1. Actualizar globals.css

```css
/* Añadir al inicio de src/app/globals.css */
@import url('https://rsms.me/inter/inter.css');
@import "tailwindcss";

@theme {
  /* Copiar todo el sistema de design tokens de lexyweb */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  /* Emerald palette completo */
  --color-emerald-50: #ECFDF5;
  --color-emerald-400: #34D399;
  --color-emerald-600: #059669;
  --color-emerald-700: #047857;

  /* ... resto de tokens */
}

/* Font features para Inter */
html {
  scroll-behavior: smooth;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

body {
  @apply bg-white text-black antialiased;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 2. Crear Componentes Base

```bash
# Estructura sugerida
src/components/ui/
├── Button.tsx           # Sistema de botones
├── Card.tsx             # Cards con hover effects
├── Badge.tsx            # Badges y pills
├── Navigation.tsx       # Nav glassmórfica
└── Section.tsx          # Section wrapper con grid pattern
```

### 3. Actualizar Componentes Existentes

**Prioridad Alta:**

1. **Dashboard**: Aplicar grid pattern de fondo
2. **Sidebar**: Glassmorphism effect
3. **Botones**: Usar variante emerald con hover effects
4. **Cards de contratos**: Hover effects modernos
5. **Headers**: Tipografía bold con gradient text en keywords

**Ejemplo - Actualizar BackToDashboard.tsx:**

```tsx
// ANTES
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  <HomeIcon />
</button>

// DESPUÉS
<button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300">
  <HomeIcon className="w-5 h-5" />
</button>
```

### 4. Aplicar Grid Pattern Globalmente

**Opción A: Layout wrapper**

```tsx
// src/components/layout/PageWrapper.tsx
export function PageWrapper({ children, variant = 'white' }: Props) {
  const gridPattern = variant === 'white'
    ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]'
    : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]';

  return (
    <div className={`relative min-h-screen ${variant === 'white' ? 'bg-white' : 'bg-black'}`}>
      <div className={`absolute inset-0 ${gridPattern}`} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
```

**Opción B: En cada página**

```tsx
// src/app/(dashboard)/abogado/page.tsx
<main className="relative min-h-screen bg-white">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
  <div className="relative z-10">
    {/* Contenido */}
  </div>
</main>
```

### 5. Checklist de Implementación

- [ ] Actualizar globals.css con design tokens
- [ ] Crear componentes base (Button, Card, Badge)
- [ ] Aplicar grid pattern en páginas principales
- [ ] Actualizar paleta de colores: primary → emerald
- [ ] Implementar glassmorphism en navigation
- [ ] Añadir hover effects en cards interactivas
- [ ] Usar gradient text en headlines clave
- [ ] Implementar gradient orbs en hero sections
- [ ] Actualizar tipografía a Inter Variable Font
- [ ] Añadir animaciones Framer Motion en secciones críticas

---

## Recursos Adicionales

### Tailwind CSS Utilities Clave

```tsx
// Grid Pattern
bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]

// Glassmorphism
bg-white/80 backdrop-blur-xl

// Gradient Text
bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text

// Hover Scale
hover:scale-105 transition-transform duration-300

// Shadow Emerald
hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)]
```

### Framer Motion Patterns

```tsx
import { motion } from 'framer-motion';

// Fade in + slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
>
  {children}
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

**Documento Vivo** - Actualizar según evolucione la implementación en lexyapp.
