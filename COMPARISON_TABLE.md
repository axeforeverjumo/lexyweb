# 📊 TABLA COMPARATIVA DETALLADA: lexyapp vs lexyweb

**Fecha:** 28 Enero 2026

---

## 📁 ESTRUCTURA DE ARCHIVOS

### APP ROUTER - Páginas

| Ruta | lexyapp | lexyweb | Estado | Prioridad |
|------|---------|---------|--------|-----------|
| **AUTENTICACIÓN** | | | | |
| `/login` | ✅ | ✅ | Completo | - |
| `/register` | ✅ | ✅ | Completo | - |
| `/forgot-password` | ❌ | ✅ | Extra en lexyweb | - |
| **DASHBOARD** | | | | |
| `/dashboard` | ❌ | ✅ | Solo en lexyweb | - |
| `/abogado` (Chat) | ✅ COMPLETO | ⚠️ PLACEHOLDER | **MIGRAR** | 🔴 CRÍTICO |
| `/contratos` | ✅ COMPLETO | ⚠️ PLACEHOLDER | **MIGRAR** | 🔴 CRÍTICO |
| `/contratos/[id]` | ✅ | ❌ | **MIGRAR** | 🔴 CRÍTICO |
| `/contratos/[id]/firmar` | ✅ | ❌ | **MIGRAR** | 🟡 IMPORTANTE |
| **FIRMAS PÚBLICAS** | | | | |
| `/contratos/[id]/firmar/[token]` | ✅ | ❌ | **MIGRAR** | 🟡 IMPORTANTE |
| **SUBSCRIPCIONES** | | | | |
| `/subscription/plans` | ✅ | ❌ | **MIGRAR** | 🟡 IMPORTANTE |
| `/subscription/success` | ✅ | ✅ | Mejorar | 🟡 IMPORTANTE |
| `/subscription/blocked` | ✅ | ❌ | **MIGRAR** | 🟡 IMPORTANTE |
| **LANDING** | | | | |
| `/` (home) | ❌ | ✅ | Solo en lexyweb | - |
| `/urgente` | ❌ | ✅ | Solo en lexyweb | - |
| `/blog` | ❌ | ✅ | Solo en lexyweb (Sanity) | - |
| `/blog/[slug]` | ❌ | ✅ | Solo en lexyweb (Sanity) | - |
| `/studio` | ❌ | ✅ | Solo en lexyweb (Sanity) | - |
| **LEGAL** | | | | |
| `/terminos` | ❌ | ✅ | Solo en lexyweb | - |
| `/privacidad` | ❌ | ✅ | Solo en lexyweb | - |
| **DEBUG** | | | | |
| `/debug-env` | ❌ | ✅ | Solo en lexyweb | - |
| `/success` (Stripe) | ❌ | ✅ | Solo en lexyweb | - |

---

## 🔌 APIS - Rutas de Backend

### APIs de Contratos

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `POST /api/contracts/generate` | ✅ | ❌ | Generación base | 🔴 CRÍTICO |
| `POST /api/contracts/generate-intelligent` | ✅ | ❌ | Generación con análisis | 🔴 CRÍTICO |
| `POST /api/contracts/generate-with-claude` | ✅ | ❌ | Generación con Claude | 🔴 CRÍTICO |
| `POST /api/contracts/detect-intent` | ✅ | ❌ | Detectar intención | 🔴 CRÍTICO |
| `POST /api/contracts/find-template` | ✅ | ❌ | Búsqueda híbrida | 🔴 CRÍTICO |
| `POST /api/contracts/analyze-conversation` | ✅ | ❌ | Análisis profundo | 🔴 CRÍTICO |
| `GET /api/contracts/list` | ✅ | ❌ | Listar contratos | 🔴 CRÍTICO |
| `GET /api/contracts/by-conversation/[id]` | ✅ | ❌ | Contratos de conversación | 🔴 CRÍTICO |
| `GET /api/contracts/[id]` | ✅ | ❌ | Detalle de contrato | 🔴 CRÍTICO |
| `PATCH /api/contracts/[id]` | ✅ | ❌ | Actualizar contrato | 🔴 CRÍTICO |
| `DELETE /api/contracts/[id]` | ✅ | ❌ | Eliminar contrato | 🔴 CRÍTICO |
| `PATCH /api/contracts/[id]/update-title` | ✅ | ❌ | Actualizar título | 🟢 BAJA |
| `POST /api/contracts/[id]/prepare-signature` | ✅ | ❌ | Preparar firma | 🟡 IMPORTANTE |
| `POST /api/contracts/sign/[token]` | ✅ | ❌ | Firmar con token | 🟡 IMPORTANTE |

