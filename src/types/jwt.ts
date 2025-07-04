import { JwtPayload } from "jwt-decode";

/**
 * Interface for the custom JWT payload returned from the authentication server
 * Extends the standard JwtPayload with application-specific properties
 */
export interface CustomJwtPayload extends JwtPayload {
  apellidoPaterno: string;
  role: string;
  userId: number;
  nombre: string;
  apellidoMaterno?: string;
  sub: string;
  telefono?: string;
  nacimiento?: string;
}