import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { message } from 'antd';
import { usuarioAPI, empresaAPI, authAPI } from '../services/api';
import { Usuario, Empresa, Rol, AuthResponse, UsuarioCreateDTO } from '../types/api';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Rol;
  avatar?: string;
  // Additional fields based on role
  telefono?: string | number;
  direccion?: string;
  descripcion?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nacimiento?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: Rol;
  // Usuario fields
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nacimiento?: string;
  telefono?: number;
  // Empresa fields
  direccion?: string;
  descripcion?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('mirai_token');
    const userData = localStorage.getItem('mirai_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('mirai_token');
        localStorage.removeItem('mirai_user');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      console.log('Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      // El backend devuelve { jwt: "token" }
      const jwtToken = response.data.jwt;
      
      if (!jwtToken) {
        throw new Error('No token received from server');
      }
      
      // Decodificar el JWT para obtener información del usuario
      const decodedToken: any = jwtDecode(jwtToken);
      console.log('Decoded JWT:', decodedToken);
      
      // Determinar el rol basado en userType del JWT
      let userRole: Rol;
      if (decodedToken.userType === 'USUARIO') {
        userRole = Rol.USUARIO;
      } else if (decodedToken.userType === 'EMPRESA') {
        userRole = Rol.EMPRESA;
      } else if (decodedToken.userType === 'ADMIN') {
        userRole = Rol.ADMIN;
      } else {
        // Fallback: intentar usar role si userType no está disponible
        if (decodedToken.role === 'ROLE_USUARIO') {
          userRole = Rol.USUARIO;
        } else if (decodedToken.role === 'ROLE_EMPRESA') {
          userRole = Rol.EMPRESA;
        } else if (decodedToken.role === 'ROLE_ADMIN') {
          userRole = Rol.ADMIN;
        } else {
          userRole = Rol.USUARIO; // default
        }
      }
      
      // Construir objeto user basado en datos del JWT
      const user: User = {
        id: decodedToken.userId,
        email: decodedToken.sub || credentials.email,
        name: decodedToken.nombre || 'User',
        role: userRole,
      };

      // Agregar campos adicionales si están disponibles en el JWT
      if (decodedToken.apellidoPaterno) {
        user.apellidoPaterno = decodedToken.apellidoPaterno;
      }
      if (decodedToken.apellidoMaterno) {
        user.apellidoMaterno = decodedToken.apellidoMaterno;
      }
      if (decodedToken.telefono) {
        user.telefono = decodedToken.telefono;
      }
      if (decodedToken.direccion) {
        user.direccion = decodedToken.direccion;
      }
      if (decodedToken.descripcion) {
        user.descripcion = decodedToken.descripcion;
      }
      if (decodedToken.nacimiento) {
        user.nacimiento = decodedToken.nacimiento;
      }

      console.log('Processed user object:', user);

      // Store in localStorage
      localStorage.setItem('mirai_token', jwtToken);
      localStorage.setItem('mirai_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: jwtToken } });
      message.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Login failed
      dispatch({ type: 'LOGIN_FAILURE' });
      
      if (error.response?.status === 401) {
        message.error('Invalid credentials. Please check your email and password.');
      } else {
        message.error('Login failed. Please check your connection and try again.');
      }
      
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      if (data.role === Rol.USUARIO) {
        const usuarioData: UsuarioCreateDTO = {
          nombre: data.nombre!,
          apellidoPaterno: data.apellidoPaterno!,
          apellidoMaterno: data.apellidoMaterno!,
          email: data.email,
          password: data.password,
          telefono: data.telefono!,
          nacimiento: data.nacimiento!,
          rol: Rol.USUARIO
        };
        
        console.log('Creating user with data:', usuarioData);
        const response = await usuarioAPI.create(usuarioData);
        console.log('User creation response:', response.data);
        
        // After successful registration, automatically log in
        const loginSuccess = await login({ 
          email: data.email, 
          password: data.password 
        });
        
        if (loginSuccess) {
          message.success(`Account created successfully! Welcome!`);
          return true;
        } else {
          message.error('Account created but login failed. Please try logging in manually.');
          return false;
        }
      } else {
        // Handle empresa registration (if needed)
        const empresaData: Empresa = {
          nombre: data.nombre!,
          email: data.email,
          password: data.password,
          telefono: data.telefono?.toString() || '',
          direccion: data.direccion!,
          descripcion: data.descripcion!,
          rol: Rol.EMPRESA
        };
        const response = await empresaAPI.create(empresaData);
        
        // After successful registration, automatically log in
        const loginSuccess = await login({ 
          email: data.email, 
          password: data.password 
        });
        
        if (loginSuccess) {
          message.success(`Company account created successfully! Welcome!`);
          return true;
        } else {
          message.error('Account created but login failed. Please try logging in manually.');
          return false;
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Registration failed. Please try again.';
      message.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mirai_token');
    localStorage.removeItem('mirai_user');
    dispatch({ type: 'LOGOUT' });
    message.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};