"use client";

import type React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./components/Landing";
import Login from "./components/Login";
import CompanyDashboard from "./components/CompanyDashboard";
import UserDashboard from "./components/UserDashboard";
import Interview from "./components/Interview";
import ConvocatoriaDetailsView from "./components/ConvocatoriaDetailsView";
import CandidatesList from "./components/CandidatesList";
import CreateConvocatoria from "./components/CreateConvocatoria";
import AdminDashboard from "./components/AdminDashboard";
import DemoDataViewer from "./components/DemoDataViewer";
import { Rol } from "./types/api";
import "./App.css";

// Theme configuration component
const ThemedApp: React.FC = () => {
  const { isDarkMode } = useTheme();

  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: "#6366f1",
      colorSuccess: "#10b981",
      colorWarning: "#f59e0b",
      colorError: "#ef4444",
      colorInfo: "#06b6d4",
      borderRadius: 8,
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      colorBgBase: isDarkMode ? "#0f172a" : "#ffffff",
      colorTextBase: isDarkMode ? "#f1f5f9" : "#1f2937",
    },
    components: {
      Layout: {
        headerBg: isDarkMode ? "#1e293b" : "#ffffff",
        bodyBg: isDarkMode ? "#0f172a" : "#fafafa",
        siderBg: isDarkMode ? "#1e293b" : "#ffffff",
      },
      Button: {
        borderRadius: 8,
        fontWeight: 500,
      },
      Card: {
        borderRadius: 12,
        headerBg: isDarkMode ? "#1e293b" : "#ffffff",
      },
      Menu: {
        itemBg: isDarkMode ? "#1e293b" : "#ffffff",
        subMenuItemBg: isDarkMode ? "#1e293b" : "#ffffff",
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <AuthProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* Demo Route - Solo para desarrollo */}
                <Route path="/demo-data" element={<DemoDataViewer />} />

                {/* Dashboard Redirect */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Rol.ADMIN}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Company Routes */}
                <Route
                  path="/empresa/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Rol.EMPRESA}>
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/empresa/convocatoria/create"
                  element={
                    <ProtectedRoute requiredRole={Rol.EMPRESA}>
                      <CreateConvocatoria />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/empresa/convocatoria/:id"
                  element={
                    <ProtectedRoute requiredRole={Rol.EMPRESA}>
                      <ConvocatoriaDetailsView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/empresa/convocatoria/:id/candidates"
                  element={
                    <ProtectedRoute requiredRole={Rol.EMPRESA}>
                      <CandidatesList />
                    </ProtectedRoute>
                  }
                />

                {/* User Routes */}
                <Route
                  path="/usuario/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Rol.USUARIO}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuario/interview/:id"
                  element={
                    <ProtectedRoute requiredRole={Rol.USUARIO}>
                      <Interview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuario/interview/:id/results"
                  element={
                    <ProtectedRoute requiredRole={Rol.USUARIO}>
                      <Interview />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy route for backward compatibility */}
                <Route
                  path="/interview/:id"
                  element={
                    <ProtectedRoute>
                      <Interview />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
};

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Redirect to appropriate dashboard based on user role
  if (user.role === Rol.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === Rol.EMPRESA) {
    return <Navigate to="/empresa/dashboard" replace />;
  } else {
    return <Navigate to="/usuario/dashboard" replace />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
