import axios from 'axios';

// Crear instancia de axios con configuración base
const API = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar tokens
API.interceptors.request.use(
  (config) => {
    // Si estamos en el servidor, no intentar acceder a localStorage
    if (typeof window === 'undefined') {
      return config;
    }

    const user = JSON.parse(window.localStorage.getItem('user') || '{}');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      code: error.code,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    };

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', errorDetails);
    } else if (!error.response) {
      console.error('Network or server error:', errorDetails);
    } else {
      console.error('API error:', errorDetails);
    }

    return Promise.reject(error);
  }
);

export default API;
