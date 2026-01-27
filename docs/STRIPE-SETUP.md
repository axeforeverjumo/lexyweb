# Configuración de Stripe para LEXY

Guía completa para configurar pagos con Stripe en LEXY.

## 📋 Tabla de contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Obtener claves de Stripe](#obtener-claves-de-stripe)
3. [Crear productos y precios](#crear-productos-y-precios)
4. [Configurar variables de entorno](#configurar-variables-de-entorno)
5. [Probar localmente](#probar-localmente)
6. [Desplegar a producción](#desplegar-a-producción)

---

## 1. Prerrequisitos

- Cuenta de Stripe (gratis en https://stripe.com)
- Node.js 18+ instalado
- Proyecto lexyweb clonado localmente

---

## 2. Obtener claves de Stripe

### Paso 1: Crear cuenta o iniciar sesión

1. Ve a https://dashboard.stripe.com
2. Si no tienes cuenta, créala (es gratis)
3. Completa la verificación de email

### Paso 2: Obtener API keys

1. Ve a: https://dashboard.stripe.com/test/apikeys
2. Copia dos claves:
   - **Publishable key** (empieza con `pk_test_...`)
   - **Secret key** (empieza con `sk_test_...`)

⚠️ **IMPORTANTE**:
- Usa las claves de **TEST** mientras desarrollas
- NUNCA compartas tu Secret key en Git
- Las claves de producción empiezan con `pk_live_` y `sk_live_`

---

## 3. Crear productos y precios

Tenemos un script automático que crea los 4 productos:

### Opción A: Script automático (Recomendado)

1. **Configura tu Secret key temporalmente**:
   ```bash
   # En .env.local
   STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
   ```

2. **Ejecuta el script**:
   ```bash
   node scripts/setup-stripe-products.js
   ```

3. **Copia los Price IDs** que el script imprime y añádelos a `.env.local`

### Opción B: Manual (Stripe Dashboard)

Si prefieres crear los productos manualmente:

#### PRO - 65€/mes
```bash
# 1. Crear producto en Dashboard
Nombre: LEXY PRO
Descripción: Plan individual para agentes inmobiliarios

# 2. Crear precio
Precio: 65.00 EUR
Tipo: Recurrente
Frecuencia: Mensual
```

#### TEAM - 150€/mes
```bash
Nombre: LEXY TEAM
Descripción: Para agencias pequeñas (2-3 agentes)
Precio: 150.00 EUR
Tipo: Recurrente
Frecuencia: Mensual
```

#### BUSINESS - 299€/mes
```bash
Nombre: LEXY BUSINESS
Descripción: Para agencias medianas
Precio: 299.00 EUR
Tipo: Recurrente
Frecuencia: Mensual
```

#### ENTERPRISE - 500€/mes
```bash
Nombre: LEXY ENTERPRISE
Descripción: Para grandes grupos inmobiliarios
Precio: 500.00 EUR
Tipo: Recurrente
Frecuencia: Mensual
```

Después de crear cada producto, **copia su Price ID** (empieza con `price_...`)

---

## 4. Configurar variables de entorno

### Desarrollo local (.env.local)

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_PUBLICA
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA

# Stripe Price IDs (obtenidos del paso anterior)
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxx
STRIPE_PRICE_ID_TEAM=price_xxxxxxxxxx
STRIPE_PRICE_ID_BUSINESS=price_xxxxxxxxxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Verificar configuración

```bash
# El archivo debe verse así:
cat .env.local
```

---

## 5. Probar localmente

### Iniciar servidor

```bash
npm run dev
```

### Probar checkout

1. Abre http://localhost:3000/#precios
2. Haz click en "Empieza AHORA" en cualquier plan
3. Deberías ser redirigido a Stripe Checkout
4. Usa tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos
   - ZIP: Cualquier código postal

### Tarjetas de prueba de Stripe

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Pago exitoso |
| `4000 0000 0000 0002` | ❌ Pago rechazado |
| `4000 0000 0000 9995` | ❌ Fondos insuficientes |

Más tarjetas de prueba: https://stripe.com/docs/testing

### Verificar en Stripe Dashboard

1. Ve a https://dashboard.stripe.com/test/payments
2. Deberías ver el pago de prueba
3. Verifica que tenga 14 días de trial
4. Revisa los metadata (tier, plan_name, max_users)

---

## 6. Desplegar a producción

### Paso 1: Cambiar a claves de producción

⚠️ **Solo cuando estés listo para aceptar pagos reales**

1. Ve a https://dashboard.stripe.com/apikeys (sin /test/)
2. Activa tu cuenta de Stripe (verificación de negocio)
3. Copia las claves de **producción** (empiezan con `pk_live_` y `sk_live_`)

### Paso 2: Crear productos de producción

Repite el paso 3 pero con las claves de producción:

```bash
# En .env.local temporal para el script
STRIPE_SECRET_KEY=sk_live_TU_CLAVE_PRODUCCION

# Ejecutar script
node scripts/setup-stripe-products.js
```

Esto creará 4 productos nuevos en tu cuenta de producción.

### Paso 3: Configurar en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `lexyweb`
3. Settings → Environment Variables
4. Añade estas variables:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_TU_CLAVE_PUBLICA
STRIPE_SECRET_KEY=sk_live_TU_CLAVE_SECRETA
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxx
STRIPE_PRICE_ID_TEAM=price_xxxxxxxxxx
STRIPE_PRICE_ID_BUSINESS=price_xxxxxxxxxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://lexyweb.vercel.app
```

⚠️ **CRÍTICO**: Marca `STRIPE_SECRET_KEY` como variable **secreta** (no visible en logs)

### Paso 4: Redeploy

Vercel hará redeploy automáticamente al guardar las variables.

Alternativamente:
```bash
vercel --prod
```

### Paso 5: Probar en producción

1. Abre https://lexyweb.vercel.app/#precios
2. **CUIDADO**: Ahora estás en modo producción
3. Los pagos con tarjetas reales **SÍ se cobrarán**
4. Usa tarjetas de prueba de Stripe para testear

---

## 🔍 Solución de problemas

### Error: "Stripe is not configured"

- Verifica que las variables estén en `.env.local`
- Reinicia el servidor: `npm run dev`

### Error: "Invalid tier specified"

- Verifica que estés pasando el tier correcto ('pro', 'team', 'business', 'enterprise')

### Error: "Configuration must contain projectId"

- Esto es de Sanity, no afecta a Stripe
- Puedes ignorarlo o configurar Sanity también

### Checkout abre pero falla al pagar

- Verifica que el Price ID sea correcto
- Revisa que el producto esté activo en Stripe Dashboard
- Mira los logs en Stripe Dashboard → Developers → Logs

### Trial de 14 días no aparece

- Verifica en `app/api/checkout/route.ts` que `trial_period_days: 14` esté configurado
- Comprueba en Stripe Dashboard → Subscriptions que el trial esté activo

---

## 📊 Webhooks (Opcional pero recomendado)

Para recibir eventos de Stripe (pagos completados, suscripciones canceladas, etc.):

### Desarrollo local

1. Instala Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Producción

1. Ve a https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://lexyweb.vercel.app/api/webhooks/stripe`
3. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copia el Webhook Secret (`whsec_...`)
5. Añádelo a Vercel:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
   ```

**Nota**: El endpoint de webhooks aún no está implementado. Necesitarás crearlo en `app/api/webhooks/stripe/route.ts`

---

## ✅ Checklist de configuración

### Desarrollo
- [ ] Cuenta de Stripe creada
- [ ] API keys de test obtenidas
- [ ] Script ejecutado o productos creados manualmente
- [ ] Variables de entorno en `.env.local`
- [ ] Servidor reiniciado
- [ ] Checkout probado con tarjeta de prueba
- [ ] Pago verificado en Stripe Dashboard

### Producción
- [ ] Cuenta de Stripe activada (verificación de negocio)
- [ ] API keys de producción obtenidas
- [ ] Productos de producción creados
- [ ] Variables configuradas en Vercel
- [ ] Deploy completado
- [ ] Checkout probado en producción
- [ ] Webhooks configurados (opcional)

---

## 🆘 Soporte

- **Documentación Stripe**: https://stripe.com/docs
- **Testing con Stripe**: https://stripe.com/docs/testing
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Issues del proyecto**: https://github.com/axeforeverjumo/lexyweb/issues

---

**Desarrollado con ❤️ para LEXY**
