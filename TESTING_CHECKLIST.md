# Checklist de Testing: Dos Modos de Edición

## Pre-requisitos

Antes de empezar:
- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Base de datos Supabase activa
- [ ] Al menos 1 contrato creado
- [ ] Al menos 2 usuarios registrados (para probar colaboración)

## Test 1: Botones en Vista de Detalle

**Ubicación**: `/contratos/[id]`

- [ ] **Verificar Botón 1** ("Editar con Lexy"):
  - [ ] Tiene icono Sparkles (✨)
  - [ ] Color gradiente morado/índigo
  - [ ] Texto "Editar con Lexy"
  - [ ] Subtítulo "(IA + Tiempo Real)" visible en desktop

- [ ] **Verificar Botón 2** ("Edición Colaborativa"):
  - [ ] Tiene icono Users (👥)
  - [ ] Color azul con borde
  - [ ] Texto "Edición Colaborativa"
  - [ ] Subtítulo "(Solo Editor)" visible en desktop

- [ ] **Diferenciación visual clara** entre ambos botones

## Test 2: Modo "Editar con Lexy"

### Test 2.1: Carga Inicial

**Acción**: Click en "Editar con Lexy"

- [ ] Se abre ruta `/contratos/[id]/editar`
- [ ] Aparece sidebar a la izquierda (450px)
- [ ] Aparece editor a la derecha (flex-1)
- [ ] Header muestra "Edición con Lexy"
- [ ] Botón "Volver al contrato" funciona
- [ ] Loading spinner mientras carga usuario

### Test 2.2: Sidebar Lexy

**Ubicación**: Sidebar izquierdo

- [ ] **Header Lexy**:
  - [ ] Avatar con gradiente morado
  - [ ] Texto "Lexy Assistant"
  - [ ] Subtítulo "Asistente legal IA"

- [ ] **Mensaje inicial**:
  - [ ] Icono Sparkles
  - [ ] "Hola, soy Lexy tu asistente legal"
  - [ ] Lista de capacidades (explicar, editar, sugerir, responder)

- [ ] **Input de chat**:
  - [ ] Placeholder: "Pregunta a Lexy sobre el contrato..."
  - [ ] Botón enviar (icono Send)
  - [ ] Enter para enviar
  - [ ] Shift+Enter para nueva línea
  - [ ] Deshabilitado mientras está cargando

### Test 2.3: Interacción con Lexy

**Acción**: Enviar mensaje "Hola Lexy"

- [ ] Mensaje del usuario aparece a la derecha (azul)
- [ ] Loading spinner mientras Lexy responde
- [ ] Respuesta de Lexy aparece a la izquierda (blanco)
- [ ] Timestamp correcto en ambos mensajes
- [ ] Auto-scroll al mensaje más reciente

**Acción**: Pedir edición "Mejora el primer párrafo"

- [ ] Lexy responde con texto
- [ ] Aparece botón "Aplicar cambios al contrato" (verde)
- [ ] Click en botón aplica cambios al editor
- [ ] Editor se actualiza con nuevo contenido
- [ ] Se guarda automáticamente

### Test 2.4: Editor Colaborativo

**Ubicación**: Panel derecho

- [ ] **Presencia Bar**:
  - [ ] Muestra avatares de usuarios conectados
  - [ ] Muestra tu propio avatar
  - [ ] Colores asignados correctamente
  - [ ] Contador "1/3", "2/3", etc.

- [ ] **Toolbar**:
  - [ ] Botones de formato visibles
  - [ ] Negrita, cursiva, código funcionan
  - [ ] Listas ordenadas/desordenadas funcionan
  - [ ] Headings (H1, H2, H3) funcionan
  - [ ] Deshacer/rehacer funciona

- [ ] **Editor**:
  - [ ] Contenido inicial cargado
  - [ ] Puedes escribir y editar
  - [ ] Formato se aplica correctamente
  - [ ] Scroll funciona

- [ ] **Auto-guardado**:
  - [ ] Mensaje "Guardando..." aparece después de editar
  - [ ] Desaparece cuando completa
  - [ ] Botón "Guardar cambios" manual funciona

### Test 2.5: Colaboración en Tiempo Real

