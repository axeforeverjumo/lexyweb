# 🔄 PLAN DE MIGRACIÓN: lexyapp → lexyweb

**Fecha de Auditoría:** 28 Enero 2026
**Analista:** Claude Code
**Estado:** AUDITORÍA COMPLETADA - PLAN EJECUTABLE

---

## 📊 EXECUTIVE SUMMARY

### Estado Actual
- **ORIGEN (lexyapp):** Aplicación completa con 127 archivos TypeScript/TSX
- **DESTINO (lexyweb):** Aplicación parcial con 79 archivos TypeScript/TSX
- **GAP:** ~48 archivos críticos faltantes + funcionalidades completas sin migrar

### Completitud Estimada
```
lexyweb Completitud: 35-40%
├─ ✅ Autenticación: 80%
├─ ⚠️  Chat IA: 5%
├─ ⚠️  Contratos: 10%
├─ ⚠️  APIs: 15%
├─ ❌ Organizaciones: 0%
├─ ❌ Notificaciones: 0%
└─ ❌ Subscripciones: 0%
```

### Priorización
| Criticidad | Features | % Total |
|-----------|----------|---------|
| 🔴 CRÍTICO | Chat IA, Generación Contratos, APIs Core | 50% |
| 🟡 IMPORTANTE | Canvas Edición, Firmas, Organizaciones | 30% |
| 🟢 MEJORAS | Notificaciones, Subscripciones, Dashboard | 20% |

---

## 🔍 INVENTARIO COMPLETO

### ✅ Features IMPLEMENTADAS en lexyweb

#### 1. Autenticación (80% completo)
```
✅ app/(auth)/login/page.tsx
✅ app/(auth)/register/page.tsx
✅ app/(auth)/forgot-password/page.tsx ⭐ (EXTRA, no en lexyapp)
✅ app/(auth)/layout.tsx
✅ app/auth/callback/route.ts
✅ components/auth/* (5 archivos)
✅ lib/auth/* (2 archivos)
✅ lib/supabase/client.ts
✅ lib/supabase/server.ts
```
**FALTANTE:**
- ❌ `components/auth/LogoutButton.tsx` (existe en lexyapp)

#### 2. Landing Pages (100% completo)
```
✅ app/page.tsx (Hero principal)
✅ app/urgente/page.tsx (Landing urgencia)
✅ app/(legal)/terminos/page.tsx
✅ app/(legal)/privacidad/page.tsx
✅ components/sections/* (13 componentes)
✅ components/blog/* (1 componente)
```

#### 3. Blog/CMS (100% completo - EXTRA)
```
✅ app/blog/page.tsx
✅ app/blog/[slug]/page.tsx
✅ app/studio/[[...index]]/page.tsx (Sanity Studio)
✅ sanity/schemas/* (5 esquemas)
✅ lib/sanity.client.ts
✅ lib/sanity.types.ts
⭐ NO EXISTE EN LEXYAPP - Feature adicional de lexyweb
```

#### 4. Stripe Checkout (Básico - 30% completo)
```
✅ app/api/checkout/route.ts
✅ app/api/verify-session/route.ts
✅ app/success/page.tsx
✅ components/useCheckout.ts
✅ lib/stripe.ts
```
**FALTANTE:**
- ❌ `app/api/stripe/portal/route.ts`
- ❌ `app/api/stripe/webhook/route.ts`
- ❌ Sistema completo de subscripciones

#### 5. Dashboard (20% completo)
```
✅ app/(dashboard)/layout.tsx
✅ app/(dashboard)/dashboard/page.tsx
✅ app/(dashboard)/abogado/page.tsx (PLACEHOLDER)
✅ app/(dashboard)/contratos/page.tsx (PLACEHOLDER)
✅ components/layout/DashboardLayout.tsx
```

---

### ❌ Features FALTANTES en lexyweb

#### 🔴 CRÍTICO 1: Sistema de Chat Completo con IA (0% migrado)

**Descripción:** Motor conversacional completo con Lexy (Gemini), detección de intención de contrato, modo contrato activable, extracción de datos en tiempo real.

