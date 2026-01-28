#!/bin/bash

###############################################################################
# Script Automático de Diagnóstico y Solución
# Supabase + Vercel
#
# Este script ejecuta automáticamente todo el proceso de diagnóstico
# y solución para el problema de variables de Supabase en Vercel.
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                                ║${NC}"
echo -e "${CYAN}║       DIAGNÓSTICO Y SOLUCIÓN AUTOMÁTICA                       ║${NC}"
echo -e "${CYAN}║       Supabase + Vercel                                       ║${NC}"
echo -e "${CYAN}║                                                                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra package.json${NC}"
    echo "   Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

PROJECT_DIR=$(pwd)
echo -e "${BLUE}📁 Proyecto: ${PROJECT_DIR}${NC}"
echo ""

# Función para esperar Enter
wait_for_enter() {
    echo ""
    read -p "Presiona Enter para continuar..." -r
    echo ""
}

# FASE 1: DIAGNÓSTICO
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 1: DIAGNÓSTICO${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}1.1 Verificando configuración local...${NC}"
echo ""

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local NO encontrado${NC}"
    echo ""
    echo "Por favor, crea .env.local con las variables de Supabase."
    exit 1
else
    echo -e "${GREEN}✅ .env.local encontrado${NC}"

    # Verificar contenido
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅ Variables NEXT_PUBLIC_* presentes en .env.local${NC}"
    else
        echo -e "${RED}❌ Variables NEXT_PUBLIC_* NO encontradas en .env.local${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}1.2 Verificando bundle de producción...${NC}"
echo ""

# Ejecutar verificación de producción
if node scripts/verify-production.js; then
    echo ""
    echo -e "${GREEN}✅ Las variables ESTÁN en producción${NC}"
    echo ""
    echo "El problema NO son las variables. Posibles causas:"
    echo "  - CORS"
    echo "  - Red/Firewall"
    echo "  - Configuración de Supabase"
    echo ""
    echo "Revisa los logs de Vercel:"
    echo "  vercel logs --follow"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ Las variables NO ESTÁN en producción${NC}"
    echo ""
    echo "Esto confirma que Vercel no está inyectando las variables."
    echo "Continuando con la solución..."
fi

wait_for_enter

# FASE 2: VERIFICACIÓN DE VERCEL DASHBOARD
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 2: VERIFICACIÓN DE VERCEL DASHBOARD${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Por favor, verifica manualmente en Vercel Dashboard:"
echo ""
echo -e "${CYAN}URL: https://vercel.com/tu-proyecto/settings/environment-variables${NC}"
echo ""
echo "Verifica que existan ESTAS 3 VARIABLES:"
echo ""
echo -e "${BLUE}1. NEXT_PUBLIC_SUPABASE_URL${NC}"
echo "   Valor: https://supabase.odoo.barcelona"
echo "   Environments: ✅ Production ✅ Preview ✅ Development"
echo ""
echo -e "${BLUE}2. NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo "   Valor: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA"
echo "   Environments: ✅ Production ✅ Preview ✅ Development"
echo ""
echo -e "${BLUE}3. SUPABASE_SERVICE_ROLE_KEY${NC}"
echo "   Valor: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc"
echo "   Environments: ✅ Production ✅ Preview ✅ Development"
echo ""
echo -e "${YELLOW}⚠️  Si alguna variable falta o está incorrecta, agrégala/corrígela AHORA.${NC}"
echo ""

read -p "¿Están TODAS las variables correctas? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo ""
    echo -e "${RED}❌ Configura las variables en Vercel Dashboard y vuelve a ejecutar este script.${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Variables confirmadas en Vercel Dashboard${NC}"

wait_for_enter

# FASE 3: REDEPLOY FORZADO
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 3: REDEPLOY FORZADO SIN CACHE${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}3.1 Limpiando cache local...${NC}"
rm -rf .next out node_modules/.cache
echo -e "${GREEN}✅ Cache local limpiado${NC}"
echo ""

echo -e "${BLUE}3.2 Ejecutando redeploy forzado...${NC}"
echo ""
echo "Este proceso puede tardar 3-5 minutos."
echo "Vercel mostrará el progreso del build..."
echo ""

# Verificar que vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
    npm install -g vercel
fi

# Ejecutar redeploy con --force
if vercel --prod --force; then
    echo ""
    echo -e "${GREEN}✅ Redeploy exitoso${NC}"
else
    echo ""
    echo -e "${RED}❌ Error en redeploy${NC}"
    echo ""
    echo "Intenta redeploy manual desde Vercel UI:"
    echo "  1. Ve a: https://vercel.com/tu-proyecto/deployments"
    echo "  2. Click en los 3 puntos → Redeploy"
    echo "  3. ✅ Marca 'Clear cache'"
    echo "  4. Click 'Redeploy'"
    echo ""
    exit 1
fi

echo ""
echo -e "${BLUE}3.3 Esperando propagación de Vercel...${NC}"
echo ""
echo "Vercel necesita unos segundos para propagar el deployment."
echo "Esperando 30 segundos..."
echo ""

for i in {30..1}; do
    echo -ne "\r⏳ ${i}s restantes..."
    sleep 1
done
echo ""
echo ""

# FASE 4: VERIFICACIÓN POST-REDEPLOY
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 4: VERIFICACIÓN POST-REDEPLOY${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}4.1 Verificando bundle de producción...${NC}"
echo ""

if node scripts/verify-production.js; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║  ✅ SOLUCIÓN EXITOSA - PROBLEMA RESUELTO                      ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Las variables ESTÁN embebidas en el bundle de producción."
    echo ""
    echo -e "${CYAN}SIGUIENTE PASO:${NC}"
    echo ""
    echo "1. Abre: https://www.lexy.plus/login"
    echo ""
    echo "2. Haz login con:"
    echo "   Email: j.ojedagarcia@icloud.com"
    echo "   Password: 19861628"
    echo ""
    echo "3. Abre DevTools (F12) → Console"
    echo ""
    echo "4. Verifica que NO haya error 401"
    echo ""
    echo "5. Deberías poder acceder al dashboard sin problemas."
    echo ""
    echo -e "${GREEN}🎉 ¡Login debería funcionar ahora!${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}║  ❌ PROBLEMA PERSISTE                                          ║${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Las variables AÚN NO ESTÁN en el bundle de producción."
    echo ""
    echo -e "${YELLOW}POSIBLES CAUSAS:${NC}"
    echo ""
    echo "1. Las variables no están en Vercel Dashboard"
    echo "   Solución: Verifica paso 2 de este script"
    echo ""
    echo "2. Cache de Vercel no se limpió"
    echo "   Solución: Ve a Vercel → Settings → General → Clear Build Cache"
    echo ""
    echo "3. Build falló silenciosamente"
    echo "   Solución: Revisa logs en https://vercel.com/tu-proyecto/deployments"
    echo ""
    echo -e "${CYAN}SIGUIENTE PASO:${NC}"
    echo ""
    echo "Ejecuta diagnóstico manual:"
    echo "  1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables"
    echo "  2. Verifica que las 3 variables estén presentes"
    echo "  3. Verifica que tengan marcadas Production + Preview + Development"
    echo "  4. Ve a: https://vercel.com/tu-proyecto/settings/general"
    echo "  5. Click en 'Clear Build Cache'"
    echo "  6. Vuelve a ejecutar este script"
    echo ""
    exit 1
fi
