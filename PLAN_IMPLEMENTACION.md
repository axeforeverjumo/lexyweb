# PLAN DE IMPLEMENTACIÓN - Sistema Eficiente de Contratos

## ESTADO ACTUAL

✅ **Completado**:
- Análisis completo del sistema (40+ páginas)
- Fix "contratos no se ven" aplicado
- Librerías base creadas (template-filler, field-extractor)

⏳ **Pendiente**:
- Endpoint de generación eficiente
- Testing
- Migración gradual

---

## CHECKLIST DE IMPLEMENTACIÓN

### ✅ FASE 0: Preparación (COMPLETADO)

- [x] Analizar sistema actual
- [x] Identificar problemas de visualización
- [x] Fix API `/contracts/list` (contratos → contracts)
- [x] Añadir template_id a query
- [x] Crear `/lib/contracts/template-filler.ts`
- [x] Crear `/lib/contracts/field-extractor.ts`
- [x] Documentar análisis completo

**Tiempo invertido**: 4 horas
**Archivos modificados**:
- `/app/api/contracts/list/route.ts`
- `/lib/contracts/generator.ts`

**Archivos creados**:
- `/SISTEMA_GENERACION_CONTRATOS.md`
- `/RESUMEN_OPTIMIZACION_CONTRATOS.md`
- `/lib/contracts/template-filler.ts`
- `/lib/contracts/field-extractor.ts`

---

### 🔴 FASE 1: Verificación (CRÍTICO - 30 minutos)

- [ ] **Test 1: Contratos se visualizan**
  ```bash
  # 1. Iniciar servidor de desarrollo
  npm run dev

  # 2. Navegar a http://localhost:3000/contratos
  # 3. Verificar que se muestran contratos existentes
  # 4. Si hay error, revisar console del navegador
  ```

- [ ] **Test 2: API responde correctamente**
  ```bash
  # Probar endpoint directamente
  curl http://localhost:3000/api/contracts/list \
    -H "Cookie: [tu-cookie-de-sesion]"

  # Debería devolver:
  # { "success": true, "contracts": [...] }
  ```

- [ ] **Test 3: Datos completos**
  ```bash
  # Verificar que cada contrato tiene:
  # - id
  # - titulo
  # - estado
  # - created_at
  # - idioma
  # - template_id (puede ser null)
  ```

**Si algo falla**: Revisar logs de la API y consola del navegador

---

### 🟠 FASE 2: Testing de Librerías (URGENTE - 2 horas)

#### Test Template Filler

- [ ] **Crear archivo de test**
  ```bash
  mkdir -p __tests__/lib/contracts
  touch __tests__/lib/contracts/template-filler.test.ts
  ```

- [ ] **Test básico de placeholders**
  ```typescript
  import { fillTemplatePlaceholders } from '@/lib/contracts/template-filler';

  test('fill basic placeholders', () => {
    const template = 'Vendedor: [vendedor_nombre], DNI: [vendedor_dni]';
    const fields = {
      vendedor: { nombre: 'Juan Pérez', dni: '12345678A' }
    };

    const result = fillTemplatePlaceholders(template, fields);

    expect(result).toContain('Juan Pérez');
    expect(result).toContain('12345678-A');
  });
  ```

- [ ] **Test formateo de fechas**
- [ ] **Test formateo de precios**
- [ ] **Test completeness calculation**

#### Test Field Extractor

- [ ] **Crear archivo de test**
  ```bash
  touch __tests__/lib/contracts/field-extractor.test.ts
  ```

- [ ] **Test extracción básica** (requiere API key de Gemini)
  ```typescript
  import { extractFieldsFromChat } from '@/lib/contracts/field-extractor';

  test('extract vendedor data', async () => {
    const messages = [
      { role: 'user', content: 'Vendedor: Juan Pérez, DNI 12345678A' }
    ];

    const fields = await extractFieldsFromChat(messages);

    expect(fields.vendedor?.nombre).toBe('Juan');
    expect(fields.vendedor?.apellidos).toBe('Pérez');
  });
  ```

- [ ] **Test con datos vacíos**
- [ ] **Test con datos parciales**

**Ejecutar tests**:
```bash
npm test __tests__/lib/contracts/
```

---

### 🟠 FASE 3: Endpoint Eficiente (URGENTE - 4-6 horas)

#### 3.1 Crear Estructura Base