**Requisito**: 2 navegadores

**Navegador A**: Abre `/contratos/[id]/editar`
**Navegador B**: Abre `/contratos/[id]/editar`

- [ ] **Presencia**:
  - [ ] A ve avatar de B
  - [ ] B ve avatar de A
  - [ ] Colores diferentes para cada usuario

- [ ] **Cursores**:
  - [ ] A ve cursor de B en tiempo real
  - [ ] B ve cursor de A en tiempo real
  - [ ] Nombres aparecen sobre cursores

- [ ] **Edición**:
  - [ ] Cambios de A aparecen en B instantáneamente
  - [ ] Cambios de B aparecen en A instantáneamente
  - [ ] Sin conflictos al editar simultáneamente

- [ ] **Lexy**:
  - [ ] A pide cambio a Lexy
  - [ ] A aplica cambio
  - [ ] B ve el cambio de Lexy en tiempo real

## Test 3: Modo "Edición Colaborativa"

### Test 3.1: Carga Inicial

**Acción**: Click en "Edición Colaborativa"

- [ ] Se abre ruta `/contratos/[id]/editar-colaborativo`
- [ ] NO aparece sidebar de Lexy
- [ ] Editor ocupa toda la pantalla
- [ ] Header muestra "Edición Colaborativa"
- [ ] Botón "Volver al contrato" funciona
- [ ] Loading spinner mientras carga usuario

### Test 3.2: Editor Puro

**Ubicación**: Pantalla completa

- [ ] **Presencia Bar**: Igual que en modo con Lexy
- [ ] **Toolbar**: Igual que en modo con Lexy
- [ ] **Editor**: Más ancho (100% pantalla)
- [ ] **Auto-guardado**: Funciona igual

### Test 3.3: Colaboración

**Navegador A**: Abre `/contratos/[id]/editar-colaborativo`
**Navegador B**: Abre `/contratos/[id]/editar-colaborativo`

- [ ] Presencia funciona
- [ ] Cursores sincronizan
- [ ] Ediciones sincronizan
- [ ] Sin Lexy visible

## Test 4: Sincronización Cruzada (CRÍTICO)

Este test verifica que ambos modos usan el mismo documento.

### Test 4.1: Lexy → Google Docs

**Navegador A**: Abre `/contratos/[id]/editar` (Con Lexy)
**Navegador B**: Abre `/contratos/[id]/editar-colaborativo` (Solo Editor)

- [ ] **Presencia cruzada**:
  - [ ] A ve avatar de B (en presencia bar)
  - [ ] B ve avatar de A (en presencia bar)

- [ ] **A edita manualmente**:
  - [ ] B ve cambio en tiempo real

- [ ] **B edita manualmente**:
  - [ ] A ve cambio en tiempo real

- [ ] **A usa Lexy**:
  - [ ] A pide "Añade un título al documento"
  - [ ] A aplica cambio de Lexy
  - [ ] ✅ **B ve el cambio de Lexy en tiempo real**

### Test 4.2: Google Docs → Lexy

**Navegador A**: Abre `/contratos/[id]/editar-colaborativo` (Solo Editor)
**Navegador B**: Abre `/contratos/[id]/editar` (Con Lexy)

- [ ] **Presencia cruzada funciona**

- [ ] **A edita**:
  - [ ] B ve cambio en editor
  - [ ] B ve cambio en contexto de Lexy (cuando pregunta)

- [ ] **B usa Lexy**:
  - [ ] B pide cambio
  - [ ] B aplica cambio
  - [ ] ✅ **A ve el cambio en tiempo real**

## Test 5: Límite de Usuarios

**Requisito**: 4 usuarios

**Usuarios 1, 2, 3**: Abren el contrato (cualquier modo)
**Usuario 4**: Intenta abrir el contrato

- [ ] Usuario 4 ve mensaje: "Este contrato ya tiene 3 usuarios editando"
- [ ] Usuario 4 NO puede editar
- [ ] Usuario 1 cierra → Usuario 4 puede entrar

## Test 6: Permisos

### Test 6.1: Owner

**Acción**: Owner abre cualquier modo

- [ ] Puede editar
- [ ] NO hay badge "Solo lectura"
- [ ] Botón "Guardar cambios" activo

