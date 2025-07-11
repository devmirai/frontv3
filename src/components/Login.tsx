import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
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
  phone: string;
  company?: string;
}

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActiveTab("login");
      setError("");
    } catch (err) {
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
          Back to Home
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
                <span className="login-brand-subtitle">Interview Platform</span>
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
                {activeTab === "login" ? "Welcome Back" : "Join mirAI"}
              </Title>
              <Paragraph className="login-form-subtitle">
                {activeTab === "login"
                  ? "Sign in to your account and continue your AI-powered hiring journey"
                  : "Create your account and start transforming your hiring process"}
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
                Sign In
              </button>
              <button
                className={`tab-selector-button ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Sign Up
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
                  <div className="error-title">Authentication Error</div>
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
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <MailOutlined />
                      </div>
                      <Input
                        placeholder="Enter your email address"
                        className="login-input-modern"
                        autoComplete="email"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <LockOutlined />
                      </div>
                      <Input.Password
                        placeholder="Enter your password"
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
                      <span>{loading ? "Signing In..." : "Sign In"}</span>
                      <ThunderboltOutlined className="button-icon" />
                    </Button>
                  </Form.Item>
                </Form>

                {/* Security Badge */}
                <div className="login-security-badge">
                  <SafetyOutlined className="security-icon" />
                  <span>Enterprise-grade security & privacy protection</span>
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
                        message: "Please enter your full name",
                      },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <UserOutlined />
                      </div>
                      <Input
                        placeholder="Enter your full name"
                        className="login-input-modern"
                        autoComplete="name"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <MailOutlined />
                      </div>
                      <Input
                        placeholder="Enter your email address"
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
                        { required: true, message: "Please enter password" },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters",
                        },
                      ]}
                    >
                      <div className="login-input-wrapper">
                        <div className="input-icon">
                          <LockOutlined />
                        </div>
                        <Input.Password
                          placeholder="Create password"
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
                        { required: true, message: "Please confirm password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match!"),
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
                          placeholder="Confirm password"
                          className="login-input-modern"
                          autoComplete="new-password"
                        />
                        <div className="input-focus-border"></div>
                      </div>
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
                  >
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <PhoneOutlined />
                      </div>
                      <Input
                        placeholder="Enter phone number"
                        className="login-input-modern"
                        autoComplete="tel"
                      />
                      <div className="input-focus-border"></div>
                    </div>
                  </Form.Item>

                  <Form.Item name="company">
                    <div className="login-input-wrapper">
                      <div className="input-icon">
                        <BankOutlined />
                      </div>
                      <Input
                        placeholder="Company name (optional)"
                        className="login-input-modern"
                        autoComplete="organization"
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
                      <span>
                        {loading ? "Creating Account..." : "Create Account"}
                      </span>
                      <StarOutlined className="button-icon" />
                    </Button>
                  </Form.Item>
                </Form>

                {/* Terms Notice */}
                <div className="login-terms-notice">
                  <CheckCircleOutlined className="terms-icon" />
                  <span>
                    By signing up, you agree to our Terms of Service and Privacy
                    Policy
                  </span>
                </div>
              </motion.div>
            )}

            {/* Help Section */}
            <div className="login-help-section">
              <div className="help-links">
                <a href="#" className="help-link">
                  Forgot password?
                </a>
                <span className="help-divider">•</span>
                <a href="#" className="help-link">
                  Need support?
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
              <span>250+ Companies</span>
            </div>
            <div className="trust-item">
              <EyeOutlined className="trust-icon" />
              <span>12.5K+ Interviews</span>
            </div>
            <div className="trust-item">
              <HeartOutlined className="trust-icon" />
              <span>99.9% Uptime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