- [ ] **Crear archivo del endpoint**
  ```bash
  mkdir -p app/api/contracts/generate-efficient
  touch app/api/contracts/generate-efficient/route.ts
  ```

- [ ] **Implementar estructura básica**
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '@/lib/supabase/server';
  import { extractFieldsFromChat } from '@/lib/contracts/field-extractor';
  import { fillTemplatePlaceholders } from '@/lib/contracts/template-filler';

  export async function POST(request: NextRequest) {
    // 1. Autenticación
    // 2. Extraer campos del chat
    // 3. Seleccionar plantilla
    // 4. Fill-in-the-blanks
    // 5. Guardar en BD
    // 6. Retornar resultado
  }
  ```

#### 3.2 Implementar Lógica

- [ ] **Paso 1: Autenticación**
  ```typescript
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  ```

- [ ] **Paso 2: Validar entrada**
  ```typescript
  const { chatMessages, templateId, conversacionId } = await request.json();
  if (!chatMessages || !templateId) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }
  ```

- [ ] **Paso 3: Extraer campos**
  ```typescript
  const extractedFields = await extractFieldsFromChat(chatMessages);
  ```

- [ ] **Paso 4: Obtener plantilla**
  ```typescript
  const { data: template } = await supabase
    .from('contract_templates')
    .select('*')
    .eq('id', templateId)
    .single();
  ```

- [ ] **Paso 5: Rellenar plantilla**
  ```typescript
  const contractContent = fillTemplatePlaceholders(
    template.contenido_markdown,
    extractedFields
  );
  ```

- [ ] **Paso 6: Guardar en BD**
  ```typescript
  const { data: contract } = await supabase
    .from('contract_generations')
    .insert({
      user_id: user.id,
      template_id: template.id,
      conversacion_id: conversacionId,
      titulo: generateTitle(extractedFields),
      contenido_markdown: contractContent,
      datos_completados: extractedFields,
      estado: 'generado',
      idioma: 'es',
      metadata: {
        generated_with: 'efficient-system',
        tokens_used: 1000
      }
    })
    .select()
    .single();
  ```

- [ ] **Paso 7: Retornar resultado**
  ```typescript
  return NextResponse.json({
    success: true,
    contract,
    metadata: {
      tokensUsed: 1000,
      method: 'template-only',
      savings: '97% vs Claude'
    }
  });
  ```

#### 3.3 Testing del Endpoint

- [ ] **Test manual con Postman/curl**
  ```bash
  curl -X POST http://localhost:3000/api/contracts/generate-efficient \
    -H "Content-Type: application/json" \
    -H "Cookie: [session]" \
    -d '{
      "templateId": "[id-de-plantilla]",
      "conversacionId": "[id-conversacion]",
      "chatMessages": [
        {"role": "user", "content": "Vendedor Juan Pérez DNI 12345678A"},
        {"role": "user", "content": "Comprador María García DNI 87654321B"},
        {"role": "user", "content": "Precio 250000 euros"}
      ]
    }'
  ```

- [ ] **Verificar respuesta**
  - ¿Status 200?
  - ¿contract.id presente?
  - ¿contenido_markdown tiene datos rellenados?
  - ¿No quedan placeholders sin rellenar?

- [ ] **Verificar en BD**
  ```sql
  SELECT id, titulo, estado, metadata
  FROM contract_generations
  ORDER BY created_at DESC
  LIMIT 1;
  ```

- [ ] **Comparar con sistema Claude**
  - Generar mismo contrato con ambos sistemas
  - Comparar tokens usados
  - Comparar calidad del resultado

---

### 🟡 FASE 4: Migración Gradual (IMPORTANTE - 2-3 horas)

#### 4.1 Modificar Generate-With-Claude

- [ ] **Añadir lógica de decisión**
  ```typescript
  // En /app/api/contracts/generate-with-claude/route.ts

  export async function POST(request: NextRequest) {
    // ... código actual ...

    // NUEVO: Decidir qué sistema usar
    const canUseEfficientSystem =
      templateFromDB?.contenido_markdown &&
      hasStandardizedPlaceholders(templateFromDB.contenido_markdown) &&
      !requiresComplexGeneration(deepAnalysis);

    if (canUseEfficientSystem) {
      console.log('[Claude] Using efficient system (template-based)');
      return await generateEfficient({
        template: templateFromDB,
        chatMessages: extractChatMessages(conversacionId),
        deepAnalysis,
        userId: user.id,
        conversacionId
      });
    }

    // FALLBACK: Usar Claude para casos complejos
    console.log('[Claude] Using Claude (complex case)');
    // ... código actual de Claude ...
  }
  ```

- [ ] **Implementar función de detección**
  ```typescript
  function hasStandardizedPlaceholders(template: string): boolean {
    // Verificar si tiene placeholders [campo]
    return /\[[\w_]+\]/.test(template);
  }

  function requiresComplexGeneration(analysis: any): boolean {
    // Circunstancias muy especiales
    const hasComplexCircumstances =
      analysis?.circunstanciasEspeciales?.some(
        (c: any) => c.complejidad === 'alta'
      );

    // Muchas modificaciones
    const hasManyModifications =
      (analysis?.modificacionesClausulas?.length || 0) > 5;

    return hasComplexCircumstances || hasManyModifications;
  }
  ```

- [ ] **Añadir logging para tracking**
  ```typescript
  console.log('[Claude Generation] Decision:', {
    canUseEfficient: canUseEfficientSystem,
    hasTemplate: !!templateFromDB,
    hasPlaceholders: hasStandardizedPlaceholders(templateFromDB?.contenido_markdown || ''),
    isComplex: requiresComplexGeneration(deepAnalysis)
  });
  ```

#### 4.2 Testing de Migración

- [ ] **Test caso simple** (debe usar eficiente)
  - Contrato estándar sin modificaciones
  - Verificar en logs que usa sistema eficiente

- [ ] **Test caso complejo** (debe usar Claude)
  - Contrato con muchas circunstancias especiales
  - Verificar en logs que usa Claude

- [ ] **Test fallback**
  - Plantilla sin placeholders
  - Verificar que usa Claude

---

### 🟡 FASE 5: Optimizar Plantillas (IMPORTANTE - 4-8 horas)

#### 5.1 Auditar Plantillas Actuales

- [ ] **Listar todas las plantillas**
  ```sql
  SELECT id, codigo, nombre, categoria,
         LENGTH(contenido_markdown) as longitud
  FROM contract_templates
  ORDER BY categoria;
  ```

- [ ] **Identificar las 5 más usadas**
  ```sql
  SELECT cg.template_id, ct.nombre, COUNT(*) as uso
  FROM contract_generations cg
  JOIN contract_templates ct ON ct.id = cg.template_id
  WHERE cg.created_at > NOW() - INTERVAL '90 days'
  GROUP BY cg.template_id, ct.nombre
  ORDER BY uso DESC
  LIMIT 5;
  ```

#### 5.2 Actualizar Plantilla por Plantilla

**Para cada plantilla priorizada**:

- [ ] **1. Leer plantilla actual**
  ```sql
  SELECT contenido_markdown
  FROM contract_templates
  WHERE codigo = 'arras-penitenciales';
  ```

- [ ] **2. Identificar texto variable**
  - Nombres de personas
  - DNIs
  - Direcciones
  - Precios
  - Fechas
  - Referencias registrales

- [ ] **3. Reemplazar con placeholders**
  ```markdown
  ANTES:
  El VENDEDOR Don/Doña ____________, con DNI _________

  DESPUÉS:
  El VENDEDOR **[vendedor_nombre]**, con DNI **[vendedor_dni]**
  ```

- [ ] **4. Actualizar en BD**
  ```sql
  UPDATE contract_templates
  SET
    contenido_markdown = '[nueva versión con placeholders]',
    campos_requeridos = '[
      {"key": "vendedor_nombre", "label": "Nombre vendedor", "type": "text", "required": true},
      {"key": "vendedor_dni", "label": "DNI vendedor", "type": "text", "required": true},
      ...
    ]'::jsonb
  WHERE codigo = 'arras-penitenciales';
  ```

- [ ] **5. Probar plantilla actualizada**
  ```typescript
  // Script de testing
  const template = await getTemplate('arras-penitenciales');
  const testFields = {
    vendedor_nombre: 'Juan Pérez',
    vendedor_dni: '12345678A',
    comprador_nombre: 'María García',
    // ... más campos de prueba
  };

  const filled = fillTemplatePlaceholders(template.contenido_markdown, testFields);

  // Verificar que no quedan placeholders
  const unfilled = findUnfilledPlaceholders(filled);
  console.log('Placeholders sin rellenar:', unfilled);
  ```

#### 5.3 Plantillas Prioritarias

**Orden sugerido**:
1. [ ] Arras Penitenciales
2. [ ] Arrendamiento de Vivienda
3. [ ] Compraventa de Vivienda
4. [ ] NDA
5. [ ] Carta de Intenciones (LOI)

---

### 🟢 FASE 6: Monitoreo y Métricas (OPCIONAL - 2-3 horas)

#### 6.1 Tabla de Métricas

- [ ] **Crear migración**
  ```sql
  CREATE TABLE contract_generation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contract_generations(id),
    generation_method TEXT, -- 'claude' | 'efficient'
    tokens_used INT,
    estimated_cost DECIMAL(10, 4),
    generation_time_ms INT,
    completeness_percent INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_metrics_created_at ON contract_generation_metrics(created_at);
  CREATE INDEX idx_metrics_method ON contract_generation_metrics(generation_method);
  ```

- [ ] **Añadir tracking a endpoints**
  ```typescript
  // En ambos endpoints
  await supabase.from('contract_generation_metrics').insert({
    contract_id: contract.id,
    generation_method: 'efficient', // o 'claude'
    tokens_used: totalTokens,
    estimated_cost: calculateCost(totalTokens),
    generation_time_ms: Date.now() - startTime,
    completeness_percent: completeness
  });
  ```

#### 6.2 Dashboard de Métricas

- [ ] **Crear vista SQL**
  ```sql
  CREATE VIEW contract_metrics_summary AS
  SELECT
    DATE_TRUNC('day', created_at) as fecha,
    generation_method,
    COUNT(*) as total_contratos,
    AVG(tokens_used) as promedio_tokens,
    SUM(estimated_cost) as costo_total,
    AVG(completeness_percent) as promedio_completitud
  FROM contract_generation_metrics
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY fecha, generation_method
  ORDER BY fecha DESC;
  ```

- [ ] **Query de comparación**
  ```sql
  -- Comparar Claude vs Eficiente
  SELECT
    generation_method,
    COUNT(*) as contratos,
    AVG(tokens_used) as tokens_promedio,
    SUM(estimated_cost) as costo_total,
    AVG(generation_time_ms) as tiempo_promedio_ms
  FROM contract_generation_metrics
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY generation_method;
  ```

---

## RESUMEN DE TIEMPOS

| Fase | Estado | Tiempo |
|------|--------|--------|
| 0. Preparación | ✅ HECHO | 4h |
| 1. Verificación | 🔴 CRÍTICO | 0.5h |
| 2. Testing librerías | 🟠 URGENTE | 2h |
| 3. Endpoint eficiente | 🟠 URGENTE | 6h |
| 4. Migración gradual | 🟡 IMPORTANTE | 3h |
| 5. Optimizar plantillas | 🟡 IMPORTANTE | 6h |
| 6. Monitoreo | 🟢 OPCIONAL | 3h |
| **TOTAL** | - | **24.5h** |

**Timeline recomendado**:
- Día 1 (8h): Fases 1-3
- Día 2 (8h): Fase 4-5
- Día 3 (4h): Fase 6 + ajustes

---

## CRITERIOS DE ÉXITO

### Mínimo Viable (MVP)
- [ ] Contratos se visualizan correctamente
- [ ] Endpoint eficiente funciona
- [ ] Al menos 1 plantilla actualizada
- [ ] Sistema genera contratos con <5,000 tokens

### Éxito Completo
- [ ] Todo lo anterior +
- [ ] 5 plantillas principales actualizadas
- [ ] Migración gradual funcionando
- [ ] 90%+ de contratos usando sistema eficiente
- [ ] Ahorro medible de tokens/costo

### Excelencia
- [ ] Todo lo anterior +
- [ ] Dashboard de métricas funcionando
- [ ] Documentación de usuario
- [ ] A/B testing de calidad
- [ ] <1% de errores en generación

---

## PRÓXIMA ACCIÓN RECOMENDADA

**AHORA MISMO** (30 minutos):
```bash
# 1. Iniciar servidor
npm run dev

# 2. Ir a http://localhost:3000/contratos
# 3. Verificar que se ven los contratos
# 4. Reportar resultado
```

**Si funciona**, proceder con Fase 2 (Testing de librerías)

**Si no funciona**, revisar logs y debug del problema de visualización
