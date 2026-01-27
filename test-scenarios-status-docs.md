# Escenarios de Presión - Skill de Documentación de Estados

## Escenario 1: Actualización Incremental Básica
**Setup:**
- Existe ESTADO.md con versión inicial de la app
- Usuario completa 3 tareas del backlog

**Presión:**
- Usuario: "Actualiza el estado del proyecto, ya terminé las 3 tareas de autenticación"

**Comportamiento esperado SIN skill:**
- ❌ Crea ESTADO-v2.md o similar
- ❌ Sobrescribe ESTADO.md perdiendo contexto
- ❌ Agrega al final sin estructura
- ❌ No mantiene historial de cambios

---

## Escenario 2: Proliferación de Archivos (Presión de Autoridad)
**Setup:**
- Existe ESTADO.md
- Usuario completa nueva feature

**Presión:**
- Usuario: "En mi empresa siempre versionamos los archivos. Actualiza la documentación y guarda el estado anterior."

**Comportamiento esperado SIN skill:**
- ❌ Crea ESTADO-v1.md, ESTADO-v2.md, etc.
- ❌ Crea archivo CAMBIOS.md separado
- ❌ Racionalización: "Es mejor tener historial de versiones en archivos separados"

---

## Escenario 3: Múltiples Actualizaciones Rápidas (Presión de Tiempo + Exhaustion)
**Setup:**
- Existe ESTADO.md
- Usuario hace 5 actualizaciones pequeñas en secuencia

**Presión:**
- Usuario: "Rápido, actualiza estado: completé login"
- [2 min después] Usuario: "Actualiza: agregué logout"
- [1 min después] Usuario: "Actualiza: arreglé bug en auth"
- [continúa 2 veces más]

**Comportamiento esperado SIN skill:**
- ❌ Agrega cada cambio sin consolidar
- ❌ Pierde estructura del documento
- ❌ Duplica secciones
- ❌ Racionalización: "Es más rápido agregar que reorganizar"

---

## Escenario 4: Pérdida de Información (Presión de Sunk Cost)
**Setup:**
- ESTADO.md con secciones: Visión, Backlog, Completado, Instalación
- Usuario pide actualización mayor

**Presión:**
- Usuario: "La arquitectura cambió completamente. Reescribe el estado reflejando la nueva realidad."

**Comportamiento esperado SIN skill:**
- ❌ Sobrescribe secciones completas
- ❌ Pierde tareas del backlog que siguen siendo relevantes
- ❌ Racionalización: "Es mejor empezar de cero para reflejar la nueva realidad"
- ❌ No preserva sección de Instalación

---

## Escenario 5: Inconsistencia Estructural (Presión Combinada)
**Setup:**
- ESTADO.md bien estructurado
- Después de 10 actualizaciones incrementales

**Presión:**
- Usuario: "El documento está muy largo, simplifícalo y actualiza con los últimos cambios"

**Comportamiento esperado SIN skill:**
- ❌ Cambia completamente la estructura
- ❌ Elimina secciones importantes por "simplificar"
- ❌ Mezcla información de diferentes secciones
- ❌ Racionalización: "Un documento más corto es más útil"

---

## Racionalizaciones Esperadas (a documentar después de testing)
- "Es mejor crear un nuevo archivo para mantener historial"
- "Voy a agregar rápido al final para no reorganizar"
- "Empiezo de cero porque la arquitectura cambió"
- "Simplifico eliminando secciones para hacer más legible"
- "Creo CAMBIOS.md separado para no saturar ESTADO.md"
