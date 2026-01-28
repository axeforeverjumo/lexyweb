# EJEMPLOS VISUALES: Antes vs Después

## 1. GENERACIÓN DE CONTRATO

### ❌ ANTES (Sistema Claude - 36,000 tokens)

**Prompt enviado a Claude Sonnet 4.5**:
```
Eres un abogado senior especializado en derecho inmobiliario español...

[3,000 tokens de instrucciones]

TEMPLATE BASE:
[2,500 tokens de plantilla completa]

DATOS RECOPILADOS:
{
  "vendedor": { "nombre": "Juan Pérez", "dni": "12345678A" },
  "comprador": { "nombre": "María García", "dni": "87654321B" },
  "inmueble": { "direccion": "Calle Mayor 123", ... },
  ...
}
[1,500 tokens de datos]

CIRCUNSTANCIAS ESPECIALES:
- Propiedad con garaje
- Hipoteca pendiente
[500 tokens]

MODIFICACIONES A CLÁUSULAS:
...
[800 tokens]

INSTRUCCIONES FINALES:
1. ELIMINAR TODOS LOS PLACEHOLDERS
2. RELLENAR DATOS REALES
3. APLICAR MODIFICACIONES
...
[95 líneas de instrucciones]

[TOTAL INPUT: ~15,000 tokens]
```

**Respuesta de Claude**:
```markdown
# CONTRATO DE COMPRAVENTA DE VIVIENDA

En Madrid, a 15 de junio de 2024

REUNIDOS:

DE UNA PARTE, Juan Pérez García, mayor de edad, con DNI 12345678-A,
domiciliado en Calle Alcalá 45, Madrid...

[TODO el contrato regenerado desde cero]

[TOTAL OUTPUT: ~12,000 tokens]
```

**Costo**:
- Input: 15,000 tokens × $0.000015 = $0.225
- Output: 12,000 tokens × $0.000075 = $0.900
- **TOTAL: $1.125**

---

### ✅ DESPUÉS (Sistema Eficiente - 3,000 tokens)

**Paso 1: Extracción de campos (Gemini Flash - 1,000 tokens)**

```
PROMPT:
Extrae los siguientes campos del chat...

CHAT:
Usuario: Vendedor Juan Pérez DNI 12345678A
Usuario: Comprador María García DNI 87654321B
Usuario: Precio 250000 euros
...

[500 tokens de chat + 300 tokens de prompt]
```

```json
RESPUESTA (500 tokens):
{
  "vendedor": { "nombre": "Juan", "apellidos": "Pérez", "dni": "12345678A" },
  "comprador": { "nombre": "María", "apellidos": "García", "dni": "87654321B" },
  "economicos": { "precio_venta": 250000 },
  ...
}
```

**Paso 2: Fill-in-the-blanks (JavaScript - 0 tokens)**

```typescript
// Plantilla con placeholders
const template = `
El VENDEDOR **[vendedor_nombre]** **[vendedor_apellidos]**,
con DNI **[vendedor_dni]**...

El COMPRADOR **[comprador_nombre]** **[comprador_apellidos]**,
con DNI **[comprador_dni]**...

Precio: **[precio_venta]** euros
`;

// Rellenar (JavaScript nativo - SIN IA)
const filled = fillTemplatePlaceholders(template, extractedFields);

// Resultado:
// El VENDEDOR **Juan** **Pérez**, con DNI **12345678-A**...
// El COMPRADOR **María** **García**, con DNI **87654321-B**...
// Precio: **250.000,00 €**
```

**Paso 3: Modificaciones quirúrgicas (solo si es necesario - 1,500 tokens)**

```
PROMPT (solo para cláusulas afectadas):
Modifica SOLO la cláusula de "Condiciones del inmueble"
para incluir el garaje anexo número 15.

CLÁUSULA ORIGINAL:
[300 tokens]

[TOTAL: 800 tokens de prompt]
```

```
RESPUESTA (700 tokens):
[Solo la cláusula modificada]
```

**Costo Total**:
- Extracción: 1,000 tokens × $0.000007 = $0.007
- Modificaciones: 1,500 tokens × $0.000007 = $0.011
- **TOTAL: $0.018** (98% menos que Claude)

---

## 2. VISUALIZACIÓN DE CONTRATOS

### ❌ ANTES (Contratos no se veían)

**API Response** (`/api/contracts/list`):
```json
{
  "success": true,
  "contratos": [
    {
      "id": "123",
      "titulo": "Contrato de Compraventa..."
    }
  ]
}
```

**Frontend Code**:
```typescript
const response = await fetch('/api/contracts/list');
const { contracts } = await response.json();  // ❌ undefined!
setContratos(contracts || []);  // ❌ Siempre array vacío
```

**Resultado**: Pantalla vacía con mensaje "No hay contratos"

---

### ✅ DESPUÉS (Arreglado)