### APIs de Chat/Conversaciones

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `POST /api/gemini/chat` | ✅ | ❌ | Chat principal | 🔴 CRÍTICO |
| `POST /api/conversaciones` | ✅ | ❌ | Crear conversación | 🔴 CRÍTICO |
| `GET /api/conversaciones` | ✅ | ❌ | Listar conversaciones | 🔴 CRÍTICO |
| `GET /api/conversaciones/[id]` | ✅ | ❌ | Detalle conversación | 🔴 CRÍTICO |
| `PATCH /api/conversaciones/[id]` | ✅ | ❌ | Actualizar conversación | 🔴 CRÍTICO |
| `DELETE /api/conversaciones/[id]` | ✅ | ❌ | Eliminar conversación | 🔴 CRÍTICO |
| `POST /api/conversaciones/[id]/mensajes` | ✅ | ❌ | Enviar mensaje | 🔴 CRÍTICO |
| `GET /api/conversaciones/[id]/mensajes` | ✅ | ❌ | Listar mensajes | 🔴 CRÍTICO |
| `POST /api/conversaciones/[id]/participants` | ✅ | ❌ | Agregar participante | 🟡 IMPORTANTE |
| `POST /api/conversaciones/[id]/share` | ✅ | ❌ | Compartir conversación | 🟢 BAJA |
| `POST /api/chat-shares/[id]/accept` | ✅ | ❌ | Aceptar share | 🟢 BAJA |
| `GET /api/chat/contract/[id]` | ✅ | ❌ | Chat de contrato | 🟡 IMPORTANTE |

### APIs de Claude

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `POST /api/claude/consult` | ✅ | ❌ | Consultas generales | 🟡 IMPORTANTE |
| `POST /api/claude/contract-assist` | ✅ | ❌ | Asistencia en contrato | 🟡 IMPORTANTE |

### APIs de Organizaciones

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `GET /api/organizations/[id]` | ✅ | ❌ | Detalle organización | 🟡 IMPORTANTE |
| `PATCH /api/organizations/[id]` | ✅ | ❌ | Actualizar organización | 🟡 IMPORTANTE |
| `DELETE /api/organizations/[id]` | ✅ | ❌ | Eliminar organización | 🟡 IMPORTANTE |
| `PATCH /api/organizations/[id]/members/[memberId]` | ✅ | ❌ | Actualizar miembro | 🟡 IMPORTANTE |
| `DELETE /api/organizations/[id]/members/[memberId]` | ✅ | ❌ | Eliminar miembro | 🟡 IMPORTANTE |
| `GET /api/organizations/[id]/invitations` | ✅ | ❌ | Listar invitaciones | 🟡 IMPORTANTE |
| `POST /api/organizations/[id]/invitations` | ✅ | ❌ | Crear invitación | 🟡 IMPORTANTE |
| `POST /api/organizations/invitations/[id]/accept` | ✅ | ❌ | Aceptar invitación | 🟡 IMPORTANTE |
| `POST /api/organizations/invitations/[id]/reject` | ✅ | ❌ | Rechazar invitación | 🟡 IMPORTANTE |

