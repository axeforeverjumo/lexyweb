# 🚀 Guía de Deployment en Coolify

Esta guía te ayudará a deployar **Lexyapp** en tu instancia de Coolify.

## 📋 Pre-requisitos

1. ✅ Instancia de Coolify funcionando
2. ✅ Repositorio Git accesible (GitHub, GitLab, Gitea, etc.)
3. ✅ Instancia de Supabase (puede ser en Coolify también)
4. ✅ API Key de Gemini (Google AI)

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Hacer Commit de los Archivos de Docker

```bash
git add Dockerfile .dockerignore next.config.js
git commit -m "feat: configuración Docker para Coolify deployment"
git push origin main
```

### 1.2 Verificar que estos archivos existan en tu repo:
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `next.config.js` (con `output: 'standalone'`)

---

## 🌐 Paso 2: Crear Proyecto en Coolify

### 2.1 En tu Dashboard de Coolify:

1. Click en **"+ New Resource"**
2. Selecciona **"Application"**
3. Elige **"Git Repository"**

### 2.2 Conectar el Repositorio:

1. **Source**: Selecciona tu proveedor Git (GitHub/GitLab/etc.)
2. **Repository**: Selecciona `lexyapp`
3. **Branch**: `main` (o la rama que uses)
4. **Build Pack**: Selecciona **"Dockerfile"**

### 2.3 Configuración Básica:

- **Name**: `lexyapp` (o el nombre que prefieras)
- **Port**: `3000`
- **Auto Deploy**: ✅ Activado (para CI/CD automático)

---

## 🔐 Paso 3: Configurar Variables de Entorno

En la sección **"Environment Variables"** de Coolify, agrega las siguientes variables:

### Variables PÚBLICAS (disponibles en el browser):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
NEXT_PUBLIC_APP_URL=https://lexyapp.tu-dominio.com
```

### Variables PRIVADAS (solo server-side):

```bash
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui
GEMINI_API_KEY=tu_gemini_api_key_aqui
```

### Variables de Build (Build Arguments):

**IMPORTANTE**: Coolify necesita que marques estas variables como **"Build Argument"**:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` → Marcar como **Build Argument**
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Marcar como **Build Argument**
- ✅ `NEXT_PUBLIC_APP_URL` → Marcar como **Build Argument**

> **Nota**: Las variables que empiezan con `NEXT_PUBLIC_` deben estar disponibles en build time porque Next.js las embebe en el bundle de JavaScript.

---

## 🌍 Paso 4: Configurar Dominio

### 4.1 En Coolify:

1. Ve a la sección **"Domains"**
2. Agrega tu dominio: `lexyapp.tu-dominio.com`
3. Coolify generará automáticamente un certificado SSL con Let's Encrypt

### 4.2 En tu DNS:

Agrega un registro A o CNAME que apunte a tu servidor Coolify:

```
A    lexyapp.tu-dominio.com    →    IP_DE_TU_COOLIFY
```

O si usas CNAME:

```
CNAME    lexyapp.tu-dominio.com    →    tu-coolify.tu-dominio.com
```

---

## 🚀 Paso 5: Deploy

### 5.1 Hacer el Primer Deploy:

1. Click en **"Deploy"** en Coolify
2. Espera a que el build termine (puede tardar 3-5 minutos)
3. Verifica los logs en tiempo real

### 5.2 Verificar el Deploy:

El build seguirá estos pasos:
1. ✅ Clone del repositorio
2. ✅ Build de la imagen Docker (3 stages: deps, builder, runner)
3. ✅ Push de la imagen al registry interno de Coolify
4. ✅ Deploy del contenedor
5. ✅ Health check en el puerto 3000

---

## ✅ Paso 6: Verificación Post-Deploy

### 6.1 Verificar que la app esté corriendo:

```bash
curl https://lexyapp.tu-dominio.com
```

Deberías ver el HTML de tu aplicación.

### 6.2 Verificar funcionalidades clave:

