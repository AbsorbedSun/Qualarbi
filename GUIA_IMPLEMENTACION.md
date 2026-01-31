# 🚀 GUÍA DE IMPLEMENTACIÓN - SPA COMPLETO

## ✅ Lo que has logrado

Has migrado **TODO** el contenido de tus archivos HTML al sistema SPA:
- ✅ Dashboard completo
- ✅ Horarios con tabla semanal
- ✅ Profesores con tabla y modal funcional
- ✅ Materias con tabla
- ✅ Configuración completa
- ✅ Ayuda completa

---

## 📝 PASOS DE INSTALACIÓN

### Paso 1: Reemplazar archivo spa-router.js

```bash
# Ruta del archivo a reemplazar:
/public/js/spa-router.js
```

**Acción:** Reemplaza tu archivo `spa-router.js` actual con el nuevo `spa-router-complete.js` (renombrándolo a `spa-router.js`)

### Paso 2: Verificar que app.html esté correcto

Tu archivo `app.html` debe tener esta estructura:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard - Qualarbi</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../public/css/main.css" />
  <link rel="stylesheet" href="../public/css/components.css" />
  <link rel="stylesheet" href="../public/css/dashboard.css" />
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  <div class="flex h-screen overflow-hidden">
    
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>

    <!-- Main Content -->
    <main id="main-content" class="flex-1 overflow-y-auto p-8">
      <!-- El contenido se inyecta aquí dinámicamente -->
    </main>

  </div>

  <!-- Scripts -->
  <script src="../public/js/sidebar-inject.js"></script>
  <script src="../public/js/spa-router.js"></script>
  <script>
    document.body.classList.add('loaded');
    lucide.createIcons();
  </script>
</body>
</html>
```

### Paso 3: Verificar sidebar-inject.js

En tu archivo `sidebar-inject.js`, **todos los links deben usar `href="#"`** en lugar de `href="pagina.html"`:

```javascript
// ✅ CORRECTO
<a href="#" class="nav-link" data-page="dashboard">
  <i data-lucide="layout-dashboard"></i>
  <span>Dashboard</span>
</a>

// ❌ INCORRECTO
<a href="dashboard.html" class="nav-link" data-page="dashboard">
```

**Busca y reemplaza en sidebar-inject.js:**
- `href="dashboard.html"` → `href="#"`
- `href="schedule.html"` → `href="#"`
- `href="teachers.html"` → `href="#"`
- `href="subjects.html"` → `href="#"`
- `href="configuration.html"` → `href="#"`
- `href="help.html"` → `href="#"`

---

## 🎯 Estructura Final de Archivos

```
Qualarbi_Web/
├── public/
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── dashboard.css
│   │
│   └── js/
│       ├── spa-router.js        ← REEMPLAZAR con spa-router-complete.js
│       └── sidebar-inject.js    ← Actualizar hrefs a "#"
│
└── views/
    ├── app.html                 ← Archivo principal SPA
    └── components/
        └── _sidebar.html        ← (opcional, ya está en sidebar-inject.js)
```

---

## 🧪 PRUEBAS

### 1. Iniciar servidor local

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx http-server

# Opción 3: PHP
php -S localhost:8000
```

### 2. Abrir en navegador

```
http://localhost:8000/views/app.html
```

### 3. Probar navegación

✅ **Verifica que:**
1. El sidebar aparece correctamente
2. Dashboard se carga al iniciar
3. Hacer clic en "Horarios" carga la tabla de horarios SIN recargar la página
4. Hacer clic en "Profesores" carga la tabla de profesores SIN recargar
5. El modal de "Agregar Profesor" funciona
6. "Materias" carga correctamente
7. "Configuración" carga correctamente
8. "Ayuda" carga correctamente
9. El botón atrás/adelante del navegador funciona
10. La URL cambia (ej: `app.html` → `schedule.html`) pero NO recarga

---

## 🐛 Solución de Problemas

### Problema 1: La navegación sigue recargando la página

**Causa:** Los links del sidebar usan `href="pagina.html"`

**Solución:** 
```javascript
// En sidebar-inject.js, cambiar TODOS los href a "#":
<a href="#" class="nav-link" data-page="schedule">
```

### Problema 2: El contenido no cambia al hacer clic

**Causa:** El contenedor `#main-content` no existe

**Solución:**
Verificar que en `app.html` exista:
```html
<main id="main-content" class="flex-1 overflow-y-auto p-8">
  <!-- ... -->
</main>
```

### Problema 3: Los iconos no aparecen

**Causa:** Lucide no está inicializado

**Solución:**
Verificar que al final de `app.html` esté:
```html
<script>
  lucide.createIcons();
</script>
```

### Problema 4: El modal de profesores no se abre

**Causa:** La función `openTeacherModal()` no está accesible

**Solución:**
El router se expone en `window.spaRouter`, así que usa:
```javascript
onclick="window.spaRouter.openTeacherModal()"
```

### Problema 5: Error en consola "spaRouter is not defined"

**Causa:** El script `spa-router.js` no se está cargando

**Solución:**
1. Verificar que la ruta es correcta: `<script src="../public/js/spa-router.js"></script>`
2. Verificar que el archivo existe en esa ubicación
3. Abrir la consola del navegador (F12) y ver el error exacto