### APIs de Notificaciones

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `GET /api/notifications` | ✅ | ❌ | Listar notificaciones | 🟡 IMPORTANTE |
| `POST /api/notifications` | ✅ | ❌ | Crear notificación | 🟡 IMPORTANTE |
| `GET /api/notifications/[id]` | ✅ | ❌ | Detalle notificación | 🟡 IMPORTANTE |
| `PATCH /api/notifications/[id]` | ✅ | ❌ | Actualizar notificación | 🟡 IMPORTANTE |
| `DELETE /api/notifications/[id]` | ✅ | ❌ | Eliminar notificación | 🟡 IMPORTANTE |
| `PATCH /api/notifications/[id]/read` | ✅ | ❌ | Marcar como leída | 🟡 IMPORTANTE |

### APIs de Stripe

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `POST /api/stripe/checkout` | ✅ COMPLETO | ⚠️ SIMPLE | Mejorar | 🟡 IMPORTANTE |
| `POST /api/stripe/portal` | ✅ | ❌ | Portal de cliente | 🟡 IMPORTANTE |
| `POST /api/stripe/webhook` | ✅ | ❌ | Webhooks de Stripe | 🟡 IMPORTANTE |
| `POST /api/stripe/verify-session` | ✅ COMPLETO | ⚠️ SIMPLE | Mejorar | 🟡 IMPORTANTE |

### APIs Auxiliares

| Endpoint | lexyapp | lexyweb | Función | Prioridad |
|----------|---------|---------|---------|-----------|
| `GET /api/profile` | ✅ | ❌ | Perfil de usuario | 🟢 BAJA |
| `GET /api/users/search` | ✅ | ❌ | Búsqueda de usuarios | 🟢 BAJA |
| `GET /api/debug-env` | ❌ | ✅ | Debug vars entorno | - |
| `POST /api/checkout` | ❌ | ✅ | Checkout simple | - |
| `POST /api/verify-session` | ❌ | ✅ | Verificar sesión | - |

---

## 🧩 COMPONENTES

### Componentes de Abogado (Chat)

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `ChatInterface.tsx` | ✅ 31KB | ❌ | GRANDE | 🔴 CRÍTICO |
| `ChatInput.tsx` | ✅ 1.8KB | ❌ | PEQUEÑO | 🔴 CRÍTICO |
| `MessageBubble.tsx` | ✅ 2.3KB | ❌ | PEQUEÑO | 🔴 CRÍTICO |
| `ConversationsSidebar.tsx` | ✅ 5.2KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ConversationsSidebarV2.tsx` | ✅ 11KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ConversationItem.tsx` | ✅ 5.4KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractSuggestion.tsx` | ✅ 11KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractDataSidebar.tsx` | ✅ 11KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ConversationContractsSidebar.tsx` | ✅ 5.7KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractCreationModal.tsx` | ✅ 26KB | ❌ | GRANDE | 🔴 CRÍTICO |

**TOTAL ABOGADO:** 10 componentes (110KB) - **0% migrado**

### Componentes de Contratos

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `ContractCreationSelector.tsx` | ✅ 10KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractFormWizard.tsx` | ✅ 19KB | ❌ | GRANDE | 🔴 CRÍTICO |
| `ContractCard.tsx` | ✅ 7KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractsList.tsx` | ✅ 8KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractDetailView.tsx` | ✅ 6KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractFilters.tsx` | ✅ 1.4KB | ❌ | PEQUEÑO | 🔴 CRÍTICO |
| `ContractPreview.tsx` | ✅ 11KB | ❌ | MEDIO | 🔴 CRÍTICO |
| `ContractCanvasSidebar.tsx` | ✅ 9KB | ❌ | MEDIO | 🟡 IMPORTANTE |
| `ContractAssistantChat.tsx` | ✅ 7KB | ❌ | MEDIO | 🟡 IMPORTANTE |
| `SignatureCanvas.tsx` | ✅ 4.7KB | ❌ | MEDIO | 🟡 IMPORTANTE |
| `SendToSignModal.tsx` | ✅ 7KB | ❌ | MEDIO | 🟡 IMPORTANTE |
| `ShareSignatureLinkModal.tsx` | ✅ 7KB | ❌ | MEDIO | 🟡 IMPORTANTE |
| `DeleteContractDialog.tsx` | ✅ 1.8KB | ❌ | PEQUEÑO | 🟢 BAJA |

