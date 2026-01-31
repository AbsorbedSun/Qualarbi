// ==================== API CLIENT ====================
// Cliente HTTP para comunicación con el backend de Qualarbi

import {
  APP_CONFIG,
  API_ROUTES,
  ERROR_MESSAGES,
  STORAGE_KEYS,
} from "../config/constants.js";
import { storage, showToast } from "./helpers.js";

/**
 * Cliente API principal
 */
class APIClient {
  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL;
    this.timeout = APP_CONFIG.TIMEOUT;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Obtener token de autenticación
   */
  getAuthToken() {
    return storage.get(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Establecer token de autenticación
   */
  setAuthToken(token) {
    return storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Eliminar token de autenticación
   */
  removeAuthToken() {
    return storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtener headers con autenticación
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Manejar errores de respuesta
   */
  handleError(error, showNotification = true) {
    let message = ERROR_MESSAGES.UNKNOWN_ERROR;
    let statusCode = 500;

    if (error.response) {
      // Error de respuesta del servidor
      statusCode = error.response.status;

      switch (statusCode) {
        case 400:
          message =
            error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          message = ERROR_MESSAGES.UNAUTHORIZED;
          this.removeAuthToken();
          // Redirigir al login si es necesario
          if (window.location.pathname !== "/views/login.html") {
            window.location.href = "/views/login.html";
          }
          break;
        case 404:
          message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
          message = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          message =
            error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    } else if (error.request) {
      // Error de red
      message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Error en la configuración de la petición
      message = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }

    if (showNotification) {
      showToast(message, "error");
    }

    return {
      success: false,
      error: message,
      statusCode,
      data: null,
    };
  }

  /**
   * Realizar petición HTTP
   */
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      data = null,
      headers = {},
      timeout = this.timeout,
      showErrorNotification = true,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: this.getHeaders(headers),
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    try {
      // Crear controller para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Parsear respuesta
      const contentType = response.headers.get("content-type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData,
          },
        };
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
        error: null,
      };
    } catch (error) {
      // Manejar timeout
      if (error.name === "AbortError") {
        const timeoutError = { message: ERROR_MESSAGES.TIMEOUT };
        return this.handleError(timeoutError, showErrorNotification);
      }

      return this.handleError(error, showErrorNotification);
    }
  }

  /**
   * Métodos HTTP simplificados
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", data });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

/**
 * Instancia singleton del cliente API
 */
const apiClient = new APIClient();

/**
 * API de Autenticación
 */
export const authAPI = {
  /**
   * Login
   */
  async login(email, password, remember = false) {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });

    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);

      if (response.data.refreshToken) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }

      if (response.data.user) {
        storage.set(STORAGE_KEYS.USER_DATA, response.data.user);
      }

      storage.set(STORAGE_KEYS.REMEMBER_ME, remember);
    }

    return response;
  },

  /**
   * Register
   */
  async register(userData) {
    const response = await apiClient.post(API_ROUTES.AUTH.REGISTER, userData);

    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);

      if (response.data.user) {
        storage.set(STORAGE_KEYS.USER_DATA, response.data.user);
      }
    }

    return response;
  },

  /**
   * Logout
   */
  async logout() {
    await apiClient.post(API_ROUTES.AUTH.LOGOUT);

    apiClient.removeAuthToken();
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER_DATA);
    storage.remove(STORAGE_KEYS.REMEMBER_ME);

    window.location.href = "/views/login.html";
  },

  /**
   * Refresh Token
   */
  async refreshToken() {
    const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      return { success: false, error: "No refresh token available" };
    }

    const response = await apiClient.post(API_ROUTES.AUTH.REFRESH, {
      refreshToken,
    });

    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }

    return response;
  },

  /**
   * Forgot Password
   */
  async forgotPassword(email) {
    return await apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset Password
   */
  async resetPassword(token, newPassword) {
    return await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
  },
};

/**
 * API de Horarios
 */
