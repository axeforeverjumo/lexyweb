# LEXY - Tu Asistente Legal Inmobiliario con IA

> De conversación a contrato firmado en 3 pasos. Inteligencia artificial legal especializada para agentes inmobiliarios.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-ISC-green)](LICENSE)

---

## 🎯 ¿Qué es LEXY?

LEXY es una plataforma SaaS que combina IA conversacional con generación automática de contratos legales para el sector inmobiliario. Sustituye semanas de trabajo legal por segundos de conversación.

**De 600€ por contrato a 65€/mes ilimitado.**

### ✨ Características principales

- 💬 **Consultas legales 24/7** - IA entrenada por abogados expertos
- 📄 **Generación de contratos en 30 segundos** - 97 plantillas profesionales
- ✏️ **Editor Canvas en tiempo real** - Edita cláusulas al instante
- ✍️ **Firma digital integrada** - Envía por WhatsApp, firma con PIN
- 📚 **Todo centralizado** - Contratos + chats + firmas en un solo lugar

---

## 🖼️ Capturas de pantalla

### Dashboard principal
![Dashboard LEXY](public/images/dashboard.png)

### Chat con Lexy
![Chat conversacional](public/images/chat-con-lexy.png)

### Generación de contratos
![Generación automática](public/images/generacion-del-contrato.png)

### Editor Canvas
![Editor en tiempo real](public/images/canvas.png)

### Firma digital
![Sistema de firmas](public/images/firma-digital.png)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1](https://nextjs.org/)** - React framework con App Router
- **[React 19.2](https://react.dev/)** - Server & Client Components
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animaciones fluidas

### Payments
- **[Stripe](https://stripe.com/)** - Subscripciones con trial de 14 días

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting optimizado para Next.js

---

## 🚀 Instalación local

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Git

### Pasos

1. **Clona el repositorio**
```bash
git clone https://github.com/axeforeverjumo/lexyweb.git
cd lexyweb
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**

Crea un archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
STRIPE_PRICE_ID=tu_price_id_del_plan_pro
```

4. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

5. **Abre tu navegador**
```
http://localhost:3000
```

---

## 📦 Scripts disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Crea build de producción
npm run start    # Inicia servidor de producción
npm run lint     # Ejecuta linter
```

---

## 🌍 Deploy a producción

### Deploy en Vercel (Recomendado)

1. **Instala Vercel CLI**
```bash
npm i -g vercel
```

2. **Inicia sesión**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configura variables de entorno en Vercel**
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Añade tus claves de Stripe

### Deploy automático con GitHub

1. Conecta tu repositorio en [vercel.com/new](https://vercel.com/new)
2. Cada `git push` desplegará automáticamente

---

## 📝 Pricing

### Plan Gratis
- 3 chats al año (consultas ilimitadas por chat)
- 2 contratos al mes
- Acceso a todas las plantillas

### Plan Pro - 65€/mes
- **Chats ilimitados**
- **Contratos ilimitados**
- 14 días de prueba gratis
- Sin permanencia

---

## 🎨 Diseño

Inspiración: **Apple-style minimalism**
- Fondo blanco limpio
- Naranja cálido (#FF6B35) como acento
- Tipografía: Manrope (200-800)
- Animaciones sutiles con Framer Motion

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'feat: añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

---

## 🔗 Links

- **Landing Page**: [Próximamente]
- **Aplicación**: [https://app.lexy.plus](https://app.lexy.plus)
- **Documentación**: [En desarrollo]

---

## 👥 Equipo

Desarrollado con ❤️ para revolucionar el sector legal inmobiliario.

---

## 📧 Contacto

¿Preguntas? ¿Feedback? Contáctanos en [hola@lexy.plus](mailto:hola@lexy.plus)

---

**⚡ LEXY - Contratos inteligentes para agentes inteligentes**
