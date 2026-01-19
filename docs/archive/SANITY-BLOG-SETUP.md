# 🚀 Sanity Blog - Guía Completa de Setup y Uso

**Fecha**: 2026-01-19
**Objetivo**: CMS headless profesional para gestionar blog de Lexy sin tocar código
**Stack**: Sanity.io + Next.js 14 + TypeScript

---

## 📊 ¿Qué es Sanity?

Sanity es un **CMS Headless** (Content Management System) que te permite:

✅ **Crear y editar artículos** desde una UI visual profesional
✅ **Sin tocar código** - Todo desde el navegador
✅ **SEO optimizado** - Meta tags, slugs, keywords automáticos
✅ **Gratis** - Plan gratuito generoso (3 usuarios, 10k documentos)
✅ **Imágenes optimizadas** - CDN global automático
✅ **Preview en tiempo real** - Ve cambios antes de publicar

---

## 🔧 Setup Inicial (Solo la primera vez)

### Paso 1: Crear cuenta en Sanity

1. Ve a [https://www.sanity.io/](https://www.sanity.io/)
2. Click en **"Sign up for free"**
3. Regístrate con Google o email
4. Confirma tu email

### Paso 2: Crear proyecto en Sanity

```bash
# Desde la terminal en el proyecto lexyweb
npx sanity init --project-id=your_project_id --dataset=production
```

O créalo desde el dashboard:
1. En [sanity.io/manage](https://www.sanity.io/manage)
2. Click **"Create project"**
3. Nombre: "Lexy Blog"
4. Dataset: "production"
5. Copia el **Project ID** (lo necesitarás)

### Paso 3: Configurar variables de entorno

1. Copia `.env.local.example` a `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edita `.env.local` y pega tu Project ID:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_aqui
NEXT_PUBLIC_SANITY_DATASET=production
```

### Paso 4: Inicializar dataset

```bash
# Esto crea las tablas necesarias en Sanity
npx sanity dataset create production
```

### Paso 5: Deploy schemas a Sanity

```bash
# Esto sube los schemas (post, author, category) a Sanity
npx sanity deploy
```

---

## 🎨 Acceder al Studio (Editor Visual)

### Opción 1: Local (Desarrollo)

```bash
npm run dev
```

Abre en tu navegador:
```
http://localhost:3000/studio
```

### Opción 2: Cloud (Producción)

Una vez hagas deploy a Vercel, accede a:
```
https://lexyweb.vercel.app/studio
```

---

## ✍️ Crear tu Primer Artículo

### Paso 1: Acceder al Studio

Abre `http://localhost:3000/studio` (o tu URL de producción)

### Paso 2: Crear un Autor

1. En el sidebar izquierdo, click en **"Autor"**
2. Click en **"Create new document"** (botón + verde)
3. Rellena:
   - **Nombre**: Juan Manuel Ojeda
   - **Slug**: Click en "Generate" (auto-genera desde nombre)
   - **Imagen**: Sube una foto (opcional)
   - **Biografía**: Escribe bio breve
4. Click **"Publish"** (botón verde arriba a la derecha)

### Paso 3: Crear Categorías

1. En el sidebar, click en **"Categoría"**
2. Click en **"Create new document"**
3. Crea estas categorías:
   - **Título**: "Legalidad IA"
   - **Slug**: Click "Generate"
   - **Descripción**: "Artículos sobre validez legal de contratos IA"
4. Repite para:
   - "Contratos Inmobiliarios"
   - "Guías Legales"
   - "Casos de Uso"

### Paso 4: Crear tu Primer Post

1. En el sidebar, click en **"Blog Post"**
2. Click en **"Create new document"**
3. Rellena los campos:

#### **Sección Principal**
- **Título**: ¿Es Legal un Contrato Generado por IA? Guía Completa
- **Slug**: Click "Generate" → `es-legal-contrato-ia`
- **Autor**: Selecciona "Juan Manuel Ojeda"
- **Imagen Principal**: Sube una imagen (1200x630px recomendado)
  - **Alt Text**: "Validez legal de contratos generados por IA"
- **Categorías**: Selecciona "Legalidad IA" y "Guías Legales"
- **Fecha de Publicación**: Hoy (auto-rellena)
- **Extracto**:
  ```
  Análisis completo: por qué 73% de IA legal falla. Cómo Lexy garantiza 100% legalidad validada por 250+ abogados españoles.
  ```

#### **Sección Contenido**

Aquí es donde escribes el artículo completo. El editor es como un Word mejorado:

**Toolbar disponible:**
- **Estilos**: Normal, H1, H2, H3, H4, Quote
- **Formatos**: Bold, Italic, Code
- **Listas**: Bullets, Números
- **Links**: Inserta enlaces
- **Imágenes**: Sube imágenes inline
- **Código**: Code blocks con syntax highlighting

**Ejemplo de estructura:**

```
[H1] ¿Es Legal un Contrato Generado por IA? Guía Completa

[Normal] La pregunta más importante: ¿Realmente es legal un contrato generado por inteligencia artificial?

La respuesta corta: Sí, es completamente legal en España. Pero solo si la IA está validada por expertos legales.

[H2] El Problema: 73% de Cláusulas IA Son Legalmente Nulas

[Normal] En 2024, un estudio de la Asociación de Legal Tech Española analizó 10,000 contratos generados por IA legal genérica.

Resultado: 73% de las cláusulas eran legalmente nulas o problemáticas.

[H3] Razón 1: Desactualización Normativa

[Normal] IA genérica entrenada en 2022. Ley de Vivienda promulgada en 2023. IA NO actualiza...

[Imagen] (Sube gráfico o screenshot)

[H2] Sí, Es Legal. Pero Solo Si Cumple Estos 4 Criterios

...continúa escribiendo...
```

#### **Sección SEO** (Desplegable)

- **Meta Title**: ¿Es Legal un Contrato Generado por IA? Guía Completa | Lexy
- **Meta Description**:
  ```
  Análisis: por qué 73% de IA legal falla. Cómo Lexy garantiza 100% legalidad. Entrenado por 250+ abogados españoles, verificado semanalmente.
  ```
- **Keywords**:
  - es legal contrato ia
  - validez legal contrato ia
  - contratos generados por inteligencia artificial
  - lexy contratos legales
- **OG Image**: Sube imagen para redes sociales (1200x630px)

#### **Tiempo de Lectura**

- **Tiempo de Lectura**: 18 (minutos)

### Paso 5: Preview y Publicar

1. Click **"Save"** (icono disquete, arriba a la derecha) - Guarda borrador
2. Revisa el contenido en el preview
3. Cuando esté listo: Click **"Publish"** (botón verde)

¡Listo! Tu artículo está publicado.

---

## 🌐 Ver el Artículo Publicado

### Local:
```
http://localhost:3000/blog
http://localhost:3000/blog/es-legal-contrato-ia
```

### Producción (después de deploy):
```
https://lexyweb.vercel.app/blog
https://lexyweb.vercel.app/blog/es-legal-contrato-ia
```

---

## 📝 Copiar Contenido desde CONTENIDO-BLOG-VALIDEZ-LEGAL.md

### Método Rápido:

1. Abre `docs/CONTENIDO-BLOG-VALIDEZ-LEGAL.md`
2. Copia sección por sección
3. Pega en Sanity Studio
4. Aplica formato:
   - `## H2 Heading` → Selecciona texto, cambia estilo a "H2"
   - `### H3 Heading` → Cambia a "H3"
   - `**Bold**` → Selecciona, click botón Bold (B)
   - `*Italic*` → Selecciona, click botón Italic (I)
   - Links → Selecciona texto, click botón link, pega URL

### Estructura sugerida:

```
Intro (párrafos normales)
↓
[H2] El Problema: 73% de Cláusulas IA Son Nulas
  [H3] Razón 1: Desactualización Normativa
  [H3] Razón 2: Falta de Especialización Regional
  [Imagen] (ejemplo visual)
↓
[H2] Sí, Es Legal. Pero Solo Si Cumple Estos 4 Criterios
  [H3] Criterio 1: Consentimiento Informado
  [H3] Criterio 2: Objeto Lícito
  ...
↓
[H2] Por Qué Lexy Es 100% Legal
  [Lista de bullets con checkmarks]
↓
[Quote] "Contratos generados por IA son válidos..." - Sentencia AP Madrid
↓
[H2] Caso Real: Compraventa de 400k€
  [Tabla comparativa: Abogado vs Lexy]
↓
[H2] Conclusión y CTA
```

---

## 🎨 Tips de Formato para Mejor Legibilidad

### Usa Headings Correctamente
- **H1**: Solo para título principal (auto-generado)
- **H2**: Secciones principales (4-6 por artículo)
- **H3**: Subsecciones (dentro de H2)
- **H4**: Detalles menores (raramente)

### Párrafos Cortos
- Máximo 3-4 líneas por párrafo
- Espacio blanco es tu amigo
- Salta línea entre párrafos

### Usa Listas
- **Bullets**: Para listas no ordenadas
- **Números**: Para pasos o rankings

### Destaca Información Clave
- **Bold**: Para palabras importantes
- *Italic*: Para énfasis o citas
- `Code`: Para términos técnicos o ejemplos

### Imágenes
- Sube imágenes de alta calidad (1200px ancho mínimo)
- Siempre rellena **Alt Text** (SEO + accesibilidad)
- Agrega **Caption** si necesitas explicar la imagen

### Quotes
- Usa para citas de sentencias, estudios, testimonios
- Hace el contenido más creíble y visual

---

## 🔄 Editar Artículos Existentes

1. Abre Studio (`/studio`)
2. Sidebar → **"Blog Post"**
3. Click en el artículo que quieres editar
4. Haz cambios
5. **Save** (guarda borrador)
6. **Publish** (publica cambios)

**Nota**: Los cambios se reflejan automáticamente en la web (gracias a ISR - Incremental Static Regeneration, revalidación cada 60 segundos).

---

## 📈 SEO Best Practices

### Meta Title (Max 60 caracteres)
✅ Bueno: "¿Es Legal un Contrato IA? Guía Completa | Lexy"
❌ Malo: "Artículo sobre contratos de inteligencia artificial y legalidad"

### Meta Description (Max 160 caracteres)
✅ Bueno: "Análisis: por qué 73% de IA legal falla. Cómo Lexy garantiza 100% legalidad validada por 250+ abogados españoles."
❌ Malo: "Artículo de blog sobre contratos."

### Keywords
- 3-6 keywords principales
- Variaciones de long-tail
- Incluye marca ("lexy")

### Alt Text en Imágenes
✅ Bueno: "Tabla comparativa validez legal contratos IA vs tradicionales"
❌ Malo: "imagen1.png"

### Internal Linking
- Linkea a otras páginas de Lexy:
  - `/` - Landing principal
  - `/urgente` - Landing urgente
  - Otros artículos de blog
- Usa anchor text descriptivo:
  - ✅ "guía sobre contratos urgentes"
  - ❌ "click aquí"

---

## 🚀 Deploy a Producción

### Paso 1: Push a GitHub

```bash
git add .
git commit -m "feat: add Sanity blog with complete CMS"
git push origin main
```

### Paso 2: Configurar Variables en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona proyecto "lexyweb"
3. Settings → Environment Variables
4. Agrega:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = tu_project_id
   - `NEXT_PUBLIC_SANITY_DATASET` = production
5. Redeploy

### Paso 3: Acceder al Studio en Producción

```
https://lexyweb.vercel.app/studio
```

---

## 🛠️ Troubleshooting

### Error: "Project ID not found"
**Solución**: Verifica que `.env.local` tiene el `NEXT_PUBLIC_SANITY_PROJECT_ID` correcto.

### Error: "Dataset not found"
**Solución**: Ejecuta `npx sanity dataset create production`

### Las imágenes no cargan
**Solución**: Verifica que el dominio de Sanity CDN esté permitido en `next.config.js`:
```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
}
```

### Cambios no se reflejan inmediatamente
**Solución**: Esto es normal (ISR con revalidación cada 60s). Para force refresh:
```bash
# En desarrollo
rm -rf .next && npm run dev

# En producción
Redeploy en Vercel o espera 60 segundos
```

### No puedo acceder a /studio
**Solución**: Verifica que `app/studio/[[...index]]/page.tsx` existe y que Sanity está instalado.

---

## 📚 Recursos Adicionales

- **Sanity Docs**: https://www.sanity.io/docs
- **Portable Text**: https://portabletext.org/
- **Image Optimization**: https://www.sanity.io/docs/image-url
- **GROQ Query Language**: https://www.sanity.io/docs/groq

---

## 🎯 Siguientes Pasos

### Inmediato:
1. ✅ Crear cuenta Sanity
2. ✅ Configurar variables `.env.local`
3. ✅ Acceder a `/studio`
4. ✅ Crear primer autor
5. ✅ Crear categorías
6. ✅ Crear primer artículo

### Corto Plazo (Esta semana):
- [ ] Copiar contenido de `CONTENIDO-BLOG-VALIDEZ-LEGAL.md` a Sanity
- [ ] Crear 2-3 artículos más (contratos rápidos, casos de uso)
- [ ] Optimizar imágenes para SEO
- [ ] Hacer deploy a producción

### Medio Plazo (Este mes):
- [ ] Publicar 8-10 artículos de alta calidad
- [ ] Configurar Google Search Console
- [ ] Trackear rankings de keywords target
- [ ] Internal linking entre artículos

---

**Documento creado**: 2026-01-19
**Versión**: 1.0
**Status**: ✅ Listo para usar
**Support**: Si tienes problemas, consulta Sanity Docs o pregunta en Slack

---

## 🎉 ¡Felicidades!

Ahora tienes un CMS profesional sin tocar código. Puedes crear, editar y publicar artículos desde el navegador, con SEO optimizado automático y diseño Apple-style brutal.

**¡A escribir artículos y rankear en Google! 🚀**
