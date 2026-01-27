# LexyApp - Asistente Legal con IA

<div align="center">

**De conversación a contrato firmado en 3 pasos**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

Progressive Web App para creación de contratos inmobiliarios con inteligencia artificial

**Estado: v1.1.0** | Firmas Digitales + Chat Persistente

</div>

---

## 🎯 ¿Qué es LexyApp?

LexyApp es una plataforma SaaS de **asistencia legal especializada en derecho inmobiliario español** que combina:

- 🤖 **Chat IA conversacional** - Lexy responde consultas legales en tiempo real
- 📄 **Generación automática de contratos** - Sistema híbrido Gemini + Claude
- ✍️ **Firma digital integrada** - Canvas táctil y gestión de tokens
- 📚 **97 templates profesionales** - Verificados por juristas
- 🎨 **Canvas de edición en vivo** - Tipo ChatGPT Canvas

---

## ✨ Características Principales

### Sistema Híbrido de IA
- **Gemini Flash (Google)** - Conversación, análisis, detección de necesidades
- **Claude Sonnet 3.5 (Anthropic)** - Generación de documentos nivel abogado (10+ páginas)
- **Marca LEXY unificada** - Sin referencias externas a proveedores de IA

### Flujos de Trabajo
1. **Chat → Contrato**: Conversación natural detecta necesidad y genera documento
2. **Canvas de Edición**: Chat izquierda + Documento derecha, edición en tiempo real
3. **Firma Digital**: Tokens temporales, canvas táctil, PDF firmado automático

### Tecnología
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **IA**: Google Gemini + Anthropic Claude
- **Estado**: Zustand + RLS (Row Level Security)

---

## 🚀 Inicio Rápido

### Pre-requisitos
- Node.js 18+
- Cuenta Supabase
- API Keys: Google Gemini + Anthropic Claude

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/lexyapp.git
cd lexyapp

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves

# Iniciar servidor
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# IA
GEMINI_API_KEY=tu_gemini_key
ANTHROPIC_API_KEY=tu_anthropic_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Rutas protegidas (chat, contratos, dashboard)
│   └── api/                # Backend APIs (Gemini, Claude, Contratos)
├── components/             # Componentes React
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── abogado/            # Sistema de chat
│   └── contratos/          # Gestión de contratos + Canvas
├── lib/                    # Lógica de negocio
│   ├── supabase/           # Cliente Supabase (server/browser)
│   ├── gemini/             # Cliente Gemini + prompts
│   ├── claude/             # Cliente Claude + configuración
│   └── store/              # Zustand stores
└── types/                  # TypeScript definitions
```

---

## 📈 Estado del Proyecto

### ✅ Completado (v1.1.0)

**Core:**
- [x] Autenticación completa (Supabase Auth)
- [x] Chat persistente con historial en BD
- [x] Dashboard con filtros y estadísticas
- [x] RLS completo en todas las tablas

**Contratos:**
- [x] 97 templates profesionales
- [x] Búsqueda híbrida IA (vectorial + keywords + metadata)
- [x] Generación automática con Claude
- [x] Canvas de edición tipo ChatGPT (v1.0)
- [x] Edición en tiempo real automática (v1.0)

**Firmas:**
- [x] Sistema de firmas digitales (v1.1)
- [x] Canvas táctil HTML5
- [x] Tokens temporales + PINs
- [x] API prepare-signature + sign/[token]
- [x] Página pública de firma

### 🔜 Próximas Fases

**FASE 3: Exportación Avanzada**
- [ ] Generación PDF profesional
- [ ] Generación Word (.docx) editable
- [ ] Plantillas de email

**FASE 4: Analytics**
- [ ] Dashboard de métricas
- [ ] Logs de generaciones
- [ ] Panel admin para templates

---

## 💰 Costos de Operación

### Por Contrato Generado

| Servicio | Uso | Costo |
|----------|-----|-------|
| Gemini (Chat + Análisis) | ~5,000 tokens | ~0.006€ |
| Claude (Documento Final) | ~20,000 tokens | ~0.15€ |
| **TOTAL** | - | **~0.16€** |

**Valor generado:** 300-800€ (precio abogado tradicional)
**Ahorro:** 99.95%

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| [ESTADO.md](./ESTADO.md) | Estado técnico completo del proyecto |
| [CONTEXT.md](./CONTEXT.md) | Visión, contexto e intenciones del proyecto |
| Este archivo (README.md) | Landing y guía rápida |

---

## 🛠️ Scripts Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run lint             # Linting

# Procesamiento de contratos
npx tsx scripts/batch-process-contracts.ts    # Procesar Word → JSON
npx tsx scripts/batch-load-to-db.ts           # Cargar a Supabase
npx tsx scripts/test-hybrid-search.ts         # Test búsqueda híbrida
```

---

## 🎯 Métricas Clave

| Métrica | Valor |
|---------|-------|
| Templates cargados | 97 |
| Precisión búsqueda | 60-75% |
| Tiempo de búsqueda | <2s |
| Tiempo de generación | ~30s |
| Dimensiones embedding | 768 |
| Costo IA por contrato | 0.16€ |

---

## 🔒 Seguridad

- ✅ HTTPS obligatorio en producción
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Validación client + server side
- ✅ JWT tokens con Supabase Auth
- ✅ Secrets en variables de entorno
- ✅ CORS configurado

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Privado - Todos los derechos reservados

---

<div align="center">

**Construido con Next.js, Supabase, Gemini AI y Claude**

Última actualización: 1 Enero 2026 | Versión 1.1.0

[Estado](./ESTADO.md) · [Contexto](./CONTEXT.md) · [Issues](https://github.com/tu-usuario/lexyapp/issues)

</div>
