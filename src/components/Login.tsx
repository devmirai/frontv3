"use client"

import type React from "react"
import { useState } from "react"
import { Form, Input, Button, Card, Typography, Alert, Row, Col, Divider } from "antd"
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  RobotOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  SunOutlined,
  MoonOutlined,
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import "../styles/login.css"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const { Title, Paragraph } = Typography

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  company?: string
}

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true)
    setError("")

    try {
      // Make direct API call to auth endpoint
      const response = await axios.post('http://localhost:8081/auth/login', {
        email: values.email,
        password: values.password
      })

      // Extract JWT token from response
      const jwtToken = response.data.jwt
      
      if (!jwtToken) {
        setError("Authentication failed: No token received")
        setLoading(false)
        return
      }
      
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode(jwtToken)
      
      // Create user object from JWT data
      const user = {
        id: decodedToken.userId,
        email: decodedToken.sub,
        name: `${decodedToken.nombre} ${decodedToken.apellidoPaterno} ${decodedToken.apellidoMaterno}`,
        role: decodedToken.role === 'ROLE_USUARIO' ? 'USUARIO' : 'EMPRESA',
        telefono: decodedToken.telefono,
        apellidoPaterno: decodedToken.apellidoPaterno,
        apellidoMaterno: decodedToken.apellidoMaterno,
        nacimiento: decodedToken.nacimiento,
      }

      // Store token and user data in localStorage
      localStorage.setItem('mirai_token', jwtToken)
      localStorage.setItem('mirai_user', JSON.stringify(user))

      // Update auth context and navigate to dashboard
      navigate("/dashboard")
      
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true)
    setError("")

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setActiveTab("login")
      setError("")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <div className="login-layout">
      <div className="login-content">
        <div className="login-container">
          <Row className="login-row">
            {/* Hero Section */}
            <Col xs={24} lg={12}>
              <motion.div className="login-hero" variants={containerVariants} initial="hidden" animate="visible">
                {/* Back to Home Link */}
                <motion.div variants={itemVariants}>
                  <div className="login-back-link" onClick={() => navigate("/")}>
                    <ArrowLeftOutlined />
                    <span>Back to Home</span>
                  </div>
                </motion.div>

                {/* Logo */}
                <motion.div variants={itemVariants}>
                  <div className="login-hero-logo">
                    <div className="login-hero-logo-icon">
                      <RobotOutlined />
                    </div>
                    <div className="login-hero-logo-content">
                      <div className="login-hero-logo-text">mirAI</div>
                      <div className="login-hero-logo-subtitle">Interview Platform</div>
                    </div>
                  </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div variants={itemVariants}>
                  <div className="login-hero-image">
                    <div className="login-hero-image-main">
                      <img
                        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="AI Interview Platform"
                      />
                      <div className="login-hero-image-overlay">
                        <p className="login-hero-image-caption">Transform your hiring process with AI</p>
                      </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                      className="login-hero-floating-card"
                      style={{ top: "15%", right: "-8%" }}
                      variants={floatingVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.8 }}
                    >
                      <div className="login-hero-floating-card-content">
                        <div className="login-hero-floating-card-icon">
                          <TrophyOutlined />
                        </div>
                        <p className="login-hero-floating-card-text">98% Success Rate</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="login-hero-floating-card"
                      style={{ bottom: "15%", left: "-8%" }}
                      variants={floatingVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1.0 }}
                    >
                      <div className="login-hero-floating-card-content">
                        <div className="login-hero-floating-card-icon">
                          <TeamOutlined />
                        </div>
                        <p className="login-hero-floating-card-text">500+ Companies</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Hero Content */}
                <motion.div variants={itemVariants}>
                  <Title className="login-hero-title">
                    Welcome to the <span className="login-hero-title-highlight">Future</span> of Hiring
                  </Title>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Paragraph className="login-hero-description">
                    Join thousands of companies using mirAI to conduct smarter interviews, evaluate candidates with AI
                    precision, and make better hiring decisions faster than ever before.
                  </Paragraph>
                </motion.div>

                {/* Stats Section */}
                <motion.div variants={itemVariants}>
                  <div className="login-hero-stats">
                    <div className="login-hero-stat">
                      <span className="login-hero-stat-number">10K+</span>
                      <span className="login-hero-stat-label">Interviews</span>
                    </div>
                    <div className="login-hero-stat">
                      <span className="login-hero-stat-number">500+</span>
                      <span className="login-hero-stat-label">Companies</span>
                    </div>
                    <div className="login-hero-stat">
                      <span className="login-hero-stat-number">98%</span>
                      <span className="login-hero-stat-label">Accuracy</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>

            {/* Form Section */}
            <Col xs={24} lg={12}>
              <div className="login-form-section">
                <motion.div
                  className="login-form-container"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Card className="login-form-card">
                    <div className="login-form-content">
                      {/* Tab Toggle Buttons */}
                      <div className="login-tab-buttons">
                        <Button
                          className={`login-tab-button ${activeTab === "login" ? "login-tab-button-active" : ""}`}
                          onClick={() => setActiveTab("login")}
                        >
                          Sign In
                        </Button>
                        <Button
                          className={`login-tab-button ${activeTab === "register" ? "login-tab-button-active" : ""}`}
                          onClick={() => setActiveTab("register")}
                        >
                          Sign Up
                        </Button>
                      </div>

                      {/* Login Form */}
                      {activeTab === "login" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {error && (
                            <Alert
                              message="Authentication Error"
                              description={error}
                              type="error"
                              showIcon
                              className="login-alert login-alert-error"
                              closable
                              onClose={() => setError("")}
                            />
                          )}

                          <Form
                            name="login"
                            onFinish={handleLogin}
                            layout="vertical"
                            className={`login-form ${loading ? "login-form-loading" : ""}`}
                            size="large"
                          >
                            <Form.Item
                              name="email"
                              label={<span className="login-form-label">Email Address</span>}
                              rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                              ]}
                              className="login-form-item"
                            >
                              <Input
                                prefix={<MailOutlined className="login-input-prefix" />}
                                placeholder="Enter your email address"
                                className="login-input"
                                autoComplete="email"
                              />
                            </Form.Item>

                            <Form.Item
                              name="password"
                              label={<span className="login-form-label">Password</span>}
                              rules={[{ required: true, message: "Please enter your password" }]}
                              className="login-form-item"
                            >
                              <Input.Password
                                prefix={<LockOutlined className="login-input-prefix" />}
                                placeholder="Enter your password"
                                className="login-password"
                                autoComplete="current-password"
                              />
                            </Form.Item>

                            <Form.Item className="login-form-item">
                              <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="login-button login-button-primary"
                                block
                              >
                                {loading ? "Signing In..." : "Sign In"}
                              </Button>
                            </Form.Item>
                          </Form>

                          <div className="login-security">
                            <SafetyOutlined className="login-security-icon" />
                            <span className="login-security-text">
                              Your data is protected with enterprise-grade security
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Register Form */}
                      {activeTab === "register" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {error && (
                            <Alert
                              message="Registration Error"
                              description={error}
                              type="error"
                              showIcon
                              className="login-alert login-alert-error"
                              closable
                              onClose={() => setError("")}
                            />
                          )}

                          <Form
                            name="register"
                            onFinish={handleRegister}
                            layout="vertical"
                            className={`login-form ${loading ? "login-form-loading" : ""}`}
                            size="large"
                          >
                            <Form.Item
                              name="name"
                              label={<span className="login-form-label">Full Name</span>}
                              rules={[{ required: true, message: "Please enter your full name" }]}
                              className="login-form-item"
                            >
                              <Input
                                prefix={<UserOutlined className="login-input-prefix" />}
                                placeholder="Enter your full name"
                                className="login-input"
                                autoComplete="name"
                              />
                            </Form.Item>

                            <Form.Item
                              name="email"
                              label={<span className="login-form-label">Email Address</span>}
                              rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                              ]}
                              className="login-form-item"
                            >
                              <Input
                                prefix={<MailOutlined className="login-input-prefix" />}
                                placeholder="Enter your email address"
                                className="login-input"
                                autoComplete="email"
                              />
                            </Form.Item>

                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  name="password"
                                  label={<span className="login-form-label">Password</span>}
                                  rules={[
                                    { required: true, message: "Please enter password" },
                                    { min: 8, message: "Password must be at least 8 characters" },
                                    {
                                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                      message: "Password must contain uppercase, lowercase and number",
                                    },
                                  ]}
                                  className="login-form-item"
                                >
                                  <Input.Password
                                    prefix={<LockOutlined className="login-input-prefix" />}
                                    placeholder="Create password"
                                    className="login-password"
                                    autoComplete="new-password"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  name="confirmPassword"
                                  label={<span className="login-form-label">Confirm Password</span>}
                                  dependencies={["password"]}
                                  rules={[
                                    { required: true, message: "Please confirm password" },
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                          return Promise.resolve()
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"))
                                      },
                                    }),
                                  ]}
                                  className="login-form-item"
                                >
                                  <Input.Password
                                    prefix={<LockOutlined className="login-input-prefix" />}
                                    placeholder="Confirm password"
                                    className="login-password"
                                    autoComplete="new-password"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item
                              name="phone"
                              label={<span className="login-form-label">Phone Number</span>}
                              rules={[
                                { required: true, message: "Please enter phone number" },
                                {
                                  pattern: /^\+?[\d\s\-$$$$]+$/,
                                  message: "Please enter a valid phone number",
                                },
                              ]}
                              className="login-form-item"
                            >
                              <Input
                                prefix={<PhoneOutlined className="login-input-prefix" />}
                                placeholder="Enter phone number"
                                className="login-input"
                                autoComplete="tel"
                              />
                            </Form.Item>

                            <Form.Item
                              name="company"
                              label={<span className="login-form-label">Company Name (Optional)</span>}
                              className="login-form-item"
                            >
                              <Input
                                prefix={<BankOutlined className="login-input-prefix" />}
                                placeholder="Enter your company name"
                                className="login-input"
                                autoComplete="organization"
                              />
                            </Form.Item>

                            <Form.Item className="login-form-item">
                              <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="login-button login-button-primary"
                                block
                              >
                                {loading ? "Creating Account..." : "Create Account"}
                              </Button>
                            </Form.Item>
                          </Form>

                          <div className="login-security">
                            <CheckCircleOutlined className="login-security-icon" />
                            <span className="login-security-text">
                              By signing up, you agree to our Terms of Service and Privacy Policy
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <Divider className="login-divider">
                        <span className="login-divider-text">Need Help?</span>
                      </Divider>

                      <div className="login-footer-links">
                        <Paragraph className="login-footer-text">
                          Forgot your password?{" "}
                          <a href="#" className="login-footer-link">
                            Reset it here
                          </a>
                        </Paragraph>
                        <Paragraph className="login-footer-text">
                          Need support?{" "}
                          <a href="#" className="login-footer-link">
                            Contact our team
                          </a>
                        </Paragraph>
                      </div>

                      <div className="login-theme-toggle">
                        <Button
                          onClick={toggleTheme}
                          className="login-theme-button"
                          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                        >
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Login
