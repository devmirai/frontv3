import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { message } from 'antd';
import { usuarioAPI, empresaAPI, authAPI } from '../services/api';
import { Usuario, Empresa, Rol } from '../types/api';
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

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Call the API with the credentials
      const response = await authAPI.login({ email, password });
      
      // Get the JWT token from the response - updated to use 'jwt' key
      const jwtToken = response.data.jwt;
      
      if (!jwtToken) {
        throw new Error('No token received from server');
      }
      
      // Use the decoded token and response data to create the user object
      const decodedToken: any = jwtDecode(jwtToken);
      
      // Create user object from JWT data
      const user: User = {
        id: decodedToken.userId,
        email: decodedToken.sub, // sub contains the email
        name: `${decodedToken.nombre} ${decodedToken.apellidoPaterno} ${decodedToken.apellidoMaterno}`,
        role: decodedToken.role === 'ROLE_USUARIO' ? Rol.USUARIO : Rol.EMPRESA,
        telefono: decodedToken.telefono,
        apellidoPaterno: decodedToken.apellidoPaterno,
        apellidoMaterno: decodedToken.apellidoMaterno,
        nacimiento: decodedToken.nacimiento,
      };

      // Store in localStorage
      localStorage.setItem('mirai_token', jwtToken);
      localStorage.setItem('mirai_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: jwtToken } });
      message.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      let response;
      
      if (data.role === Rol.USUARIO) {
        const usuarioData: Usuario = {
          nombre: data.nombre!,
          apellidoPaterno: data.apellidoPaterno!,
          apellidoMaterno: data.apellidoMaterno!,
          email: data.email,
          password: data.password,
          nacimiento: data.nacimiento!,
          telefono: data.telefono!,
          rol: Rol.USUARIO
        };
        response = await usuarioAPI.create(usuarioData);
      } else {
        const empresaData: Empresa = {
          nombre: data.nombre!,
          email: data.email,
          password: data.password,
          telefono: data.telefono?.toString() || '',
          direccion: data.direccion!,
          descripcion: data.descripcion!,
          rol: Rol.EMPRESA
        };
        response = await empresaAPI.create(empresaData);
      }

      const userData = response.data;
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: data.role === Rol.USUARIO 
          ? `${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`
          : userData.nombre,
        role: data.role,
        avatar: data.role === Rol.EMPRESA 
          ? 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100'
          : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
        ...userData
      };

      const token = 'mock_jwt_token_' + Date.now();

      localStorage.setItem('mirai_token', token);
      localStorage.setItem('mirai_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      message.success(`Account created successfully! Welcome, ${user.name}!`);
      return true;
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
