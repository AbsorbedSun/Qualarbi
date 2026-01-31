/**
 * ==================== QUALARBI SPA ROUTER - VERSIÓN COMPLETA ====================
 * Sistema de enrutamiento Single Page Application con TODO el contenido migrado
 * 
 * Contenido incluido:
 * - Dashboard completo
 * - Horarios con tabla semanal
 * - Profesores con tabla y modal
 * - Materias con tabla
 * - Configuración completa
 * - Ayuda completa
 */

class SPARouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.contentContainer = null;
    this.isLoading = false;
    
    this.init();
  }

  /**
   * Inicializar el router
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Configurar el router
   */
  setup() {
    this.contentContainer = document.getElementById('main-content');
    
    if (!this.contentContainer) {
      console.error('⚠️ No se encontró el contenedor #main-content');
      return;
    }

    this.registerRoutes();
    this.interceptSidebarLinks();

    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.loadRoute(e.state.route, false);
      }
    });

    const initialRoute = this.getCurrentRoute();
    this.loadRoute(initialRoute, true);
  }

  /**
   * Registrar todas las rutas
   */
  registerRoutes() {
    this.routes = {
      'dashboard': {
        title: 'Dashboard',
        loader: () => this.loadDashboard()
      },
      'schedule': {
        title: 'Horarios',
        loader: () => this.loadSchedule()
      },
      'teachers': {
        title: 'Profesores',
        loader: () => this.loadTeachers()
      },
      'subjects': {
        title: 'Materias',
        loader: () => this.loadSubjects()
      },
      'configuration': {
        title: 'Configuración',
        loader: () => this.loadConfiguration()
      },
      'help': {
        title: 'Ayuda',
        loader: () => this.loadHelp()
      }
    };
  }

  /**
   * Interceptar clics en links del sidebar
   */
  interceptSidebarLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link[data-page]');
      
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-page');
        
        if (route && this.routes[route]) {
          this.navigate(route);
        }
      }
    });
  }

  /**
   * Obtener la ruta actual
   */
  getCurrentRoute() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'dashboard';
  }

  /**
   * Navegar a una ruta
   */
  navigate(route) {
    if (this.isLoading) {
      return;
    }

    if (!this.routes[route]) {
      console.error(`⚠️ Ruta no encontrada: ${route}`);
      return;
    }

    const url = `${route}.html`;
    window.history.pushState({ route }, '', url);
    this.loadRoute(route, true);
  }

  /**
   * Cargar una ruta
   */
  async loadRoute(route, updateHistory = true) {
    if (!this.routes[route]) {
      route = 'dashboard';
    }

    if (this.currentRoute === route && !updateHistory) {
      return;
    }

    this.isLoading = true;
    this.currentRoute = route;

    try {
      this.showLoader();
      document.title = `${this.routes[route].title} - Qualarbi`;
      this.updateSidebarActiveLink(route);
      await this.routes[route].loader();
      this.hideLoader();
      this.contentContainer.scrollTop = 0;
    } catch (error) {
      console.error(`❌ Error cargando ruta ${route}:`, error);
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Actualizar link activo en el sidebar
   */
  updateSidebarActiveLink(route) {
    const links = document.querySelectorAll('.nav-link[data-page]');
    
    links.forEach(link => {
      const linkRoute = link.getAttribute('data-page');
      
      if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Mostrar loader
   */
  showLoader() {
    this.contentContainer.style.opacity = '0.5';
    this.contentContainer.style.pointerEvents = 'none';
  }

  /**
   * Ocultar loader
   */
  hideLoader() {
    this.contentContainer.style.opacity = '1';
    this.contentContainer.style.pointerEvents = 'auto';
  }

  /**
   * Mostrar error
   */
  showError(message) {
    this.contentContainer.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="alert-circle" class="text-red-400" size="32"></i>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Error al cargar</h2>
          <p class="text-gray-400">${message}</p>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  // ==================== LOADERS DE CONTENIDO ====================

  /**
   * DASHBOARD
   */
  async loadDashboard() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-4xl font-bold text-white">Dashboard</h1>
          <div class="flex items-center justify-end gap-3">
            <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-gray-200 hover:bg-gray-700 hover:border-white/20 transition-all">
              <i data-lucide="download" size="18"></i>
              Importar Datos
            </button>
            <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/90 text-white hover:bg-green-500 hover:scale-105 transition-all shadow-lg shadow-green-500/20">
              <i data-lucide="plus" size="18"></i>
              Nuevo Proyecto
            </button>
          </div>
        </div>
        <p class="text-gray-300">Bienvenido de nuevo, aquí está tu resumen</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card hover:scale-105 transition-transform">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-sm text-gray-300 mb-2">Total Proyectos</div>
              <div class="text-4xl font-bold text-white">24</div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <i data-lucide="briefcase" size="24" class="text-blue-400"></i>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="flex items-center text-green-400">
              <i data-lucide="trending-up" size="16"></i>
              <span class="ml-1">12%</span>
            </div>
            <span class="text-gray-300">vs mes anterior</span>
          </div>
        </div>

        <div class="card hover:scale-105 transition-transform">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-sm text-gray-300 mb-2">Tareas Completadas</div>
              <div class="text-4xl font-bold text-white">189</div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <i data-lucide="check-circle" size="24" class="text-green-400"></i>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="flex items-center text-green-400">
              <i data-lucide="trending-up" size="16"></i>
              <span class="ml-1">8%</span>
            </div>
            <span class="text-gray-300">vs mes anterior</span>
          </div>
        </div>

        <div class="card hover:scale-105 transition-transform">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-sm text-gray-300 mb-2">Miembros del Equipo</div>
              <div class="text-4xl font-bold text-white">12</div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <i data-lucide="users" size="24" class="text-purple-400"></i>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="flex items-center text-green-400">
              <i data-lucide="trending-up" size="16"></i>
              <span class="ml-1">2 nuevos</span>
            </div>
            <span class="text-gray-300">este mes</span>
          </div>
        </div>

        <div class="card hover:scale-105 transition-transform">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-sm text-gray-300 mb-2">Tiempo Dedicado</div>
              <div class="text-4xl font-bold text-white">248h</div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <i data-lucide="clock" size="24" class="text-orange-400"></i>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="flex items-center text-red-400">
              <i data-lucide="trending-down" size="16"></i>
              <span class="ml-1">5%</span>
            </div>
            <span class="text-gray-300">vs mes anterior</span>
          </div>
        </div>
      </div>

      <!-- Content en 2 columnas -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Proyectos Recientes -->
        <div class="card">
          <h3 class="text-xl font-semibold text-white mb-4">Proyectos Recientes</h3>
          <div class="space-y-3">
            ${this.generateRecentProjects()}
          </div>
        </div>

        <!-- Rastreador de Tiempo -->
        <div class="card p-4 rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Rastreador de Tiempo</h3>
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          
          <div class="text-center mb-4">
            <div class="text-4xl font-bold font-mono text-white mb-2">01:24:08</div>
            <p class="text-sm text-gray-400">Sesión actual</p>
          </div>
          
          <div class="flex gap-2">
            <button class="flex-1 inline-flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all border border-green-500/30">
              <i data-lucide="pause" size="18"></i>
              <span class="text-sm font-medium">Pausar</span>
            </button>
            <button class="flex-1 inline-flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all border border-red-500/30">
              <i data-lucide="square" size="18"></i>
              <span class="text-sm font-medium">Detener</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  /**
   * Generar proyectos recientes
   */
  generateRecentProjects() {
    const projects = [
      { name: 'Develop API Endpoints', progress: 75, color: 'green' },
      { name: 'Mobile App Redesign', progress: 45, color: 'blue' },
      { name: 'Database Migration', progress: 90, color: 'purple' },
      { name: 'Security Audit', progress: 30, color: 'orange' }
    ];

    return projects.map(project => `
      <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
        <div class="w-10 h-10 rounded-lg bg-${project.color}-500/20 flex items-center justify-center flex-shrink-0">
          <i data-lucide="folder" size="20" class="text-${project.color}-400"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate text-white">${project.name}</div>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-${project.color}-500 rounded-full" style="width: ${project.progress}%"></div>
            </div>
            <span class="text-xs text-gray-400 flex-shrink-0">${project.progress}%</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * HORARIOS
   */
  async loadSchedule() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Gestión de Horarios</h1>
            <p class="text-gray-300">Crea y administra horarios académicos</p>
          </div>
          <button class="btn-primary">
            <i data-lucide="plus" size="18"></i>
            <span>Generar Nuevo Horario</span>
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card bg-gray-800/50 backdrop-blur-xl">
            <div class="stats-card">
              <div class="stats-value">24</div>
              <div class="stats-label">Horarios Activos</div>
            </div>
          </div>
          <div class="card bg-gray-800/50 backdrop-blur-xl">
            <div class="stats-card">
              <div class="stats-value" style="color: #22c55e;">98%</div>
              <div class="stats-label">Eficiencia</div>
            </div>
          </div>
          <div class="card bg-gray-800/50 backdrop-blur-xl">
            <div class="stats-card">
              <div class="stats-value" style="color: #a855f7;">45</div>
              <div class="stats-label">Profesores Asignados</div>
            </div>
          </div>
          <div class="card bg-gray-800/50 backdrop-blur-xl">
            <div class="stats-card">
              <div class="stats-value" style="color: #3b82f6;">0</div>
              <div class="stats-label">Conflictos</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Grid -->
      <div class="card bg-gray-800/50 backdrop-blur-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">Horario Semanal - Semestre 1</h2>
          <div class="flex gap-2">
            <button class="btn-outline border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <i data-lucide="download" size="16"></i>
              <span>Exportar PDF</span>
            </button>
            <button class="btn-outline border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <i data-lucide="file-spreadsheet" size="16"></i>
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        <!-- Schedule Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-700/50">
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Hora</th>
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Lunes</th>
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Martes</th>
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Miércoles</th>
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Jueves</th>
                <th class="border border-white/10 p-3 text-center text-gray-300 font-bold text-sm">Viernes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-white/10 p-2 text-center text-gray-300 font-medium text-sm bg-gray-700/30">08:00-09:00</td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-green-500/20 border-2 border-green-500/50 p-3 text-center hover:bg-green-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Matemáticas</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. García</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-blue-500/20 border-2 border-blue-500/50 p-3 text-center hover:bg-blue-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Física</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. López</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-purple-500/20 border-2 border-purple-500/50 p-3 text-center hover:bg-purple-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Literatura</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Martínez</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-green-500/20 border-2 border-green-500/50 p-3 text-center hover:bg-green-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Matemáticas</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. García</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-orange-500/20 border-2 border-orange-500/50 p-3 text-center hover:bg-orange-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Inglés</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Pérez</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-white/10 p-2 text-center text-gray-300 font-medium text-sm bg-gray-700/30">09:00-10:00</td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-orange-500/20 border-2 border-orange-500/50 p-3 text-center hover:bg-orange-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Inglés</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Pérez</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-green-500/20 border-2 border-green-500/50 p-3 text-center hover:bg-green-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Matemáticas</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. García</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-indigo-500/20 border-2 border-indigo-500/50 p-3 text-center hover:bg-indigo-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Biología</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Torres</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-blue-500/20 border-2 border-blue-500/50 p-3 text-center hover:bg-blue-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Física</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. López</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-purple-500/20 border-2 border-purple-500/50 p-3 text-center hover:bg-purple-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Literatura</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Martínez</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-white/10 p-2 text-center text-gray-300 font-medium text-sm bg-gray-700/30">10:00-10:30</td>
                <td colspan="5" class="border border-white/10 p-2 text-center">
                  <div class="rounded-xl bg-gray-600/30 border-2 border-gray-500/30 p-2">
                    <div class="text-sm font-bold text-gray-300">RECESO</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-white/10 p-2 text-center text-gray-300 font-medium text-sm bg-gray-700/30">10:30-11:30</td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-pink-500/20 border-2 border-pink-500/50 p-3 text-center hover:bg-pink-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Historia</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Sánchez</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-yellow-500/20 border-2 border-yellow-500/50 p-3 text-center hover:bg-yellow-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Química</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Rodríguez</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-orange-500/20 border-2 border-orange-500/50 p-3 text-center hover:bg-orange-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Inglés</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Pérez</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-green-500/20 border-2 border-green-500/50 p-3 text-center hover:bg-green-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Matemáticas</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. García</div>
                  </div>
                </td>
                <td class="border border-white/10 p-2">
                  <div class="rounded-xl bg-indigo-500/20 border-2 border-indigo-500/50 p-3 text-center hover:bg-indigo-500/30 transition-colors cursor-pointer">
                    <div class="text-sm font-bold text-white">Biología</div>
                    <div class="text-xs text-gray-300 mt-1">Prof. Torres</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend -->
        <div class="mt-6 flex flex-wrap gap-4 justify-center">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-green-500/40 border-2 border-green-500"></div>
            <span class="text-sm text-gray-300">Matemáticas</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-blue-500/40 border-2 border-blue-500"></div>
            <span class="text-sm text-gray-300">Física</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-purple-500/40 border-2 border-purple-500"></div>
            <span class="text-sm text-gray-300">Literatura</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-pink-500/40 border-2 border-pink-500"></div>
            <span class="text-sm text-gray-300">Historia</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-yellow-500/40 border-2 border-yellow-500"></div>
            <span class="text-sm text-gray-300">Química</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-orange-500/40 border-2 border-orange-500"></div>
            <span class="text-sm text-gray-300">Inglés</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-indigo-500/40 border-2 border-indigo-500"></div>
            <span class="text-sm text-gray-300">Biología</span>
          </div>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  /**
   * PROFESORES
   */
  async loadTeachers() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2" style="text-align: left;">
              Gestión de Profesores
            </h1>
            <p class="text-gray-300" style="text-align: left;">
              Administra la información y asignaciones de profesores
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button class="btn-outline" onclick="alert('Exportar')">
              <i data-lucide="download" size="18"></i>
              <span>Exportar</span>
            </button>
            <button class="btn-primary" onclick="window.spaRouter.openTeacherModal()">
              <i data-lucide="plus" size="18"></i>
              <span>Agregar Profesor</span>
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card">
            <div class="stats-card">
              <div class="stats-value">24</div>
              <div class="stats-label">Total Profesores</div>
              <div class="stats-change positive">
                <i data-lucide="trending-up" size="16"></i>
                <span>+3% vs mes anterior</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="stats-card">
              <div class="stats-value" style="color: #22c55e;">21</div>
              <div class="stats-label">Activos</div>
              <div class="flex justify-center">
                <span class="badge badge-success">87.5%</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="stats-card">
              <div class="stats-value" style="color: #a855f7;">156</div>
              <div class="stats-label">Horas Totales</div>
              <div class="stats-change positive">
                <i data-lucide="trending-up" size="16"></i>
                <span>+12 horas</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="stats-card">
              <div class="stats-value" style="color: #3b82f6;">42</div>
              <div class="stats-label">Materias Asignadas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="label">Departamento</label>
            <select class="select">
              <option value="">Todos los departamentos</option>
              <option value="matematicas">Matemáticas</option>
              <option value="ciencias">Ciencias</option>
              <option value="humanidades">Humanidades</option>
              <option value="idiomas">Idiomas</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="label">Estado</label>
            <select class="select">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="licencia">En Licencia</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="label">Tipo de Contrato</label>
            <select class="select">
              <option value="">Todos</option>
              <option value="tiempo-completo">Tiempo Completo</option>
              <option value="medio-tiempo">Medio Tiempo</option>
              <option value="por-horas">Por Horas</option>
            </select>
          </div>

          <div class="pt-6">
            <button class="btn-ghost" onclick="document.querySelectorAll('.select').forEach(s => s.value = '')">
              <i data-lucide="x" size="18"></i>
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Teachers Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Departamento</th>
                <th>Materias</th>
                <th>Horas/Semana</th>
                <th>Contrato</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="flex items-center gap-3 justify-center">
                    <div class="avatar" style="background: linear-gradient(135deg, #16a34a, #22c55e);">JG</div>
                    <div style="text-align: left;">
                      <div class="font-semibold text-white">Juan García</div>
                      <div class="text-sm text-gray-400">juan.garcia@school.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" style="background: rgba(34, 197, 94, 0.15); color: #22c55e; border-color: rgba(34, 197, 94, 0.3);">Matemáticas</span>
                </td>
                <td>
                  <div class="text-white font-medium">8 materias</div>
                </td>
                <td>
                  <div class="text-white font-medium">32 hrs</div>
                </td>
                <td>
                  <span class="text-gray-300">Tiempo Completo</span>
                </td>
                <td>
                  <span class="badge badge-success">Activo</span>
                </td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver profesor 1')">
                      <i data-lucide="eye" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="window.spaRouter.openTeacherModal()">
                      <i data-lucide="edit" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?') && alert('Eliminado')">
                      <i data-lucide="trash-2" size="16"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="flex items-center gap-3 justify-center">
                    <div class="avatar" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">ML</div>
                    <div style="text-align: left;">
                      <div class="font-semibold text-white">María López</div>
                      <div class="text-sm text-gray-400">maria.lopez@school.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3);">Ciencias</span>
                </td>
                <td>
                  <div class="text-white font-medium">6 materias</div>
                </td>
                <td>
                  <div class="text-white font-medium">24 hrs</div>
                </td>
                <td>
                  <span class="text-gray-300">Tiempo Completo</span>
                </td>
                <td>
                  <span class="badge badge-success">Activo</span>
                </td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver profesor 2')">
                      <i data-lucide="eye" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="window.spaRouter.openTeacherModal()">
                      <i data-lucide="edit" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?') && alert('Eliminado')">
                      <i data-lucide="trash-2" size="16"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="flex items-center gap-3 justify-center">
                    <div class="avatar" style="background: linear-gradient(135deg, #f97316, #fb923c);">CR</div>
                    <div style="text-align: left;">
                      <div class="font-semibold text-white">Carlos Rodríguez</div>
                      <div class="text-sm text-gray-400">carlos.rodriguez@school.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" style="background: rgba(236, 72, 153, 0.15); color: #ec4899; border-color: rgba(236, 72, 153, 0.3);">Humanidades</span>
                </td>
                <td>
                  <div class="text-white font-medium">5 materias</div>
                </td>
                <td>
                  <div class="text-white font-medium">20 hrs</div>
                </td>
                <td>
                  <span class="text-gray-300">Tiempo Completo</span>
                </td>
                <td>
                  <span class="badge badge-success">Activo</span>
                </td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver profesor 3')">
                      <i data-lucide="eye" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="window.spaRouter.openTeacherModal()">
                      <i data-lucide="edit" size="16"></i>
                    </button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?') && alert('Eliminado')">
                      <i data-lucide="trash-2" size="16"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination mt-6">
          <button class="pagination-btn" disabled>
            <i data-lucide="chevron-left" size="16"></i>
          </button>
          <button class="pagination-btn active">1</button>
          <button class="pagination-btn">2</button>
          <button class="pagination-btn">3</button>
          <button class="pagination-btn">
            <i data-lucide="chevron-right" size="16"></i>
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div id="teacherModal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white" style="text-align: left;">Agregar Profesor</h2>
            <button onclick="window.spaRouter.closeTeacherModal()" class="icon-btn">
              <i data-lucide="x" size="20"></i>
            </button>
          </div>

          <form id="teacherForm" class="space-y-6" onsubmit="event.preventDefault(); alert('Profesor guardado'); window.spaRouter.closeTeacherModal();">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="label">Nombre</label>
                <input type="text" class="input" placeholder="Ej: Juan" required />
              </div>

              <div class="form-group">
                <label class="label">Apellido</label>
                <input type="text" class="input" placeholder="Ej: García" required />
              </div>
            </div>

            <div class="form-group">
              <label class="label">Correo Electrónico</label>
              <input type="email" class="input" placeholder="profesor@escuela.com" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="label">Departamento</label>
                <select class="select" required>
                  <option value="">Seleccionar...</option>
                  <option value="matematicas">Matemáticas</option>
                  <option value="ciencias">Ciencias</option>
                  <option value="humanidades">Humanidades</option>
                  <option value="idiomas">Idiomas</option>
                </select>
              </div>

              <div class="form-group">
                <label class="label">Tipo de Contrato</label>
                <select class="select" required>
                  <option value="">Seleccionar...</option>
                  <option value="tiempo-completo">Tiempo Completo</option>
                  <option value="medio-tiempo">Medio Tiempo</option>
                  <option value="por-horas">Por Horas</option>
                </select>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button type="button" class="btn-ghost flex-1" onclick="window.spaRouter.closeTeacherModal()">
                Cancelar
              </button>
              <button type="submit" class="btn-primary flex-1">
                Guardar Profesor
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
    
    // Cerrar modal al hacer clic fuera
    setTimeout(() => {
      const modal = document.getElementById('teacherModal');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeTeacherModal();
        }
      });
    }, 100);
  }

  /**
   * Abrir modal de profesores
   */
  openTeacherModal() {
    const modal = document.getElementById('teacherModal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => this.initLucideIcons(), 100);
    }
  }

  /**
   * Cerrar modal de profesores
   */
  closeTeacherModal() {
    const modal = document.getElementById('teacherModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * MATERIAS
   */
  async loadSubjects() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2" style="text-align: left;">Gestión de Materias</h1>
            <p class="text-gray-300" style="text-align: left;">Administra las materias y sus configuraciones</p>
          </div>
          <button class="btn-primary" onclick="alert('Agregar materia')">
            <i data-lucide="plus" size="18"></i><span>Agregar Materia</span>
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card"><div class="stats-card"><div class="stats-value">42</div><div class="stats-label">Total Materias</div></div></div>
          <div class="card"><div class="stats-card"><div class="stats-value" style="color: #22c55e;">38</div><div class="stats-label">Activas</div></div></div>
          <div class="card"><div class="stats-card"><div class="stats-value" style="color: #a855f7;">180</div><div class="stats-label">Horas Totales</div></div></div>
          <div class="card"><div class="stats-card"><div class="stats-value" style="color: #3b82f6;">24</div><div class="stats-label">Profesores Asignados</div></div></div>
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Materia</th><th>Código</th><th>Departamento</th><th>Horas/Semana</th><th>Profesor</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="font-semibold text-white">Matemáticas Avanzadas</div></td>
                <td><span class="badge badge-info">MAT-301</span></td>
                <td><span class="text-gray-300">Matemáticas</span></td>
                <td><div class="text-white font-medium">4 hrs</div></td>
                <td><div class="text-gray-300">Juan García</div></td>
                <td><span class="badge badge-success">Activa</span></td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver')"><i data-lucide="eye" size="16"></i></button>
                    <button class="icon-btn" onclick="alert('Editar')"><i data-lucide="edit" size="16"></i></button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?')"><i data-lucide="trash-2" size="16"></i></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="font-semibold text-white">Física Cuántica</div></td>
                <td><span class="badge badge-info">FIS-401</span></td>
                <td><span class="text-gray-300">Ciencias</span></td>
                <td><div class="text-white font-medium">6 hrs</div></td>
                <td><div class="text-gray-300">María López</div></td>
                <td><span class="badge badge-success">Activa</span></td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver')"><i data-lucide="eye" size="16"></i></button>
                    <button class="icon-btn" onclick="alert('Editar')"><i data-lucide="edit" size="16"></i></button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?')"><i data-lucide="trash-2" size="16"></i></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="font-semibold text-white">Literatura Contemporánea</div></td>
                <td><span class="badge badge-info">LIT-201</span></td>
                <td><span class="text-gray-300">Humanidades</span></td>
                <td><div class="text-white font-medium">3 hrs</div></td>
                <td><div class="text-gray-300">Carlos Rodríguez</div></td>
                <td><span class="badge badge-success">Activa</span></td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button class="icon-btn" onclick="alert('Ver')"><i data-lucide="eye" size="16"></i></button>
                    <button class="icon-btn" onclick="alert('Editar')"><i data-lucide="edit" size="16"></i></button>
                    <button class="icon-btn" onclick="confirm('¿Eliminar?')"><i data-lucide="trash-2" size="16"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  /**
   * CONFIGURACIÓN
   */
  async loadConfiguration() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2" style="text-align:left;">Configuración</h1>
        <p class="text-gray-300" style="text-align:left;">Personaliza tu experiencia en Qualarbi</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-xl font-bold text-white mb-4" style="text-align:left;">Perfil de Usuario</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label class="label">Nombre Completo</label>
              <input type="text" class="input" value="Totok Michael">
            </div>
            <div class="form-group">
              <label class="label">Correo Electrónico</label>
              <input type="email" class="input" value="tmichael@example.com">
            </div>
            <div class="form-group">
              <label class="label">Institución</label>
              <input type="text" class="input" value="Universidad Nacional">
            </div>
            <button class="btn-primary w-full" onclick="alert('Cambios guardados')">Guardar Cambios</button>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-white mb-4" style="text-align:left;">Preferencias</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-white">Tema Oscuro</span>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white">Notificaciones</span>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white">Modo Compacto</span>
              <label class="toggle-switch">
                <input type="checkbox">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-white mb-4" style="text-align:left;">Seguridad</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label class="label">Contraseña Actual</label>
              <input type="password" class="input">
            </div>
            <div class="form-group">
              <label class="label">Nueva Contraseña</label>
              <input type="password" class="input">
            </div>
            <div class="form-group">
              <label class="label">Confirmar Contraseña</label>
              <input type="password" class="input">
            </div>
            <button class="btn-primary w-full" onclick="alert('Contraseña cambiada')">Cambiar Contraseña</button>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-white mb-4" style="text-align:left;">Configuración del Sistema</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label class="label">Días Laborales</label>
              <select class="select">
                <option>Lunes a Viernes</option>
                <option>Lunes a Sábado</option>
              </select>
            </div>
            <div class="form-group">
              <label class="label">Duración de Clases (minutos)</label>
              <input type="number" class="input" value="50">
            </div>
            <div class="form-group">
              <label class="label">Hora de Inicio</label>
              <input type="time" class="input" value="08:00">
            </div>
            <button class="btn-primary w-full" onclick="alert('Configuración guardada')">Guardar Configuración</button>
          </div>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  /**
   * AYUDA
   */
  async loadHelp() {
    this.contentContainer.innerHTML = `
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2" style="text-align:left;">Centro de Ayuda</h1>
        <p class="text-gray-300" style="text-align:left;">Encuentra respuestas y soporte</p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="card mb-6">
          <div class="relative">
            <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size="20"></i>
            <input type="text" placeholder="Buscar en la ayuda..." class="input w-full pl-12">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="card hover:shadow-xl transition-all">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <i data-lucide="book-open" class="text-green-400" size="24"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Guía de Inicio</h3>
            </div>
            <p class="text-gray-400 mb-4">Aprende los conceptos básicos de Qualarbi</p>
            <a href="#" class="text-green-400 hover:text-green-300 font-medium">Ver guía →</a>
          </div>

          <div class="card hover:shadow-xl transition-all">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <i data-lucide="video" class="text-blue-400" size="24"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Tutoriales en Video</h3>
            </div>
            <p class="text-gray-400 mb-4">Mira tutoriales paso a paso</p>
            <a href="#" class="text-green-400 hover:text-green-300 font-medium">Ver videos →</a>
          </div>

          <div class="card hover:shadow-xl transition-all">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <i data-lucide="message-circle" class="text-purple-400" size="24"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Preguntas Frecuentes</h3>
            </div>
            <p class="text-gray-400 mb-4">Encuentra respuestas rápidas</p>
            <a href="#" class="text-green-400 hover:text-green-300 font-medium">Ver FAQ →</a>
          </div>

          <div class="card hover:shadow-xl transition-all">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <i data-lucide="headphones" class="text-orange-400" size="24"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Soporte Técnico</h3>
            </div>
            <p class="text-gray-400 mb-4">Contacta con nuestro equipo</p>
            <a href="#" class="text-green-400 hover:text-green-300 font-medium">Contactar →</a>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-white mb-4" style="text-align:left;">Preguntas Frecuentes</h3>
          <div class="space-y-3">
            <div class="accordion-item">
              <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('active')">
                <span class="text-white font-medium">¿Cómo agrego un nuevo profesor?</span>
                <i data-lucide="chevron-down" size="20" class="text-gray-300"></i>
              </div>
              <div class="accordion-content">
                <p class="text-gray-300">Ve a la sección de Profesores y haz clic en "Agregar Profesor". Completa el formulario con la información requerida.</p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('active')">
                <span class="text-white font-medium">¿Cómo genero un horario?</span>
                <i data-lucide="chevron-down" size="20" class="text-gray-300"></i>
              </div>
              <div class="accordion-content">
                <p class="text-gray-300">En la sección Horarios, haz clic en "Generar" y configura los parámetros necesarios.</p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('active')">
                <span class="text-white font-medium">¿Puedo exportar los horarios?</span>
                <i data-lucide="chevron-down" size="20" class="text-gray-300"></i>
              </div>
              <div class="accordion-content">
                <p class="text-gray-300">Sí, puedes exportar horarios en formatos PDF, Excel o CSV desde el botón "Exportar".</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.initLucideIcons();
  }

  /**
   * Inicializar iconos de Lucide
   */
  initLucideIcons() {
    if (typeof lucide !== 'undefined') {
      setTimeout(() => {
        lucide.createIcons();
      }, 50);
    }
  }
}

// Inicializar el router
window.spaRouter = new SPARouter();
