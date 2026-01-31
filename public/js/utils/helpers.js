// ==================== HELPER FUNCTIONS ====================
// Funciones auxiliares reutilizables para Qualarbi

import {
  STORAGE_KEYS,
  NOTIFICATION_DURATION,
  NOTIFICATION_TYPES,
} from "../config/constants.js";

/**
 * LocalStorage Helper
 */
export const storage = {
  /**
   * Guardar en localStorage
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },

  /**
   * Obtener de localStorage
   */
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  /**
   * Eliminar de localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },

  /**
   * Limpiar todo el localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },
};

/**
 * Formato de fecha
 */
export const formatDate = (date, format = "default") => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "Fecha inválida";
  }

  const options = {
    default: { year: "numeric", month: "long", day: "numeric" },
    short: { year: "numeric", month: "short", day: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return d.toLocaleString("es-ES", options[format] || options.default);
};

/**
 * Formato de tiempo relativo (hace 2 horas, hace 3 días, etc.)
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Justo ahora";
  if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
  if (diffHour < 24) return `Hace ${diffHour} hora${diffHour > 1 ? "s" : ""}`;
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay > 1 ? "s" : ""}`;
  if (diffDay < 30)
    return `Hace ${Math.floor(diffDay / 7)} semana${
      Math.floor(diffDay / 7) > 1 ? "s" : ""
    }`;
  if (diffDay < 365)
    return `Hace ${Math.floor(diffDay / 30)} mes${
      Math.floor(diffDay / 30) > 1 ? "es" : ""
    }`;
  return `Hace ${Math.floor(diffDay / 365)} año${
    Math.floor(diffDay / 365) > 1 ? "s" : ""
  }`;
};

/**
 * Debounce - retrasa la ejecución de una función
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle - limita la frecuencia de ejecución de una función
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generar ID único
 */
export const generateId = (prefix = "id") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Copiar al portapapeles
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);

    // Fallback para navegadores antiguos
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  }
};

/**
 * Descargar archivo
 */
export const downloadFile = (data, filename, type = "application/json") => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat("es-ES").format(num);
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncar texto
 */
export const truncate = (str, maxLength = 50, suffix = "...") => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtener iniciales de un nombre
 */
export const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Generar color aleatorio
 */
export const getRandomColor = () => {
  const colors = [
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#f97316",
    "#eab308",
    "#06b6d4",
    "#8b5cf6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Escapar HTML para prevenir XSS
 */
export const escapeHtml = (text) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Verificar si es móvil
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Scroll suave hacia un elemento
 */
export const scrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

/**
 * Obtener parámetros de URL
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Actualizar parámetros de URL sin recargar
 */
export const updateUrlParams = (params) => {
  const url = new URL(window.location);
  Object.keys(params).forEach((key) => {
    if (params[key] === null || params[key] === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, params[key]);
    }
  });
  window.history.pushState({}, "", url);
};

/**
 * Sistema de notificaciones Toast
 */
export const showToast = (
  message,
  type = NOTIFICATION_TYPES.INFO,
  duration = NOTIFICATION_DURATION.MEDIUM
) => {
  // Crear contenedor de toast si no existe
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed top-4 right-4 z-50 space-y-4";
    document.body.appendChild(container);
  }

  // Crear toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type} animate-slide-left`;

  // Iconos según el tipo
  const icons = {
    success: "check-circle",
    error: "x-circle",
    warning: "alert-triangle",
    info: "info",
  };

  toast.innerHTML = `
        <div class="flex items-start gap-3">
            <i data-lucide="${
              icons[type]
            }" size="20" class="flex-shrink-0 mt-0.5"></i>
            <div class="flex-1">
                <p class="font-medium">${escapeHtml(message)}</p>
            </div>
            <button class="toast-close text-gray-400 hover:text-white transition-colors">
                <i data-lucide="x" size="18"></i>
            </button>
        </div>
    `;

  container.appendChild(toast);

  // Inicializar iconos de Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Cerrar al hacer clic
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    toast.style.animation = "slideRight 0.3s ease-out forwards";
    setTimeout(() => toast.remove(), 300);
  });

  // Auto cerrar
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = "slideRight 0.3s ease-out forwards";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
};

/**
 * Confirmar acción con modal
 */
export const confirmAction = (message, onConfirm, onCancel) => {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay animate-fade-in";

  overlay.innerHTML = `
        <div class="modal-content animate-scale-in max-w-md">
            <div class="flex items-start gap-4 mb-6">
                <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="alert-triangle" size="24" class="text-orange-400"></i>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-2">Confirmar Acción</h3>
                    <p class="text-gray-400">${escapeHtml(message)}</p>
                </div>
            </div>
            <div class="flex gap-3 justify-end">
                <button class="btn-ghost px-6 py-2 modal-cancel">Cancelar</button>
                <button class="btn-primary px-6 py-2 modal-confirm">Confirmar</button>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);

  // Inicializar iconos
  if (window.lucide) {
    lucide.createIcons();
  }

  // Event listeners
  const confirmBtn = overlay.querySelector(".modal-confirm");
  const cancelBtn = overlay.querySelector(".modal-cancel");

  const close = () => {
    overlay.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => overlay.remove(), 300);
  };

  confirmBtn.addEventListener("click", () => {
    close();
    if (onConfirm) onConfirm();
  });

  cancelBtn.addEventListener("click", () => {
    close();
    if (onCancel) onCancel();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
      if (onCancel) onCancel();
    }
  });
};

/**
 * Loader/Spinner overlay
 */
export const showLoader = (message = "Cargando...") => {
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.className = "modal-overlay animate-fade-in";

  loader.innerHTML = `
        <div class="flex flex-col items-center gap-4">
            <div class="spinner"></div>
            <p class="text-lg text-gray-300">${escapeHtml(message)}</p>
        </div>
    `;

  document.body.appendChild(loader);
};

export const hideLoader = () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => loader.remove(), 300);
  }
};

/**
 * Calcular porcentaje
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Ordenar array por propiedad
 */
export const sortBy = (array, property, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Agrupar array por propiedad
 */
export const groupBy = (array, property) => {
  return array.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

/**
 * Esperar (delay)
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  storage,
  formatDate,
  formatRelativeTime,
  debounce,
  throttle,
  generateId,
  copyToClipboard,
  downloadFile,
  formatNumber,
  capitalize,
  truncate,
  isValidEmail,
  isValidUrl,
  getInitials,
  getRandomColor,
  escapeHtml,
  isMobile,
  scrollTo,
  getUrlParams,
  updateUrlParams,
  showToast,
  confirmAction,
  showLoader,
  hideLoader,
  calculatePercentage,
  sortBy,
  groupBy,
  sleep,
};
