#!/bin/bash

# Script de Redeploy para Solucionar Error 401 en Login

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        REDEPLOY COMPLETO PARA SOLUCIONAR ERROR 401           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Directorio del proyecto
PROJECT_DIR="/Users/juanmanuelojedagarcia/Documents/develop/Desarrollos internos/lexyweb"
cd "$PROJECT_DIR" || exit 1

echo "📁 Directorio: $PROJECT_DIR"
echo ""

# PASO 1: Limpiar build anterior
echo "🧹 PASO 1/4: Limpiando build anterior..."
rm -rf .next
rm -rf out
echo "   ✅ Build anterior eliminado"
echo ""

# PASO 2: Rebuild local para verificar
echo "🔨 PASO 2/4: Rebuilding localmente..."
echo "   (Esto puede tomar 1-2 minutos)"
if npm run build; then
    echo "   ✅ Build local exitoso"
else
    echo "   ❌ Error en build local"
    echo "   Revisa los errores arriba antes de continuar"
    exit 1
fi
echo ""

# PASO 3: Deploy a producción
echo "🚀 PASO 3/4: Deploying a producción..."
echo "   (Esto puede tomar 2-3 minutos)"

if vercel --prod --yes; then
    echo "   ✅ Deploy exitoso"
else
    echo "   ❌ Error en deploy"
    echo "   Revisa los errores arriba"
    exit 1
fi
echo ""

# PASO 4: Instrucciones finales
echo "✅ PASO 4/4: Deploy completado"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    PRÓXIMOS PASOS                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Espera 30 segundos a que Vercel propague los cambios"
echo ""
echo "2. Abre: https://www.lexy.plus/login"
echo ""
echo "3. Prueba con estas credenciales:"
echo "   Email: test@lexy.plus"
echo "   Password: Test123456!"
echo ""
echo "4. Abre la consola del navegador (F12) y verifica:"
echo "   - Si funciona: ¡problema resuelto! 🎉"
echo "   - Si sigue 401: ejecuta el diagnóstico avanzado"
echo "   - Si es 400: verifica usuario/password"
echo ""
echo "5. Para diagnóstico avanzado:"
echo "   vercel logs --follow"
echo ""
echo "═══════════════════════════════════════════════════════════════"