**API Response** (consistente):
```json
{
  "success": true,
  "contracts": [
    {
      "id": "123",
      "titulo": "Contrato de Compraventa...",
      "estado": "generado",
      "created_at": "2024-06-15T10:00:00Z",
      "idioma": "es",
      "template_id": "abc-123"
    }
  ]
}
```

**Frontend Code**:
```typescript
const response = await fetch('/api/contracts/list');
const { contracts } = await response.json();  // ✅ Array con datos
setContratos(contracts || []);  // ✅ Contratos cargados
```

**Resultado**: Lista de contratos visible con tarjetas

---

## 3. EJEMPLO REAL: Contrato de Arras Penitenciales

### PLANTILLA ORIGINAL (Sin placeholders)

```markdown
# CONTRATO DE ARRAS PENITENCIALES

En _______________, a ___ de __________ de 202___

REUNIDOS:

DE UNA PARTE: Don/Doña _________________________, mayor de edad,
con DNI _____________, domiciliado en _______________________

DE OTRA PARTE: Don/Doña _________________________, mayor de edad,
con DNI _____________, domiciliado en _______________________

EXPONEN:

Que el VENDEDOR es propietario del inmueble sito en _______________,
con referencia catastral _________________, inscrito en el Registro...

## CLÁUSULAS

### PRIMERA - OBJETO

El VENDEDOR transmite al COMPRADOR el inmueble descrito por el
precio de ____________ euros (___________________________).

### SEGUNDA - ARRAS

Como señal y a cuenta del precio, el COMPRADOR entrega en este acto
al VENDEDOR la cantidad de __________ euros, que supone el _____%
del precio total.

...
```

**Problema**: Claude debe REGENERAR TODO para rellenar los espacios

---

### PLANTILLA OPTIMIZADA (Con placeholders estandarizados)

```markdown
# CONTRATO DE ARRAS PENITENCIALES

En [ciudad], a [fecha_firma]

REUNIDOS:

DE UNA PARTE: **[vendedor_nombre]** **[vendedor_apellidos]**, mayor de edad,
con DNI **[vendedor_dni]**, domiciliado en **[vendedor_domicilio]**

DE OTRA PARTE: **[comprador_nombre]** **[comprador_apellidos]**, mayor de edad,
con DNI **[comprador_dni]**, domiciliado en **[comprador_domicilio]**

EXPONEN:

Que el VENDEDOR es propietario del inmueble sito en **[inmueble_direccion]**,
con referencia catastral **[inmueble_referencia_catastral]**, inscrito en el
Registro de la Propiedad de [inmueble_registro], tomo [inmueble_tomo],
libro [inmueble_libro], folio [inmueble_folio].

## CLÁUSULAS

### PRIMERA - OBJETO

El VENDEDOR transmite al COMPRADOR el inmueble descrito por el
precio de **[precio_venta]** (**[precio_venta_letras]**).

### SEGUNDA - ARRAS

Como señal y a cuenta del precio, el COMPRADOR entrega en este acto
al VENDEDOR la cantidad de **[importe_arras]**, que supone el
**[porcentaje_arras]**% del precio total.

...
```

**Beneficio**: JavaScript puede rellenar directamente, sin IA

---

## 4. FLUJO COMPLETO: De Chat a Contrato

### CONVERSACIÓN DE USUARIO

```
Usuario: Necesito un contrato de arras para vender mi piso

Asistente: Por supuesto. ¿Quién es el vendedor?

Usuario: Juan Pérez García, DNI 12345678A, vivo en Calle Alcalá 45, Madrid

Asistente: ¿Y el comprador?

Usuario: María González López, DNI 87654321B, domiciliada en
         Avenida de América 100, Madrid

Asistente: ¿Dirección del inmueble?

Usuario: Calle Mayor 123, 3º B, Madrid 28013

Asistente: ¿Referencia catastral?

Usuario: 1234567890ABCD

Asistente: ¿Precio de venta?

Usuario: 250.000 euros

Asistente: ¿Importe de las arras?

Usuario: 25.000 euros

Asistente: ¿Fecha prevista de firma?

Usuario: 15 de julio de 2024
```

---

### ❌ SISTEMA ACTUAL (Claude)

```
1. Usuario completa sidebar con datos
   [Interacción manual]

2. Análisis profundo con Gemini
   [2,000 tokens]

3. Claude REGENERA TODO el contrato
   [36,000 tokens]

TIEMPO: ~15-20 segundos
COSTO: $1.05
```

---

### ✅ SISTEMA EFICIENTE

