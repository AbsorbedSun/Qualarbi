# 🚀 Guía Rápida de Implementación SPA

> **Migra tu proyecto de multi-página a SPA en 15 minutos**

---

## ⚡ Instalación Express

### Paso 1: Copiar Archivos (2 min)

Copia estos archivos a tu proyecto:

```
public/js/
├── spa-router.js       ← NUEVO (copiar)
└── sidebar-inject.js   ← YA EXISTE (mantener)

views/
└── app.html            ← NUEVO (copiar)
```

### Paso 2: Actualizar sidebar-inject.js (3 min)

Cambia todos los `href="pagina.html"` por `href="#"`:

**ANTES:**
```html
<a href="dashboard.html" class="nav-link" data-page="dashboard">
  Dashboard
</a>
```

**DESPUÉS:**
```html
<a href="#" class="nav-link" data-page="dashboard">
  Dashboard
</a>
```

### Paso 3: Probar (1 min)

```bash
# Iniciar servidor
python -m http.server 8000

# Abrir navegador
http://localhost:8000/views/app.html
```

¡Listo! Ya tienes una SPA funcionando.

---

## 🔧 Migrar Contenido Existente (10 min)

### Opción A: Migración Rápida

Si tienes páginas separadas (dashboard.html, schedule.html, etc.), puedes extraer solo el contenido:

#### 1. Abrir tu página existente (ej: schedule.html)

```html
<!-- schedule.html COMPLETO -->
<body>
  <aside>...</aside>
  <main>
    <h1>Horarios</h1>
    <div class="grid">...</div>
  </main>
</body>
```

#### 2. Copiar solo el contenido de `<main>`

```html
<h1>Horarios</h1>
<div class="grid">...</div>
```

#### 3. Pegar en el loader correspondiente en `spa-router.js`

```javascript
async loadSchedule() {
  this.contentContainer.innerHTML = `
    <h1>Horarios</h1>
    <div class="grid">...</div>
  `;
  
  this.initLucideIcons();
}
```

### Opción B: Migración Completa

Extrae el contenido de todas tus páginas:

```javascript
// En spa-router.js

async loadDashboard() {
  this.contentContainer.innerHTML = `
    <!-- Contenido de dashboard.html -->
  `;
  this.initLucideIcons();
}

async loadSchedule() {
  this.contentContainer.innerHTML = `
    <!-- Contenido de schedule.html -->
  `;
  this.initLucideIcons();
}

async loadTeachers() {
  this.contentContainer.innerHTML = `
    <!-- Contenido de teachers.html -->
  `;
  this.initLucideIcons();
}

// ... etc
```

---

## ✅ Checklist de Verificación

- [ ] `spa-router.js` copiado a `public/js/`
- [ ] `app.html` copiado a `views/`
- [ ] Links del sidebar cambiados a `href="#"`
- [ ] Todos los links tienen `data-page`
- [ ] Servidor local iniciado
- [ ] Navegación funciona sin recargas
- [ ] Iconos se ven correctamente
- [ ] Link activo se marca en verde

---

## 🎨 Personalización Básica

### Cambiar el contenido del Dashboard

```javascript
// En spa-router.js, busca:
async loadDashboard() {
  this.contentContainer.innerHTML = `
    <!-- AQUÍ modifica el HTML del dashboard -->
  `;
}
```

### Añadir una nueva sección

```javascript
// 1. Registrar ruta
registerRoutes() {
  this.routes = {
    // ... existentes ...
    'reportes': {
      title: 'Reportes',
      loader: () => this.loadReportes()
    }
  };
}

// 2. Crear loader
async loadReportes() {
  this.contentContainer.innerHTML = `
    <h1>Reportes</h1>
    <div class="card">
      <p>Contenido de reportes</p>
    </div>
  `;
  this.initLucideIcons();
}

// 3. Añadir link al sidebar (en sidebar-inject.js)
<a href="#" class="nav-link" data-page="reportes">
  <i data-lucide="file-text"></i>
  <span>Reportes</span>
</a>
```