**TOTAL CONTRATOS:** 13 componentes (98KB) - **0% migrado**

### Componentes de Organizaciones

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `InviteUserModal.tsx` | ✅ | ❌ | MEDIO | 🟡 IMPORTANTE |
| `ManageTeamModal.tsx` | ✅ | ❌ | MEDIO | 🟡 IMPORTANTE |

**TOTAL ORGANIZACIONES:** 2 componentes - **0% migrado**

### Componentes de Notificaciones

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `NotificationBell.tsx` | ✅ | ❌ | PEQUEÑO | 🟡 IMPORTANTE |
| `NotificationsPanel.tsx` | ✅ | ❌ | MEDIO | 🟡 IMPORTANTE |

**TOTAL NOTIFICACIONES:** 2 componentes - **0% migrado**

### Componentes de Subscripciones

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `PricingModal.tsx` | ✅ | ❌ | MEDIO | 🟡 IMPORTANTE |
| `SubscriptionBlockedScreen.tsx` | ✅ | ❌ | MEDIO | 🟡 IMPORTANTE |

**TOTAL SUBSCRIPCIONES:** 2 componentes - **0% migrado**

### Componentes de Dashboard

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `DashboardFilters.tsx` | ✅ | ❌ | PEQUEÑO | 🟢 BAJA |

**TOTAL DASHBOARD:** 1 componente - **0% migrado**

### Componentes de Layout

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `BackToDashboard.tsx` | ✅ | ❌ | PEQUEÑO | 🟢 BAJA |
| `DashboardLayout.tsx` | ❌ | ✅ | MEDIO | - |

### Componentes de Chat (auxiliares)

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `ShareChatModal.tsx` | ✅ | ❌ | MEDIO | 🟢 BAJA |

### Componentes de Auth

| Componente | lexyapp | lexyweb | Tamaño | Prioridad |
|------------|---------|---------|--------|-----------|
| `LogoutButton.tsx` | ✅ | ❌ | PEQUEÑO | 🟢 BAJA |
| `AuthButton.tsx` | ❌ | ✅ | PEQUEÑO | - |
| `AuthError.tsx` | ❌ | ✅ | PEQUEÑO | - |
| `AuthForm.tsx` | ❌ | ✅ | MEDIO | - |
| `AuthInput.tsx` | ❌ | ✅ | PEQUEÑO | - |
| `index.ts` | ❌ | ✅ | - | - |

### Componentes UI

| Componente | lexyapp | lexyweb | Estado | Prioridad |
|------------|---------|---------|--------|-----------|
| `Badge.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `button.tsx` | ✅ | ⚠️ | Comparar | 🟢 BAJA |
| `card.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `dialog.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `dropdown-menu.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `input.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `label.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `Section.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `separator.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `textarea.tsx` | ✅ | ❌ | Migrar | 🟢 BAJA |
| `index.ts` | ✅ | ❌ | Migrar | 🟢 BAJA |

---

## 📚 LIBRERÍAS

### lib/gemini

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `client.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `embeddings.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/legal-consultant.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/lexy-master-prompt.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/lexy-optimized.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/clause-analyzer.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/contract-intent-detector.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/contract-detector.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/contract-personalizer.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `prompts/contract-deep-analyzer.ts` | ✅ | ❌ | 🔴 CRÍTICO |

**TOTAL:** 10 archivos - **0% migrado**

