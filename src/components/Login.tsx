import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, message, Row, Col, Tabs, Select, Alert } from 'antd';
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
  CheckCircleOutlined,
  ShieldCheckOutlined,
  ZapOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Rol } from '../types/api';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
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
        <div className="space-y-8">
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
                className="rounded-xl border-0 shadow-sm"
              />
            </motion.div>
          )}
          
          <Form
            name="login"
            onFinish={onLogin}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email address"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Password</span>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="login-input"
              />
            </Form.Item>

            <div className="flex justify-end mb-6">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-300 hover:underline">
                Forgot your password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button w-full"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center pt-6">
            <span className="text-gray-600 dark:text-gray-400 text-base">Don't have an account? </span>
            <button 
              onClick={() => setActiveTab('register')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300 hover:underline text-base"
            >
              Sign up here
            </button>
          </div>

          {/* Security Statement */}
          <div className="security-statement">
            <div className="security-statement-text">
              <ShieldCheckOutlined />
              <span>We use secure encryption to protect your data</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'register',
      label: 'Sign Up',
      children: (
        <div className="space-y-8">
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
                className="rounded-xl border-0 shadow-sm"
              />
            </motion.div>
          )}
          
          <Form
            name="register"
            onFinish={onRegister}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="role"
              label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Account Type</span>}
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
              label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email address"
                className="login-input"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Password</span>}
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
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Confirm Password</span>}
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
                    <div className="space-y-6">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="nombre"
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">First Name</span>}
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
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Last Name</span>}
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
                            name="apellidoMaterno"
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Mother's Last Name</span>}
                          >
                            <Input 
                              placeholder="Mother's last name"
                              className="login-input"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="telefono"
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Phone</span>}
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
                      </Row>
                      <Form.Item
                        name="nacimiento"
                        label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Date of Birth</span>}
                        rules={[{ required: true, message: 'Please enter your date of birth!' }]}
                      >
                        <Input 
                          prefix={<CalendarOutlined className="text-gray-400" />}
                          type="date"
                          className="login-input"
                        />
                      </Form.Item>
                    </div>
                  );
                } else if (role === Rol.EMPRESA) {
                  return (
                    <div className="space-y-6">
                      <Form.Item
                        name="nombre"
                        label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Company Name</span>}
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
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Phone</span>}
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
                            label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Address</span>}
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
                        label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Company Description</span>}
                        rules={[{ required: true, message: 'Please enter company description!' }]}
                      >
                        <Input.TextArea 
                          rows={3}
                          placeholder="Brief description of your company..."
                          className="login-input"
                          style={{ height: 'auto' }}
                        />
                      </Form.Item>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Form.Item className="mb-0">
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

          <div className="text-center pt-6">
            <span className="text-gray-600 dark:text-gray-400 text-base">Already have an account? </span>
            <button 
              onClick={() => setActiveTab('login')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300 hover:underline text-base"
            >
              Sign in here
            </button>
          </div>

          {/* Security Statement */}
          <div className="security-statement">
            <div className="security-statement-text">
              <ShieldCheckOutlined />
              <span>Your data is encrypted and secure with us</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900">
      <Content className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <Row gutter={[48, 48]} align="middle" className="min-h-screen">
            {/* Left Side - Hero Section */}
            <Col xs={24} lg={9}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left space-y-10"
              >
                {/* Back to Home Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-300 cursor-pointer mb-8"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeftOutlined className="text-lg" />
                  <span className="font-medium">Back to Home</span>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex justify-center lg:justify-start mb-10"
                >
                  <div className="relative">
                    <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                        alt="AI Interview Assistant"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div 
                      className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <div className="flex items-center space-x-3">
                        <RobotOutlined className="text-indigo-600 text-xl" />
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          AI-Powered
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="space-y-6"
                >
                  <Title level={1} className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-gray-900 dark:text-white mb-6">
                    Transform Your{' '}
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Interview Experience
                    </span>
                  </Title>
                  
                  <Paragraph className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    Join the future of recruitment with AI-powered interviews that provide intelligent insights and personalized assessments for better hiring decisions.
                  </Paragraph>
                </motion.div>

                {/* Features */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {[
                    { icon: ZapOutlined, text: 'AI-powered personalized questions', color: 'from-yellow-500 to-orange-600' },
                    { icon: BarChartOutlined, text: 'Real-time intelligent evaluation', color: 'from-blue-500 to-indigo-600' },
                    { icon: CheckCircleOutlined, text: 'Comprehensive performance insights', color: 'from-green-500 to-emerald-600' }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    >
                      <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                        <feature.icon />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Col>

            {/* Right Side - Login Form */}
            <Col xs={24} lg={15}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center lg:justify-center"
              >
                <div className="w-full max-w-lg">
                  <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                    {/* Logo in Form */}
                    <div className="text-center mb-10 pt-10">
                      <motion.div 
                        className="flex items-center justify-center space-x-4 mb-8"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <RobotOutlined className="text-2xl text-white" />
                        </div>
                        <Title level={2} className="mb-0 text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          mirAI
                        </Title>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <Title level={3} className="mb-4 text-gray-900 dark:text-white text-2xl font-bold">
                          Welcome Back
                        </Title>
                        <Paragraph className="text-gray-600 dark:text-gray-300 font-medium text-base">
                          Sign in to continue your journey with intelligent interviews
                        </Paragraph>
                      </motion.div>
                    </div>

                    {/* Form Content */}
                    <div className="px-10 pb-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <Tabs
                          activeKey={activeTab}
                          onChange={setActiveTab}
                          items={tabItems}
                          centered
                          className="login-tabs"
                          size="large"
                        />
                      </motion.div>
                    </div>
                  </Card>

                  {/* Theme Toggle */}
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <Button
                      type="text"
                      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                      onClick={toggleTheme}
                      className="theme-toggle-login"
                    >
                      <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
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