# Modelos de IA Configurados en LexyWeb

Este documento lista los modelos de IA utilizados en la aplicación y sus configuraciones.

## Google Gemini

**Modelo actual:** `gemini-1.5-flash-latest`

### Modelos disponibles (Enero 2026)
- `gemini-1.5-flash-latest` - Recomendado para producción (versión estable más reciente)
- `gemini-2.0-flash-exp` - Experimental (features más recientes)
- `gemini-1.5-pro-latest` - Mayor capacidad, más lento

### Configuración
Variable de entorno: `GEMINI_API_KEY`

### Uso en el código
```typescript
import { geminiClient } from '@/lib/gemini/client';

// Chat conversacional
const response = await geminiClient.chat(messages, systemPrompt, newMessage);

// Generación simple
const text = await geminiClient.generate(prompt);

// Generación JSON
const data = await geminiClient.generateJSON<MyType>(prompt);
```

## Anthropic Claude

**Modelo actual:** `claude-sonnet-4-5`

### Uso
- Contract assistance (`/api/claude/contract-assist`)
- Edición inteligente de contratos con historial de conversación

### Configuración
Variable de entorno: `ANTHROPIC_API_KEY`

### Características
- Context window grande (200k tokens)
- Mejor para tareas legales y edición precisa
- Costo mayor que Gemini

## Recomendaciones de Uso

| Caso de Uso | Modelo Recomendado | Razón |
|-------------|-------------------|-------|
| Chat general | Gemini Flash | Más rápido y económico |
| Generación de contratos | Gemini Flash | Suficiente calidad, menor costo |
| Edición precisa de contratos | Claude Sonnet | Mayor precisión en ediciones quirúrgicas |
| Análisis legal complejo | Claude Sonnet | Mejor razonamiento |
| Embeddings | Gemini Embeddings | Mejor para español |

## Cambios Recientes

### 2026-01-28
- ✅ Actualizado `gemini-1.5-flash` a `gemini-1.5-flash-latest`
- ✅ Verificado que Claude usa `claude-sonnet-4-5` (correcto)

## Troubleshooting

### Error: "Model not found" con Gemini
- Verificar que se usa `-latest` al final del modelo
- Verificar API key válida en `.env.local`

### Error: Rate limit excedido
- Gemini: 15 requests/min en tier gratuito
- Claude: Varía según plan de Anthropic

### Migración Gemini → Claude
Si decides migrar completamente a Claude:
1. Actualizar `lib/gemini/client.ts` para usar Claude SDK
2. Ajustar prompts (Claude requiere formato diferente)
3. Actualizar límites de tokens (Claude tiene mayor contexto)
