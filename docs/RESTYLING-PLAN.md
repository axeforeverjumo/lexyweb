# Plan de Restyling: lexyapp → lexyweb Design

**Fecha**: 2026-01-20
**Objetivo**: Alinear el diseño de lexyapp con el diseño moderno y potente de lexyweb
**Estado**: Planificación inicial

---

## 📊 Análisis de Brecha Actual

### lexyweb (Landing Page) - Estado Deseado

✅ **Fortalezas del diseño:**
- Grid pattern unificador en toda la interfaz
- Glassmorphism moderno (navigation, stats cards)
- Gradientes estratégicos (texto, botones, fondos)
- Hover effects sofisticados
- Tipografía Inter con pesos correctos
- Color emerald (#059669) como identidad única
- Alternancia blanco/negro con transiciones fluidas
- Framer Motion para animaciones sutiles
- Profundidad visual con gradient orbs
- Minimalismo refinado sin ser vacío

### lexyapp (Aplicación) - Estado Actual

⚠️ **Áreas a mejorar:**
- [ ] No tiene grid pattern de fondo
- [ ] Falta glassmorphism en componentes clave
- [ ] Gradientes limitados o inexistentes
- [ ] Hover effects básicos
- [ ] Color primary genérico (necesita ser emerald)
- [ ] Falta profundidad visual
- [ ] Transiciones menos fluidas
- [ ] Sin gradient text en headlines
- [ ] Efectos visuales menos impactantes

---

## 🎯 Objetivos del Restyling

### 1. Identidad Visual Unificada
- **Color único**: Emerald (#059669) en toda la app
- **Grid pattern**: Fondo unificador en todas las páginas
- **Tipografía**: Inter Variable Font consistente

### 2. Modernización Visual
- **Glassmorphism**: Navigation, sidebars, modals
- **Gradient effects**: Texto, botones, fondos
- **Depth layers**: Gradient orbs, sombras sutiles
- **Hover interactions**: Feedback visual rico

### 3. Experiencia de Usuario
- **Transiciones fluidas**: 300ms duration estándar
- **Feedback inmediato**: Hover states claros
- **Jerarquía visual**: Headlines con gradient, pesos correctos
- **Respirabilidad**: Espaciado compacto pero respirable (py-12)

---

## 📦 Fases de Implementación

### Fase 1: Fundamentos (Prioridad Alta)

**Objetivo**: Establecer base visual moderna

#### 1.1 Sistema de Diseño Base
```bash
# Tareas
- [ ] Actualizar globals.css con design tokens de lexyweb
- [ ] Importar Inter Variable Font
- [ ] Configurar theme de Tailwind con emerald palette
- [ ] Definir custom utilities (grid-pattern, glassmorphism)
```

**Archivos afectados:**
- `src/app/globals.css`
- `tailwind.config.ts`

**Tiempo estimado:** 2-3 horas

#### 1.2 Componentes Base UI
```bash
# Crear nuevos componentes
- [ ] src/components/ui/Button.tsx - Variantes emerald
- [ ] src/components/ui/Card.tsx - Con hover effects
- [ ] src/components/ui/Badge.tsx - Pills y badges
- [ ] src/components/ui/Section.tsx - Wrapper con grid pattern
```

**Tiempo estimado:** 3-4 horas

---

### Fase 2: Componentes Principales (Prioridad Alta)

**Objetivo**: Actualizar componentes más visibles

#### 2.1 Navigation & Layout
```bash
- [ ] BackToDashboard.tsx - Glassmorphism effect
- [ ] ConversationsSidebar.tsx - Grid pattern + emerald accents
- [ ] Dashboard header - Gradient text en títulos
```

**Archivos:**
- `src/components/layout/BackToDashboard.tsx`
- `src/components/abogado/ConversationsSidebar.tsx`
- `src/app/(dashboard)/abogado/page.tsx`

**Tiempo estimado:** 4-5 horas

#### 2.2 Dashboard Principal
```bash
- [ ] Aplicar grid pattern de fondo
- [ ] Cards de conversaciones con hover effects
- [ ] Botones con variante emerald
- [ ] Stats con glassmorphism
```

**Archivos:**
- `src/app/(dashboard)/abogado/page.tsx`
- `src/components/abogado/ConversationsList.tsx`

**Tiempo estimado:** 4-5 horas

---

### Fase 3: Páginas de Contrato (Prioridad Media)

**Objetivo**: Modernizar experiencia de contratos

#### 3.1 Vista de Contrato Individual
```bash
- [ ] Header con gradient text
- [ ] Canvas editor con glassmorphism toolbar
- [ ] Botones de acción con hover effects
- [ ] Grid pattern de fondo
```

**Archivos:**
- `src/components/contratos/ContractCanvas.tsx`
- `src/components/contratos/ContractPreview.tsx`

**Tiempo estimado:** 5-6 horas

#### 3.2 Lista de Contratos
```bash
- [ ] Cards con hover: scale + shadow
- [ ] Badges con color emerald
- [ ] Transiciones fluidas
```

**Archivos:**
- `src/components/abogado/ConversationContractsSidebar.tsx`

**Tiempo estimado:** 3-4 horas

---

### Fase 4: Detalles y Pulido (Prioridad Baja)

**Objetivo**: Perfeccionar experiencia completa

#### 4.1 Animaciones
```bash
- [ ] Instalar framer-motion si no está
- [ ] Fade in en montaje de componentes
- [ ] Stagger animations en listas
- [ ] Hover animations en iconos
```

**Tiempo estimado:** 4-5 horas

#### 4.2 Estados y Feedback
```bash
- [ ] Loading states glassmórficos
- [ ] Toasts con emerald accent
- [ ] Modals con backdrop-blur
- [ ] Empty states con gradient text
```

**Tiempo estimado:** 3-4 horas

---

## 🛠️ Guía de Implementación Técnica

### Actualizar globals.css

```css
/* src/app/globals.css */

/* 1. Importar Inter Variable Font */
@import url('https://rsms.me/inter/inter.css');
@import "tailwindcss";

/* 2. Definir theme tokens */
@theme {
  /* Font family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  /* Emerald palette completo */
  --color-emerald-50: #ECFDF5;
  --color-emerald-100: #D1FAE5;
  --color-emerald-400: #34D399;
  --color-emerald-500: #10B981;
  --color-emerald-600: #059669;
  --color-emerald-700: #047857;

  /* Alias primary = emerald */
  --color-primary-400: var(--color-emerald-400);
  --color-primary-500: var(--color-emerald-500);
  --color-primary-600: var(--color-emerald-600);
  --color-primary-700: var(--color-emerald-700);

  /* Gray scale */
  --color-gray-50: #F9FAFB;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* Shadows con emerald */
  --shadow-emerald: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

/* 3. Font features para Inter */
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

/* 4. Utilities personalizadas */
.text-balance {
  text-wrap: balance;
}

.grid-pattern-white {
  @apply bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px];
}

.grid-pattern-black {
  @apply bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px];
}

.glassmorphic {
  @apply bg-white/80 backdrop-blur-xl;
}

.glassmorphic-dark {
  @apply bg-white/5 backdrop-blur-sm border border-white/10;
}
```

### Crear Button Component

```tsx
// src/components/ui/Button.tsx
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
}

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
```

### Crear Section Wrapper

```tsx
// src/components/ui/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  variant?: 'white' | 'black';
  withPattern?: boolean;
  className?: string;
}

export function Section({
  children,
  variant = 'white',
  withPattern = true,
  className = ''
}: SectionProps) {
  const bgColor = variant === 'white' ? 'bg-white' : 'bg-black';
  const textColor = variant === 'white' ? 'text-black' : 'text-white';
  const gridPattern = variant === 'white'
    ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]'
    : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]';

  return (
    <section className={`relative ${bgColor} ${textColor} ${className}`}>
      {withPattern && (
        <div className={`absolute inset-0 ${gridPattern}`} />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
```

### Actualizar Componente Existente (Ejemplo)

```tsx
// ANTES - src/components/layout/BackToDashboard.tsx
export function BackToDashboard() {
  return (
    <button className="fixed top-4 left-4 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg">
      <HomeIcon className="w-5 h-5" />
    </button>
  );
}

// DESPUÉS
export function BackToDashboard() {
  return (
    <button className="fixed top-4 left-4 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300 hover:scale-105">
      <HomeIcon className="w-5 h-5" />
    </button>
  );
}
```

---

## 📝 Checklist de Implementación Completa

### Setup Inicial
- [ ] Crear carpeta DOCS/
- [ ] Documentar sistema de diseño (DESIGN-SYSTEM.md)
- [ ] Crear plan de restyling (RESTYLING-PLAN.md)

### Fase 1: Fundamentos
- [ ] Actualizar globals.css con tokens
- [ ] Importar Inter Variable Font
- [ ] Configurar theme Tailwind (emerald palette)
- [ ] Crear utilities (grid-pattern, glassmorphism)
- [ ] Crear Button.tsx
- [ ] Crear Card.tsx
- [ ] Crear Badge.tsx
- [ ] Crear Section.tsx

### Fase 2: Componentes Principales
- [ ] Actualizar BackToDashboard.tsx
- [ ] Actualizar ConversationsSidebar.tsx
- [ ] Aplicar grid pattern en Dashboard
- [ ] Actualizar ConversationsList con hover effects
- [ ] Modernizar botones (emerald + shadows)

### Fase 3: Páginas de Contrato
- [ ] Actualizar ContractCanvas.tsx
- [ ] Actualizar ContractPreview.tsx
- [ ] Modernizar ConversationContractsSidebar.tsx
- [ ] Añadir gradient text en headers

### Fase 4: Detalles y Pulido
- [ ] Instalar/verificar framer-motion
- [ ] Añadir fade-in animations
- [ ] Implementar stagger en listas
- [ ] Modernizar loading states
- [ ] Actualizar toast notifications
- [ ] Glassmorphism en modals

### Testing y QA
- [ ] Verificar responsive design
- [ ] Test de hover effects en touch devices
- [ ] Verificar contraste de accesibilidad
- [ ] Test de performance (animations)
- [ ] Validar cross-browser compatibility

---

## 🎨 Ejemplos Visuales de Transformación

### Dashboard Header

**ANTES:**
```tsx
<div className="flex items-center justify-between p-4 bg-white border-b">
  <h1 className="text-2xl font-bold">Dashboard</h1>
  <button className="bg-primary-600 text-white px-4 py-2 rounded">
    Nueva Conversación
  </button>
</div>
```

**DESPUÉS:**
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
  <div className="relative z-10 flex items-center justify-between p-6">
    <h1 className="text-3xl font-bold tracking-tight">
      Dash<span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">board</span>
    </h1>
    <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 py-3 rounded-full font-medium shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-300">
      Nueva Conversación →
    </button>
  </div>
</div>
```

### Conversation Card

**ANTES:**
```tsx
<div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
  <h3 className="font-semibold">{title}</h3>
  <p className="text-sm text-gray-600">{preview}</p>
</div>
```

**DESPUÉS:**
```tsx
<div className="group relative p-6 border border-gray-200 rounded-xl hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-105 transition-all duration-300 cursor-pointer bg-white">
  {/* Grid pattern sutil */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:16px_16px] rounded-xl" />

  <div className="relative z-10">
    <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed">{preview}</p>
  </div>
</div>
```

---

## 🚀 Próximos Pasos

### Inmediato (Esta Semana)
1. ✅ Crear carpeta DOCS y documentación
2. ⏳ Fase 1: Fundamentos (globals.css + componentes base)
3. ⏳ Fase 2: Actualizar Dashboard y Navigation

### Corto Plazo (Próxima Semana)
4. ⏳ Fase 3: Páginas de contratos
5. ⏳ Testing inicial y ajustes

### Medio Plazo (2 Semanas)
6. ⏳ Fase 4: Detalles y pulido
7. ⏳ Testing completo y QA
8. ⏳ Deploy a producción

---

## 📚 Referencias

- **lexyweb**: `~/Documents/develop/Desarrollos internos/lexyweb`
- **DESIGN-SYSTEM.md**: Sistema de diseño completo
- **PROYECTO.md (lexyweb)**: Documentación original del diseño

---

**Documento Vivo** - Actualizar según progrese la implementación.
