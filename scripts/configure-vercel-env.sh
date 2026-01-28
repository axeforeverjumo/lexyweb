#!/bin/bash
# Script para configurar las variables de entorno en Vercel

set -e

echo "🔧 Configurando variables de entorno en Vercel..."

# Cargar variables desde .env.local
source .env.local

# Configurar variables en Vercel (Production, Preview, Development)
vercel env add NEXT_PUBLIC_SUPABASE_URL production "$NEXT_PUBLIC_SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env add NEXT_PUBLIC_APP_URL production "https://lexy.plus"

vercel env add NEXT_PUBLIC_SUPABASE_URL preview "$NEXT_PUBLIC_SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env add NEXT_PUBLIC_APP_URL preview "https://lexyweb.vercel.app"

vercel env add NEXT_PUBLIC_SUPABASE_URL development "$NEXT_PUBLIC_SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env add NEXT_PUBLIC_APP_URL development "http://localhost:3000"

echo "✅ Variables de entorno configuradas correctamente"
echo "🚀 Ahora ejecuta: vercel --prod"
