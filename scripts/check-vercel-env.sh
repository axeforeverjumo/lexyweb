#!/bin/bash

###############################################################################
# Script para Verificar Variables de Entorno en Vercel
#
# Este script usa Vercel CLI para verificar que las variables estén
# correctamente configuradas en el dashboard.
###############################################################################

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  VERIFICACIÓN DE VARIABLES EN VERCEL                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no está instalado${NC}"
    echo ""
    echo "Instálalo con:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

# Variables esperadas
EXPECTED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

EXPECTED_VALUES=(
    "https://supabase.odoo.barcelona"
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA"
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc"
)

echo -e "${YELLOW}📋 Obteniendo variables de Vercel...${NC}"
echo ""

# Obtener lista de variables (esto puede requerir login)
ENV_OUTPUT=$(vercel env ls production 2>&1)

if [[ $ENV_OUTPUT == *"Error"* ]]; then
    echo -e "${RED}❌ Error al obtener variables de Vercel${NC}"
    echo ""
    echo "Posibles causas:"
    echo "  1. No has hecho login en Vercel CLI"
    echo "  2. No tienes permisos en el proyecto"
    echo ""
    echo "Ejecuta:"
    echo "  vercel login"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Conexión con Vercel exitosa${NC}"
echo ""

# Verificar cada variable
ALL_GOOD=true

for i in "${!EXPECTED_VARS[@]}"; do
    VAR_NAME="${EXPECTED_VARS[$i]}"
    EXPECTED_VALUE="${EXPECTED_VALUES[$i]}"

    echo -e "${BLUE}Verificando: ${VAR_NAME}${NC}"

    # Obtener el valor de la variable
    VAR_VALUE=$(vercel env pull .env.vercel.check --yes 2>/dev/null && grep "^${VAR_NAME}=" .env.vercel.check | cut -d= -f2- || echo "")

    if [ -z "$VAR_VALUE" ]; then
        echo -e "   ${RED}❌ NO ENCONTRADA${NC}"
        ALL_GOOD=false
    elif [ "$VAR_VALUE" == "$EXPECTED_VALUE" ]; then
        echo -e "   ${GREEN}✅ CORRECTA${NC}"
        echo -e "   ${GREEN}   ${VAR_VALUE:0:50}...${NC}"
    else
        echo -e "   ${YELLOW}⚠️  VALOR INCORRECTO${NC}"
        echo -e "   ${RED}   Esperado: ${EXPECTED_VALUE:0:50}...${NC}"
        echo -e "   ${YELLOW}   Actual:   ${VAR_VALUE:0:50}...${NC}"
        ALL_GOOD=false
    fi

    echo ""
done

# Limpiar archivo temporal
rm -f .env.vercel.check

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

if [ "$ALL_GOOD" = true ]; then
    echo ""
    echo -e "${GREEN}✅ TODAS LAS VARIABLES CORRECTAS${NC}"
    echo ""
    echo "Las variables están configuradas en Vercel."
    echo ""
    echo "Si el login en producción NO funciona, ejecuta:"
    echo "  npm run redeploy"
    echo ""
    echo "Para forzar un rebuild que incluya estas variables."
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ PROBLEMA DETECTADO${NC}"
    echo ""
    echo "Algunas variables están mal configuradas o faltantes."
    echo ""
    echo -e "${YELLOW}SOLUCIÓN:${NC}"
    echo ""
    echo "1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables"
    echo ""
    echo "2. Agrega o corrige las variables:"
    echo ""

    for i in "${!EXPECTED_VARS[@]}"; do
        VAR_NAME="${EXPECTED_VARS[$i]}"
        EXPECTED_VALUE="${EXPECTED_VALUES[$i]}"
        echo "   ${VAR_NAME}"
        echo "   ${EXPECTED_VALUE}"
        echo ""
    done

    echo "3. Asegúrate de marcar:"
    echo "   - Environment: Production ✅"
    echo "   - Environment: Preview ✅"
    echo "   - Environment: Development ✅"
    echo ""
    echo "4. Ejecuta redeploy forzado:"
    echo "   npm run redeploy"
    echo ""
    exit 1
fi
