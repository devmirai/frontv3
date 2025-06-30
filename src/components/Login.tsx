import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, message, Row, Col, Tabs, Select, Alert } from 'antd';
import { UserOutlined, LockOutlined, RobotOutlined, ArrowLeftOutlined, MailOutlined, TeamOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
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
        <span className="text-base font-medium px-4 py-2">
          Sign In
        </span>
      ),
      children: (
        <div className="space-y-6">
          {error && (
            <Alert
              message="Authentication Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}
          
          <Form
            name="login"
            onFinish={onLogin}
            layout="vertical"
            size="large"
            className="space-y-4"
          >
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
                className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <div></div>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-300">
                Forgot your password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {loading ? 'Signing In...' : 'Sign In to Your Account'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    },
    {
      key: 'register',
      label: (
        <span className="text-base font-medium px-4 py-2">
          Sign Up
        </span>
      ),
      children: (
        <div className="space-y-6">
          {error && (
            <Alert
              message="Registration Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}
          
          <Form
            name="register"
            onFinish={onRegister}
            layout="vertical"
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="role"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Account Type</span>}
              rules={[{ required: true, message: 'Please select account type!' }]}
            >
              <Select
                placeholder="Select your account type"
                className="h-12 rounded-xl"
                style={{ borderRadius: '12px' }}
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
                className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                    className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                    className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="apellidoMaterno"
                            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Mother's Last Name</span>}
                          >
                            <Input 
                              placeholder="Mother's last name"
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
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
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="nacimiento"
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium">Date of Birth</span>}
                        rules={[{ required: true, message: 'Please enter your date of birth!' }]}
                      >
                        <Input 
                          prefix={<CalendarOutlined className="text-gray-400" />}
                          type="date"
                          className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                          className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                              className="h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                          rows={4}
                          placeholder="Brief description of your company..."
                          className="rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300"
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
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {loading ? 'Creating Account...' : 'Create Your Account'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    }
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Content className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <Row gutter={[64, 64]} align="middle" className="min-h-screen">
            {/* Left Side - Branding */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left space-y-8"
              >
                {/* Logo */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <RobotOutlined className="text-3xl text-white" />
                  </div>
                  <Title level={1} className="mb-0 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    mirAI
                  </Title>
                </div>
                
                {/* Heading */}
                <div className="space-y-6">
                  <Title level={2} className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                    {activeTab === 'login' ? 'Welcome Back to the Future of' : 'Join the Future of'}{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      AI Interviews
                    </span>
                  </Title>
                  
                  <Paragraph className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                    {activeTab === 'login' 
                      ? 'Sign in to access your AI-powered interview platform and continue transforming your recruitment process.'
                      : 'Create your account and start experiencing intelligent interviews powered by cutting-edge AI technology.'
                    }
                  </Paragraph>
                </div>

                {/* Features List */}
                <div className="hidden lg:block mt-12 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">AI-powered personalized questions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Real-time intelligent evaluation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Comprehensive performance insights</span>
                  </div>
                </div>

                {/* Mirabot Illustration */}
                <div className="hidden lg:block mt-12">
                  <div className="relative max-w-md">
                    <img 
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                      alt="AI Assistant"
                      className="w-full rounded-3xl shadow-2xl"
                    />
                    <div className="absolute -bottom-6 left-8 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <RobotOutlined className="text-indigo-600 text-xl" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          mirAI: Ready to assist!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>

            {/* Right Side - Auth Form */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-md">
                  {/* Back Button */}
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    className="mb-8 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    Back to Home
                  </Button>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                    {/* Form Header */}
                    <div className="text-center mb-8 p-6 pb-0">
                      <Title level={3} className="mb-4 text-gray-900 dark:text-white">
                        {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
                      </Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 text-base">
                        {activeTab === 'login' 
                          ? 'Enter your credentials to access the platform'
                          : 'Join thousands of users already using mirAI'
                        }
                      </Paragraph>
                    </div>

                    {/* Auth Tabs */}
                    <div className="px-6">
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
                    <div className="px-6 py-4">
                      <Divider>
                        <span className="text-gray-400 dark:text-gray-500 text-sm">Secure Authentication</span>
                      </Divider>
                    </div>

                    {/* Security Notice */}
                    <div className="mx-6 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">🔒</span>
                        </div>
                        <div>
                          <Paragraph className="text-blue-800 dark:text-blue-300 mb-1 font-medium text-sm">
                            Your data is secure
                          </Paragraph>
                          <Paragraph className="text-blue-700 dark:text-blue-400 mb-0 text-xs">
                            We use industry-standard encryption to protect your information.
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </Card>
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