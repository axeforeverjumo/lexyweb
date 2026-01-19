# 🚀 Setup Sanity para Lexy - CONFIGURACIÓN PERSONAL

**Tu Project ID**: `s5r9o1yx`
**Dataset**: `production`
**Status**: ✅ Variables configuradas

---

## ✅ Lo Que Ya Está Hecho

✅ Variables de entorno configuradas en `.env.local`
✅ Project ID: `s5r9o1yx`
✅ Dataset: `production`
✅ Schemas creados (post, author, category, blockContent)
✅ Cliente Sanity configurado
✅ Páginas de blog creadas (/blog, /blog/[slug])
✅ Sanity Studio configurado (/studio)
✅ Next.js preparado para imágenes de Sanity CDN

---

## 🔐 Paso 1: Login en Sanity CLI (30 segundos)

Abre tu terminal y ejecuta:

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npx sanity login
```

Esto abrirá tu navegador para autenticarte. **Usa la misma cuenta que usaste en sanity.io/manage**.

---

## 📦 Paso 2: Crear Dataset (30 segundos)

Una vez logueado, crea el dataset:

```bash
npx sanity dataset create production
```

Si dice "already exists", perfecto - continúa al siguiente paso.

---

## 🚀 Paso 3: Arrancar el Servidor Local

```bash
npm run dev
```

Espera a que diga "Ready" (puede tardar 30 segundos la primera vez).

---

## 🎨 Paso 4: Acceder al Studio

Abre tu navegador en:

```
http://localhost:3000/studio
```

**Te va a pedir login** - usa la misma cuenta de Sanity.

**¡Y LISTO!** Ya tienes el Studio funcionando localmente.

---

## ✍️ Paso 5: Crear tu Primer Contenido

### A. Crear Autor

1. Sidebar izquierdo → Click **"Autor"**
2. Click botón **"+"** (Create)
3. Rellena:
   - **Nombre**: Juan Manuel Ojeda
   - **Slug**: Click "Generate"
   - **Imagen**: (Opcional) Sube foto
   - **Biografía**: "Fundador de Lexy. Experto en legaltech inmobiliario."
4. Click **"Publish"** ✅

### B. Crear Categorías

Crea estas 3 categorías (Sidebar → "Categoría" → "+"):

**1. Legalidad IA**
- Título: `Legalidad IA`
- Slug: Click "Generate"
- Descripción: `Artículos sobre validez legal de contratos generados por IA`
- Publish ✅

**2. Contratos Inmobiliarios**
- Título: `Contratos Inmobiliarios`
- Slug: Click "Generate"
- Descripción: `Guías sobre contratos de compraventa, alquiler y cesión`
- Publish ✅

**3. Guías Legales**
- Título: `Guías Legales`
- Slug: Click "Generate"
- Descripción: `Tutoriales paso a paso sobre temas legales`
- Publish ✅

### C. Crear Primer Artículo

Sidebar → "Blog Post" → "+":

**Campos principales:**
- **Título**: `¿Es Legal un Contrato Generado por IA? Guía Completa`
- **Slug**: Click "Generate"
- **Autor**: Selecciona "Juan Manuel Ojeda"
- **Imagen Principal**: Upload una imagen (1200x630px ideal)
  - **Alt Text**: `Validez legal de contratos generados por IA`
- **Categorías**: Marca "Legalidad IA" y "Guías Legales"
- **Extracto**:
  ```
  Análisis completo: por qué 73% de IA legal falla. Cómo Lexy garantiza 100% legalidad validada por 250+ abogados españoles.
  ```

**Contenido:**

Copia y pega esto (luego puedes editar):

```
La pregunta más importante: ¿Realmente es legal un contrato generado por inteligencia artificial?

La respuesta corta: Sí, es completamente legal en España. Pero solo si la IA está validada por expertos legales.

El problema: 73% de IA legal genérica produce cláusulas legalmente nulas porque no actualiza normativa local.

Lexy es diferente. Entrenada por 250+ abogados inmobiliarios españoles. Evaluada cada semana. Actualizada cuando la ley cambia.