export const scheduleAPI = {
  /**
   * Generar horario
   */
  async generate(params) {
    return await apiClient.post(API_ROUTES.SCHEDULES.GENERATE, params);
  },

  /**
   * Listar horarios
   */
  async list(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_ROUTES.SCHEDULES.LIST}${
      queryParams ? `?${queryParams}` : ""
    }`;
    return await apiClient.get(endpoint);
  },

  /**
   * Obtener horario por ID
   */
  async getById(id) {
    return await apiClient.get(API_ROUTES.SCHEDULES.GET(id));
  },

  /**
   * Actualizar horario
   */
  async update(id, data) {
    return await apiClient.put(API_ROUTES.SCHEDULES.UPDATE(id), data);
  },

  /**
   * Eliminar horario
   */
  async delete(id) {
    return await apiClient.delete(API_ROUTES.SCHEDULES.DELETE(id));
  },

  /**
   * Exportar horario
   */
  async export(id, format = "pdf") {
    return await apiClient.get(
      `${API_ROUTES.SCHEDULES.EXPORT(id)}?format=${format}`
    );
  },
};

/**
 * API de Profesores
 */
export const teacherAPI = {
  /**
   * Listar profesores
   */
  async list(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_ROUTES.TEACHERS.LIST}${
      queryParams ? `?${queryParams}` : ""
    }`;
    return await apiClient.get(endpoint);
  },

  /**
   * Crear profesor
   */
  async create(data) {
    return await apiClient.post(API_ROUTES.TEACHERS.CREATE, data);
  },

  /**
   * Obtener profesor por ID
   */
  async getById(id) {
    return await apiClient.get(API_ROUTES.TEACHERS.GET(id));
  },

  /**
   * Actualizar profesor
   */
  async update(id, data) {
    return await apiClient.put(API_ROUTES.TEACHERS.UPDATE(id), data);
  },

  /**
   * Eliminar profesor
   */
  async delete(id) {
    return await apiClient.delete(API_ROUTES.TEACHERS.DELETE(id));
  },

  /**
   * Obtener/Actualizar disponibilidad
   */
  async getAvailability(id) {
    return await apiClient.get(API_ROUTES.TEACHERS.AVAILABILITY(id));
  },

  async updateAvailability(id, availability) {
    return await apiClient.put(API_ROUTES.TEACHERS.AVAILABILITY(id), {
      availability,
    });
  },
};

/**
 * API de Materias
 */
export const subjectAPI = {
  /**
   * Listar materias
   */
  async list(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_ROUTES.SUBJECTS.LIST}${
      queryParams ? `?${queryParams}` : ""
    }`;
    return await apiClient.get(endpoint);
  },

  /**
   * Crear materia
   */
  async create(data) {
    return await apiClient.post(API_ROUTES.SUBJECTS.CREATE, data);
  },

  /**
   * Obtener materia por ID
   */
  async getById(id) {
    return await apiClient.get(API_ROUTES.SUBJECTS.GET(id));
  },

  /**
   * Actualizar materia
   */
  async update(id, data) {
    return await apiClient.put(API_ROUTES.SUBJECTS.UPDATE(id), data);
  },

  /**
   * Eliminar materia
   */
  async delete(id) {
    return await apiClient.delete(API_ROUTES.SUBJECTS.DELETE(id));
  },
};

/**
 * API de Analytics
 */
export const analyticsAPI = {
  /**
   * Dashboard analytics
   */
  async getDashboard() {
    return await apiClient.get(API_ROUTES.ANALYTICS.DASHBOARD);
  },

  /**
   * Project analytics
   */
  async getProjects(period = "month") {
    return await apiClient.get(
      `${API_ROUTES.ANALYTICS.PROJECTS}?period=${period}`
    );
  },

  /**
   * Teacher analytics
   */
  async getTeachers() {
    return await apiClient.get(API_ROUTES.ANALYTICS.TEACHERS);
  },

  /**
   * Subject analytics
   */
  async getSubjects() {
    return await apiClient.get(API_ROUTES.ANALYTICS.SUBJECTS);
  },
};

/**
 * API de Usuarios
 */
export const userAPI = {
  /**
   * Obtener perfil
   */
  async getProfile() {
    return await apiClient.get(API_ROUTES.USERS.PROFILE);
  },

  /**
   * Actualizar perfil
   */
  async updateProfile(data) {
    return await apiClient.put(API_ROUTES.USERS.UPDATE, data);
  },

  /**
   * Eliminar cuenta
   */
  async deleteAccount() {
    return await apiClient.delete(API_ROUTES.USERS.DELETE);
  },
};

export default apiClient;
export { apiClient };