---

## ✨ Características Implementadas

### Dashboard
- ✅ 4 tarjetas de estadísticas
- ✅ Proyectos recientes con progreso
- ✅ Rastreador de tiempo
- ✅ Botones de acción

### Horarios
- ✅ Tabla semanal completa
- ✅ 4 tarjetas de stats
- ✅ Horarios con colores por materia
- ✅ Leyenda de colores
- ✅ Botones de exportar

### Profesores
- ✅ Tabla de profesores con avatares
- ✅ 4 tarjetas de estadísticas
- ✅ Filtros por departamento, estado y contrato
- ✅ **Modal funcional** para agregar/editar
- ✅ Botones de acciones (ver, editar, eliminar)
- ✅ Paginación

### Materias
- ✅ Tabla de materias
- ✅ 4 tarjetas de estadísticas
- ✅ Badges de información
- ✅ Botones de acciones

### Configuración
- ✅ Formulario de perfil
- ✅ Preferencias con switches
- ✅ Cambio de contraseña
- ✅ Configuración del sistema

### Ayuda
- ✅ Búsqueda
- ✅ 4 cards de recursos
- ✅ Acordeón de FAQs

---

## 🎨 Personalización

### Cambiar datos del Dashboard

Editar en `spa-router.js`:
```javascript
async loadDashboard() {
  // Cambiar números de estadísticas
  <div class="stats-value">24</div>  // ← Cambiar aquí
}
```

### Agregar más profesores a la tabla

Editar en `spa-router.js`:
```javascript
async loadTeachers() {
  // Copiar y pegar un <tr> existente
  // Cambiar nombre, departamento, etc.
}
```

### Personalizar colores de materias en horarios

Editar en `spa-router.js`:
```javascript
// Cambiar colores de fondo de clases:
bg-green-500/20   // Verde
bg-blue-500/20    // Azul
bg-purple-500/20  // Morado
// etc.
```

---

## 📊 Antes vs Después

### ANTES (Archivos HTML separados)
```
dashboard.html  (120+ líneas)
schedule.html   (260+ líneas)
teachers.html   (487+ líneas)
subjects.html   (90+ líneas)
configuration.html (8 líneas comprimidas)
help.html (8 líneas comprimidas)
---
Total: ~973 líneas duplicadas
```

### DESPUÉS (SPA)
```
spa-router.js   (TODO el contenido)
app.html        (50 líneas)
---
Total: 1 archivo JavaScript modular
```

**Beneficios:**
- ✅ Navegación sin recargas (instantánea)
- ✅ Mejor experiencia de usuario
- ✅ Estado preservado
- ✅ Sidebar siempre visible
- ✅ Mantenimiento centralizado

---

## 🚀 Próximos Pasos Sugeridos

### Corto Plazo (esta semana)
1. ✅ Implementar el SPA completo
2. 📝 Probar todas las funcionalidades
3. 🎨 Personalizar datos según tu proyecto

### Mediano Plazo (este mes)
1. 🔐 Conectar con backend/API
2. 💾 Implementar funciones de guardar (profesores, materias, etc.)
3. 📊 Conectar con base de datos real
4. 🔍 Implementar búsqueda funcional

### Largo Plazo (siguiente mes)
1. 📱 Hacer responsive para móviles
2. ⚡ Optimizar rendimiento
3. 🧪 Agregar tests
4. 📈 Analytics y métricas

---

## 💡 Tips Pro

### Tip 1: Debugging
Abre la consola (F12) y busca mensajes del router:
```
✅ Qualarbi SPA inicializado
📍 Ruta actual: dashboard
✅ Ruta cargada: schedule
```

### Tip 2: Agregar loading spinner
Personaliza el método `showLoader()`:
```javascript
showLoader() {
  this.contentContainer.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="animate-spin">
        <i data-lucide="loader" size="48"></i>
      </div>
    </div>
  `;
}
```

### Tip 3: Transiciones suaves
Agrega en el CSS:
```css
#main-content {
  transition: opacity 0.3s ease-in-out;
}
```

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. **Revisa la consola del navegador** (F12) para ver errores
2. **Verifica la estructura de archivos** según esta guía
3. **Comprueba que todos los hrefs sean "#"** en el sidebar
4. **Asegúrate de usar un servidor local** (no abrir con file://)

---

## ✅ Checklist Final

- [ ] Reemplacé `spa-router.js` con el nuevo archivo
- [ ] Actualicé todos los `href` a `#` en `sidebar-inject.js`
- [ ] Verifiqué que `app.html` tiene el contenedor `#main-content`
- [ ] Inicié un servidor local
- [ ] Probé la navegación entre secciones
- [ ] Confirmé que NO hay recargas de página
- [ ] El modal de profesores se abre correctamente
- [ ] Las tablas se ven bien
- [ ] Los iconos de Lucide aparecen
- [ ] Los botones funcionan

---

**¡Felicitaciones! 🎉 Ahora tienes una SPA completa y funcional.**

---

<div align="center">

**Hecho con ❤️ para Qualarbi**  
Versión: 2.0 - SPA Complete  
Fecha: 31 de enero de 2026

</div>
