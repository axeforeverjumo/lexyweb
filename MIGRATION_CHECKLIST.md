# ✅ CHECKLIST DE MIGRACIÓN - lexyapp → lexyweb

**Última actualización:** 28 Enero 2026
**Estado:** Listo para iniciar

---

## 📋 ÍNDICE

- [Pre-Migración](#pre-migración)
- [SPRINT 1: Core Crítico](#sprint-1-core-crítico)
- [SPRINT 2: Gestión Contratos](#sprint-2-gestión-contratos)
- [SPRINT 3: Canvas y Firmas](#sprint-3-canvas-y-firmas)
- [SPRINT 4: Organizaciones](#sprint-4-organizaciones)
- [SPRINT 5: Subscripciones](#sprint-5-subscripciones)
- [SPRINT 6: Mejoras](#sprint-6-mejoras)
- [SPRINT 7: Validación](#sprint-7-validación)

---

## 🚀 PRE-MIGRACIÓN

### Setup Inicial
- [ ] Crear rama `migration/lexyapp-full`
- [ ] Backup de lexyweb actual (copiar directorio completo)
- [ ] Crear directorio `types/` en lexyweb
- [ ] Instalar dependencias faltantes

```bash
# Ejecutar desde lexyweb:
git checkout -b migration/lexyapp-full
cp -r ../lexyweb ../lexyweb-backup-$(date +%Y%m%d)
mkdir types
npm install zustand jspdf html2canvas react-signature-canvas @types/react-signature-canvas
```

### Verificar Entorno
- [ ] Variables de entorno completas en `.env.local`
  - [ ] `GEMINI_API_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] Todas las de Supabase
- [ ] Build actual funciona: `npm run build`
- [ ] TypeScript sin errores: `npm run lint`

### Documentación
- [ ] Leer `MIGRATION_PLAN.md` completo
- [ ] Leer `MIGRATION_SUMMARY.md`
- [ ] Revisar `COMPARISON_TABLE.md`
- [ ] Tener `lexyapp/ESTADO.md` a mano

---

## 🔴 SPRINT 1: CORE CRÍTICO

**Objetivo:** Chat funcional + Generación básica de contratos
**Duración estimada:** 10 días

### Fase 1.1: Setup de Dependencias
- [ ] Instalar `zustand jspdf html2canvas react-signature-canvas`
- [ ] Verificar instalación correcta en `package.json`

### Fase 1.2: Types Base

**Copiar desde `lexyapp/src/types/` a `lexyweb/types/`:**

- [ ] `contrato.types.ts` ⭐
- [ ] `conversacion.types.ts` ⭐
- [ ] `mensaje.types.ts` ⭐
- [ ] `gemini.types.ts` ⭐
- [ ] `user.types.ts`
- [ ] `subscription.types.ts`

**Verificar:**
- [ ] No hay errores de importación
- [ ] Ajustar paths si es necesario

### Fase 1.3: Librerías Gemini

**Copiar desde `lexyapp/src/lib/gemini/` a `lexyweb/lib/gemini/`:**

- [ ] `client.ts` ⭐
- [ ] `embeddings.ts` ⭐
- [ ] Crear directorio `prompts/`
- [ ] `prompts/legal-consultant.ts`
- [ ] `prompts/lexy-master-prompt.ts` ⭐
- [ ] `prompts/lexy-optimized.ts` ⭐
- [ ] `prompts/clause-analyzer.ts`
- [ ] `prompts/contract-intent-detector.ts` ⭐
- [ ] `prompts/contract-detector.ts`
- [ ] `prompts/contract-personalizer.ts`
- [ ] `prompts/contract-deep-analyzer.ts`

**Verificar:**
- [ ] Imports de `@google/generative-ai` funcionan
- [ ] GEMINI_API_KEY está en .env.local

### Fase 1.4: Store de Chat

**Copiar desde `lexyapp/src/lib/store/` a `lexyweb/lib/store/`:**

- [ ] `chatStore.ts` ⭐

**Verificar:**
- [ ] Zustand funciona correctamente
- [ ] No hay errores de tipos

### Fase 1.5: Librerías de Contratos

**Copiar desde `lexyapp/src/lib/contracts/` a `lexyweb/lib/contracts/`:**

- [ ] `generator.ts` ⭐
- [ ] Crear directorio `templates/`
- [ ] `templates/compraventa.ts` (ejemplo)

**Copiar desde `lexyapp/src/lib/claude/` a `lexyweb/lib/claude/`:**

- [ ] Crear directorio `generation-settings/`
- [ ] `generation-settings/arrendamiento-vivienda.ts`
- [ ] `generation-settings/arras-penitenciales.ts`

**Verificar:**
- [ ] ANTHROPIC_API_KEY está en .env.local
- [ ] Imports de `@anthropic-ai/sdk` funcionan

### Fase 1.6: Validators

**Copiar desde `lexyapp/src/lib/validators/` a `lexyweb/lib/validators/`:**

- [ ] `amounts.ts`
- [ ] `dates.ts`
- [ ] `dni.ts`
- [ ] `index.ts`

### Fase 1.7: Utils Adicionales

**Copiar desde `lexyapp/src/lib/utils/` a `lexyweb/lib/utils/`:**

- [ ] `constants.ts`

**Verificar:**
- [ ] Fusionar con `utils.ts` existente si es necesario
- [ ] No hay conflictos

### Fase 1.8: APIs de Contratos

**Copiar desde `lexyapp/src/app/api/contracts/` a `lexyweb/app/api/contracts/`:**

- [ ] `list/route.ts`
- [ ] `[id]/route.ts` (GET, PATCH, DELETE)
- [ ] `detect-intent/route.ts` ⭐
- [ ] `find-template/route.ts` ⭐
- [ ] `analyze-conversation/route.ts` ⭐
- [ ] `generate/route.ts` ⭐
- [ ] `generate-intelligent/route.ts` ⭐
- [ ] `generate-with-claude/route.ts` ⭐
- [ ] `by-conversation/[conversacionId]/route.ts`
- [ ] `[id]/update-title/route.ts`

**Testing intermedio:**
- [ ] Test API: `GET /api/contracts/list`
- [ ] Test API: `POST /api/contracts/detect-intent`

### Fase 1.9: APIs de Chat

**Copiar desde `lexyapp/src/app/api/` a `lexyweb/app/api/`:**

- [ ] `conversaciones/route.ts` (GET, POST) ⭐
- [ ] `conversaciones/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] `conversaciones/[id]/mensajes/route.ts` (GET, POST) ⭐
- [ ] `conversaciones/[id]/participants/route.ts`
- [ ] `conversaciones/[id]/share/route.ts`
- [ ] `gemini/chat/route.ts` ⭐⭐⭐ CRÍTICO
- [ ] `chat/contract/[id]/route.ts` ⭐
- [ ] `chat-shares/[id]/accept/route.ts`

**Testing intermedio:**
- [ ] Test API: `POST /api/gemini/chat` (enviar mensaje simple)
- [ ] Test API: `GET /api/conversaciones`

### Fase 1.10: Componentes de Chat

**Copiar desde `lexyapp/src/components/abogado/` a `lexyweb/components/abogado/`:**

- [ ] `MessageBubble.tsx`
- [ ] `ChatInput.tsx`
- [ ] `ConversationItem.tsx`
- [ ] `ConversationsSidebar.tsx`
- [ ] `ConversationsSidebarV2.tsx` ⭐ (usar esta versión)
- [ ] `ContractSuggestion.tsx` ⭐
- [ ] `ContractDataSidebar.tsx` ⭐
- [ ] `ConversationContractsSidebar.tsx` ⭐
- [ ] `ContractCreationModal.tsx` ⭐
- [ ] `ChatInterface.tsx` ⭐⭐⭐ ÚLTIMO (depende de todos)

**Verificar después de cada componente:**
- [ ] No hay errores de imports
- [ ] Ajustar paths si es necesario
- [ ] TypeScript sin errores

### Fase 1.11: Actualizar Página de Abogado

**Reemplazar:**
- [ ] `lexyweb/app/(dashboard)/abogado/page.tsx`
  CON `lexyapp/src/app/(dashboard)/abogado/page.tsx`

### TESTING SPRINT 1 ✅

- [ ] Login funciona
- [ ] `/abogado` carga sin errores
- [ ] Chat envía mensaje y recibe respuesta de Lexy
- [ ] Detección de intención de contrato funciona
- [ ] Banner "Puedo ayudarte a crear un contrato" aparece
- [ ] Modo contrato se activa correctamente
- [ ] Sidebar de datos aparece y es editable
- [ ] Generación de contrato funciona (al menos básica)
- [ ] Contrato se guarda en base de datos
- [ ] No hay errores en consola
- [ ] Build funciona: `npm run build`

**Commit:**
```bash
git add .
git commit -m "feat: migrar sistema completo de chat y generación de contratos (SPRINT 1)

- Copiar types: contrato, conversacion, mensaje, gemini
- Copiar lib/gemini completo con 10 archivos
- Copiar lib/store (chatStore)
- Copiar lib/contracts y lib/claude
- Copiar 10 APIs de contratos
- Copiar 8 APIs de chat/conversaciones
- Copiar 10 componentes de abogado/chat
- Actualizar página /abogado

Testing: Chat funcional + Generación básica verificada

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🔴 SPRINT 2: GESTIÓN CONTRATOS

**Objetivo:** Lista, filtros, wizard, detalle de contratos
**Duración estimada:** 5 días

### Fase 2.1: Componentes de Contratos

**Copiar desde `lexyapp/src/components/contratos/` a `lexyweb/components/contratos/`:**

- [ ] `ContractFilters.tsx`
- [ ] `DeleteContractDialog.tsx`
- [ ] `ContractCard.tsx` ⭐
- [ ] `ContractsList.tsx` ⭐
- [ ] `ContractDetailView.tsx` ⭐
- [ ] `ContractPreview.tsx` ⭐
- [ ] `ContractFormWizard.tsx` ⭐
- [ ] `ContractCreationSelector.tsx` ⭐

### Fase 2.2: Actualizar Página de Contratos

**Reemplazar:**
- [ ] `lexyweb/app/(dashboard)/contratos/page.tsx`
  CON versión mejorada de lexyapp

### Fase 2.3: Rutas de Detalle

**Copiar desde `lexyapp/src/app/(dashboard)/contratos/`:**

- [ ] `[id]/page.tsx` ⭐
- [ ] `[id]/firmar/page.tsx`

### TESTING SPRINT 2 ✅

- [ ] `/contratos` muestra lista de contratos
- [ ] Filtros funcionan correctamente
- [ ] Click en "Nuevo Contrato" abre selector
- [ ] Wizard de 3 pasos funciona
- [ ] Generación manual funciona
- [ ] Preview de contrato se muestra
- [ ] Click en contrato abre detalle
- [ ] Detalle muestra toda la información
- [ ] Botones de acciones funcionan
- [ ] No hay errores en consola
- [ ] Build funciona

**Commit:**
```bash
git add .
git commit -m "feat: sistema completo de gestión de contratos (SPRINT 2)

- Copiar 8 componentes de contratos
- Actualizar página /contratos con lista
- Agregar rutas de detalle [id]

Testing: Gestión de contratos verificada

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🟡 SPRINT 3: CANVAS Y FIRMAS

**Objetivo:** Edición avanzada + Firmas digitales
**Duración estimada:** 5 días

### Fase 3.1: APIs de Claude

**Copiar desde `lexyapp/src/app/api/claude/`:**

- [ ] `consult/route.ts` ⭐
- [ ] `contract-assist/route.ts` ⭐

**Testing intermedio:**
- [ ] Test API: `POST /api/claude/consult`

### Fase 3.2: APIs de Firmas

**Copiar desde `lexyapp/src/app/api/contracts/`:**

- [ ] `[id]/prepare-signature/route.ts` ⭐
- [ ] `sign/[token]/route.ts` ⭐

### Fase 3.3: Componentes Canvas

**Copiar desde `lexyapp/src/components/contratos/`:**

- [ ] `SignatureCanvas.tsx` ⭐
- [ ] `SendToSignModal.tsx` ⭐
- [ ] `ShareSignatureLinkModal.tsx` ⭐
- [ ] `ContractAssistantChat.tsx` ⭐
- [ ] `ContractCanvasSidebar.tsx` ⭐ (depende de ContractAssistantChat)

### Fase 3.4: Ruta Pública de Firma

**Copiar desde `lexyapp/src/app/contratos/`:**

- [ ] `[id]/firmar/[token]/page.tsx` ⭐

### Fase 3.5: Librería de PDF

- [ ] Verificar si existe `lexyapp/src/lib/pdf/`
- [ ] Copiar si existe a `lexyweb/lib/pdf/`
- [ ] Si no existe, crear lógica de PDF en componentes

### TESTING SPRINT 3 ✅

- [ ] Botón "Editar con Lexy" abre Canvas
- [ ] Canvas muestra documento a la derecha
- [ ] Chat de Lexy aparece a la izquierda
- [ ] Solicitar cambio funciona
- [ ] Lexy aplica cambios automáticamente
- [ ] Indicador "✨ Cambio aplicado" aparece
- [ ] Botón "Guardar cambios" funciona
- [ ] Preparar firma genera token
- [ ] Link de firma es accesible públicamente
- [ ] Canvas de firma táctil funciona
- [ ] Firma se guarda correctamente
- [ ] PDF con firma se genera
- [ ] No hay errores en consola
- [ ] Build funciona

**Commit:**
```bash
git add .
git commit -m "feat: sistema Canvas de edición y firmas digitales (SPRINT 3)

- Copiar APIs de Claude (consult, contract-assist)
- Copiar APIs de firmas (prepare-signature, sign)
- Copiar 5 componentes de Canvas
- Agregar ruta pública de firma
- Copiar lib/pdf si existe

Testing: Canvas y firmas verificados

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🟡 SPRINT 4: ORGANIZACIONES

**Objetivo:** Equipos, invitaciones, roles
**Duración estimada:** 5 días

### Fase 4.1: APIs de Organizaciones

**Copiar desde `lexyapp/src/app/api/organizations/`:**

- [ ] `[id]/route.ts` (GET, PATCH, DELETE)
- [ ] `[id]/members/[memberId]/route.ts` (PATCH, DELETE)
- [ ] `[id]/invitations/route.ts` (GET, POST)
- [ ] `invitations/[id]/accept/route.ts`
- [ ] `invitations/[id]/reject/route.ts`

**Testing intermedio:**
- [ ] Test API: `GET /api/organizations/[id]`
- [ ] Test API: `POST /api/organizations/[id]/invitations`

### Fase 4.2: Componentes de Organizaciones

**Copiar desde `lexyapp/src/components/organizations/`:**

- [ ] `InviteUserModal.tsx`
- [ ] `ManageTeamModal.tsx`

### Fase 4.3: APIs de Notificaciones

**Copiar desde `lexyapp/src/app/api/notifications/`:**

- [ ] `route.ts` (GET, POST)
- [ ] `[id]/route.ts` (GET, PATCH, DELETE)
- [ ] `[id]/read/route.ts` (PATCH)

### Fase 4.4: Componentes de Notificaciones

**Copiar desde `lexyapp/src/components/notifications/`:**

- [ ] `NotificationBell.tsx` ⭐
- [ ] `NotificationsPanel.tsx` ⭐

### Fase 4.5: Integrar en Layout

- [ ] Agregar `NotificationBell` al header del dashboard
- [ ] Verificar que aparece el count de notificaciones

### TESTING SPRINT 4 ✅

- [ ] Crear organización funciona
- [ ] Invitar usuario por email funciona
- [ ] Notificación de invitación aparece
- [ ] Bell de notificaciones muestra count
- [ ] Click en bell abre dropdown
- [ ] Notificaciones se listan correctamente
- [ ] Aceptar invitación funciona
- [ ] Rechazar invitación funciona
- [ ] Marcar como leída funciona
- [ ] Gestionar equipo (modal) funciona
- [ ] Eliminar miembro funciona
- [ ] No hay errores en consola
- [ ] Build funciona

**Commit:**
```bash
git add .
git commit -m "feat: sistema de organizaciones y notificaciones (SPRINT 4)

- Copiar 5 APIs de organizaciones
- Copiar 2 componentes de organizaciones
- Copiar 3 APIs de notificaciones
- Copiar 2 componentes de notificaciones
- Integrar NotificationBell en layout

Testing: Organizaciones y notificaciones verificadas

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🟡 SPRINT 5: SUBSCRIPCIONES

**Objetivo:** Sistema completo de pagos con Stripe
**Duración estimada:** 5 días

### Fase 5.1: APIs de Stripe Completas

**Copiar/Mejorar desde `lexyapp/src/app/api/stripe/`:**

- [ ] Comparar y mejorar `checkout/route.ts`
- [ ] Comparar y mejorar `verify-session/route.ts`
- [ ] Copiar `portal/route.ts` ⭐
- [ ] Copiar `webhook/route.ts` ⭐⭐⭐

**Configurar webhooks:**
- [ ] Agregar `STRIPE_WEBHOOK_SECRET` a `.env.local`
- [ ] Configurar endpoint en Stripe Dashboard

### Fase 5.2: Rutas de Subscripciones

**Copiar desde `lexyapp/src/app/subscription/`:**

- [ ] `plans/page.tsx` ⭐
- [ ] Mejorar `success/page.tsx` (comparar con actual)
- [ ] `blocked/page.tsx` ⭐

### Fase 5.3: Componentes de Subscripciones

**Copiar desde `lexyapp/src/components/subscription/`:**

- [ ] `PricingModal.tsx` ⭐
- [ ] `SubscriptionBlockedScreen.tsx` ⭐

### Fase 5.4: Middleware de Verificación

- [ ] Verificar `middleware.ts` tiene lógica de subscripción
- [ ] Agregar verificación si no existe
- [ ] Redirigir a `/subscription/blocked` si no hay subscripción activa

### TESTING SPRINT 5 ✅

- [ ] `/subscription/plans` muestra planes
- [ ] Click en plan abre Stripe Checkout
- [ ] Checkout funciona con tarjeta de prueba
- [ ] Webhook recibe evento de pago exitoso
- [ ] Subscripción se activa en base de datos
- [ ] Features se desbloquean automáticamente
- [ ] Portal de cliente funciona (cambiar plan, cancelar)
- [ ] Pantalla de bloqueo aparece si no hay subscripción
- [ ] Verificación de sesión funciona
- [ ] No hay errores en consola
- [ ] Build funciona

**Testing webhooks locales:**
```bash
# Usar Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# En otra terminal, trigger evento de prueba
stripe trigger payment_intent.succeeded
```

**Commit:**
```bash
git add .
git commit -m "feat: sistema completo de subscripciones con Stripe (SPRINT 5)

- Mejorar APIs de Stripe (checkout, verify-session)
- Copiar API de portal y webhook
- Copiar 3 rutas de subscripciones
- Copiar 2 componentes de subscripciones
- Agregar verificación en middleware

Testing: Subscripciones verificadas con webhooks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🟢 SPRINT 6: MEJORAS

**Objetivo:** Features auxiliares y pulido UX
**Duración estimada:** 5 días

### Fase 6.1: Dashboard Mejorado

**Copiar desde `lexyapp/src/components/dashboard/`:**

- [ ] `DashboardFilters.tsx`

**Actualizar:**
- [ ] Integrar filtros en página de dashboard

### Fase 6.2: Componentes de Layout

**Copiar desde `lexyapp/src/components/layout/`:**

- [ ] `BackToDashboard.tsx`

**Copiar desde `lexyapp/src/components/auth/`:**

- [ ] `LogoutButton.tsx`

### Fase 6.3: Share Chat

**Copiar desde `lexyapp/src/components/chat/`:**

- [ ] `ShareChatModal.tsx`

**Actualizar:**
- [ ] Agregar botón "Compartir" en chat
- [ ] Integrar modal

### Fase 6.4: APIs Auxiliares

**Copiar desde `lexyapp/src/app/api/`:**

- [ ] `profile/route.ts`
- [ ] `users/search/route.ts`

### Fase 6.5: Storage

**Copiar desde `lexyapp/src/lib/supabase/`:**

- [ ] `storage.ts`

### Fase 6.6: Componentes UI Faltantes

**Copiar desde `lexyapp/src/components/ui/`:**

- [ ] Comparar y copiar componentes UI faltantes
- [ ] `Section.tsx`
- [ ] Otros componentes UI que no estén

### TESTING SPRINT 6 ✅

- [ ] Filtros de dashboard funcionan
- [ ] Navegación mejorada funciona
- [ ] Botón "Volver al Dashboard" funciona
- [ ] Compartir chat funciona
- [ ] Link de chat compartido funciona
- [ ] API de perfil funciona
- [ ] Búsqueda de usuarios funciona
- [ ] Storage funciona si se usa
- [ ] Componentes UI funcionan
- [ ] No hay errores en consola
- [ ] Build funciona

**Commit:**
```bash
git add .
git commit -m "feat: mejoras y features auxiliares (SPRINT 6)

- Copiar dashboard con filtros
- Copiar componentes de layout mejorados
- Copiar share chat
- Copiar APIs auxiliares (profile, users)
- Copiar storage
- Completar componentes UI faltantes

Testing: Features auxiliares verificadas

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## ✅ SPRINT 7: VALIDACIÓN

**Objetivo:** Testing E2E, documentación, deploy
**Duración estimada:** 5 días

### Fase 7.1: Testing E2E Completo

#### Test 1: Registro y Login
- [ ] Registro de usuario nuevo funciona
- [ ] Email de confirmación llega
- [ ] Login funciona con credenciales correctas
- [ ] Error con credenciales incorrectas

#### Test 2: Flujo Chat → Contrato
- [ ] Abrir `/abogado`
- [ ] Enviar mensaje: "Necesito un contrato de arrendamiento"
- [ ] Lexy detecta intención
- [ ] Banner de sugerencia aparece
- [ ] Activar modo contrato
- [ ] Sidebar de datos aparece
- [ ] Responder preguntas de Lexy
- [ ] Sidebar se actualiza automáticamente
- [ ] Generar contrato funciona
- [ ] Contrato aparece en sidebar derecho
- [ ] Click abre contrato en detalle

#### Test 3: Flujo Manual → Contrato
- [ ] Ir a `/contratos`
- [ ] Click en "Nuevo Contrato"
- [ ] Selector de método aparece
- [ ] Elegir "Creación manual"
- [ ] Wizard paso 1: Seleccionar tipo
- [ ] Wizard paso 2: Datos de partes
- [ ] Wizard paso 3: Contexto adicional
- [ ] Generar contrato
- [ ] Preview se muestra
- [ ] Guardar contrato

#### Test 4: Canvas de Edición
- [ ] Abrir contrato existente
- [ ] Click en "Editar con Lexy"
- [ ] Canvas se abre
- [ ] Documento a la derecha, chat a la izquierda
- [ ] Solicitar cambio: "Cambia la fecha a 1 de febrero"
- [ ] Lexy responde y aplica cambio
- [ ] Indicador "✨ Cambio aplicado" aparece
- [ ] Guardar cambios funciona

#### Test 5: Firmas Digitales
- [ ] Abrir contrato
- [ ] Click en "Preparar para firma"
- [ ] Modal de preparación aparece
- [ ] Generar link de firma
- [ ] Copiar link
- [ ] Abrir link en navegador de incógnito (o logout)
- [ ] Página pública de firma carga
- [ ] Canvas de firma táctil funciona
- [ ] Dibujar firma
- [ ] Confirmar firma
- [ ] PDF con firma se genera
- [ ] Estado cambia a "Firmado"

#### Test 6: Organizaciones
- [ ] Crear organización
- [ ] Invitar usuario por email
- [ ] Notificación aparece en bell
- [ ] Usuario invitado recibe email
- [ ] Aceptar invitación
- [ ] Verificar usuario en equipo
- [ ] Gestionar equipo (ver miembros)
- [ ] Eliminar miembro

#### Test 7: Subscripciones
- [ ] Logout y crear usuario nuevo
- [ ] Intentar acceder a `/abogado` sin subscripción
- [ ] Redirige a `/subscription/blocked`
- [ ] Click en "Ver planes"
- [ ] Página de planes carga
- [ ] Click en plan
- [ ] Stripe Checkout abre
- [ ] Completar pago con tarjeta de prueba: 4242 4242 4242 4242
- [ ] Redirige a `/subscription/success`
- [ ] Subscripción activa
- [ ] Acceso a `/abogado` desbloqueado

#### Test 8: Dashboard
- [ ] Ir a `/dashboard`
- [ ] Estadísticas se muestran
- [ ] Filtros funcionan
- [ ] Gráficos se actualizan

### Fase 7.2: Verificar Migraciones SQL

- [ ] Todas las 12 migraciones existen en lexyweb
- [ ] Todas han sido aplicadas a Supabase
- [ ] RLS está activo en todas las tablas
- [ ] Funciones helper existen
- [ ] Triggers están activos
- [ ] Views de estadísticas funcionan

### Fase 7.3: Verificar Variables de Entorno

**Producción (.env.local y Vercel):**

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GEMINI_API_KEY` ⭐
- [ ] `ANTHROPIC_API_KEY` ⭐
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Variables de Sanity (ya existentes)

### Fase 7.4: Build y Deploy

- [ ] Build local sin errores: `npm run build`
- [ ] TypeScript sin errores: `npm run lint`
- [ ] No hay warnings críticos
- [ ] Test en localhost:3000
- [ ] Deploy a Vercel staging
- [ ] Test en staging
- [ ] Deploy a producción
- [ ] Test en producción

### Fase 7.5: Documentación

**Actualizar archivos:**

- [ ] `README.md` - Agregar features de lexyapp
- [ ] Crear/Actualizar `ESTADO.md` - Estado técnico completo
- [ ] Crear/Actualizar `ARCHITECTURE.md` - Arquitectura completa
- [ ] Crear `API.md` - Documentación de todas las APIs
- [ ] Actualizar comentarios en código si es necesario

### Fase 7.6: Lighthouse y Performance

- [ ] Score de Performance > 90
- [ ] Score de Accessibility > 90
- [ ] Score de Best Practices > 90
- [ ] Score de SEO > 90

### TESTING FINAL ✅

- [ ] TODOS los tests E2E pasan
- [ ] Build sin errores
- [ ] Deploy exitoso
- [ ] App funciona en producción
- [ ] No hay errores en consola de producción
- [ ] Logs de Vercel sin errores críticos
- [ ] Webhooks de Stripe funcionan en producción
- [ ] Emails se envían correctamente
- [ ] Lighthouse scores > 90

**Commit Final:**
```bash
git add .
git commit -m "feat: validación completa y deploy a producción (SPRINT 7)

- Testing E2E completo (8 flujos)
- Verificación de migraciones SQL
- Documentación actualizada
- Build optimizado
- Deploy a producción exitoso
- Lighthouse scores > 90

MIGRACIÓN COMPLETA: lexyweb tiene 100% de features de lexyapp

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🎯 MERGE A MAIN

**Después de verificar TODO:**

```bash
# Desde rama migration/lexyapp-full
git checkout main
git merge migration/lexyapp-full
git push origin main
```

---

## 📊 RESUMEN DE PROGRESO

**Progreso general:**

```
┌─────────────────────────────────────────┐
│  SPRINT 1: Core Crítico          [ ]   │
│  SPRINT 2: Gestión Contratos     [ ]   │
│  SPRINT 3: Canvas y Firmas       [ ]   │
│  SPRINT 4: Organizaciones        [ ]   │
│  SPRINT 5: Subscripciones        [ ]   │
│  SPRINT 6: Mejoras               [ ]   │
│  SPRINT 7: Validación            [ ]   │
│                                          │
│  PROGRESO TOTAL: 0/7 (0%)               │
└─────────────────────────────────────────┘
```

**Actualizar después de cada SPRINT completado.**

---

## 📝 NOTAS

### Problemas Comunes

1. **Errores de importación:**
   - Verificar que paths `@/` apuntan a raíz
   - Ajustar imports de `src/` a raíz

2. **Errores de tipos:**
   - Copiar types PRIMERO
   - Verificar imports de tipos

3. **APIs no responden:**
   - Verificar variables de entorno
   - Verificar keys de APIs (Gemini, Claude, Stripe)
   - Verificar CORS si es necesario

4. **Build falla:**
   - Verificar todas las dependencias instaladas
   - Limpiar `.next/`: `rm -rf .next`
   - Reinstalar deps: `rm -rf node_modules && npm install`

### Comandos Útiles

```bash
# Limpiar y rebuild
rm -rf .next node_modules
npm install
npm run build

# Ver logs en desarrollo
npm run dev

# Testing de APIs
curl -X POST http://localhost:3000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola"}'

# Stripe webhooks locales
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Ver logs de Supabase
# En Supabase Dashboard > Logs
```

---

## 🎉 COMPLETADO

**Fecha de finalización:** ______________

**Verificado por:** ______________

**Deploy URL:** ______________

**Lighthouse scores:**
- Performance: ____
- Accessibility: ____
- Best Practices: ____
- SEO: ____

---

**¡MIGRACIÓN COMPLETADA EXITOSAMENTE! 🚀**
