# 🔧 Configurar Variables de Entorno en Vercel

El error de Supabase (`TypeError: Failed to execute 'fetch'`) es porque las variables de entorno **NO están configuradas en Vercel**.

## 📋 Variables Necesarias

**IMPORTANTE:** Los valores reales están en tu archivo `.env.local` local. NO los commiteamos a Git por seguridad.

### 🔴 CRÍTICAS (Supabase - Causando el error actual)

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Ver .env.local línea 2
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Ver .env.local línea 3
SUPABASE_SERVICE_ROLE_KEY=         # Ver .env.local línea 4
```

### 🟡 AI APIs

```bash
GEMINI_API_KEY=                    # Ver .env.local línea 7
ANTHROPIC_API_KEY=                 # Ver .env.local línea 11
```

### 🟢 App Config

```bash
NEXT_PUBLIC_APP_URL=https://www.lexy.plus
```

### 💳 Stripe

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Ver .env.local línea 17
STRIPE_SECRET_KEY=                  # Ver .env.local línea 18
STRIPE_PRICE_ID_PRO=                # Ver .env.local línea 22
STRIPE_PRICE_ID_TEAM=               # Ver .env.local línea 23
STRIPE_PRICE_ID_BUSINESS=           # Ver .env.local línea 24
STRIPE_PRICE_ID_ENTERPRISE=         # Ver .env.local línea 25
```

### 🔵 Sanity CMS

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=s5r9o1yx
NEXT_PUBLIC_SANITY_DATASET=production
```

## 🚀 Opción 1: Script Automatizado (Recomendado)

```bash
# En tu terminal local (donde está .env.local):
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb

# Ejecuta este comando para cada variable:
vercel env add NOMBRE_VARIABLE production

# Cuando te pida el valor, cópialo desde .env.local
```

## 🌐 Opción 2: Interfaz Web de Vercel

1. Ve a: https://vercel.com/axeforeverjumo/lexyweb/settings/environment-variables

2. Click en "Add New"

3. Para cada variable:
   - Name: Copia el nombre (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: Copia el valor desde tu `.env.local`
   - Environment: Selecciona "Production"
   - Click "Save"

4. Repite para TODAS las variables listadas arriba

## 🔄 Después de Configurar

**Vercel hará redeploy automáticamente** cuando agregues variables de entorno.

O puedes forzar redeploy con:
```bash
vercel --prod
```

## ✅ Verificar que Funcionó

1. Espera ~2 minutos al redeploy
2. Ve a https://www.lexy.plus/login
3. Intenta hacer login
4. Si funciona: ✅ Variables configuradas correctamente
5. Si sigue fallando: Revisa la consola del navegador (F12)

## 🐛 Troubleshooting

Si después de configurar las variables sigue sin funcionar:

1. Verifica que las variables tengan el prefijo correcto:
   - `NEXT_PUBLIC_` para variables que se usan en el frontend
   - Sin prefijo para variables solo del backend

2. Asegúrate de que las variables estén en **production** environment

3. Verifica en Vercel dashboard que las variables aparecen listadas

4. Fuerza un redeploy completo

## 📝 Notas de Seguridad

- **NUNCA** commiteesAPI keys a Git
- Los valores reales solo existen en `.env.local` (local) y en Vercel (producción)
- `.env.local` está en `.gitignore`
