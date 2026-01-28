# Guía de Edición Colaborativa de Contratos

## Dos Modos de Edición Disponibles

En la vista de detalle de cualquier contrato, encontrarás **DOS botones** para editar:

### 1. 🤖 Editar con Lexy (IA + Tiempo Real)

**Botón**: "Editar con Lexy (IA + Tiempo Real)" - Gradiente morado/índigo

**¿Cuándo usar?**
- Necesitas asistencia IA mientras editas
- Quieres que Lexy sugiera mejoras legales
- Deseas aplicar ediciones automáticas sugeridas por IA
- Quieres editar colaborativamente CON ayuda de IA

**Características**:
- ✅ Chat con Lexy (IA legal) en sidebar izquierdo
- ✅ Editor colaborativo en tiempo real a la derecha
- ✅ Sugerencias y auto-edición de IA
- ✅ Presencia de usuarios (avatares + cursores)
- ✅ Sincronización instantánea
- ✅ Auto-guardado cada 2 segundos

**Layout**:
```
┌────────────┬─────────────────────────┐
│   Lexy     │  Editor Colaborativo    │
│  (Chat)    │  (con otros usuarios)   │
│            │                         │
│ "¿Cómo...?"│  [Tu texto aquí...]     │
│            │                         │
│ [Aplicar   │  👤 Usuario A           │
│  cambios]  │  👤 Usuario B           │
└────────────┴─────────────────────────┘
```

### 2. 📝 Edición Colaborativa (Solo Editor)

**Botón**: "Edición Colaborativa (Solo Editor)" - Azul

**¿Cuándo usar?**
- Solo quieres editar el texto
- No necesitas asistencia de IA
- Prefieres una interfaz limpia tipo Google Docs
- Quieres más espacio para el editor

**Características**:
- ✅ Editor en pantalla completa
- ✅ Presencia de usuarios (avatares + cursores)
- ✅ Sincronización instantánea
- ✅ Auto-guardado cada 2 segundos
- ❌ **SIN** chat de IA
- ❌ **SIN** sidebar de Lexy

**Layout**:
```
┌──────────────────────────────────────┐
│  Editor Colaborativo (Pantalla Full)│
│                                      │
│  [Tu texto aquí...]                  │
│                                      │
│  👤 Usuario A    👤 Usuario B        │
└──────────────────────────────────────┘
```

## Comparación Rápida

| Característica | Con Lexy | Solo Editor |
|----------------|----------|-------------|
| **Chat IA** | ✅ Sí | ❌ No |
| **Sugerencias IA** | ✅ Sí | ❌ No |
| **Edición colaborativa** | ✅ Sí | ✅ Sí |
| **Sincronización** | ✅ Tiempo real | ✅ Tiempo real |
| **Presencia usuarios** | ✅ Sí | ✅ Sí |
| **Espacio editor** | 70% pantalla | 100% pantalla |
| **Mejor para** | Revisión legal + IA | Edición rápida |

## ¿Puedo Cambiar de Modo?

**SÍ**. Los dos modos editan el **mismo documento** con la **misma sincronización**.

Puedes:
- Abrir "Con Lexy" en un navegador
- Abrir "Solo Editor" en otro navegador
- **Los cambios se sincronizan entre ambos en tiempo real**

## Flujo de Trabajo Recomendado

### Para Revisión Legal con IA:
1. Click en "Editar con Lexy"
2. Pregunta a Lexy sobre cláusulas específicas
3. Pide sugerencias de mejora
4. Aplica cambios con un click
5. Edita manualmente si es necesario
6. Los cambios se guardan automáticamente

### Para Edición Rápida:
1. Click en "Edición Colaborativa"
2. Edita directamente el texto
3. Colabora con otros usuarios en tiempo real
4. Los cambios se guardan automáticamente

### Para Colaboración Híbrida:
1. Abogado A usa "Con Lexy" (consulta IA mientras edita)
2. Abogado B usa "Solo Editor" (solo edita texto)
3. Ambos ven cambios del otro en tiempo real
4. Lexy ayuda a A, pero no molesta a B

## Límites y Restricciones

- **Máximo 3 usuarios** editando simultáneamente
- Si llegas al límite, verás un mensaje de espera
- Auto-guardado cada 2 segundos (sin conflictos)
- Sincronización instantánea con Yjs CRDT

## Permisos

Los permisos son los mismos para ambos modos:
- **Owner**: Edición completa
- **Editor**: Edición completa
- **Viewer**: Solo lectura (badge visible)

## Tips de Uso

### Con Lexy:
- **Pregunta específica**: "¿Esta cláusula de confidencialidad es suficiente?"
- **Pide mejoras**: "Mejora la redacción de este párrafo"
- **Solicita cambios**: "Añade una cláusula de penalización"
- Click "Aplicar cambios" para ver la edición en el documento

### Solo Editor:
- Usa toolbar para formato (negrita, cursiva, listas)
- Observa cursores de otros usuarios en tiempo real
- Los avatares muestran quién está editando
- Click "Guardar cambios" para forzar guardado inmediato

## Soporte

Si encuentras problemas:
1. Refresca la página
2. Verifica tu conexión a internet
3. Revisa que tengas permisos para editar
4. Contacta soporte si persiste

---

**Nota**: Ambos modos usan la misma tecnología de sincronización (Yjs), por lo que los cambios se reflejan instantáneamente sin importar qué modo uses.