**Archivos Origen (lexyapp):**
```
src/components/abogado/
├─ ChatInterface.tsx (31KB) ⭐ CORE
├─ ChatInput.tsx
├─ MessageBubble.tsx
├─ ConversationsSidebar.tsx
├─ ConversationsSidebarV2.tsx (11KB) ⭐ Versión optimizada
├─ ConversationItem.tsx
├─ ContractSuggestion.tsx (11KB) ⭐ Sugerencias inteligentes
├─ ContractDataSidebar.tsx (11KB) ⭐ Sidebar de datos en tiempo real
├─ ConversationContractsSidebar.tsx (5KB) ⭐ Sidebar de contratos generados
└─ ContractCreationModal.tsx (26KB) ⭐ Modal de creación de contratos
```

**Archivos Destino (lexyweb):**
```
components/abogado/ (VACÍO - 0 archivos)
```

**APIs Necesarias:**
```
src/app/api/gemini/chat/route.ts ⭐ CRÍTICO
src/app/api/conversaciones/route.ts
src/app/api/conversaciones/[id]/route.ts
src/app/api/conversaciones/[id]/mensajes/route.ts
src/app/api/conversaciones/[id]/participants/route.ts
src/app/api/conversaciones/[id]/share/route.ts
src/app/api/chat/contract/[id]/route.ts
src/app/api/chat-shares/[id]/accept/route.ts
```

**Librerías Core:**
```
src/lib/gemini/client.ts ⭐ Cliente Gemini
src/lib/gemini/embeddings.ts
src/lib/gemini/prompts/ (8 archivos) ⭐ TODOS los prompts
src/lib/store/chatStore.ts (Zustand store)
```

**Types:**
```
src/types/conversacion.types.ts
src/types/mensaje.types.ts
src/types/gemini.types.ts
```

**Dependencias:**
- ✅ `@google/generative-ai` (ya en lexyweb)
- ❌ `zustand` (NO en lexyweb)

---

#### 🔴 CRÍTICO 2: Sistema Completo de Contratos (10% migrado)

**Descripción:** Generación inteligente de contratos con Claude, búsqueda híbrida de templates, wizard de creación, preview, edición Canvas.

**Componentes Faltantes:**
```
src/components/contratos/
├─ ContractCreationSelector.tsx (10KB) ⭐ Selector de flujo
├─ ContractFormWizard.tsx (19KB) ⭐ Wizard 3 pasos
├─ ContractCard.tsx (7KB)
├─ ContractsList.tsx (8KB)
├─ ContractDetailView.tsx (6KB)
├─ ContractFilters.tsx
├─ ContractPreview.tsx (11KB) ⭐ Preview profesional
├─ ContractCanvasSidebar.tsx (9KB) ⭐ Canvas tipo ChatGPT
├─ ContractAssistantChat.tsx (7KB) ⭐ Chat de edición con Lexy
├─ SignatureCanvas.tsx (4KB) ⭐ Canvas de firma táctil
├─ SendToSignModal.tsx (7KB)
├─ ShareSignatureLinkModal.tsx (7KB)
└─ DeleteContractDialog.tsx
```

**APIs Core:**
```
src/app/api/contracts/
├─ generate/route.ts ⭐ Generación base
├─ generate-intelligent/route.ts ⭐ Generación inteligente
├─ generate-with-claude/route.ts ⭐ Generación con Claude
├─ detect-intent/route.ts ⭐ Detección de intención
├─ find-template/route.ts ⭐ Búsqueda híbrida
├─ analyze-conversation/route.ts ⭐ Análisis profundo
├─ list/route.ts
├─ by-conversation/[conversacionId]/route.ts
├─ [id]/route.ts (GET, PATCH, DELETE)
├─ [id]/update-title/route.ts
├─ [id]/prepare-signature/route.ts ⭐ Preparar firma
└─ sign/[token]/route.ts ⭐ Firmar con token
```

**Librerías:**
```
src/lib/contracts/
├─ generator.ts ⭐ Motor de generación
└─ templates/compraventa.ts (ejemplo)

src/lib/claude/generation-settings/
├─ arrendamiento-vivienda.ts ⭐ Settings específicos
└─ arras-penitenciales.ts

src/lib/pdf/ (generación de PDFs)
```

**Rutas Públicas:**
```
src/app/contratos/[id]/firmar/[token]/page.tsx ⭐ Firma pública
src/app/(dashboard)/contratos/[id]/page.tsx ⭐ Detalle de contrato
src/app/(dashboard)/contratos/[id]/firmar/page.tsx ⭐ Firmar autenticado
```