### lib/contracts

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `generator.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `templates/compraventa.ts` | ✅ | ❌ | 🔴 CRÍTICO |

**TOTAL:** 2+ archivos - **0% migrado**

### lib/claude

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `generation-settings/arrendamiento-vivienda.ts` | ✅ | ❌ | 🟡 IMPORTANTE |
| `generation-settings/arras-penitenciales.ts` | ✅ | ❌ | 🟡 IMPORTANTE |

**TOTAL:** 2+ archivos - **0% migrado**

### lib/validators

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `amounts.ts` | ✅ | ❌ | 🟢 BAJA |
| `dates.ts` | ✅ | ❌ | 🟢 BAJA |
| `dni.ts` | ✅ | ❌ | 🟢 BAJA |
| `index.ts` | ✅ | ❌ | 🟢 BAJA |

**TOTAL:** 4 archivos - **0% migrado**

### lib/store

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `chatStore.ts` | ✅ | ❌ | 🔴 CRÍTICO |

**TOTAL:** 1 archivo - **0% migrado**

### lib/supabase

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `client.ts` | ✅ | ✅ | Comparar | - |
| `server.ts` | ✅ | ✅ | Comparar | - |
| `storage.ts` | ✅ | ❌ | 🟢 BAJA |
| `index.ts` | ❌ | ✅ | - | - |

### lib/utils

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `utils.ts` | ✅ | ✅ | Comparar | - |
| `cn.ts` | ✅ | ⚠️ | Verificar | 🟢 BAJA |
| `constants.ts` | ✅ | ❌ | 🟢 BAJA |

### lib/auth

| Archivo | lexyapp | lexyweb | Estado |
|---------|---------|---------|--------|
| `index.ts` | ❌ | ✅ | Solo en lexyweb |
| `utils.ts` | ❌ | ✅ | Solo en lexyweb |

### lib/sanity (Solo en lexyweb)

| Archivo | lexyapp | lexyweb | Estado |
|---------|---------|---------|--------|
| `sanity.client.ts` | ❌ | ✅ | Solo en lexyweb |
| `sanity.types.ts` | ❌ | ✅ | Solo en lexyweb |

### lib/stripe

| Archivo | lexyapp | lexyweb | Estado |
|---------|---------|---------|--------|
| `stripe.ts` | ✅ | ✅ | Comparar y fusionar |

### lib/pdf

| Archivo | lexyapp | lexyweb | Prioridad |
|---------|---------|---------|-----------|
| `*.ts` (si existe) | ⚠️ | ❌ | 🟡 IMPORTANTE |

---

## 📝 TYPES

| Type | lexyapp | lexyweb | Prioridad |
|------|---------|---------|-----------|
| `contrato.types.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `conversacion.types.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `mensaje.types.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `gemini.types.ts` | ✅ | ❌ | 🔴 CRÍTICO |
| `user.types.ts` | ✅ | ❌ | 🟡 IMPORTANTE |
| `subscription.types.ts` | ✅ | ❌ | 🟡 IMPORTANTE |
| `pricing.ts` | ❌ | ✅ | Solo en lexyweb |

---

## 📦 DEPENDENCIAS NPM

### Faltantes en lexyweb (deben instalarse)

| Paquete | Versión | Uso |
|---------|---------|-----|
| `zustand` | ^5.0.2 | State management (chat store) |
| `jspdf` | ^2.5.2 | Generación de PDFs |
| `html2canvas` | ^1.4.1 | Screenshots para PDFs |
| `react-signature-canvas` | ^1.0.7 | Canvas de firma |
| `@types/react-signature-canvas` | ^1.0.7 | Types para canvas |

### Adicionales en lexyweb (no en lexyapp)

| Paquete | Versión | Uso |
|---------|---------|-----|
| `@portabletext/react` | ^3.1.0 | Sanity Portable Text |
| `@portabletext/types` | ^4.0.1 | Types de Portable Text |
| `@sanity/client` | ^6.22.7 | Cliente Sanity |
| `@sanity/image-url` | ^1.0.2 | URLs de imágenes Sanity |
| `@sanity/vision` | ^3.62.4 | Sanity Vision |
| `next-sanity` | ^9.8.14 | Integración Next.js |
| `sanity` | ^3.62.4 | Sanity Studio |

### Compartidas