En este artículo analizamos qué hace que un contrato IA sea legal, por qué falla la mayoría, y cómo Lexy garantiza validez total.
```

Luego:
- Selecciona "La pregunta más importante..." y cambia estilo a **H2**
- Haz algunas palabras **bold** (selecciona y click B)
- Continúa escribiendo o copia contenido de `docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md`

**Sección SEO** (desplegable):
- **Meta Title**: `¿Es Legal un Contrato IA? Guía Completa 2026 | Lexy`
- **Meta Description**: (copia el extracto)
- **Keywords**: `es legal contrato ia`, `validez legal contrato ia`, `contratos ia españa`

**Tiempo de Lectura**: `18`

**Click "Publish"** ✅

---

## 🌐 Paso 6: Ver tu Blog

Abre:

**Lista de artículos:**
```
http://localhost:3000/blog
```

**Tu artículo:**
```
http://localhost:3000/blog/es-legal-contrato-generado-por-ia-guia-completa
```

**¡Diseño Apple-style brutal con emerald accents! 🎉**

---

## 🌍 Configurar Studio en Sanity Cloud (Opcional - Recomendado)

Para tener el Studio accesible online en `lexy.sanity.studio`:

```bash
npx sanity deploy
```

Esto te preguntará:
- **Hostname**: `lexy` (o el que quieras)

Resultado: `https://lexy.sanity.studio`

**Ventajas:**
- ✅ Gratis forever
- ✅ Accesible desde cualquier lugar
- ✅ No necesitas tener `npm run dev` corriendo
- ✅ Más seguro (HTTPS, autenticación Sanity)

---

## 🚀 Deploy a Producción (Vercel)

### 1. Configurar variables en Vercel

Ve a: https://vercel.com/tu-proyecto/settings/environment-variables

Agrega:
```
NEXT_PUBLIC_SANITY_PROJECT_ID = s5r9o1yx
NEXT_PUBLIC_SANITY_DATASET = production
```

### 2. Redeploy

```bash
git add .
git commit -m "feat: add Sanity blog CMS"
git push origin main
```

Vercel hará auto-deploy.

### 3. Acceso al Studio en producción

**Opción A: Sanity Cloud (recomendado)**
```
https://lexy.sanity.studio
```

**Opción B: En tu dominio**
```
https://lexy.plus/studio
```

---

## 📝 Resumen de URLs

**Local:**
- Studio: `http://localhost:3000/studio`
- Blog: `http://localhost:3000/blog`

**Producción (después de deploy):**
- Studio: `https://lexy.sanity.studio` (si hiciste `npx sanity deploy`)
- Blog: `https://lexy.plus/blog`
- Manage: `https://www.sanity.io/manage` (gestionar proyecto)

---

## 🛠️ Comandos Útiles

```bash
# Arrancar desarrollo local
npm run dev

# Login en Sanity
npx sanity login

# Crear dataset
npx sanity dataset create production

# Deploy Studio a Sanity Cloud
npx sanity deploy

# Gestionar proyecto (abre navegador)
npx sanity manage

# Ver información del proyecto
npx sanity projects list
```

---

## 🎯 Checklist

- [ ] `npx sanity login` ejecutado
- [ ] Dataset `production` creado
- [ ] `npm run dev` corriendo
- [ ] Studio accesible en `/studio`
- [ ] Autor creado
- [ ] Categorías creadas (3)
- [ ] Primer artículo publicado
- [ ] Artículo visible en `/blog`
- [ ] (Opcional) `npx sanity deploy` para Studio en cloud

---

## 🆘 Troubleshooting

### "Project not found"
→ Verifica que `.env.local` tenga `s5r9o1yx`

### "Dataset not found"
→ Ejecuta: `npx sanity dataset create production`

### "You must login first"
→ Ejecuta: `npx sanity login`

### No puedo acceder a /studio
→ Reinicia: `Ctrl+C` y luego `npm run dev`

### Cambios no se reflejan
→ Espera 60 segundos (ISR revalidation) o reinicia servidor

---

## 📚 Documentación Completa

- **Setup completo**: `docs/SANITY-BLOG-SETUP.md`
- **Quick start**: `docs/SANITY-QUICKSTART.md`
- **Contenido listo**: `docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md`

---

**Tu configuración:**
- Project ID: `s5r9o1yx`
- Dataset: `production`
- Organization: Lexy

**¡Todo listo para empezar a escribir! 🚀**
