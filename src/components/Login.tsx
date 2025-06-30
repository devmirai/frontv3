import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Row, Col, Tabs, Select, Alert, Divider } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  RobotOutlined, 
  ArrowLeftOutlined, 
  MailOutlined, 
  TeamOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone, 
  MoonOutlined, 
  SunOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Rol } from '../types/api';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const from = location.state?.from?.pathname || '/';

  const onLogin = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(values);
      if (success) {
        navigate(from === '/' ? '/dashboard' : from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await register(values);
      if (success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Sign In',
      children: (
        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                message="Authentication Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                className="rounded-xl shadow-sm"
              />
            </motion.div>
          )}
          
          <Form
            name="login"
            onFinish={onLogin}
            layout="vertical"
            size="large"
            className="space-y-6"
            autoComplete="on"
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium text-base">Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
              className="mb-5"
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400 text-lg" />}
                placeholder="Enter your email address"
                className="login-input transition-all duration-300 hover:border-indigo-400"
                autoComplete="username"
                id="login-email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <div className="flex justify-between w-full">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 text-sm">
                    Forgot password?
                  </a>
                </div>
              }
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="login-input"
                autoComplete="current-password"
                id="login-password"
              />
            </Form.Item>

            <Form.Item className="mb-2 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button w-full relative overflow-hidden group"
                style={{ 
                  height: '56px', 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                }}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 transform bg-white/20 origin-left group-hover:scale-x-100"></div>
                <span className="relative z-10">{loading ? 'Signing In...' : 'Sign In'}</span>
              </Button>
            </Form.Item>
          </Form>

          <div className="my-6">
            <Divider plain>
              <Text type="secondary">OR</Text>
            </Divider>
          </div>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <button 
              onClick={() => setActiveTab('register')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>

          <div className="security-statement mt-8">
            <div className="security-statement-text">
              <SafetyOutlined />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'register',
      label: 'Sign Up',
      children: (
        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                message="Registration Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                className="rounded-xl shadow-sm"
              />
            </motion.div>
          )}
          
          <Form
            name="register"
            onFinish={onRegister}
            layout="vertical"
            size="large"
            className="space-y-4"
            autoComplete="on"
          >
            <Form.Item
              name="role"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Account Type</span>}
              rules={[{ required: true, message: 'Please select account type!' }]}
            >
              <Select
                placeholder="Select your account type"
                className="login-select"
              >
                <Option value={Rol.USUARIO}>
                  <Space>
                    <UserOutlined />
                    Job Seeker
                  </Space>
                </Option>
                <Option value={Rol.EMPRESA}>
                  <Space>
                    <TeamOutlined />
                    Company/Recruiter
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email address"
                className="login-input"
                autoComplete="username"
                id="register-email"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={<span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>}
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Create password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="login-input"
                    autoComplete="new-password"
                    id="register-password"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label={<span className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</span>}
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="login-input"
                    autoComplete="new-password"
                    id="register-confirm-password"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) => {
                const role = getFieldValue('role');
                
                if (role === Rol.USUARIO) {
                  return (
                    <div className="space-y-4">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="nombre"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">First Name</span>}
                            rules={[{ required: true, message: 'Please enter your first name!' }]}
                          >
                            <Input 
                              prefix={<UserOutlined className="text-gray-400" />}
                              placeholder="First name"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="apellidoPaterno"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Last Name</span>}
                            rules={[{ required: true, message: 'Please enter your last name!' }]}
                          >
                            <Input 
                              placeholder="Last name"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="telefono"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Phone</span>}
                            rules={[{ required: true, message: 'Please enter your phone!' }]}
                          >
                            <Input 
                              prefix={<PhoneOutlined className="text-gray-400" />}
                              type="number"
                              placeholder="Phone number"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="nacimiento"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Date of Birth</span>}
                            rules={[{ required: true, message: 'Please enter your date of birth!' }]}
                          >
                            <Input 
                              prefix={<CalendarOutlined className="text-gray-400" />}
                              type="date"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="apellidoMaterno"
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium">Mother's Last Name</span>}
                      >
                        <Input 
                          placeholder="Mother's last name (optional)"
                          className="login-input"
                        />
                      </Form.Item>
                    </div>
                  );
                } else if (role === Rol.EMPRESA) {
                  return (
                    <div className="space-y-4">
                      <Form.Item
                        name="nombre"
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium">Company Name</span>}
                        rules={[{ required: true, message: 'Please enter company name!' }]}
                      >
                        <Input 
                          prefix={<TeamOutlined className="text-gray-400" />}
                          placeholder="Company name"
                          className="login-input"
                        />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="telefono"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Phone</span>}
                            rules={[{ required: true, message: 'Please enter phone!' }]}
                          >
                            <Input 
                              prefix={<PhoneOutlined className="text-gray-400" />}
                              placeholder="Phone number"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="direccion"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Address</span>}
                            rules={[{ required: true, message: 'Please enter address!' }]}
                          >
                            <Input 
                              prefix={<HomeOutlined className="text-gray-400" />}
                              placeholder="Company address"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="descripcion"
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium">Company Description</span>}
                        rules={[{ required: true, message: 'Please enter company description!' }]}
                      >
                        <Input.TextArea 
                          rows={3}
                          placeholder="Brief description of your company..."
                          className="login-input rounded-xl"
                          style={{ height: 'auto' }}
                        />
                      </Form.Item>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Form.Item className="mb-2 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button w-full"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          <div className="my-6">
            <Divider plain>
              <Text type="secondary">OR</Text>
            </Divider>
          </div>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <button 
              onClick={() => setActiveTab('login')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Sign in
            </button>
          </div>

          <div className="security-statement mt-8">
            <div className="security-statement-text">
              <SafetyOutlined />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout className="min-h-screen relative bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Add background pattern */}
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>
      
      <Content className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-7xl">
          <Row gutter={[48, 48]} align="middle" className="min-h-screen">
            {/* Left Side - Hero Section */}
            <Col xs={24} lg={10}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left space-y-8"
              >
                {/* Back to Home Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors cursor-pointer mb-6"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeftOutlined className="text-base" />
                  <span className="font-medium">Back to Home</span>
                </motion.div>

                {/* Logo and Branding */}
                <motion.div 
                  className="flex items-center space-x-3 mb-8"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.6 } }}
                  >
                    <RobotOutlined className="text-xl text-white" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="font-bold text-2xl text-gray-900 dark:text-white">mirAI</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Interview Platform</span>
                  </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="relative mx-auto lg:mx-0" style={{ maxWidth: "420px" }}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                      {/* Add subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      
                      <img 
                        src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                        alt="AI Interview Assistant"
                        className="w-full h-auto object-cover"
                      />
                      
                      {/* Add caption inside the image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                        <p className="text-white font-medium text-lg">
                          Transform your hiring process with AI
                        </p>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800 px-5 py-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-600 rounded-full p-2 text-white">
                          <RobotOutlined className="text-lg" />
                        </div>
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                          AI-Powered Interview Platform
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <Title className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Smart recruitment starts with 
                    <span className="text-indigo-600 dark:text-indigo-400"> intelligent interviews</span>
                  </Title>
                  
                  <Paragraph className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Join thousands of companies using AI to streamline their hiring process, reduce bias, and find the best talent efficiently.
                  </Paragraph>
                </motion.div>

                {/* Features */}
                <motion.div 
                  className="space-y-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {/*
                    { icon: CheckCircleOutlined, text: 'Personalized question generation' },
                    { icon: CheckCircleOutlined, text: 'Real-time candidate evaluation' },
                    { icon: CheckCircleOutlined, text: 'Data-driven hiring insights' }
                  */}
                </motion.div>
              </motion.div>
            </Col>

            {/* Right Side - Login Form */}
            <Col xs={24} lg={14}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-md">
                  <Card 
                    className="bg-white dark:bg-gray-800 border-0 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm"
                    style={{ 
                      boxShadow: isDarkMode ? 
                        '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 20px -5px rgba(79, 70, 229, 0.2)' : 
                        '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(79, 70, 229, 0.1)' 
                    }}
                  >
                    {/* Form Content */}
                    <div className="px-6 py-8">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Tabs
                          activeKey={activeTab}
                          onChange={setActiveTab}
                          items={tabItems}
                          centered
                          className="login-tabs"
                          tabBarStyle={{
                            marginBottom: 30,
                            borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
                            padding: '0 20px'
                          }}
                        />
                      </motion.div>
                    </div>
                  </Card>

                  {/* Theme Toggle */}
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button
                      type="text"
                      onClick={toggleTheme}
                      className="theme-toggle-button flex items-center space-x-2 px-5 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isDarkMode ? (
                        <>
                          <SunOutlined className="text-yellow-500 text-lg" />
                          <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                        </>
                      ) : (
                        <>
                          <MoonOutlined className="text-indigo-600 text-lg" />
                          <span className="text-gray-700">Dark Mode</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