**Types:**
```
src/types/contrato.types.ts ⭐ CRÍTICO
```

**Dependencias:**
- ❌ `@anthropic-ai/sdk` (ya en lexyweb)
- ❌ `jspdf` (NO en lexyweb)
- ❌ `html2canvas` (NO en lexyweb)
- ❌ `react-signature-canvas` (NO en lexyweb)
- ❌ `@types/react-signature-canvas` (NO en lexyweb)

---

#### 🔴 CRÍTICO 3: APIs de Claude (0% migrado)

**Descripción:** Integración con Claude para generación de documentos profesionales y asistencia en edición.

```
src/app/api/claude/
├─ consult/route.ts ⭐ Consultas generales
└─ contract-assist/route.ts ⭐ Asistencia en contratos
```

---

#### 🟡 IMPORTANTE 1: Sistema de Organizaciones (0% migrado)

**Descripción:** Gestión de equipos, invitaciones, roles, membresías.

**Componentes:**
```
src/components/organizations/
├─ InviteUserModal.tsx
└─ ManageTeamModal.tsx
```

**APIs:**
```
src/app/api/organizations/
├─ [id]/route.ts (GET, PATCH, DELETE)
├─ [id]/members/[memberId]/route.ts (PATCH, DELETE)
├─ [id]/invitations/route.ts (GET, POST)
└─ invitations/[id]/accept/route.ts
└─ invitations/[id]/reject/route.ts
```

**Migraciones SQL:**
```
supabase/migrations/20260122000003_create_organizations_table.sql ✅ (ya en lexyweb)
supabase/migrations/20260122000004_create_organization_invitations_table.sql ✅ (ya en lexyweb)
```

---

#### 🟡 IMPORTANTE 2: Sistema de Notificaciones (0% migrado)

**Componentes:**
```
src/components/notifications/
├─ NotificationBell.tsx ⭐ Bell con badge de count
└─ NotificationsPanel.tsx ⭐ Dropdown de notificaciones
```

**APIs:**
```
src/app/api/notifications/
├─ route.ts (GET, POST)
├─ [id]/route.ts (GET, PATCH, DELETE)
└─ [id]/read/route.ts (PATCH)
```

**Migraciones SQL:**
```
supabase/migrations/20260122000009_create_notifications_table.sql ✅ (ya en lexyweb)
```

---

#### 🟡 IMPORTANTE 3: Sistema de Subscripciones Completo (0% migrado)

**Descripción:** Gestión completa de planes, checkout, portal, webhooks, bloqueos.

**Rutas:**
```
src/app/subscription/
├─ plans/page.tsx ⭐ Planes y precios
├─ success/page.tsx ⭐ Éxito de pago
└─ blocked/page.tsx ⭐ Pantalla de bloqueo
```

**Componentes:**
```
src/components/subscription/
├─ PricingModal.tsx ⭐ Modal de pricing
└─ SubscriptionBlockedScreen.tsx ⭐ Pantalla de bloqueo completa
```

**APIs:**
```
src/app/api/stripe/
├─ checkout/route.ts ⚠️ (versión simple existe en lexyweb)
├─ portal/route.ts ❌ FALTANTE
├─ webhook/route.ts ❌ FALTANTE
└─ verify-session/route.ts ⚠️ (versión simple existe en lexyweb)
```

**Types:**
```
src/types/subscription.types.ts
```

**Migraciones SQL:**
```
supabase/migrations/20260122000002_create_subscriptions_table.sql ✅ (ya en lexyweb)
```

---

#### 🟢 MEJORAS 1: Dashboard con Filtros (20% migrado)

**Componentes:**
```
src/components/dashboard/
└─ DashboardFilters.tsx ⭐ Filtros avanzados
```

---

#### 🟢 MEJORAS 2: Componentes Layout (50% migrado)

```
src/components/layout/
└─ BackToDashboard.tsx ⭐ Navegación mejorada
```

---

#### 🟢 MEJORAS 3: Componentes UI Adicionales (90% migrado)

**Faltantes:**
```
src/components/ui/Section.tsx
```

---

#### 🟢 MEJORAS 4: Librería de Validators (0% migrado)

