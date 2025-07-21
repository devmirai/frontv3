import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import dayjs from "../utils/dayjs";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BankOutlined,
  RobotOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  StarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/login.css";
import { Rol } from "../types/api";

const { Title, Paragraph } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  nacimiento: string; // Now using HTML date input (YYYY-MM-DD format)
}

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { isDarkMode } = useTheme();

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const success = await login({
        email: values.email,
        password: values.password,
      });

      if (success) {
        const userDataStr = localStorage.getItem("mirai_user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);

          if (userData.role === Rol.ADMIN) {
            navigate("/admin/dashboard");
          } else if (userData.role === Rol.EMPRESA) {
            navigate("/empresa/dashboard");
          } else {
            navigate("/usuario/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(
          "Authentication failed. Please check your credentials and try again.",
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const success = await register({
        email: values.email,
        password: values.password,
        role: Rol.USUARIO,
        nombre: values.name,
        apellidoPaterno: values.apellidoPaterno,
        apellidoMaterno: values.apellidoMaterno,
        telefono: parseInt(values.telefono),
        nacimiento: values.nacimiento, // Input date is already in YYYY-MM-DD format
      });

      if (success) {
        // The register function now handles login automatically
        // Navigate based on user role
        const userDataStr = localStorage.getItem("mirai_user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.role === Rol.ADMIN) {
            navigate("/admin/dashboard");
          } else if (userData.role === Rol.EMPRESA) {
            navigate("/empresa/dashboard");
          } else {
            navigate("/usuario/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-layout">
      {/* Aurora Background */}
      <div className="login-aurora-background">
        <div className="login-aurora-pattern"></div>
        <div className="login-mesh-gradient"></div>
        <div className="login-floating-orbs">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`login-orb login-orb-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Back to Home */}
      <motion.div
        className="login-back-navigation"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          className="login-back-button"
          onClick={() => navigate("/")}
          icon={<ArrowLeftOutlined />}
        >
          Volver al Inicio
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="login-main-content">
        <motion.div
          className="login-container-modern"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Logo Section */}
          <motion.div
            className="login-logo-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="login-logo-modern">
              <div className="login-logo-icon-modern">
                <RobotOutlined />
              </div>
              <div className="login-logo-text-modern">
                <span className="login-brand-name">mirAI</span>
                <span className="login-brand-subtitle">Plataforma de Entrevistas</span>
              </div>
            </div>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            className="login-form-card-modern"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Header */}
            <div className="login-form-header">
              <Title level={2} className="login-form-title">
                {activeTab === "login" ? "Bienvenido de vuelta" : "Únete a mirAI"}
              </Title>
              <Paragraph className="login-form-subtitle">
                {activeTab === "login"
                  ? "Inicia sesión en tu cuenta y continúa tu viaje de contratación impulsado por IA"
                  : "Crea tu cuenta y comienza a transformar tu proceso de contratación"}
              </Paragraph>
            </div>

            {/* Tab Selector */}
            <div className="login-tab-selector">
              <div className="tab-selector-background">
                <motion.div
                  className="tab-selector-indicator"
                  animate={{
                    x: activeTab === "login" ? 0 : "100%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <button
                className={`tab-selector-button ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Iniciar Sesión
              </button>
              <button
                className={`tab-selector-button ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Registrarse
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-error-alert"
              >
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <div className="error-title">Error de Autenticación</div>
                  <div className="error-message">{error}</div>
                </div>
                <button className="error-close" onClick={() => setError("")}>
                  ×
                </button>
              </motion.div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Form
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                  className="login-form-modern"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Por favor ingrese su correo electrónico" },
                      { type: "email", message: "Por favor ingrese un correo electrónico válido" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <MailOutlined />
                      </div>
                      <Input
                        placeholder="Ingrese su dirección de correo electrónico"
                        className="login-input-modern"
                        autoComplete="email"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Por favor ingrese su contraseña" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <LockOutlined />
                      </div>
                      <Input.Password
                        placeholder="Ingrese su contraseña"
                        className="login-input-modern"
                        autoComplete="current-password"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="login-button-modern"
                      block
                    >
                      <span>{loading ? "Iniciando sesión..." : "Iniciar Sesión"}</span>
                      <ThunderboltOutlined className="button-icon" />
                    </Button>
                  </Form.Item>
                </Form>

                {/* Security Badge */}
                <div className="login-security-badge">
                  <SafetyOutlined className="security-icon" />
                  <span>Seguridad y protección de privacidad de nivel empresarial</span>
                </div>
              </motion.div>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Form
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  className="login-form-modern"
                  size="large"
                >
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese su nombre",
                      },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <UserOutlined />
                      </div>
                      <Input
                        placeholder="Ingrese su nombre"
                        className="login-input-modern"
                        autoComplete="given-name"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <div className="form-row">
                    <Form.Item
                      name="apellidoPaterno"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese su apellido paterno",
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <UserOutlined />
                        </div>
                        <Input
                          placeholder="Apellido paterno"
                          className="login-input-modern"
                          autoComplete="family-name"
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="apellidoMaterno"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese su apellido materno",
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <UserOutlined />
                        </div>
                        <Input
                          placeholder="Apellido materno"
                          className="login-input-modern"
                          autoComplete="family-name"
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Por favor ingrese su correo electrónico" },
                      { type: "email", message: "Por favor ingrese un correo electrónico válido" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <MailOutlined />
                      </div>
                      <Input
                        placeholder="Ingrese su dirección de correo electrónico"
                        className="login-input-modern"
                        autoComplete="email"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <div className="form-row">
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Por favor ingrese una contraseña" },
                        {
                          min: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <LockOutlined />
                        </div>
                        <Input.Password
                          placeholder="Crear contraseña"
                          className="login-input-modern"
                          autoComplete="new-password"
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Por favor confirme la contraseña" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("¡Las contraseñas no coinciden!"),
                            );
                          },
                        }),
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <LockOutlined />
                        </div>
                        <Input.Password
                          placeholder="Confirmar contraseña"
                          className="login-input-modern"
                          autoComplete="new-password"
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>
                  </div>

                  <div className="form-row">
                    <Form.Item
                      name="telefono"
                      rules={[
                        { required: true, message: "Por favor ingrese su número de teléfono" },
                        { 
                          pattern: /^9\d{8}$/, 
                          message: "El número de teléfono debe comenzar con 9 y tener exactamente 9 dígitos" 
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <PhoneOutlined />
                        </div>
                        <Input
                          placeholder="Número de teléfono (9XXXXXXXX)"
                          className="login-input-modern"
                          autoComplete="tel"
                          maxLength={9}
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="nacimiento"
                      rules={[
                        { required: true, message: "Por favor seleccione su fecha de nacimiento" },
                        {
                          validator: (_, value) => {
                            if (!value) {
                              return Promise.resolve();
                            }
                            
                            // Convert string date to dayjs for validation
                            const birthDate = dayjs(value);
                            const today = dayjs();
                            const age = today.diff(birthDate, 'year');
                            
                            if (age < 18) {
                              return Promise.reject(new Error('Debe tener al menos 18 años para registrarse'));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <CalendarOutlined />
                        </div>
                        <Input
                          type="date"
                          placeholder="Seleccione su fecha de nacimiento"
                          className="login-input-modern"
                          style={{ width: '100%' }}
                          max={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="login-button-modern"
                      block
                    >
                      <span>
                        {loading ? "Creando cuenta..." : "Crear Cuenta"}
                      </span>
                      <StarOutlined className="button-icon" />
                    </Button>
                  </Form.Item>
                </Form>

                {/* Terms Notice */}
                <div className="login-terms-notice">
                  <CheckCircleOutlined className="terms-icon" />
                  <span>
                    Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
                  </span>
                </div>
              </motion.div>
            )}

            {/* Help Section */}
            <div className="login-help-section">
              <div className="help-links">
                <a href="#" className="help-link">
                  ¿Olvidaste tu contraseña?
                </a>
                <span className="help-divider">•</span>
                <a href="#" className="help-link">
                  ¿Necesitas ayuda?
                </a>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="login-trust-indicators"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="trust-item">
              <GlobalOutlined className="trust-icon" />
              <span>250+ Empresas</span>
            </div>
            <div className="trust-item">
              <EyeOutlined className="trust-icon" />
              <span>12.5K+ Entrevistas</span>
            </div>
            <div className="trust-item">
              <HeartOutlined className="trust-icon" />
              <span>99.9% Disponibilidad</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
