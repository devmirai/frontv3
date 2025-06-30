import axios, { InternalAxiosRequestConfig } from 'axios';

// API Base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8081/api';
const AUTH_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for auth endpoints
const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available - Applied to both instances
// Using InternalAxiosRequestConfig instead of AxiosRequestConfig for Axios v1.x
const addAuthToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('mirai_token');
  if (token) {
    // In Axios v1.x, headers is already guaranteed to exist
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Adding token to request:', config.url);
  }
  return config;
};

api.interceptors.request.use(
  addAuthToken,
  (error) => Promise.reject(error)
);

authAxios.interceptors.request.use(
  addAuthToken,
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
const handleErrors = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('mirai_token');
    localStorage.removeItem('mirai_user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  handleErrors
);

authAxios.interceptors.response.use(
  (response) => response,
  handleErrors
);

// Auth API using the auth instance
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    authAxios.post('/auth/login', credentials),
  // You might add more auth-related endpoints here
};

// Usuario API
export const usuarioAPI = {
  create: (data: any) => api.post('/usuario', data),
  getAll: () => api.get('/usuario'),
  getById: (id: number) => api.get(`/usuario/${id}`),
  getByEmail: (email: string) => api.get(`/usuario/email/${email}`),
  update: (id: number, data: any) => api.put(`/usuario/${id}`, data),
  delete: (id: number) => api.delete(`/usuario/${id}`),
};

// Empresa API
export const empresaAPI = {
  create: (data: any) => api.post('/empresa', data),
  getAll: () => api.get('/empresa'),
  getById: (id: number) => api.get(`/empresa/${id}`),
  getByEmail: (email: string) => api.get(`/empresa/email/${email}`),
  update: (id: number, data: any) => api.put(`/empresa/${id}`, data),
  delete: (id: number) => api.delete(`/empresa/${id}`),
};

// Convocatoria API
export const convocatoriaAPI = {
  create: (data: any) => api.post('/convocatorias', data),
  getAll: () => api.get('/convocatorias'),
  getById: (id: number) => api.get(`/convocatorias/${id}`),
  getByEmpresa: (empresaId: number) => api.get(`/convocatorias/empresa/${empresaId}`),
  getActivas: () => api.get('/convocatorias/activas'),
  update: (id: number, data: any) => api.put(`/convocatorias/${id}`, data),
  delete: (id: number) => api.delete(`/convocatorias/${id}`),
};

// Postulacion API
export const postulacionAPI = {
  create: (data: any) => api.post('/postulaciones', data),
  getAll: () => api.get('/postulaciones'),
  getById: (id: number) => api.get(`/postulaciones/${id}`),
  getByUsuario: (usuarioId: number) => api.get(`/postulaciones/usuario/${usuarioId}`),
  getByConvocatoria: (convocatoriaId: number) => api.get(`/postulaciones/convocatoria/${convocatoriaId}`),
  update: (id: number, data: any) => api.put(`/postulaciones/${id}`, data),
  delete: (id: number) => api.delete(`/postulaciones/${id}`),
  
  // New specific endpoints for better legibility
  iniciarEntrevista: (id: number) => 
    api.patch(`/postulaciones/${id}/iniciar-entrevista`),
  
  completarEntrevista: (id: number) => 
    api.patch(`/postulaciones/${id}/completar-entrevista`),
  
  // Company-only endpoint for changing status
  actualizarEstado: (id: number, estado: string) => 
    api.patch(`/postulaciones/${id}/estado`, { estado }),
  
  // Existing endpoints
  getByEstado: (estado: string) => 
    api.get(`/postulaciones/estado/${estado}`),
    
  getByUsuarioYEstado: (usuarioId: number, estado: string) => 
    api.get(`/postulaciones/usuario/${usuarioId}/estado/${estado}`),
    
  getByConvocatoriaYEstado: (convocatoriaId: number, estado: string) => 
    api.get(`/postulaciones/convocatoria/${convocatoriaId}/estado/${estado}`),
};

// Pregunta API
export const preguntaAPI = {
  generar: (data: { idPostulacion: number }) => api.post('/preguntas/generar', data),
  getAll: () => api.get('/preguntas'),
  getById: (id: number) => api.get(`/pregunta/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/preguntas/postulacion/${postulacionId}`),
};

// Evaluacion API - Updated to match your backend endpoints
export const evaluacionAPI = {
  evaluar: (data: { 
    preguntaId: number; 
    answer: string; 
    postulacionId: number 
  }) => api.post('/evaluaciones/evaluar', data),
  
  getByPostulacion: (postulacionId: number) => 
    api.get(`/evaluaciones/postulacion/${postulacionId}`),
    
  getResultados: (postulacionId: number) => 
    api.get(`/evaluaciones/mis-resultados/${postulacionId}`),
    
  getResultadosDetalle: (postulacionId: number) => 
    api.get(`/evaluaciones/mis-resultados/detalle/${postulacionId}`),
  
  getByEntrevista: (entrevistaId: number) => 
    api.get(`/evaluaciones/por-entrevista/${entrevistaId}`)
};

export default api;