---

## 🐛 Solución de Problemas Comunes

### Problema: La navegación recarga la página

**Causa:** Los links usan `href="pagina.html"`

**Solución:**
```html
<!-- Cambiar esto: -->
<a href="dashboard.html" class="nav-link" data-page="dashboard">

<!-- Por esto: -->
<a href="#" class="nav-link" data-page="dashboard">
```

### Problema: El contenido no cambia

**Causa:** El contenedor no se encuentra

**Solución:**
Verifica que existe `<main id="main-content">` en `app.html`:

```html
<main id="main-content" class="flex-1 overflow-y-auto p-8">
  <!-- El contenido se inyecta aquí -->
</main>
```

### Problema: Los iconos no aparecen

**Causa:** Lucide no está inicializado

**Solución:**
Asegúrate de llamar `this.initLucideIcons()` al final de cada loader:

```javascript
async loadDashboard() {
  this.contentContainer.innerHTML = `...`;
  this.initLucideIcons(); // ← IMPORTANTE
}
```

### Problema: Errores de consola

**Solución:**
1. Abre la consola (F12)
2. Busca el error específico
3. Verifica que todos los scripts estén cargados
4. Comprueba que las rutas de archivos sean correctas

---

## 📈 Comparación: Antes vs Después

### ANTES (Multi-Página)

```
Usuario hace clic en "Horarios"
    ↓
Navegador carga schedule.html
    ↓
Se recarga TODA la página
    ↓
Sidebar se recarga
    ↓
CSS se recarga
    ↓
JavaScript se reinicia
    ↓
2-3 segundos de espera
```

### DESPUÉS (SPA)

```
Usuario hace clic en "Horarios"
    ↓
Router intercepta el clic
    ↓
Solo cambia el contenido de <main>
    ↓
Sidebar permanece intacto
    ↓
< 0.5 segundos
```

---

## 🎯 Próximos Pasos Recomendados

### Inmediato (ahora)
1. ✅ Implementar SPA básico
2. ✅ Probar navegación
3. ✅ Migrar contenido del dashboard

### Corto Plazo (esta semana)
1. 📝 Migrar todas las secciones
2. 🎨 Personalizar contenido
3. 🧪 Probar en diferentes navegadores

### Mediano Plazo (este mes)
1. 🔐 Implementar autenticación
2. 📊 Añadir gráficos
3. 💾 Conectar con backend

---

## 💡 Tips Pro

### Tip 1: Usa Loading States

```javascript
showLoader() {
  this.contentContainer.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="animate-spin">
        <i data-lucide="loader" size="32"></i>
      </div>
    </div>
  `;
}
```

### Tip 2: Maneja Errores

```javascript
try {
  await this.routes[route].loader();
} catch (error) {
  this.showError(error.message);
}
```

### Tip 3: Cache de Contenido (Avanzado)

```javascript
// Guardar contenido en memoria para cargas futuras
this.cache = {};

async loadRoute(route) {
  if (this.cache[route]) {
    this.contentContainer.innerHTML = this.cache[route];
  } else {
    await this.routes[route].loader();
    this.cache[route] = this.contentContainer.innerHTML;
  }
}
```

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas con la implementación:

1. **Lee la documentación completa**: `DOCUMENTACION_COMPLETA.md`
2. **Revisa los ejemplos**: En `spa-router.js`
3. **Abre la consola**: F12 para ver errores
4. **Contacta**: tmichael2@gmail.com

---

## ⏱️ Tiempo Total de Implementación

- ✅ Instalación básica: **5 min**
- ✅ Migración de contenido: **10 min**
- ✅ Pruebas: **5 min**
- **Total: ~20 minutos**

---

**¡Felicitaciones! 🎉 Ahora tienes una SPA moderna y rápida.**

---

<div align="center">

[← Volver a README](README.md) | [Ver Documentación Completa](DOCUMENTACION_COMPLETA.md)

</div>
