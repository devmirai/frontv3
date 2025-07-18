import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { Rol } from '../types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Rol;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 🥧 Permitir acceso al modo diseño sin autenticación
  const isDesignMode = location.pathname.includes('/314159');
  
  console.log('🔍 [ProtectedRoute] Debug - Pathname:', location.pathname, 'IsDesignMode:', isDesignMode, 'IsAuthenticated:', isAuthenticated, 'Loading:', loading);

  if (loading && !isDesignMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Permitir acceso sin autenticación solo para modo diseño
  if (!isAuthenticated && !isDesignMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // En modo diseño, no validar roles
  if (isDesignMode) {
    return <>{children}</>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    let redirectPath = '/usuario/dashboard'; // Default path
    
    if (user?.role === Rol.EMPRESA) {
      redirectPath = '/empresa/dashboard';
    } else if (user?.role === Rol.ADMIN) {
      redirectPath = '/admin/dashboard';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
