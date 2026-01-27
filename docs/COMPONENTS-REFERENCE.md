# Referencia Rápida de Componentes - LEXY Design

**Fecha**: 2026-01-20
**Propósito**: Código copiable listo para usar basado en lexyweb

---

## 📦 Índice

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Badges & Pills](#badges--pills)
4. [Sections](#sections)
5. [Navigation](#navigation)
6. [Effects](#effects)
7. [Animations](#animations)
8. [Layouts](#layouts)

---

## Buttons

### Primary Button

```tsx
<button className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300">
  Acción Principal
</button>
```

### Gradient Button (Máximo impacto)

```tsx
<button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium text-lg rounded-full shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-300">
  Empezar AHORA →
</button>
```

### Secondary Button

```tsx
<button className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-black font-medium rounded-full border border-black/10 hover:border-black/20 transition-all duration-300">
  Acción Secundaria
</button>
```

### Ghost Button

```tsx
<button className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-gray-50 text-black font-medium rounded-full transition-all duration-300">
  Cancelar
</button>
```

### Icon Button

```tsx
<button className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] hover:scale-105 transition-all duration-300">
  <HomeIcon className="w-5 h-5" />
</button>
```

---

## Cards

### Basic Card con Hover

```tsx
<div className="group relative bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-105 cursor-pointer">
  {/* Grid pattern sutil en hover */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:16px_16px] rounded-xl" />

  <div className="relative z-10">
    <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
      Título del Card
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Descripción del contenido
    </p>
  </div>
</div>
```

### Feature Card con Icono

```tsx
<div className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-105">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
      <Icon className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="text-xl font-semibold">Feature Title</h3>
  </div>
  <p className="text-gray-600 leading-relaxed">
    Descripción de la característica
  </p>
</div>
```

### Stats Card Glassmórfico (Fondo oscuro)

```tsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
  <div className="text-3xl font-bold text-emerald-400 mb-1">30s</div>
  <div className="text-sm text-gray-400">Generación</div>
</div>
```

### Conversation Card

```tsx
<div className="group relative p-4 border border-gray-200 rounded-lg hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer">
  <div className="flex items-start justify-between mb-2">
    <h3 className="font-semibold text-base group-hover:text-emerald-600 transition-colors">
      {conversationTitle}
    </h3>
    <span className="text-xs text-gray-500">{timestamp}</span>
  </div>
  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
    {preview}
  </p>

  {/* Badge opcional */}
  <div className="mt-3 flex items-center gap-2">
    <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
      {badgeText}
    </span>
  </div>
</div>
```

---

## Badges & Pills

### Badge Simple

```tsx
<span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
  Popular
</span>
```

### Pill con Pulsing Dot

```tsx
<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
  <span className="text-xs font-medium text-emerald-400">
    Disponible 24/7
  </span>
</div>
```

### Status Badge

```tsx
{/* Success */}
<span className="inline-flex items-center px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
  Completado
</span>

{/* Warning */}
<span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
  Pendiente
</span>

{/* Error */}
<span className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
  Error
</span>
```

---

## Sections

### Section Wrapper con Grid Pattern

```tsx
<section className="relative py-12 bg-white overflow-hidden">
  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

  {/* Gradient orb opcional */}
  <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    {/* Contenido */}
  </div>
</section>
```

### Section con Fondo Negro

```tsx
<section className="relative py-12 bg-black text-white overflow-hidden">
  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

  {/* Gradient orbs */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    {/* Contenido */}
  </div>
</section>
```

### Hero Section

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
      <span className="text-xs font-medium text-emerald-400">Estado Activo</span>
    </div>

    {/* Headline con gradient */}
    <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
      Headline Principal
      <br />
      con <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">palabras clave</span>
    </h1>

    {/* Subheadline */}
    <p className="text-lg md:text-xl text-gray-400 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
      Descripción clara del valor. <span className="font-bold text-white">Énfasis</span> en palabras clave.
    </p>

    {/* CTA */}
    <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium text-lg rounded-full shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-300">
      Acción Principal →
    </button>

  </div>
</section>
```

---

## Navigation

### Glassmorphic Navigation con Scroll Detection

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navigation() {
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
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-md' : 'bg-transparent'
      }`}
    >
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
          <Link className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors">
            Contratos
          </Link>
        </div>

        {/* CTA */}
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all duration-300">
          Nueva Conversación
        </button>
      </div>
    </nav>
  );
}
```

### Sidebar con Grid Pattern

```tsx
<aside className="relative w-80 bg-white border-r border-gray-200 overflow-hidden">
  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

  <div className="relative z-10 p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Conversaciones</h2>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>

    {/* Content */}
    <div className="space-y-2">
      {/* Items aquí */}
    </div>
  </div>
</aside>
```

---

## Effects

### Gradient Text

```tsx
<h1 className="text-5xl font-bold">
  Texto normal con{' '}
  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
    gradient
  </span>
</h1>
```

### Gradient Background

```tsx
<div className="bg-gradient-to-br from-gray-950 via-black to-gray-900">
  {/* Contenido */}
</div>
```

### Gradient Orbs

```tsx
<div className="relative">
  {/* Orbs */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

  {/* Contenido */}
  <div className="relative z-10">
    {/* ... */}
  </div>
</div>
```

### Image con Overlay Hover

```tsx
<div className="relative group rounded-xl overflow-hidden">
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

  {/* Imagen */}
  <img
    src="/image.png"
    alt="Description"
    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
  />
</div>
```

### Glassmorphism

```tsx
{/* Light background */}
<div className="bg-white/80 backdrop-blur-xl border border-gray-200">
  {/* Contenido */}
</div>

{/* Dark background */}
<div className="bg-white/5 backdrop-blur-sm border border-white/10">
  {/* Contenido */}
</div>
```

---

## Animations

### Fade In (Framer Motion)

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
>
  {children}
</motion.div>
```

### Slide Up (Framer Motion)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
>
  {children}
</motion.div>
```

### Stagger Children (Framer Motion)

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Hover Scale (CSS)

```tsx
<div className="transform hover:scale-105 transition-transform duration-300">
  {children}
</div>
```

### Hover Rotate (CSS)

```tsx
<div className="transform hover:rotate-3 transition-transform duration-300">
  {children}
</div>
```

---

## Layouts

### Dashboard Layout

```tsx
<div className="relative min-h-screen bg-white">
  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

  <div className="relative z-10">
    {/* Navigation */}
    <Navigation />

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Dash<span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">board</span>
        </h1>
        <p className="text-gray-600">Tus conversaciones y contratos</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards aquí */}
      </div>
    </main>
  </div>
</div>
```

### Sidebar Layout

```tsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="relative w-80 bg-white border-r border-gray-200">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="relative z-10 p-6">
      {/* Sidebar content */}
    </div>
  </aside>

  {/* Main Content */}
  <main className="relative flex-1 bg-white">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="relative z-10 p-8">
      {/* Main content */}
    </div>
  </main>
</div>
```

### Modal con Glassmorphism

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  {/* Modal */}
  <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
    {/* Grid pattern sutil */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:16px_16px]" />

    <div className="relative z-10 p-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Título del Modal</h2>

      {/* Content */}
      <p className="text-gray-600 mb-6">
        Contenido del modal
      </p>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full font-medium transition-colors">
          Cancelar
        </button>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] transition-all">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Quick Copy Classes

### Grid Pattern
```
bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]
```

### Grid Pattern (Dark)
```
bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]
```

### Glassmorphism Light
```
bg-white/80 backdrop-blur-xl
```

### Glassmorphism Dark
```
bg-white/5 backdrop-blur-sm border border-white/10
```

### Gradient Text
```
bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text
```

### Emerald Shadow
```
shadow-lg hover:shadow-[0_0_0_3px_rgba(5,150,105,0.1)]
```

### Emerald Shadow XL
```
shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40
```

### Hover Scale
```
hover:scale-105 transition-transform duration-300
```

### Hover Border
```
hover:border-emerald-500/30 transition-colors duration-300
```

---

**Documento Vivo** - Añadir más ejemplos según se necesiten.
