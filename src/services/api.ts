import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://devmirai.duckdns.org/api';
const AUTH_BASE_URL = 'https://devmirai.duckdns.org/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const addAuthToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('mirai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔒 [API] Adding token to request:', config.url, config.method?.toUpperCase());
  } else {
    console.warn('⚠️ [API] No token found for request:', config.url);
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

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    authAxios.post('/auth/login', credentials),
  loginUsuario: (credentials: { email: string; password: string }) =>
    authAxios.post('/auth/usuario/login', credentials),
  loginEmpresa: (credentials: { email: string; password: string }) =>
    authAxios.post('/auth/empresa/login', credentials),
  registerUsuario: (data: any) =>
    authAxios.post('/auth/usuario/register', data),
  registerEmpresa: (data: any) =>
    authAxios.post('/auth/empresa/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Empresas API
export const empresaAPI = {
  getAll: () => api.get('/empresas'),
  getById: (id: number) => api.get(`/empresas/${id}`),
  create: (data: any) => api.post('/empresas', data),
  update: (id: number, data: any) => api.put(`/empresas/${id}`, data),
  delete: (id: number) => api.delete(`/empresas/${id}`),
};

// Usuarios API
export const usuarioAPI = {
  getAll: () => api.get('/usuarios'),
  getById: (id: number) => api.get(`/usuarios/${id}`),
  create: (data: any) => api.post('/usuarios', data),
  update: (id: number, data: any) => api.put(`/usuarios/${id}`, data),
  delete: (id: number) => api.delete(`/usuarios/${id}`),
};

// Convocatorias API
export const convocatoriaAPI = {
  create: (data: any) => api.post('/convocatorias', data),
  createV2: (data: any) => api.post('/convocatorias/v2', data),
  getAll: () => api.get('/convocatorias'),
  getById: (id: number) => api.get(`/convocatorias/${id}`),
  getByEmpresa: (empresaId: number) => api.get(`/convocatorias/empresa/${empresaId}`),
  getByEmpresaV2: (empresaId: number) => api.get(`/convocatorias/v2/empresa/${empresaId}`),
  getActivas: () => api.get('/convocatorias/activas'),
  getActivasV2: () => api.get('/convocatorias/v2'),
  update: (id: number, data: any) => api.put(`/convocatorias/${id}`, data),
  delete: (id: number) => api.delete(`/convocatorias/${id}`),
};

// Postulaciones API
export const postulacionAPI = {
  create: (data: any) => api.post('/postulaciones', data),
  getAll: () => api.get('/postulaciones'),
  getById: (id: number) => api.get(`/postulaciones/${id}`),
  getByUsuario: (usuarioId: number) => api.get(`/postulaciones/usuario/${usuarioId}`),
  getMisPostulaciones: () => api.get('/postulaciones/mis-postulaciones'), // New JWT-based endpoint
  getByConvocatoria: (convocatoriaId: number) => api.get(`/postulaciones/convocatoria/${convocatoriaId}`),
  iniciarEntrevista: (postulacionId: number) => api.patch(`/postulaciones/${postulacionId}/iniciar-entrevista`),
  marcarPreguntasGeneradas: (postulacionId: number, generadas: boolean = true) => api.patch(`/postulaciones/${postulacionId}/marcar-preguntas-generadas`, { generadas }),
  completarEntrevista: (postulacionId: number) => api.patch(`/postulaciones/${postulacionId}/completar-entrevista`),
  update: (id: number, data: any) => api.put(`/postulaciones/${id}`, data),
  delete: (id: number) => api.delete(`/postulaciones/${id}`),
};

// Entrevistas API v2
export const entrevistaAPI = {
  // v1 endpoints
  getAll: () => api.get('/entrevistas'),
  getById: (id: number) => api.get(`/entrevistas/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/entrevistas/postulacion/${postulacionId}`),
  create: (data: any) => api.post('/entrevistas', data),
  update: (id: number, data: any) => api.put(`/entrevistas/${id}`, data),
  delete: (id: number) => api.delete(`/entrevistas/${id}`),
  enviarRespuesta: (entrevistaId: number, data: any) => api.post(`/entrevistas/${entrevistaId}/respuesta`, data),
  finalizarEntrevista: (entrevistaId: number) => api.post(`/entrevistas/${entrevistaId}/finalizar`),
  // v2 endpoints with sessionId
  actualizarProgreso: (sessionId: string, data: any) => api.patch(`/v2/entrevistas/progreso/${sessionId}`, data),
  finalizarV2: (sessionId: string) => api.patch(`/v2/entrevistas/finalizar/${sessionId}`),
  getResultados: (sessionId: string) => api.get(`/v2/entrevistas/resultados/${sessionId}`),
  getResumen: (sessionId: string) => api.get(`/v2/entrevistas/resumen/${sessionId}`),
};

// Preguntas API
export const preguntaAPI = {
  getAll: () => api.get('/preguntas'),
  getById: (id: number) => api.get(`/preguntas/${id}`),
  getByEntrevista: (entrevistaId: number) => api.get(`/preguntas/entrevista/${entrevistaId}`),
  getByPostulacion: (postulacionId: number) => api.get(`/preguntas/postulacion/${postulacionId}`),
  getByConvocatoria: (convocatoriaId: number) => api.get(`/preguntas/convocatoria/${convocatoriaId}`),
  generar: (data: { idPostulacion: number }) => api.post('/preguntas/generar', data),
  create: (data: any) => api.post('/preguntas', data),
  update: (id: number, data: any) => api.put(`/preguntas/${id}`, data),
  delete: (id: number) => api.delete(`/preguntas/${id}`),
};

// Respuestas API
export const respuestaAPI = {
  getAll: () => api.get('/respuestas'),
  getById: (id: number) => api.get(`/respuestas/${id}`),
  getByPregunta: (preguntaId: number) => api.get(`/respuestas/pregunta/${preguntaId}`),
  create: (data: any) => api.post('/respuestas', data),
  update: (id: number, data: any) => api.put(`/respuestas/${id}`, data),
  delete: (id: number) => api.delete(`/respuestas/${id}`),
};

// Evaluaciones API
export const evaluacionAPI = {
  getAll: () => api.get('/evaluaciones'),
  getById: (id: number) => api.get(`/evaluaciones/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/evaluaciones/postulacion/${postulacionId}`),
  getResultados: (postulacionId: number) => api.get(`/evaluaciones/resultados/${postulacionId}`),
  getHistorialCompleto: (postulacionId: number) => api.get(`/evaluaciones/historial-completo/${postulacionId}`),
  evaluar: (data: any) => api.post('/evaluaciones/evaluar', data),
  create: (data: any) => api.post('/evaluaciones', data),
  update: (id: number, data: any) => api.put(`/evaluaciones/${id}`, data),
  delete: (id: number) => api.delete(`/evaluaciones/${id}`),
};

export default api;
