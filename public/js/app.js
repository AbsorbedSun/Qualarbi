// ==================== APP.JS ====================
// Punto de entrada principal de la aplicación Qualarbi

import { initAuth, updateUserInfo } from "./modules/auth.js";
import { storage } from "./utils/helpers.js";
import { STORAGE_KEYS } from "./config/constants.js";

/**
 * Clase principal de la aplicación
 */
class QualarbiApp {
  constructor() {
    this.currentTheme = "light"; // Tema por defecto: claro
    this.init();
  }

  /**
   * Inicializar aplicación
   */
  init() {
    console.log("🚀 Inicializando Qualarbi...");

    // Cargar tema guardado
    this.loadTheme();

    // Inicializar autenticación
    initAuth();

    // Actualizar información del usuario si está autenticado
    updateUserInfo();

    // Configurar listeners globales
    this.setupGlobalListeners();

    // Inicializar iconos de Lucide
    if (window.lucide) {
      lucide.createIcons();
    }

    console.log("✅ Qualarbi inicializado correctamente");
  }

  /**
   * Cargar tema guardado
   */
  loadTheme() {
    const savedTheme = storage.get(STORAGE_KEYS.THEME) || "light";
    this.setTheme(savedTheme);
  }

  /**
   * Establecer tema
   */
  setTheme(theme) {
    this.currentTheme = theme;

    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    storage.set(STORAGE_KEYS.THEME, theme);

    // Actualizar ícono del botón de tema
    this.updateThemeIcon();
  }

  /**
   * Cambiar tema
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  /**
   * Actualizar ícono del tema
   */
  updateThemeIcon() {
    const themeButtons = document.querySelectorAll("[data-theme-toggle]");
    themeButtons.forEach((button) => {
      const icon = button.querySelector("i[data-lucide]");
      if (icon) {
        const newIcon = this.currentTheme === "light" ? "moon" : "sun";
        icon.setAttribute("data-lucide", newIcon);
        if (window.lucide) {
          lucide.createIcons();
        }
      }
    });
  }

  /**
   * Configurar listeners globales
   */
  setupGlobalListeners() {
    // Theme toggle
    document.addEventListener("click", (e) => {
      const themeToggle = e.target.closest("[data-theme-toggle]");
      if (themeToggle) {
        this.toggleTheme();
      }
    });

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown")) {
        document.querySelectorAll(".dropdown-menu.active").forEach((menu) => {
          menu.classList.remove("active");
        });
      }
    });

    // Abrir/cerrar dropdowns
    document.addEventListener("click", (e) => {
      const dropdownToggle = e.target.closest("[data-dropdown-toggle]");
      if (dropdownToggle) {
        const dropdownId = dropdownToggle.getAttribute("data-dropdown-toggle");
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
          dropdown.classList.toggle("active");
        }
      }
    });

    // Toggle sidebar en móvil
    document.addEventListener("click", (e) => {
      const sidebarToggle = e.target.closest("[data-sidebar-toggle]");
      if (sidebarToggle) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
          sidebar.classList.toggle("active");
        }
      }
    });

    // Cerrar modales al hacer clic en el overlay
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        e.target.remove();
      }
    });

    // Escape key para cerrar modales
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modals = document.querySelectorAll(".modal-overlay");
        modals.forEach((modal) => modal.remove());
      }
    });

    // Toggle password visibility
    document.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest("[data-toggle-password]");
      if (toggleBtn) {
        const targetId = toggleBtn.getAttribute("data-toggle-password");
        const input = document.getElementById(targetId);
        if (input) {
          const type = input.type === "password" ? "text" : "password";
          input.type = type;

          const icon = toggleBtn.querySelector("i[data-lucide]");
          if (icon) {
            icon.setAttribute(
              "data-lucide",
              type === "password" ? "eye" : "eye-off"
            );
            if (window.lucide) {
              lucide.createIcons();
            }
          }
        }
      }
    });

    // Tabs
    document.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) {
        const tabGroup = tab.closest(".tabs");
        if (tabGroup) {
          // Remover active de todos los tabs
          tabGroup
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");

          // Mostrar contenido correspondiente
          const tabId = tab.getAttribute("data-tab");
          if (tabId) {
            document
              .querySelectorAll("[data-tab-content]")
              .forEach((content) => {
                content.classList.add("hidden");
              });
            const content = document.querySelector(
              `[data-tab-content="${tabId}"]`
            );
            if (content) {
              content.classList.remove("hidden");
            }
          }
        }
      }
    });

    // Accordion
    document.addEventListener("click", (e) => {
      const accordionHeader = e.target.closest(".accordion-header");
      if (accordionHeader) {
        const content = accordionHeader.nextElementSibling;
        if (content && content.classList.contains("accordion-content")) {
          content.classList.toggle("active");

          // Rotar ícono
          const icon = accordionHeader.querySelector("i[data-lucide]");
          if (icon) {
            const currentIcon = icon.getAttribute("data-lucide");
            icon.setAttribute(
              "data-lucide",
              currentIcon === "chevron-down" ? "chevron-up" : "chevron-down"
            );
            if (window.lucide) {
              lucide.createIcons();
            }
          }
        }
      }
    });

    // Auto-close toasts on click
    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest(".toast-close");
      if (closeBtn) {
        const toast = closeBtn.closest(".toast");
        if (toast) {
          toast.style.animation = "slideRight 0.3s ease-out forwards";
          setTimeout(() => toast.remove(), 300);
        }
      }
    });
  }

  /**
   * Navegar a una página
   */
  navigateTo(page) {
    window.location.href = page;
  }
}

/**
 * Inicializar aplicación cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", () => {
  window.qualarbiApp = new QualarbiApp();
});

/**
 * Exportar instancia de la app para uso global
 */
export default QualarbiApp;