1. ✅ Login/Registro de usuarios
2. ✅ Conexión con Supabase
3. ✅ Chat con Gemini AI
4. ✅ Generación de contratos
5. ✅ Sistema de firmas

### 6.3 Verificar logs:

En Coolify, ve a **"Logs"** para ver:
- Errores de runtime
- Requests HTTP
- Conexiones a Supabase
- Llamadas a Gemini API

---

## 🔄 CI/CD Automático

Con **Auto Deploy** activado:

1. Haces `git push origin main`
2. Coolify detecta el cambio automáticamente
3. Inicia un nuevo build
4. Si el build es exitoso, despliega la nueva versión
5. Zero-downtime deployment (rolling update)

---

## 📊 Monitoreo

### Logs en Tiempo Real:

```bash
# En Coolify → Application → Logs
# O vía SSH en tu servidor:
docker logs -f <container-id>
```

### Métricas:

Coolify te mostrará:
- CPU usage
- Memory usage
- Network I/O
- Restart count

---

## 🐛 Troubleshooting

### Problema 1: Build falla en npm install

**Solución**: Verifica que `package-lock.json` esté en el repo.

```bash
git add package-lock.json
git commit -m "chore: add package-lock.json"
git push
```

### Problema 2: Variables de entorno no disponibles

**Síntomas**: Errores como "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solución**:
1. Verifica que las variables `NEXT_PUBLIC_*` estén marcadas como **Build Arguments**
2. Redeploy la aplicación

### Problema 3: Error de conexión a Supabase

**Solución**: Verifica que:
1. La URL de Supabase sea accesible desde el servidor Coolify
2. Las API keys sean correctas
3. Si Supabase está en Coolify, usa la URL interna si es posible

### Problema 4: Build tarda mucho

**Normal**: El primer build puede tardar 5-10 minutos.

**Optimización**: Los siguientes builds usarán cache y serán más rápidos (1-3 minutos).

### Problema 5: Container se reinicia constantemente

**Debug**:
```bash
# Ver logs del contenedor
docker logs <container-id>

# Verificar health del contenedor
docker inspect <container-id> | grep -A 10 Health
```

---

## 🔒 Seguridad

### Checklist de Seguridad:

- ✅ Usa HTTPS (Let's Encrypt automático con Coolify)
- ✅ No expongas `SUPABASE_SERVICE_ROLE_KEY` públicamente
- ✅ No expongas `GEMINI_API_KEY` públicamente
- ✅ Configura CORS en Supabase para tu dominio
- ✅ Usa Row Level Security (RLS) en Supabase
- ✅ Limita rate limiting en Gemini API si es posible

---

## 📈 Scaling

### Horizontal Scaling:

Si necesitas más instancias:

1. En Coolify → Application → Settings
2. Aumenta el número de réplicas
3. Coolify hará load balancing automático

### Vertical Scaling:

Si necesitas más recursos por contenedor:

1. En Coolify → Application → Resources
2. Ajusta CPU/Memory limits
3. Redeploy

---

## 📞 Soporte

Si tienes problemas:

1. **Logs de Coolify**: Primera parada para debugging
2. **Documentación de Coolify**: https://coolify.io/docs
3. **Discord de Coolify**: Comunidad muy activa

---

## 🎉 ¡Listo!

Tu aplicación **Lexyapp** ahora está corriendo en producción con:

- ✅ HTTPS automático
- ✅ CI/CD automático
- ✅ Zero-downtime deployments
- ✅ Logs en tiempo real
- ✅ Health checks
- ✅ Auto-restart en caso de crash

**URL de producción**: https://lexyapp.tu-dominio.com

---

## 📝 Comandos Útiles

```bash
# Ver status de Coolify
coolify status

# Rebuild manual desde SSH
docker-compose -f /path/to/coolify/docker-compose.yml up -d --build

# Ver logs de todos los contenedores
docker-compose logs -f

# Restart de la app
# (Se hace desde el dashboard de Coolify)
```

---

**Última actualización**: 1 Enero 2026
**Versión de Lexyapp**: 1.1.2
