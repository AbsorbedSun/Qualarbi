// ==================== CONSTANTS ====================
// Configuración general de la aplicación Qualarbi

export const APP_CONFIG = {
  APP_NAME: "Qualarbi",
  VERSION: "1.0.0",
  API_BASE_URL: "http://localhost:3000/api", // Cambiar en producción
  TIMEOUT: 30000, // 30 segundos
};

// Rutas de la API
export const API_ROUTES = {
  // Autenticación
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Usuarios
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
  },

  // Horarios
  SCHEDULES: {
    BASE: "/schedules",
    GENERATE: "/schedules/generate",
    LIST: "/schedules/list",
    GET: (id) => `/schedules/${id}`,
    UPDATE: (id) => `/schedules/${id}`,
    DELETE: (id) => `/schedules/${id}`,
    EXPORT: (id) => `/schedules/${id}/export`,
  },

  // Profesores
  TEACHERS: {
    BASE: "/teachers",
    LIST: "/teachers/list",
    CREATE: "/teachers/create",
    GET: (id) => `/teachers/${id}`,
    UPDATE: (id) => `/teachers/${id}`,
    DELETE: (id) => `/teachers/${id}`,
    AVAILABILITY: (id) => `/teachers/${id}/availability`,
  },

  // Materias
  SUBJECTS: {
    BASE: "/subjects",
    LIST: "/subjects/list",
    CREATE: "/subjects/create",
    GET: (id) => `/subjects/${id}`,
    UPDATE: (id) => `/subjects/${id}`,
    DELETE: (id) => `/subjects/${id}`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    PROJECTS: "/analytics/projects",
    TEACHERS: "/analytics/teachers",
    SUBJECTS: "/analytics/subjects",
  },
};

// Estados de los proyectos
export const PROJECT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Colores de los estados
export const STATUS_COLORS = {
  pending: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  in_progress: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  completed: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
  },
  cancelled: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
};

// Días de la semana
export const WEEKDAYS = [
  { id: 1, name: "Lunes", short: "L" },
  { id: 2, name: "Martes", short: "M" },
  { id: 3, name: "Miércoles", short: "Mi" },
  { id: 4, name: "Jueves", short: "J" },
  { id: 5, name: "Viernes", short: "V" },
  { id: 6, name: "Sábado", short: "S" },
  { id: 7, name: "Domingo", short: "D" },
];

// Horarios típicos de clase (se pueden personalizar)
export const CLASS_TIMES = [
  { id: 1, start: "07:00", end: "08:00", label: "7:00 - 8:00 AM" },
  { id: 2, start: "08:00", end: "09:00", label: "8:00 - 9:00 AM" },
  { id: 3, start: "09:00", end: "10:00", label: "9:00 - 10:00 AM" },
  { id: 4, start: "10:00", end: "11:00", label: "10:00 - 11:00 AM" },
  { id: 5, start: "11:00", end: "12:00", label: "11:00 - 12:00 PM" },
  { id: 6, start: "12:00", end: "13:00", label: "12:00 - 1:00 PM" },
  { id: 7, start: "13:00", end: "14:00", label: "1:00 - 2:00 PM" },
  { id: 8, start: "14:00", end: "15:00", label: "2:00 - 3:00 PM" },
  { id: 9, start: "15:00", end: "16:00", label: "3:00 - 4:00 PM" },
  { id: 10, start: "16:00", end: "17:00", label: "4:00 - 5:00 PM" },
];

// Periodos de descanso (break times)
export const BREAK_PERIODS = {
  MORNING: { start: "10:00", end: "10:15", label: "Descanso Matutino" },
  LUNCH: { start: "13:00", end: "14:00", label: "Hora de Almuerzo" },
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  COORDINATOR: "coordinator",
  VIEWER: "viewer",
};

// Permisos por rol
export const ROLE_PERMISSIONS = {
  admin: ["create", "read", "update", "delete", "generate", "export"],
  coordinator: ["create", "read", "update", "generate", "export"],
  teacher: ["read", "export"],
  viewer: ["read"],
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Error de conexión. Por favor, verifica tu conexión a internet.",
  SERVER_ERROR: "Error del servidor. Intenta nuevamente más tarde.",
  UNAUTHORIZED: "No tienes permisos para realizar esta acción.",
  NOT_FOUND: "El recurso solicitado no fue encontrado.",
  VALIDATION_ERROR: "Los datos ingresados no son válidos.",
  TIMEOUT: "La solicitud ha excedido el tiempo de espera.",
  UNKNOWN_ERROR: "Ha ocurrido un error inesperado.",
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "¡Bienvenido de vuelta!",
  REGISTER_SUCCESS: "¡Cuenta creada exitosamente!",
  UPDATE_SUCCESS: "Actualización realizada con éxito.",
  DELETE_SUCCESS: "Eliminación realizada con éxito.",
  GENERATE_SUCCESS: "Horario generado exitosamente.",
  EXPORT_SUCCESS: "Exportación completada.",
};

// Configuración de validación
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "qualarbi_auth_token",
  REFRESH_TOKEN: "qualarbi_refresh_token",
  USER_DATA: "qualarbi_user_data",
  THEME: "qualarbi_theme",
  LANGUAGE: "qualarbi_language",
  REMEMBER_ME: "qualarbi_remember_me",
};

// Temas disponibles
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

// Idiomas disponibles
export const LANGUAGES = {
  ES: "es",
  EN: "en",
};

// Formatos de exportación
export const EXPORT_FORMATS = {
  PDF: "pdf",
  EXCEL: "xlsx",
  CSV: "csv",
  JSON: "json",
};

// Configuración del generador de horarios
export const SCHEDULE_GENERATION = {
  MAX_ITERATIONS: 10000, // Máximo de iteraciones para el algoritmo
  POPULATION_SIZE: 100, // Tamaño de población para algoritmo genético
  MUTATION_RATE: 0.1, // Tasa de mutación
  CROSSOVER_RATE: 0.8, // Tasa de cruce
  ELITISM: 0.2, // Porcentaje de élite a conservar
  MAX_CONSECUTIVE_CLASSES: 3, // Máximo de clases consecutivas permitidas
  MIN_BREAK_TIME: 15, // Minutos mínimos de descanso entre clases
};

// Prioridades de restricciones
export const CONSTRAINT_PRIORITIES = {
  HARD: "hard", // Debe cumplirse obligatoriamente
  SOFT: "soft", // Deseable pero no obligatorio
  PREFERRED: "preferred", // Preferencia del usuario
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Duración de notificaciones (en milisegundos)
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

export default {
  APP_CONFIG,
  API_ROUTES,
  PROJECT_STATUS,
  STATUS_COLORS,
  WEEKDAYS,
  CLASS_TIMES,
  BREAK_PERIODS,
  USER_ROLES,
  ROLE_PERMISSIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  PAGINATION,
  STORAGE_KEYS,
  THEMES,
  LANGUAGES,
  EXPORT_FORMATS,
  SCHEDULE_GENERATION,
  CONSTRAINT_PRIORITIES,
  NOTIFICATION_TYPES,
  NOTIFICATION_DURATION,
};
