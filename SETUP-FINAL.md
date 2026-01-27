# 🚀 Setup Final - LexyApp Suscripciones

**Estado:** ✅ Código completo e integrado
**Falta:** Configurar credenciales de Stripe (35 minutos)

---

## ✅ LO QUE YA ESTÁ HECHO

### 1. Activación
- ✅ ConversationsSidebarV2 reemplaza ConversationsSidebar
- ✅ NotificationBell visible en sidebar
- ✅ Botón "Compartir" en ChatInterface
- ✅ Botón "Gestionar Equipo" para owners

### 2. Stripe Integration
- ✅ 4 rutas API creadas (`/api/stripe/*`)
- ✅ Webhook que crea organizaciones
- ✅ Cliente Stripe configurado
- ✅ Package instalado (`stripe@^17.7.0`)

### 3. UI Components
- ✅ PricingModal con diseño emerald green
- ✅ Páginas `/subscription/plans` y `/subscription/success`
- ✅ 4 planes configurados (PRO/TEAM/BUSINESS/ENTERPRISE)

### 4. Documentación
- ✅ INTEGRATION-COMPLETE.md - Guía completa
- ✅ ACTIVATION-GUIDE.md - Paso a paso
- ✅ QUICK-REFERENCE.md - Referencia rápida
- ✅ .env.example - Variables de entorno

---

## ⏳ LO QUE FALTA (35 MINUTOS)

### 1. Configurar Variables de Entorno (5 min)

```bash
# Copiar ejemplo
cp .env.example .env.local

# Editar y agregar Stripe keys
nano .env.local
```

### 2. Crear Productos en Stripe (10 min)

**Dashboard de Stripe:**
1. Ir a Products → Create product
2. Crear 4 productos:
   - **PRO:** €65/mes, recurring
   - **TEAM:** €150/mes, recurring
   - **BUSINESS:** €299/mes, recurring
   - **ENTERPRISE:** €500/mes, recurring
3. Copiar Price IDs (`price_xxx`)
4. Pegar en `.env.local`

### 3. Configurar Webhook (5 min)

**Desarrollo (Stripe CLI):**
```bash
# Instalar
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Producción (Stripe Dashboard):**
1. Webhooks → Add endpoint
2. URL: `https://tudominio.com/api/stripe/webhook`
3. Eventos:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copiar webhook secret (`whsec_xxx`)
5. Agregar a `.env.local`

### 4. Testing (15 min)

```bash
# Test PRO
1. npm run dev
2. Ir a http://localhost:3000/subscription/plans
3. Seleccionar PRO
4. Usar tarjeta de prueba: 4242 4242 4242 4242
5. Verificar redirección a /success

# Test TEAM
1. Seleccionar TEAM
2. Pagar
3. Verificar en Supabase que creó organization
4. Ir a /abogado → Botón "Gestionar Equipo" visible
5. Invitar miembro
```

---

## 🎯 COMANDOS RÁPIDOS

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Testing webhook (otra terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Build producción
npm run build
npm start
```

---

## 📁 ARCHIVOS CLAVE

### Stripe
```
src/lib/stripe.ts                     # Cliente + Price IDs
src/app/api/stripe/webhook/route.ts  # CRÍTICO: Crea organización
```

### UI
```
src/components/subscription/PricingModal.tsx  # Modal de planes
src/app/subscription/plans/page.tsx           # Página de planes
```

### Activados
```
src/app/(dashboard)/abogado/page.tsx          # Usa ConversationsSidebarV2
src/components/abogado/ConversationsSidebarV2.tsx  # Con NotificationBell
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Webhook no funciona
```bash
# Ver eventos en tiempo real
stripe listen --forward-to localhost:3000/api/stripe/webhook --log-level debug
```

### Organización no se creó
```sql
-- Verificar en Supabase SQL Editor
SELECT * FROM organizations WHERE owner_id = 'user-id';
```

### Error "Price ID inválido"
```bash
# Verificar que los Price IDs en .env.local
# coinciden con Stripe Dashboard
cat .env.local | grep STRIPE_PRICE_ID
```

---

## 📞 RECURSOS

- **Documentación completa:** `INTEGRATION-COMPLETE.md`
- **Guía paso a paso:** `ACTIVATION-GUIDE.md`
- **Referencia APIs:** `QUICK-REFERENCE.md`
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Docs:** https://stripe.com/docs
- **Supabase Dashboard:** https://app.supabase.com

---

## 🎉 CHECKLIST FINAL

### Antes de producción:
- [ ] Variables de entorno configuradas
- [ ] Productos creados en Stripe
- [ ] Webhook configurado y funcionando
- [ ] Test PRO exitoso
- [ ] Test TEAM crea organización
- [ ] Invitaciones funcionan
- [ ] Compartir chats funciona
- [ ] Notificaciones aparecen

### Listo para producción:
- [ ] Variables en Vercel/hosting
- [ ] Webhook URL de producción
- [ ] DNS configurado
- [ ] SSL activo
- [ ] Monitoreo configurado

---

**🚀 TODO EL CÓDIGO ESTÁ LISTO. SOLO FALTA CONFIGURAR STRIPE.**

**Tiempo estimado:** 35 minutos
**Complejidad:** Baja (solo configuración)
