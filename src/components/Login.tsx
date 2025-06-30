import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, message, Row, Col, Tabs, Select, Alert } from 'antd';
import { UserOutlined, LockOutlined, RobotOutlined, ArrowLeftOutlined, MailOutlined, TeamOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
      label: (
        <span className="text-base font-semibold px-6 py-3">
          Sign In
        </span>
      ),
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
                prefix={<MailOutlined className="text-gray-400 text-lg" />}
                placeholder="Enter your email address"
                className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 dark:text-gray-300 font-semibold text-base">Password</span>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <div></div>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors duration-300 hover:underline">
                Forgot your password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 border-0 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                style={{ fontSize: '18px' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    <span>Signing In...</span>
                  </span>
                ) : (
                  'Sign In to Your Account'
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    },
    {
      key: 'register',
      label: (
        <span className="text-base font-semibold px-6 py-3">
          Sign Up
        </span>
      ),
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
                className="h-14 rounded-2xl"
                style={{ borderRadius: '16px', fontSize: '16px' }}
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
                prefix={<MailOutlined className="text-gray-400 text-lg" />}
                placeholder="Enter your email address"
                className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                style={{ fontSize: '16px' }}
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
                    prefix={<LockOutlined className="text-gray-400 text-lg" />}
                    placeholder="Create password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                    style={{ fontSize: '16px' }}
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
                    prefix={<LockOutlined className="text-gray-400 text-lg" />}
                    placeholder="Confirm password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                    style={{ fontSize: '16px' }}
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
                              prefix={<UserOutlined className="text-gray-400 text-lg" />}
                              placeholder="First name"
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                              prefix={<PhoneOutlined className="text-gray-400 text-lg" />}
                              type="number"
                              placeholder="Phone number"
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                          prefix={<CalendarOutlined className="text-gray-400 text-lg" />}
                          type="date"
                          className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                          style={{ fontSize: '16px' }}
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
                          prefix={<TeamOutlined className="text-gray-400 text-lg" />}
                          placeholder="Company name"
                          className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                          style={{ fontSize: '16px' }}
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
                              prefix={<PhoneOutlined className="text-gray-400 text-lg" />}
                              placeholder="Phone number"
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                              prefix={<HomeOutlined className="text-gray-400 text-lg" />}
                              placeholder="Company address"
                              className="h-14 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 text-base bg-gray-50/50 hover:bg-white focus:bg-white"
                              style={{ fontSize: '16px' }}
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
                          rows={4}
                          placeholder="Brief description of your company..."
                          className="rounded-2xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 bg-gray-50/50 hover:bg-white focus:bg-white"
                          style={{ fontSize: '16px' }}
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
                className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 border-0 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                style={{ fontSize: '18px' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  'Create Your Account'
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    }
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-6000"></div>
      </div>

      <Content className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-7xl">
          <Row gutter={[64, 64]} align="middle" className="min-h-screen">
            {/* Left Side - Branding */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center lg:text-left space-y-10"
              >
                {/* Logo */}
                <motion.div 
                  className="flex items-center justify-center lg:justify-start space-x-4 mb-12"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <RobotOutlined className="text-4xl text-white" />
                  </div>
                  <Title level={1} className="mb-0 text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    mirAI
                  </Title>
                </motion.div>
                
                {/* Heading */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Title level={2} className="text-4xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white mb-6">
                      {activeTab === 'login' ? 'Welcome Back to the Future of' : 'Join the Future of'}{' '}
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI Interviews
                      </span>
                    </Title>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Paragraph className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-medium">
                      {activeTab === 'login' 
                        ? 'Sign in to access your AI-powered interview platform and continue transforming your recruitment process.'
                        : 'Create your account and start experiencing intelligent interviews powered by cutting-edge AI technology.'
                      }
                    </Paragraph>
                  </motion.div>
                </div>

                {/* Features List */}
                <motion.div 
                  className="hidden lg:block mt-16 space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {[
                    { icon: '🤖', text: 'AI-powered personalized questions' },
                    { icon: '⚡', text: 'Real-time intelligent evaluation' },
                    { icon: '📊', text: 'Comprehensive performance insights' },
                    { icon: '🎯', text: 'Advanced skill assessment' }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Mirabot Illustration */}
                <motion.div 
                  className="hidden lg:block mt-16"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <div className="relative max-w-md">
                    <img 
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop"
                      alt="AI Assistant"
                      className="w-full rounded-3xl shadow-2xl"
                    />
                    <motion.div 
                      className="absolute -bottom-8 left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                    >
                      <div className="flex items-center space-x-4">
                        <RobotOutlined className="text-indigo-600 text-2xl" />
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">
                          mirAI: Ready to assist!
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>

            {/* Right Side - Auth Form */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-lg">
                  {/* Back Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button 
                      type="text" 
                      icon={<ArrowLeftOutlined />}
                      onClick={() => navigate('/')}
                      className="mb-8 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-300 font-semibold text-base px-6 py-3 h-auto rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50"
                    >
                      Back to Home
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                      {/* Form Header */}
                      <div className="text-center mb-10 p-8 pb-0">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <Title level={3} className="mb-6 text-gray-900 dark:text-white text-3xl font-bold">
                            {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
                          </Title>
                          <Paragraph className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                            {activeTab === 'login' 
                              ? 'Enter your credentials to access the platform'
                              : 'Join thousands of users already using mirAI'
                            }
                          </Paragraph>
                        </motion.div>
                      </div>

                      {/* Auth Tabs */}
                      <div className="px-8">
                        <Tabs
                          activeKey={activeTab}
                          onChange={setActiveTab}
                          items={tabItems}
                          centered
                          className="auth-tabs"
                          size="large"
                        />
                      </div>

                      {/* Divider */}
                      <div className="px-8 py-6">
                        <Divider>
                          <span className="text-gray-400 dark:text-gray-500 font-semibold">Secure Authentication</span>
                        </Divider>
                      </div>

                      {/* Security Notice */}
                      <motion.div 
                        className="mx-8 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                            <CheckCircleOutlined className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <Paragraph className="text-blue-800 dark:text-blue-300 mb-2 font-bold text-base">
                              Your data is secure
                            </Paragraph>
                            <Paragraph className="text-blue-700 dark:text-blue-400 mb-0 text-sm">
                              We use industry-standard encryption to protect your information.
                            </Paragraph>
                          </div>
                        </div>
                      </motion.div>
                    </Card>
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