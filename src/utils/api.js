import axios from 'axios';

// Crear instancia de axios con configuración base
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tiendamcbackend-production.up.railway.app',
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
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('La solicitud tardó demasiado tiempo');
    } else if (!error.response) {
      console.error('Error de red o servidor no disponible');
    } else {
      console.error('Error de respuesta:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default API;
