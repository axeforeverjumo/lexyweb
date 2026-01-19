# 🚀 Sanity Blog - Quick Start (5 minutos)

## Setup Inicial

### 1. Crear cuenta Sanity
```
https://www.sanity.io/ → Sign up for free
```

### 2. Crear proyecto
En [sanity.io/manage](https://www.sanity.io/manage):
- Click "Create project"
- Nombre: "Lexy Blog"
- Dataset: "production"
- **Copia el Project ID** ⚠️

### 3. Configurar variables
```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=TU_PROJECT_ID_AQUI
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Deploy schemas
```bash
npx sanity deploy
```

## Usar el Editor

### Acceder al Studio
```bash
npm run dev
```

Abre: `http://localhost:3000/studio`

### Crear contenido (en orden)
1. **Autor** → Create → Rellena nombre, slug, foto
2. **Categorías** → Create → "Legalidad IA", "Contratos", "Guías"
3. **Blog Post** → Create → Título, contenido, SEO

### Publicar
1. Escribe contenido
2. Click **"Save"** (guarda borrador)
3. Click **"Publish"** (publica)

## Ver Resultados

- Lista: `http://localhost:3000/blog`
- Artículo: `http://localhost:3000/blog/tu-slug`

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Ver Studio
open http://localhost:3000/studio

# Deploy schemas
npx sanity deploy

# Gestionar proyecto
npx sanity manage
```

## ¿Necesitas ayuda?

Lee la guía completa: `docs/SANITY-BLOG-SETUP.md`