| Paquete | lexyapp | lexyweb | Estado |
|---------|---------|---------|--------|
| `@anthropic-ai/sdk` | ^0.71.2 | ^0.71.2 | ✅ Igual |
| `@google/generative-ai` | ^0.21.0 | ^0.21.0 | ✅ Igual |
| `@stripe/stripe-js` | ❌ | ^5.7.0 | En lexyweb |
| `stripe` | ^17.7.0 | ^17.7.0 | ✅ Igual |
| `@supabase/supabase-js` | ^2.39.0 | ^2.39.0 | ✅ Igual |
| `next` | ^15.1.0 | ^15.1.0 | ✅ Igual |
| `react` | ^19.0.0 | ^19.0.0 | ✅ Igual |
| `typescript` | ^5.7.2 | ^5.7.2 | ✅ Igual |

---

## 🗄️ BASE DE DATOS (Supabase)

### Migraciones SQL

| Migración | lexyapp | lexyweb | Estado |
|-----------|---------|---------|--------|
| `20260122000001_extend_profiles_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000002_create_subscriptions_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000003_create_organizations_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000004_create_organization_invitations_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000005_create_chat_shares_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000006_update_conversaciones_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000007_create_conversacion_participants_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000008_create_typing_indicators_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000009_create_notifications_table.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000010_create_helper_functions.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000011_create_automatic_triggers.sql` | ✅ | ✅ | ✅ Sincronizado |
| `20260122000012_create_stats_views.sql` | ✅ | ✅ | ✅ Sincronizado |

**TOTAL:** 12 migraciones - **100% sincronizado** ✅

---

## 🎨 FEATURES ÚNICAS POR PROYECTO

### Solo en lexyapp

1. Sistema completo de chat con IA
2. Generación inteligente de contratos
3. Canvas de edición tipo ChatGPT
4. Sistema de firmas digitales
5. Gestión de organizaciones
6. Sistema de notificaciones
7. Subscripciones completas
8. Dashboard con filtros avanzados

### Solo en lexyweb

1. Sanity CMS completo
2. Blog con posts
3. Sanity Studio
4. Landing page optimizada
5. Página de urgencia
6. Páginas legales (términos/privacidad)
7. SEO (robots.ts, sitemap.ts)
8. Debugging tools

---

## 📊 RESUMEN NUMÉRICO

| Categoría | Total lexyapp | Total lexyweb | Gap | % Completitud |
|-----------|---------------|---------------|-----|---------------|
| **Archivos TS/TSX** | 127 | 79 | 48 | 62% |
| **APIs** | 37 | 3 | 34 | 8% |
| **Componentes Totales** | 43 | 29 | 14 | 67% |
| **Componentes Core** | 31 | 0 | 31 | 0% |
| **Librerías** | 25 | 9 | 16 | 36% |
| **Types** | 6 | 1 | 5 | 17% |
| **Migraciones SQL** | 12 | 12 | 0 | 100% |
| **Deps npm Core** | 43 | 43 | 0 | 100% |
| **Deps npm Extra** | 0 | 15 | -15 | - |

---

## ✅ PRIORIDADES DE MIGRACIÓN

### 🔴 CRÍTICO (Semana 1-3)
- 10 componentes de chat
- 13 componentes de contratos
- 14 APIs de contratos
- 8 APIs de chat/conversaciones
- 10 archivos de lib/gemini
- 6 types
- 2 archivos de lib/contracts
- 1 archivo de store

**TOTAL CRÍTICO:** ~64 archivos

### 🟡 IMPORTANTE (Semana 4-6)
- 2 APIs de Claude
- 2 APIs de firmas
- 5 APIs de organizaciones
- 3 APIs de notificaciones
- 4 APIs de Stripe (mejorar)
- 2 componentes de organizaciones
- 2 componentes de notificaciones
- 2 componentes de subscripciones
- 2 archivos de lib/claude
- 2 types

**TOTAL IMPORTANTE:** ~26 archivos

### 🟢 BAJA (Semana 7)
- 1 componente de dashboard
- 1 componente de layout
- 1 componente de chat auxiliar
- 1 componente de auth
- 11 componentes UI
- 2 APIs auxiliares
- 4 archivos de validators
- 3 archivos de utils

**TOTAL BAJA:** ~24 archivos

---

**TOTAL DE ARCHIVOS A MIGRAR:** ~114 archivos

**TIEMPO ESTIMADO:** 7-8 semanas de trabajo
