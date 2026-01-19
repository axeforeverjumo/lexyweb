# Documentación LEXY Landing Page

**Última actualización**: 2026-01-19

Esta carpeta contiene la documentación consolidada del proyecto LEXY Landing Page.

---

## 📚 Documentación Principal

### [PROYECTO.md](./PROYECTO.md)
**Diseño, Contenido y Visión del Producto**

Contiene:
- Visión y objetivos del proyecto
- Filosofía y concepto de diseño
- Sistema de diseño completo (colores, tipografía, espaciado, efectos)
- Estructura de contenido por sección
- Descripción de todos los componentes
- Historial de mejoras visuales recientes
- Próximos pasos

**Cuándo leerlo:**
- Para entender la visión del producto
- Al diseñar nuevas secciones o componentes
- Al actualizar el contenido
- Para mantener consistencia visual

### [IMPLEMENTACION.md](./IMPLEMENTACION.md)
**Setup Técnico, Integraciones y Deploy**

Contiene:
- Stack tecnológico completo
- Configuración del proyecto (Next.js, Tailwind, TypeScript)
- Integración de Stripe para pagos
- SEO y optimización de performance
- Deployment a Vercel
- Integración de Sanity CMS
- Troubleshooting y comandos útiles

**Cuándo leerlo:**
- Al hacer setup inicial del proyecto
- Para configurar integraciones (Stripe, Sanity)
- Al hacer deploy
- Al resolver problemas técnicos
- Para optimizar SEO y performance

---

## 🗂️ Estructura

```
docs/
├── README.md                 ← Este archivo
├── PROYECTO.md              ← Diseño y contenido
├── IMPLEMENTACION.md        ← Setup técnico
└── archive/                 ← Documentación histórica
    ├── RESTYLING.md
    ├── CONTENIDO-*.md
    ├── PLAN-SEO-ESTRATEGICO.md
    ├── SANITY-*.md
    └── plans/
        └── 2026-01-08-lexy-landing-page.md
```

---

## 🎯 Quick Start

### Para Diseñadores
1. Lee [PROYECTO.md](./PROYECTO.md) sección "Sistema de Diseño"
2. Revisa "Estructura de Contenido"
3. Consulta "Componentes Implementados"

### Para Desarrolladores
1. Lee [IMPLEMENTACION.md](./IMPLEMENTACION.md) sección "Configuración del Proyecto"
2. Sigue "Setup Local"
3. Consulta "Troubleshooting" si hay problemas

### Para Product Managers
1. Lee [PROYECTO.md](./PROYECTO.md) sección "Visión y Objetivos"
2. Revisa "Estructura de Contenido"
3. Consulta [IMPLEMENTACION.md](./IMPLEMENTACION.md) sección "Métricas de Éxito"

---

## 📦 Documentación Archivada

La carpeta `archive/` contiene documentación histórica del proyecto que fue consolidada en los 2 archivos principales. Útil para referencia histórica pero no necesaria para el día a día.

**Contenido del archivo:**
- Planes de implementación originales
- Borradores de contenido
- Documentación de SEO estratégico
- Setup guides individuales de Sanity
- Posts de blog planificados

---

## 🔄 Actualización de Documentación

**Cuándo actualizar:**

### PROYECTO.md
- Al cambiar colores, tipografía o espaciado
- Al añadir nuevas secciones o componentes
- Al modificar contenido importante
- Al implementar mejoras visuales

### IMPLEMENTACION.md
- Al actualizar dependencias
- Al cambiar configuraciones
- Al añadir nuevas integraciones
- Al resolver problemas comunes

**Cómo actualizar:**
1. Edita el archivo correspondiente
2. Actualiza la fecha en el header
3. Documenta el cambio en la sección apropiada
4. Commit con mensaje descriptivo:
   ```bash
   git commit -m "docs: update [PROYECTO/IMPLEMENTACION] - [descripción]"
   ```

---

## 💡 Tips

- **Buscar en documentación**: Usa Cmd+F en tu editor
- **Referencias cruzadas**: Ambos docs se referencian mutuamente
- **Código actualizado**: La documentación refleja el estado actual del código
- **Ejemplos de código**: Todos los snippets son funcionales y testeados

---

## 📞 Contacto

Para preguntas sobre la documentación:
- **Proyecto/Diseño**: [Team Design]
- **Implementación/Técnico**: [Team Engineering]
- **General**: [Product Manager]

---

**Última consolidación**: 2026-01-19
**Versión**: 2.0 (Documentación consolidada)
