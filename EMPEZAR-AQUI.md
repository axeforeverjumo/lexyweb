# 🚀 EMPIEZA AQUÍ - Lexy Blog Sanity

**Fecha**: 2026-01-19
**Status**: ✅ TODO CONFIGURADO - Solo faltan 3 comandos

---

## 🎯 ¿Qué Tienes Ahora?

✅ **Blog profesional con CMS** (Sanity.io) - Sin tocar código
✅ **Diseño Apple-style brutal** - Emerald accents minimalista
✅ **SEO optimizado** - Featured snippet ready
✅ **21 archivos creados** - Todo funcional
✅ **Gratis forever** - Plan Sanity gratuito
✅ **Documentación completa** - 4 guías detalladas

---

## ⚡ Quick Start (5 minutos)

### Paso 1: Login Sanity (30 seg)

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npx sanity login
```

→ Se abre navegador → Login con tu cuenta sanity.io

---

### Paso 2: Crear Dataset (30 seg)

```bash
npx sanity dataset create production
```

→ Si dice "already exists" → perfecto, continúa

---

### Paso 3: Configurar CORS (1 min)

**Opción A - Desde navegador (MÁS FÁCIL):**

1. Ve a: https://www.sanity.io/manage
2. Click en proyecto **"Lexy Blog"** (`s5r9o1yx`)
3. Sidebar → **API** → **CORS Origins**
4. Click **"Add CORS origin"**
5. Origin: `http://localhost:3000`
6. ✅ Marca "Allow credentials"
7. **Save**

**Opción B - Desde terminal:**

```bash
npx sanity cors add http://localhost:3000 --credentials
```

---

### Paso 4: Arrancar Servidor (30 seg)

```bash
npm run dev
```

→ Espera a que diga "Ready"

---

### Paso 5: Acceder al Studio

Abre en tu navegador:

```
http://localhost:3000/studio
```

→ Login con tu cuenta Sanity
→ **¡YA TIENES EL EDITOR VISUAL!** 🎉

---

## ✍️ Crear tu Primer Artículo (5 min)

### 1. Crear Autor

Sidebar → **"Autor"** → **"+"**

- Nombre: `Juan Manuel Ojeda`
- Slug: Click "Generate"
- Foto: (Opcional)
- Bio: `Fundador de Lexy. Experto en legaltech inmobiliario.`

→ **Publish** ✅

### 2. Crear Categorías (3)

Sidebar → **"Categoría"** → **"+"**

Crea estas 3:
1. `Legalidad IA`
2. `Contratos Inmobiliarios`
3. `Guías Legales`

→ **Publish** cada una ✅

### 3. Crear Artículo

Sidebar → **"Blog Post"** → **"+"**

**Rellena:**
- **Título**: `¿Es Legal un Contrato Generado por IA? Guía Completa`
- **Slug**: Click "Generate"
- **Autor**: Selecciona "Juan Manuel Ojeda"
- **Imagen**: Upload una (1200x630px ideal)
- **Categorías**: Marca "Legalidad IA" + "Guías Legales"
- **Extracto**:
  ```
  Análisis completo: por qué 73% de IA legal falla. Cómo Lexy garantiza 100% legalidad validada por 250+ abogados españoles.
  ```
- **Contenido**: Copia de `docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md`
- **SEO → Meta Title**: `¿Es Legal un Contrato IA? Guía Completa 2026 | Lexy`
- **SEO → Meta Description**: (copia el extracto)
- **SEO → Keywords**: `es legal contrato ia`, `validez legal contrato ia`
- **Tiempo Lectura**: `18`

→ **Save** (guarda borrador)
→ **Publish** (publica) ✅

---

## 🌐 Ver Resultado

```
http://localhost:3000/blog                                  # Lista
http://localhost:3000/blog/es-legal-contrato-generado-por-ia  # Artículo
```

**¡Diseño Apple-style brutal! 🔥**

---

## 📚 ¿Necesitas Ayuda?

### Documentación Completa

1. **`docs/SANITY-IMPLEMENTACION-COMPLETA.md`** ⭐
   → Todo documentado (21 páginas)

2. **`docs/SETUP-SANITY-PERSONAL.md`**
   → Tu config específica (Project ID: s5r9o1yx)

3. **`docs/SANITY-QUICKSTART.md`**
   → Solo comandos esenciales

4. **`docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md`**
   → Contenido completo (5,200 palabras) listo para copiar

### Comandos Útiles

```bash
# Desarrollo
npm run dev

# Ver Studio
open http://localhost:3000/studio

# Ver blog
open http://localhost:3000/blog

# Deploy Studio a cloud (opcional)
npx sanity deploy

# Gestionar proyecto
npx sanity manage
```

---

## 🆘 Troubleshooting Rápido

### Error CORS
→ Configura CORS (Paso 3 arriba)

### Error "Project not found"
→ Verifica `.env.local` tiene `s5r9o1yx`

### Error "Dataset not found"
→ Ejecuta: `npx sanity dataset create production`

### Error "You must login first"
→ Ejecuta: `npx sanity login`

---

## 🎯 Tu Configuración

```
Project ID:    s5r9o1yx
Dataset:       production
Studio Local:  http://localhost:3000/studio
Blog Local:    http://localhost:3000/blog
```

---

## ✅ Checklist

- [ ] `npx sanity login` ejecutado
- [ ] Dataset `production` creado
- [ ] CORS configurado (localhost:3000)
- [ ] `npm run dev` corriendo
- [ ] Studio accesible en `/studio`
- [ ] Autor creado
- [ ] Categorías creadas (3)
- [ ] Primer artículo publicado
- [ ] Artículo visible en `/blog`

---

## 🚀 Siguiente Paso

**Cuando todo funcione local**, puedes deployar el Studio a Sanity Cloud (gratis):

```bash
npx sanity deploy
```

Resultado: `https://lexy.sanity.studio`

**Ventajas:**
- ✅ Gratis forever
- ✅ Accesible desde cualquier lugar
- ✅ No necesitas `npm run dev`
- ✅ HTTPS automático

---

## 🎉 ¡Eso es Todo!

Ahora tienes un **CMS profesional enterprise-grade** gratis para crear blogs sin tocar código.

**Ejecuta los 3 comandos de arriba y ya está** 🚀

---

**¿Dudas?** Lee `docs/SANITY-IMPLEMENTACION-COMPLETA.md`

**¡A escribir artículos y dominar Google! 🔥**