### Test 6.2: Colaborador Editor

**Acción**: Colaborador con rol "editor" abre cualquier modo

- [ ] Puede editar
- [ ] NO hay badge "Solo lectura"
- [ ] Botón "Guardar cambios" activo

### Test 6.3: Colaborador Viewer

**Acción**: Colaborador con rol "viewer" abre cualquier modo

- [ ] NO puede editar (editor deshabilitado)
- [ ] Badge "Solo lectura" visible
- [ ] Toolbar deshabilitada
- [ ] Lexy funciona (solo lectura)

### Test 6.4: Sin Permisos

**Acción**: Usuario sin permisos intenta abrir

- [ ] Redirige a `/contratos`
- [ ] NO puede acceder al editor

## Test 7: Navegación

### Test 7.1: Botón Volver

**Acción**: Click en "Volver al contrato"

- [ ] En modo "Con Lexy" → Vuelve a `/contratos/[id]`
- [ ] En modo "Google Docs" → Vuelve a `/contratos/[id]`

### Test 7.2: Cambio de Modo

**Acción**: Desde `/contratos/[id]`

- [ ] Click "Editar con Lexy" → Abre modo Lexy
- [ ] Volver → Click "Edición Colaborativa" → Abre modo Google Docs
- [ ] Contenido es el mismo

## Test 8: Persistencia

### Test 8.1: Guardado Automático

**Acción**: Edita y espera 2 segundos

- [ ] Aparece "Guardando..."
- [ ] Desaparece cuando completa
- [ ] Recarga página → Cambios persisten

### Test 8.2: Guardado Manual

**Acción**: Click en "Guardar cambios"

- [ ] Botón muestra "Guardando..."
- [ ] Botón vuelve a "Guardar cambios"
- [ ] Recarga página → Cambios persisten

### Test 8.3: Sin Conexión

**Acción**: Desconecta WiFi

- [ ] Editor sigue funcionando (offline)
- [ ] Mensaje de error al intentar guardar
- [ ] Reconecta → Guarda automáticamente

## Test 9: Performance

### Test 9.1: Carga Inicial

- [ ] Modo "Con Lexy" carga en < 2 segundos
- [ ] Modo "Google Docs" carga en < 2 segundos
- [ ] No hay lag al escribir

### Test 9.2: Sincronización

- [ ] Cambios se reflejan en < 100ms
- [ ] Sin lag con 3 usuarios simultáneos

## Test 10: Errores y Edge Cases

### Test 10.1: Contrato No Existe

**Acción**: Abre `/contratos/invalid-id/editar`

- [ ] Redirige a `/contratos`
- [ ] NO muestra error visual

### Test 10.2: Usuario No Autenticado

**Acción**: Logout → Intenta abrir editor

- [ ] Redirige a `/login`

### Test 10.3: Lexy Error

**Acción**: Pregunta a Lexy algo que cause error

- [ ] Mensaje de error en rojo
- [ ] Icono AlertCircle
- [ ] Editor sigue funcionando

### Test 10.4: Contenido Vacío

**Acción**: Contrato sin contenido

- [ ] Muestra placeholder "# Nuevo Contrato..."
- [ ] Puedes editar normalmente

## Resumen de Resultados

| Test | Estado | Notas |
|------|--------|-------|
| Test 1: Botones | ⬜ |  |
| Test 2: Modo Lexy | ⬜ |  |
| Test 3: Modo Google Docs | ⬜ |  |
| Test 4: Sincronización Cruzada | ⬜ | **CRÍTICO** |
| Test 5: Límite Usuarios | ⬜ |  |
| Test 6: Permisos | ⬜ |  |
| Test 7: Navegación | ⬜ |  |
| Test 8: Persistencia | ⬜ |  |
| Test 9: Performance | ⬜ |  |
| Test 10: Edge Cases | ⬜ |  |

**Leyenda**:
- ⬜ Pendiente
- ✅ Pasado
- ❌ Fallado

## Bugs Encontrados

Anota aquí cualquier bug encontrado durante el testing:

1.
2.
3.

## Notas Adicionales

Anota aquí observaciones o mejoras sugeridas:

1.
2.
3.