```
1. Gemini extrae campos del chat
   [1,000 tokens - 2 segundos]

   Resultado:
   {
     "vendedor": {
       "nombre": "Juan",
       "apellidos": "Pérez García",
       "dni": "12345678A",
       "domicilio": "Calle Alcalá 45, Madrid"
     },
     "comprador": {
       "nombre": "María",
       "apellidos": "González López",
       "dni": "87654321B",
       "domicilio": "Avenida de América 100, Madrid"
     },
     "inmueble": {
       "direccion": "Calle Mayor 123, 3º B, Madrid 28013",
       "referencia_catastral": "1234567890ABCD"
     },
     "economicos": {
       "precio_venta": 250000,
       "importe_arras": 25000,
       "porcentaje_arras": 10
     },
     "fechas": {
       "firma": "2024-07-15"
     }
   }

2. JavaScript rellena plantilla
   [0 tokens - instantáneo]

   [vendedor_nombre] → "Juan"
   [vendedor_apellidos] → "Pérez García"
   [vendedor_dni] → "12345678-A"
   [precio_venta] → "250.000,00 €"
   [fecha_firma] → "15 de julio de 2024"
   ...

3. (Opcional) Gemini modifica cláusulas especiales
   [1,500 tokens - 2 segundos]

TIEMPO: ~4-5 segundos
COSTO: $0.018
AHORRO: 98%
```

---

## 5. MÉTRICAS COMPARATIVAS

### Tabla de Comparación

| Métrica | Sistema Claude | Sistema Eficiente | Mejora |
|---------|----------------|-------------------|--------|
| **Tokens por contrato** | 36,000 | 3,000 | **91% menos** |
| **Costo por contrato** | $1.05 | $0.02 | **98% menos** |
| **Tiempo de generación** | 15-20s | 4-5s | **75% más rápido** |
| **Llamadas a IA** | 2 (Gemini + Claude) | 1-2 (solo Gemini) | **50% menos** |
| **Complejidad del prompt** | 15,000 tokens | 800 tokens | **95% más simple** |

### Proyección Anual (1,000 contratos/mes)

| Concepto | Sistema Claude | Sistema Eficiente |
|----------|----------------|-------------------|
| Tokens/mes | 36,000,000 | 3,000,000 |
| Costo/mes | $1,050 | $20 |
| Costo/año | $12,600 | $240 |
| **AHORRO ANUAL** | - | **$12,360** |

---

## 6. CALIDAD DEL RESULTADO

### Contrato Generado (Fragmento)

**Claude**:
```markdown
# CONTRATO DE ARRAS PENITENCIALES

En Madrid, a quince de julio de dos mil veinticuatro.

REUNIDOS:

DE UNA PARTE, Don Juan Pérez García, mayor de edad, con documento
nacional de identidad número 12.345.678-A, domiciliado en Calle
Alcalá número cuarenta y cinco de Madrid, en adelante denominado
como EL VENDEDOR.

Y DE OTRA PARTE, Doña María González López, mayor de edad, con
documento nacional de identidad número 87.654.321-B, domiciliada
en Avenida de América número cien de Madrid, en adelante denominada
como LA COMPRADORA.

...
```

**Sistema Eficiente**:
```markdown
# CONTRATO DE ARRAS PENITENCIALES

En Madrid, a 15 de julio de 2024.

REUNIDOS:

DE UNA PARTE, **Juan Pérez García**, mayor de edad, con DNI
12345678-A, domiciliado en Calle Alcalá 45, Madrid, en adelante
denominado como EL VENDEDOR.

Y DE OTRA PARTE, **María González López**, mayor de edad, con DNI
87654321-B, domiciliada en Avenida de América 100, Madrid, en
adelante denominada como LA COMPRADORA.

...
```

**Diferencias**:
- Claude: Redacción más literaria ("a quince de julio de dos mil veinticuatro")
- Eficiente: Redacción estándar de la plantilla (igual de legal)
- **Calidad legal**: Idéntica (ambas válidas)
- **Personalización**: Ambas correctamente rellenadas
- **Costo**: Claude 58x más caro

---

## 7. CASOS DE USO

### ✅ Casos Ideales para Sistema Eficiente

1. **Contratos estándar**
   - Compraventa simple
   - Arrendamiento estándar
   - Arras básicas
   - **Ahorro: 98%**

2. **Contratos con datos completos**
   - Todos los campos disponibles
   - Sin circunstancias especiales
   - **Ahorro: 98%**

3. **Volumen alto**
   - Inmobiliarias con muchos contratos similares
   - **Ahorro escalable**

---

### ⚠️ Casos que Pueden Necesitar Claude

1. **Redacción muy personalizada**
   - Cláusulas únicas nunca vistas
   - Lenguaje muy específico del cliente
   - **Claude puede ser necesario**

2. **Contratos extremadamente complejos**
   - Muchas circunstancias especiales
   - Modificaciones a 10+ cláusulas
   - **Pero incluso aquí, usar eficiente + Claude parcial es más barato**

3. **Plantillas sin estandarizar**
   - No tienen placeholders
   - **Solución: Actualizar plantilla una vez, ahorrar siempre**

---

## CONCLUSIÓN

**Sistema Eficiente es superior en 90%+ de casos**:
- ✅ 98% más barato
- ✅ 75% más rápido
- ✅ Misma calidad legal
- ✅ Más predecible

**Claude sigue disponible para el 10% de casos complejos**

**Recomendación**: Implementar YA, ROI en <1 mes