```
src/lib/validators/
├─ amounts.ts ⭐ Validación de cantidades
├─ dates.ts ⭐ Validación de fechas
├─ dni.ts ⭐ Validación de DNI/NIE
└─ index.ts
```

---

#### 🟢 MEJORAS 5: Utilidades Adicionales (50% migrado)

**Faltantes:**
```
src/lib/utils/cn.ts ⚠️ (puede estar inline en utils.ts)
src/lib/utils/constants.ts ⭐ Constantes globales
```

---

#### 🟢 MEJORAS 6: Storage de Supabase (0% migrado)

```
src/lib/supabase/storage.ts ⭐ Gestión de archivos
```

---

#### 🟢 MEJORAS 7: APIs Auxiliares (0% migrado)

```
src/app/api/profile/route.ts ⭐ Perfil de usuario
src/app/api/users/search/route.ts ⭐ Búsqueda de usuarios
```

---

#### 🟢 MEJORAS 8: Share Chat (0% migrado)

```
src/components/chat/ShareChatModal.tsx ⭐ Compartir conversación
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### SPRINT 1 - CORE CRÍTICO (Semana 1-2) 🔴

**Objetivo:** Restaurar funcionalidad core de chat y generación de contratos.

#### Fase 1.1: Setup de Dependencias
```bash
cd lexyweb
npm install zustand jspdf html2canvas react-signature-canvas @types/react-signature-canvas
```

#### Fase 1.2: Types y Librerías Base
```
ORDEN:
1. Copiar src/types/*.types.ts → types/
   - contrato.types.ts ⭐
   - conversacion.types.ts ⭐
   - mensaje.types.ts ⭐
   - gemini.types.ts ⭐
   - user.types.ts
   - subscription.types.ts

2. Copiar src/lib/gemini/ → lib/gemini/
   - client.ts ⭐
   - embeddings.ts ⭐
   - prompts/* (todos los 8 archivos) ⭐

3. Copiar src/lib/store/ → lib/store/
   - chatStore.ts ⭐

4. Copiar src/lib/contracts/ → lib/contracts/
   - generator.ts ⭐
   - templates/compraventa.ts

5. Copiar src/lib/claude/ → lib/claude/
   - generation-settings/* (2 archivos)

6. Copiar src/lib/validators/ → lib/validators/
   - *.ts (4 archivos)

7. Copiar src/lib/utils/ → lib/utils/
   - constants.ts ⭐
```

#### Fase 1.3: APIs Core de Contratos
```
ORDEN (dependencies first):
1. app/api/contracts/list/route.ts
2. app/api/contracts/[id]/route.ts
3. app/api/contracts/detect-intent/route.ts ⭐
4. app/api/contracts/find-template/route.ts ⭐
5. app/api/contracts/analyze-conversation/route.ts ⭐
6. app/api/contracts/generate/route.ts ⭐
7. app/api/contracts/generate-intelligent/route.ts ⭐
8. app/api/contracts/generate-with-claude/route.ts ⭐
9. app/api/contracts/by-conversation/[conversacionId]/route.ts
10. app/api/contracts/[id]/update-title/route.ts
```

#### Fase 1.4: APIs de Chat
```
ORDEN:
1. app/api/conversaciones/route.ts ⭐
2. app/api/conversaciones/[id]/route.ts
3. app/api/conversaciones/[id]/mensajes/route.ts ⭐
4. app/api/conversaciones/[id]/participants/route.ts
5. app/api/conversaciones/[id]/share/route.ts
6. app/api/gemini/chat/route.ts ⭐ CRÍTICO
7. app/api/chat/contract/[id]/route.ts ⭐
8. app/api/chat-shares/[id]/accept/route.ts
```

#### Fase 1.5: Componentes de Chat
```
ORDEN:
1. components/abogado/MessageBubble.tsx
2. components/abogado/ChatInput.tsx
3. components/abogado/ConversationItem.tsx
4. components/abogado/ConversationsSidebar.tsx
5. components/abogado/ConversationsSidebarV2.tsx ⭐ (usar esta)
6. components/abogado/ContractSuggestion.tsx ⭐
7. components/abogado/ContractDataSidebar.tsx ⭐
8. components/abogado/ConversationContractsSidebar.tsx ⭐
9. components/abogado/ContractCreationModal.tsx ⭐
10. components/abogado/ChatInterface.tsx ⭐ ÚLTIMO (depende de todos)
```

#### Fase 1.6: Actualizar Página de Abogado
```
Reemplazar:
app/(dashboard)/abogado/page.tsx
CON:
src/app/(dashboard)/abogado/page.tsx (de lexyapp)
```

**TESTING FASE 1:**
```bash
# Verificar:
1. Login funciona
2. /abogado carga sin errores
3. Chat envía mensaje y recibe respuesta
4. Detección de intención de contrato funciona
5. Modo contrato se activa
6. Sidebar de datos aparece
7. Generación de contrato funciona
```

---

### SPRINT 2 - GESTIÓN DE CONTRATOS (Semana 3) 🔴

**Objetivo:** Sistema completo de gestión de contratos.

#### Fase 2.1: Componentes de Contratos
```
ORDEN:
1. components/contratos/ContractFilters.tsx
2. components/contratos/DeleteContractDialog.tsx
3. components/contratos/ContractCard.tsx ⭐
4. components/contratos/ContractsList.tsx ⭐
5. components/contratos/ContractDetailView.tsx ⭐
6. components/contratos/ContractPreview.tsx ⭐
7. components/contratos/ContractFormWizard.tsx ⭐
8. components/contratos/ContractCreationSelector.tsx ⭐
```

#### Fase 2.2: Actualizar Página de Contratos
```
Reemplazar:
app/(dashboard)/contratos/page.tsx
CON:
Versión de lexyapp con lista completa de contratos
```

#### Fase 2.3: Rutas de Detalle de Contratos
```
Copiar:
src/app/(dashboard)/contratos/[id]/page.tsx
src/app/(dashboard)/contratos/[id]/firmar/page.tsx
```

**TESTING FASE 2:**
```bash
# Verificar:
1. Lista de contratos carga
2. Filtros funcionan
3. Creación manual de contrato funciona
4. Wizard completa los 3 pasos
5. Preview se muestra correctamente
6. Detalle de contrato funciona
```

---

### SPRINT 3 - CANVAS Y FIRMAS (Semana 4) 🟡

**Objetivo:** Sistema Canvas de edición y firmas digitales.

#### Fase 3.1: APIs de Claude
```
Copiar:
app/api/claude/consult/route.ts ⭐
app/api/claude/contract-assist/route.ts ⭐
```

#### Fase 3.2: APIs de Firmas
```
Copiar:
app/api/contracts/[id]/prepare-signature/route.ts ⭐
app/api/contracts/sign/[token]/route.ts ⭐
```

#### Fase 3.3: Componentes Canvas
```
ORDEN:
1. components/contratos/SignatureCanvas.tsx ⭐
2. components/contratos/SendToSignModal.tsx ⭐
3. components/contratos/ShareSignatureLinkModal.tsx ⭐
4. components/contratos/ContractAssistantChat.tsx ⭐
5. components/contratos/ContractCanvasSidebar.tsx ⭐ (depende de ContractAssistantChat)
```

#### Fase 3.4: Ruta Pública de Firma
```
Copiar:
src/app/contratos/[id]/firmar/[token]/page.tsx ⭐
```

#### Fase 3.5: Crear Librería de PDF
```
Copiar:
src/lib/pdf/ (todo el directorio si existe)
```

**TESTING FASE 3:**
```bash
# Verificar:
1. Canvas se abre correctamente
2. Chat de edición con Lexy funciona
3. Cambios se aplican al documento
4. Botón "Guardar cambios" funciona
5. Preparar firma genera token
6. Link de firma es accesible públicamente
7. Canvas de firma funciona táctil
8. Firma se guarda y genera PDF
```

---

### SPRINT 4 - ORGANIZACIONES Y NOTIFICACIONES (Semana 5) 🟡

**Objetivo:** Features colaborativas y sistema de notificaciones.

#### Fase 4.1: APIs de Organizaciones
```
Copiar:
app/api/organizations/[id]/route.ts
app/api/organizations/[id]/members/[memberId]/route.ts
app/api/organizations/[id]/invitations/route.ts
app/api/organizations/invitations/[id]/accept/route.ts
app/api/organizations/invitations/[id]/reject/route.ts
```

#### Fase 4.2: Componentes de Organizaciones
```
Copiar:
components/organizations/InviteUserModal.tsx
components/organizations/ManageTeamModal.tsx
```

#### Fase 4.3: APIs de Notificaciones
```
Copiar:
app/api/notifications/route.ts
app/api/notifications/[id]/route.ts
app/api/notifications/[id]/read/route.ts
```

#### Fase 4.4: Componentes de Notificaciones
```
Copiar:
components/notifications/NotificationBell.tsx ⭐
components/notifications/NotificationsPanel.tsx ⭐
```

**TESTING FASE 4:**
```bash
# Verificar:
1. Crear organización funciona
2. Invitar usuarios funciona
3. Notificación de invitación aparece
4. Aceptar/rechazar invitación funciona
5. Bell de notificaciones muestra count
6. Dropdown de notificaciones funciona
7. Marcar como leída funciona
```

---

### SPRINT 5 - SUBSCRIPCIONES Y PAGOS (Semana 6) 🟡

**Objetivo:** Sistema completo de subscripciones y Stripe.

#### Fase 5.1: APIs de Stripe Completas
```
Copiar (o migrar):
app/api/stripe/portal/route.ts ⭐
app/api/stripe/webhook/route.ts ⭐

Reemplazar:
app/api/stripe/checkout/route.ts (versión completa)
app/api/stripe/verify-session/route.ts (versión completa)
```

#### Fase 5.2: Rutas de Subscripciones
```
Copiar:
app/subscription/plans/page.tsx ⭐
app/subscription/success/page.tsx (mejorar versión actual)
app/subscription/blocked/page.tsx ⭐
```

#### Fase 5.3: Componentes de Subscripciones
```
Copiar:
components/subscription/PricingModal.tsx ⭐
components/subscription/SubscriptionBlockedScreen.tsx ⭐
```

#### Fase 5.4: Types de Subscripciones
```
Ya copiados en SPRINT 1, verificar uso.
```

**TESTING FASE 5:**
```bash
# Verificar:
1. Página de planes funciona
2. Checkout funciona con Stripe
3. Webhook procesa eventos
4. Subscripción activa desbloquea features
5. Portal de cliente funciona
6. Pantalla de bloqueo aparece si no hay subscripción
7. Verificación de sesión funciona
```

---

### SPRINT 6 - MEJORAS Y PULIDO (Semana 7) 🟢

**Objetivo:** Features auxiliares y mejoras UX.

#### Fase 6.1: Dashboard Mejorado
```
Copiar:
components/dashboard/DashboardFilters.tsx
```

#### Fase 6.2: Componentes de Layout
```
Copiar:
components/layout/BackToDashboard.tsx
components/auth/LogoutButton.tsx
```

#### Fase 6.3: Share Chat
```
Copiar:
components/chat/ShareChatModal.tsx
```

#### Fase 6.4: APIs Auxiliares
```
Copiar:
app/api/profile/route.ts
app/api/users/search/route.ts
```

#### Fase 6.5: Storage y Utilidades
```
Copiar:
lib/supabase/storage.ts
```

#### Fase 6.6: Componentes UI Faltantes
```
Copiar:
components/ui/Section.tsx
```

**TESTING FASE 6:**
```bash
# Verificar:
1. Filtros de dashboard funcionan
2. Navegación mejorada funciona
3. Compartir chat funciona
4. API de perfil funciona
5. Búsqueda de usuarios funciona
6. Storage funciona si se usa
```

---

### SPRINT 7 - VALIDACIÓN Y PRODUCCIÓN (Semana 8) ✅

**Objetivo:** Testing completo, documentación, deploy.

#### Fase 7.1: Testing E2E
```
Tests a ejecutar:
1. Registro y login
2. Flujo completo: Chat → Detección → Modo Contrato → Generación
3. Flujo manual: Wizard → Generación → Preview
4. Canvas: Edición → Guardar → Firma → PDF
5. Organizaciones: Crear → Invitar → Aceptar
6. Notificaciones: Recibir → Leer
7. Subscripciones: Checkout → Activar → Verificar
8. Dashboard: Filtros → Estadísticas
```

#### Fase 7.2: Migraciones SQL
```
Verificar que todas las migraciones existen en lexyweb:
✅ 20260122000001_extend_profiles_table.sql
✅ 20260122000002_create_subscriptions_table.sql
✅ 20260122000003_create_organizations_table.sql
✅ 20260122000004_create_organization_invitations_table.sql
✅ 20260122000005_create_chat_shares_table.sql
✅ 20260122000006_update_conversaciones_table.sql
✅ 20260122000007_create_conversacion_participants_table.sql
✅ 20260122000008_create_typing_indicators_table.sql
✅ 20260122000009_create_notifications_table.sql
✅ 20260122000010_create_helper_functions.sql
✅ 20260122000011_create_automatic_triggers.sql
✅ 20260122000012_create_stats_views.sql
```

#### Fase 7.3: Variables de Entorno
```
Verificar .env.local en lexyweb contiene TODAS las variables de lexyapp:

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# IA
GEMINI_API_KEY= ⭐
ANTHROPIC_API_KEY= ⭐

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Sanity (ya existe en lexyweb)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

#### Fase 7.4: Documentación
```
Crear/Actualizar:
1. README.md → Agregar features de lexyapp
2. ESTADO.md → Estado técnico actualizado
3. ARCHITECTURE.md → Arquitectura completa
4. API.md → Documentación de APIs
```

#### Fase 7.5: Build y Deploy
```bash
# Test build local
cd lexyweb
npm run build

# Verificar no hay errores de tipo
npm run lint

# Deploy a Vercel/producción
vercel deploy --prod
```

---

## 📝 CHECKLIST EJECUTABLE

### Pre-Migración
- [ ] Backup completo de lexyweb actual
- [ ] Crear rama de desarrollo `migration/lexyapp-full`
- [ ] Documentar estado actual de lexyweb
- [ ] Instalar dependencias faltantes

### SPRINT 1 - Core
- [ ] Copiar types (6 archivos)
- [ ] Copiar lib/gemini (10 archivos)
- [ ] Copiar lib/store (1 archivo)
- [ ] Copiar lib/contracts (2+ archivos)
- [ ] Copiar lib/claude (2+ archivos)
- [ ] Copiar lib/validators (4 archivos)
- [ ] Copiar APIs de contratos (10 rutas)
- [ ] Copiar APIs de chat (8 rutas)
- [ ] Copiar componentes de chat (10 archivos)
- [ ] Actualizar página de abogado
- [ ] Testing: Chat funcional

### SPRINT 2 - Contratos
- [ ] Copiar componentes de contratos (8 archivos)
- [ ] Actualizar página de contratos
- [ ] Copiar rutas de detalle (2 archivos)
- [ ] Testing: Gestión de contratos funcional

### SPRINT 3 - Canvas/Firmas
- [ ] Copiar APIs de Claude (2 archivos)
- [ ] Copiar APIs de firmas (2 archivos)
- [ ] Copiar componentes Canvas (5 archivos)
- [ ] Copiar ruta pública de firma (1 archivo)
- [ ] Copiar lib/pdf si existe
- [ ] Testing: Canvas y firmas funcional

### SPRINT 4 - Organizaciones/Notificaciones
- [ ] Copiar APIs de organizaciones (5 archivos)
- [ ] Copiar componentes de organizaciones (2 archivos)
- [ ] Copiar APIs de notificaciones (3 archivos)
- [ ] Copiar componentes de notificaciones (2 archivos)
- [ ] Testing: Colaboración funcional

### SPRINT 5 - Subscripciones
- [ ] Migrar/mejorar APIs de Stripe (4 archivos)
- [ ] Copiar rutas de subscripciones (3 archivos)
- [ ] Copiar componentes de subscripciones (2 archivos)
- [ ] Testing: Pagos funcionales

### SPRINT 6 - Mejoras
- [ ] Copiar dashboard mejorado (1 archivo)
- [ ] Copiar componentes layout (2 archivos)
- [ ] Copiar share chat (1 archivo)
- [ ] Copiar APIs auxiliares (2 archivos)
- [ ] Copiar storage (1 archivo)
- [ ] Copiar UI faltante (1 archivo)
- [ ] Testing: Features auxiliares funcionales

### SPRINT 7 - Validación
- [ ] Testing E2E completo (8 flujos)
- [ ] Verificar migraciones SQL (12 archivos)
- [ ] Verificar variables de entorno
- [ ] Documentación actualizada
- [ ] Build sin errores
- [ ] Deploy a producción

---

## 🚨 DEPENDENCIAS CRÍTICAS

### Instalar AHORA (antes de SPRINT 1)
```bash
npm install zustand jspdf html2canvas react-signature-canvas
npm install -D @types/react-signature-canvas
```

### Ya Instaladas en lexyweb
```
✅ @anthropic-ai/sdk
✅ @google/generative-ai
✅ @stripe/stripe-js
✅ stripe
✅ @supabase/supabase-js
✅ @supabase/auth-helpers-nextjs
✅ @supabase/ssr
✅ next
✅ react
✅ react-dom
✅ typescript
✅ tailwindcss
✅ framer-motion (para animaciones)
✅ zod (validaciones)
✅ date-fns (fechas)
✅ lucide-react (iconos)
✅ marked (markdown)
✅ react-markdown
```

### Adicionales de lexyweb (NO en lexyapp)
```
⭐ @portabletext/react
⭐ @portabletext/types
⭐ @sanity/client
⭐ @sanity/image-url
⭐ @sanity/vision
⭐ next-sanity
⭐ sanity
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### Ajustes de Rutas
lexyapp usa estructura `src/` pero lexyweb NO tiene `src/`.

**Ajustar imports:**
```typescript
// lexyapp
import { X } from '@/lib/utils'
import { Y } from '@/components/ui/button'

// lexyweb (mismo)
import { X } from '@/lib/utils'
import { Y } from '@/components/ui/button'
```

El alias `@/` debe apuntar a raíz en lexyweb (configurar en `tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Estructura de Directorios
```
lexyapp:
  src/
    app/
    components/
    lib/
    types/

lexyweb:
  app/
  components/
  lib/
  types/  ← Crear este directorio
```

### Conflictos de Rutas
lexyweb tiene rutas adicionales que NO están en lexyapp:
- `app/blog/*` (Sanity CMS)
- `app/studio/*` (Sanity Studio)
- `app/urgente/page.tsx` (Landing urgencia)
- `app/(legal)/*` (Términos y privacidad)

**NO ELIMINAR** estas rutas, son adicionales válidas de lexyweb.

### Componentes Duplicados
Ambos tienen `lib/stripe.ts`. Comparar y fusionar si hay diferencias.

### Migraciones SQL
Ambos proyectos tienen las MISMAS migraciones. No duplicar.

### Middleware
Ambos tienen `middleware.ts`. Comparar y fusionar lógica si difieren.

---

## 📊 MÉTRICAS DE ÉXITO

### Criterios de Aceptación
- [ ] Chat con Lexy funciona correctamente
- [ ] Detección de intención de contrato funciona
- [ ] Modo contrato se activa y recopila datos
- [ ] Generación de contratos funciona (manual e inteligente)
- [ ] Canvas de edición funciona con Lexy
- [ ] Sistema de firmas digitales funciona
- [ ] Organizaciones y equipos funcionan
- [ ] Notificaciones funcionan
- [ ] Subscripciones y Stripe funcionan
- [ ] Dashboard muestra estadísticas correctamente
- [ ] Build sin errores de TypeScript
- [ ] Deploy exitoso a producción

### KPIs
- **0 errores de compilación**
- **0 errores de tipos**
- **100% de features críticas migradas**
- **80%+ de features importantes migradas**
- **Tests E2E pasan al 100%**

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **HOY:**
   - Crear rama `migration/lexyapp-full`
   - Instalar dependencias faltantes
   - Crear directorio `types/`
   - Backup de lexyweb actual

2. **MAÑANA:**
   - Iniciar SPRINT 1 Fase 1.1
   - Copiar types
   - Copiar lib/gemini
   - Copiar lib/store

3. **SEMANA 1:**
   - Completar SPRINT 1 completo
   - Testing de chat funcional

---

## 📞 CONTACTO Y SOPORTE

**Documento creado:** 28 Enero 2026
**Analista:** Claude Code (Sonnet 4.5)
**Versión:** 1.0.0

Para dudas o aclaraciones durante la migración, referirse a:
- `lexyapp/ESTADO.md` (estado técnico original)
- `lexyapp/README.md` (documentación original)
- Este documento (`lexyweb/MIGRATION_PLAN.md`)

---

**🚀 ¡TODO LISTO PARA COMENZAR LA MIGRACIÓN!**
