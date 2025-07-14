export enum Rol {
  USUARIO = "USUARIO",
  EMPRESA = "EMPRESA",
  ADMIN = "ADMIN",
}

// DTOs para el backend
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo?: string;
  id?: number;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
}

export interface UsuarioCreateDTO {
  email: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nacimiento: string;
  telefono: number;
  password: string;
  rol: Rol;
}

export interface UsuarioResponseDTO {
  id: number;
  email: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: Rol;
}

export enum EstadoPostulacion {
  PENDIENTE = "PENDIENTE",
  EN_EVALUACION = "EN_EVALUACION",
  COMPLETADA = "COMPLETADA",
  RECHAZADA = "RECHAZADA",
}

export interface Usuario {
  id?: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  email: string
  password?: string
  nacimiento: string
  telefono: number
  rol: Rol
  avatar?: string
}

export interface Empresa {
  id?: number
  nombre: string
  email: string
  password?: string
  telefono: string
  direccion: string
  descripcion: string
  rol: Rol
  logo?: string
}

export interface Convocatoria {
  id?: number
  titulo: string
  descripcion: string
  puesto: string
  categoria?: string
  dificultad?: string
  fechaPublicacion: string
  fechaCierre: string
  activo: boolean
  empresa?: Empresa
}

export interface Postulacion {
  id?: number
  fechaPostulacion: string
  estado: EstadoPostulacion
  usuario?: Usuario
  convocatoria?: Convocatoria
}

export interface Pregunta {
  id?: number
  pregunta: string
  tipo: string
  dificultad: string
  categoria: string
  postulacion?: Postulacion
}

export interface Evaluacion {
  id?: number
  respuesta: string
  puntaje: number
  feedback: string
  claridad_estructura: number
  dominio_tecnico: number
  resolucion_problemas: number
  comunicacion: number
  pregunta?: Pregunta
  postulacion?: Postulacion
}

export interface InterviewResults {
  postulacion: Postulacion
  evaluaciones: Evaluacion[]
  promedios: {
    claridad_estructura: number
    dominio_tecnico: number
    resolucion_problemas: number
    comunicacion: number
    puntaje_general: number
  }
  fortalezas: string[]
  areas_mejora: string[]
}
