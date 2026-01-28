#!/bin/bash

###############################################################################
# Script de Redeploy Forzado para Vercel
#
# Este script fuerza un redeploy limpio SIN cache para asegurar que las
# variables de entorno se embeben correctamente en el bundle.
###############################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  REDEPLOY FORZADO SIN CACHE - Vercel + Supabase              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra package.json${NC}"
    echo "   Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Verificar que vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado.${NC}"
    echo "   Instalando globalmente..."
    npm install -g vercel
fi

echo -e "${YELLOW}📋 PASO 1: Verificando estado actual${NC}"
echo ""

# Verificar git status
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Hay cambios sin commitear:${NC}"
    git status --short
    echo ""
    read -p "¿Quieres hacer commit de estos cambios antes de continuar? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        echo -e "${BLUE}📝 Creando commit...${NC}"
        git add .
        git commit -m "fix: configuración de variables de entorno para Vercel"
        git push origin main
    fi
fi

echo ""
echo -e "${GREEN}✅ Estado verificado${NC}"
echo ""

echo -e "${YELLOW}📋 PASO 2: Configurando variables en Vercel${NC}"
echo ""
echo "Por favor, verifica que estas variables estén configuradas en Vercel:"
echo ""
echo -e "${BLUE}1. NEXT_PUBLIC_SUPABASE_URL${NC}"
echo "   https://supabase.odoo.barcelona"
echo ""
echo -e "${BLUE}2. NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo "   eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA"
echo ""
echo -e "${BLUE}3. SUPABASE_SERVICE_ROLE_KEY${NC}"
echo "   eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc"
echo ""
echo -e "${YELLOW}IMPORTANTE:${NC} Estas variables deben estar en:"
echo "  - Environment: Production"
echo "  - Exposed to: Production AND Preview"
echo ""
read -p "¿Están configuradas correctamente en Vercel Dashboard? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo ""
    echo -e "${RED}❌ Abortando${NC}"
    echo ""
    echo "Ve a: https://vercel.com/tu-proyecto/settings/environment-variables"
    echo "Y configura las variables antes de continuar."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Variables confirmadas${NC}"
echo ""

echo -e "${YELLOW}📋 PASO 3: Limpiando builds locales${NC}"
echo ""
rm -rf .next out node_modules/.cache
echo -e "${GREEN}✅ Cache limpiado${NC}"
echo ""

echo -e "${YELLOW}📋 PASO 4: Forzando redeploy SIN cache${NC}"
echo ""
echo "Este proceso puede tardar varios minutos..."
echo ""

# Redeploy usando vercel CLI con --force
echo -e "${BLUE}Iniciando redeploy con --force...${NC}"
vercel --prod --force

echo ""
echo -e "${GREEN}✅ Redeploy iniciado${NC}"
echo ""

echo -e "${YELLOW}📋 PASO 5: Esperando a que termine el build...${NC}"
echo ""
echo "Ve a: https://vercel.com/dashboard"
echo "Espera a que el deployment esté en estado 'Ready' (Ready icon verde)"
echo ""
read -p "Presiona Enter cuando el deployment esté listo..." -r
echo ""

echo -e "${YELLOW}📋 PASO 6: Verificando producción${NC}"
echo ""
node scripts/verify-production.js

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ PROCESO COMPLETADO                                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Ahora prueba hacer login en: https://www.lexy.plus/login"
echo ""
echo "Credenciales de prueba:"
echo "  Email: j.ojedagarcia@icloud.com"
echo "  Password: 19861628"
echo ""
