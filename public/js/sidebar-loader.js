/**
 * SIDEBAR LOADER - Carga el sidebar global en todas las páginas
 * 
 * USO:
 * 1. Incluir este script en todas las páginas del dashboard
 * 2. Añadir un contenedor con id="sidebar-container" donde se inyectará el sidebar
 * 
 * Ejemplo:
 * <div id="sidebar-container"></div>
 * <script src="../public/js/sidebar-loader.js"></script>
 */

(function() {
  'use strict';

  // Función para cargar el sidebar
  function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    
    if (!container) {
      console.error('Sidebar container not found. Add <div id="sidebar-container"></div> to your HTML.');
      return;
    }

    // Determinar la ruta relativa al componente
    const currentPath = window.location.pathname;
    let sidebarPath = './components/_sidebar.html';
    
    // Si estamos en un subdirectorio, ajustar la ruta
    if (currentPath.includes('/views/')) {
      sidebarPath = './components/_sidebar.html';
    }

    // Cargar el sidebar usando fetch
    fetch(sidebarPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        
        // Inicializar iconos de Lucide si está disponible
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        // Ejecutar scripts embebidos en el sidebar
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          eval(scripts[i].innerHTML);
        }
      })
      .catch(error => {
        console.error('Error loading sidebar:', error);
        container.innerHTML = '<div class="p-4 text-red-400">Error loading sidebar</div>';
      });
  }

  // Cargar el sidebar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
  } else {
    loadSidebar();
  }
})();
