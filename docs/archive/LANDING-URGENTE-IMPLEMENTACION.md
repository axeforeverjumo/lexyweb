# Landing Page /urgente - Implementación

**Fecha**: 2026-01-19
**Objetivo**: Conversión máxima para caso urgente + Rankear keywords urgencia
**URL**: `/urgente`

---

## 📊 Overview

Landing page especializada en **urgencia** implementada con diseño **Apple-style ultra-minimalista** + verde esmeralda como acento quirúrgico.

### Diferenciadores Visuales

- ⚡ **Contador en tiempo real** mostrando 30 segundos
- 💚 **Verde esmeralda (#059669)** usado quirúrgicamente
- 🎯 **Numeración gigante** en secciones clave
- ⏱️ **Micro-animaciones** que sugieren velocidad sin caos

---

## 🎨 Sistema de Diseño

### Paleta de Color

```css
--white: #FFFFFF;           /* Background principal */
--black: #000000;           /* Texto principal */
--gray-50: #F9FAFB;         /* Backgrounds alternos */
--gray-900: #111827;        /* Texto secundario */

/* Emerald Accent - Uso quirúrgico */
--emerald-600: #059669;     /* Primary CTA, números, badges */
--emerald-700: #047857;     /* CTA hover */
--emerald-50: #ECFDF5;      /* Backgrounds sutiles */
--emerald-100: #D1FAE5;     /* Badges, highlights */
```

### Tipografía

- **Font Family**: Inter Variable
- **Headlines**: Bold (700), tight leading (1.2), tracking tight (-0.02em)
- **Body**: Normal (400), normal leading (1.6)
- **Numbers**: Tabular numerals para consistencia

### Espaciado

- Entre secciones: `py-32` (128px)
- Gap entre elementos: `gap-8` (32px) o `gap-12` (48px)
- Padding de cards: `p-8` (32px)

### Animaciones

- Duración: 0.4s - 0.6s
- Easing: ease-out
- Stagger delays: 0.1s - 0.15s entre elementos

---

## 📁 Estructura de Archivos

```
app/
└── urgente/
    └── page.tsx              # Página principal /urgente

components/sections/urgent/
├── UrgentHero.tsx           # Hero con contador en tiempo real
├── UrgentProblem.tsx        # 3 escenarios (Frustración, Alternativa, Lexy)
├── UrgentValueProp.tsx      # 4 beneficios de urgencia
├── UrgentHowItWorks.tsx     # 4 pasos críticos con tiempos
├── UrgentUseCases.tsx       # 5 casos reales
├── UrgentSocialProof.tsx    # 3 testimonios
├── UrgentObjections.tsx     # 5 objeciones con accordion
├── UrgentPricing.tsx        # Pricing con ROI focus
└── UrgentFinalCTA.tsx       # CTA maximalista en negro
```

---

## 🧩 Componentes Detallados

### 1. UrgentHero

**Características:**
- Contador de 30s en tiempo real con animación de pulso
- Headline: "Genera Contratos Inmobiliarios en 30 Segundos"
- "30 Segundos" en verde esmeralda
- Problem statement en card gris
- CTA prominente con shadow emerald

**Interacción:**
- Botón "Ver demo en tiempo real" que inicia countdown
- Animación de pulso ring cuando contador corre

### 2. UrgentProblem

**Características:**
- Grid de 3 escenarios
- Escenario C (Lexy) destacado con bg emerald-50 + ring
- Badge "LA SOLUCIÓN" en esquina superior derecha
- Emojis para contexto emocional
- Loss/gain boxes con bg diferenciado

### 3. UrgentValueProp

**Características:**
- 4 beneficios con numeración gigante (opacity 10%)
- Iconos SVG minimalistas sobre numeración
- Layout horizontal con flex
- Impact badges con check icon en emerald-50

### 4. UrgentHowItWorks

**Características:**
- 4 pasos con tiempos específicos (5s, 20s, 5s, ¿s?)
- Layout alternating (imagen izq/der)
- Time badges con iconos en círculos emerald
- Screenshots reales del producto
- 2 CTAs al final (primario + secundario)

**Imágenes:**
- dashboard.png
- chat-con-lexy.png
- generacion-del-contrato.png
- firma-digital.png

### 5. UrgentUseCases

**Características:**
- 5 casos reales en cards con bg gray-50
- Number badges circulares en esquina
- 3 secciones: Situación (italic), Con Lexy (emerald bg), Savings (check)
- Layout vertical stacked

### 6. UrgentSocialProof

**Características:**
- 3 testimonios en grid
- Quote icon en círculo emerald
- Avatar circles con iniciales
- Hover shadow effect

### 7. UrgentObjections

**Características:**
- Accordion expandible con 5 objeciones
- Bordes que cambian a emerald en hover
- Botón circular con flecha rotativa
- Respuestas con formato preservado (whitespace-pre-line)
- 2 CTAs al final (FAQ + Chat)

### 8. UrgentPricing

**Características:**
- ROI explanation box en emerald-50
- Precio: 65€/mes
- Badge "ACCESO INSTANTÁNEO"
- Features grid con checkmarks
- Comparativa lado a lado (Tradicional vs Lexy)
- Money back guarantee

### 9. UrgentFinalCTA

**Características:**
- Background negro para máximo contraste
- Headline con "30 segundos" en emerald-400
- Stats row con 3 métricas (30s, 24/7, 100%)
- CTA gigante con shadow emerald
- Trust line al final

---

## 🎯 Keywords Target

**Primary** (Target 2-3%):
- "generar contratos rápido"
- "contratos inmobiliarios urgentes"
- "software contratos rápidos"

**Secondary** (Target 1-2%):
- "contrato compraventa 30 segundos"
- "contrato legal online rápido"
- "generar contrato inmediato"

---

## 🚀 Deployment

### Verificar antes de deploy

- [ ] Todas las imágenes están en `/public/images/`
- [ ] Button component soporta variant="primary" con emerald
- [ ] Navigation está actualizado (ya existente)
- [ ] Footer está actualizado (ya existente)

### Build y Test

```bash
# Desarrollo
npm run dev

# Verificar en:
http://localhost:3000/urgente

# Build de producción
npm run build

# Preview de build
npm run start
```

### Deploy a Vercel

```bash
# Ya configurado auto-deploy desde main
git add .
git commit -m "feat: add /urgente landing page with urgency focus"
git push origin main

# Vercel desplegará automáticamente
```

---

## 📈 Métricas de Conversión

**CTAs a trackear:**
1. Hero: "Empezar AHORA - 30 segundos"
2. HowItWorks: "Probar ahora - 30 segundos" + "Ver casos reales"
3. Pricing: "Empezar gratis 14 días"
4. FinalCTA: "Construye tu primer contrato AHORA"

**UTM Parameters sugeridos:**
- utm_campaign=urgente_landing
- utm_content=30-second-CTA

---

## 🔗 Internal Linking

**From /urgente to:**
1. `/` - Landing Principal
2. `/plantillas` - Template showcase
3. `/blog/contratos-rapidos` - "¿Cómo generamos en 30 segundos?"
4. `/blog/validez-legal-ia` - "¿Pero es realmente legal?"
5. `/faq-expandido` - "Más dudas sobre urgencias"

---

## 🎨 Aesthetic Vision: "Urgencia Quirúrgica"

**Concepto**: Como una sala de operaciones de alta precisión médica. Cada segundo cuenta, pero todo está bajo control absoluto.

**Filosofía de diseño**:
> "Velocidad con sofisticación. Urgencia sin caos. Minimalismo con propósito."

**Inspiración**:
- Apple.com - Minimalismo extremo
- Vercel.com - Verde usado quirúrgicamente
- Linear.app - Tipografía impecable

---

## ✅ Checklist de Implementación

- [x] Estructura de página /urgente
- [x] UrgentHero con contador en tiempo real
- [x] UrgentProblem con 3 escenarios
- [x] UrgentValueProp con 4 beneficios
- [x] UrgentHowItWorks con 4 pasos
- [x] UrgentUseCases con 5 casos
- [x] UrgentSocialProof con testimonios
- [x] UrgentObjections con accordion
- [x] UrgentPricing con ROI focus
- [x] UrgentFinalCTA maximalista
- [x] Button component actualizado con emerald
- [x] Imágenes verificadas

---

## 📝 Notas Finales

### Diferencias vs Landing Principal (/)

| Aspecto | Landing Principal | Landing /urgente |
|---------|------------------|------------------|
| **Ángulo** | General | Urgencia extrema |
| **Tono** | Profesional | Urgente pero controlado |
| **Diseño** | Naranja + Manrope | Verde esmeralda + Inter |
| **Contador** | No | Sí (30s en tiempo real) |
| **Casos de uso** | Generales | Urgentes específicos |
| **Pricing focus** | Features | ROI inmediato |

### Performance Esperada

- Lighthouse score: >95
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- CLS: <0.1

---

**Documento creado**: 2026-01-19
**Versión**: 1.0
**Status**: ✅ Implementación completa
**Next Steps**: Deploy a Vercel + Analytics tracking
