import React from 'react';
import { Layout, Button, Typography, Row, Col, Card, Space, Statistic, Divider } from 'antd';
import { 
  RobotOutlined, 
  BulbOutlined, 
  ClockCircleOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  HeartOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <RobotOutlined className="text-5xl text-indigo-600" />,
      title: 'AI-Powered Questions',
      description: 'Generate personalized technical and behavioral questions tailored to each role and candidate profile with advanced machine learning algorithms.',
      color: 'indigo'
    },
    {
      icon: <BulbOutlined className="text-5xl text-emerald-600" />,
      title: 'Smart Evaluation',
      description: 'Advanced AI analyzes responses in real-time and provides detailed feedback on candidate performance, skills assessment, and cultural fit.',
      color: 'emerald'
    },
    {
      icon: <ClockCircleOutlined className="text-5xl text-blue-600" />,
      title: 'Asynchronous Interviews',
      description: 'Conduct interviews on your schedule. Candidates can complete assessments at their convenience, saving valuable time for everyone.',
      color: 'blue'
    },
    {
      icon: <TeamOutlined className="text-5xl text-purple-600" />,
      title: 'Recruiter Dashboard',
      description: 'Comprehensive analytics and insights dashboard to make informed hiring decisions quickly and efficiently with data-driven recommendations.',
      color: 'purple'
    }
  ];

  const stats = [
    { 
      title: 'Interviews Conducted', 
      value: 12500, 
      suffix: '+', 
      icon: <CheckCircleOutlined className="text-green-600" />,
      description: 'Successful interviews completed'
    },
    { 
      title: 'Companies Trust Us', 
      value: 250, 
      suffix: '+', 
      icon: <StarOutlined className="text-yellow-600" />,
      description: 'Active enterprise clients'
    },
    { 
      title: 'Time Saved', 
      value: 85, 
      suffix: '%', 
      icon: <ClockCircleOutlined className="text-blue-600" />,
      description: 'Reduction in hiring time'
    },
    { 
      title: 'Accuracy Rate', 
      value: 94, 
      suffix: '%', 
      icon: <TrophyOutlined className="text-purple-600" />,
      description: 'Interview assessment accuracy'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Talent, TechCorp",
      content: "mirAI transformed our hiring process. We've reduced time-to-hire by 60% while improving candidate quality.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100"
    },
    {
      name: "Michael Chen",
      role: "CEO, StartupXYZ",
      content: "The AI-powered insights help us identify the best candidates faster than ever before. Game-changing technology.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100"
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director, GlobalTech",
      content: "Our candidates love the modern interview experience, and we get detailed analytics to make better decisions.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <Layout className="main-layout">
      {/* Enhanced Header */}
      <Header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <RobotOutlined className="text-xl text-white" />
            </div>
            <Title level={3} className="mb-0 font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              mirAI
            </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Space size="large" className="hidden md:flex">
              <Button type="text" size="large" className="font-medium hover:text-indigo-600 transition-colors duration-300">
                Features
              </Button>
              <Button type="text" size="large" className="font-medium hover:text-indigo-600 transition-colors duration-300">
                Pricing
              </Button>
              <Button type="text" size="large" className="font-medium hover:text-indigo-600 transition-colors duration-300">
                About
              </Button>
              <ThemeToggle />
              <Button 
                type="text" 
                size="large" 
                onClick={() => navigate('/login')}
                className="font-medium hover:text-indigo-600 transition-colors duration-300"
              >
                Sign In
              </Button>
              <Button 
                type="primary" 
                size="large"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </Space>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <Button 
                type="primary" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 rounded-xl"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), 
                               radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
            }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20">
            <Row gutter={[64, 64]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants}>
                    <Title className="text-5xl lg:text-7xl font-black leading-tight text-gray-900 dark:text-white mb-6">
                      The Future of{' '}
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI Interviews
                      </span>
                    </Title>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Paragraph className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-2xl">
                      mirAI revolutionizes hiring with intelligent interview assistance. Generate personalized questions, 
                      evaluate candidates with AI precision, and make better hiring decisions faster than ever before.
                    </Paragraph>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Space size="large" className="flex flex-wrap">
                      <Button 
                        type="primary" 
                        size="large" 
                        className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                        icon={<RocketOutlined />}
                        onClick={() => navigate('/login')}
                      >
                        Start Free Trial
                      </Button>
                      <Button 
                        size="large" 
                        className="h-16 px-10 text-lg font-bold border-2 border-indigo-200 hover:border-indigo-400 dark:border-indigo-700 dark:hover:border-indigo-500 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                        icon={<PlayCircleOutlined />}
                      >
                        Watch Demo
                      </Button>
                    </Space>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-8">
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>Free 14-day trial</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutlined className="text-blue-500" />
                        <span>No credit card required</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GlobalOutlined className="text-purple-500" />
                        <span>Used by 250+ companies</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </Col>

              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative max-w-lg mx-auto">
                    {/* Main Image */}
                    <div className="relative z-10">
                      <img 
                        src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
                        alt="AI Interview Assistant"
                        className="w-full rounded-3xl shadow-2xl"
                      />
                    </div>

                    {/* Floating Cards */}
                    <motion.div 
                      className="absolute -top-6 -left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <CheckCircleOutlined className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">94% Accuracy</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">AI Assessment</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <ClockCircleOutlined className="text-blue-600 text-lg" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">85% Faster</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Hiring Process</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="absolute top-1/2 -left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <RobotOutlined className="text-indigo-600 text-2xl" />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">AI-Powered</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Smart Questions</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Trusted by Industry Leaders
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of companies that have transformed their hiring process with mirAI's intelligent interview platform.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <div className="mb-4">
                        <div className="text-4xl mb-3">{stat.icon}</div>
                        <Statistic
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{ 
                            color: isDarkMode ? '#f1f5f9' : '#1f2937', 
                            fontSize: '3rem', 
                            fontWeight: 'bold',
                            lineHeight: 1.2
                          }}
                          className="mb-2"
                        />
                        <Title level={4} className="text-gray-900 dark:text-white font-bold mb-2">
                          {stat.title}
                        </Title>
                        <Paragraph className="text-gray-600 dark:text-gray-400 text-sm mb-0">
                          {stat.description}
                        </Paragraph>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Title level={2} className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">mirAI</span>?
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our AI-powered platform streamlines the entire interview process with intelligent automation, 
                comprehensive analytics, and seamless candidate experience.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white dark:bg-gray-900 group">
                      <div className="text-center">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <Title level={4} className="mb-4 text-gray-900 dark:text-white font-bold text-xl">
                          {feature.title}
                        </Title>
                        <Paragraph className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </Paragraph>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                What Our Clients Say
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover how companies worldwide are transforming their hiring process with mirAI.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} lg={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <div className="text-center">
                        <div className="mb-4">
                          <img 
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mx-auto mb-4 shadow-lg"
                          />
                          <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                              <StarOutlined key={i} className="text-yellow-400 text-lg" />
                            ))}
                          </div>
                        </div>
                        <Paragraph className="text-gray-700 dark:text-gray-300 italic text-lg mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </Paragraph>
                        <div>
                          <Title level={5} className="text-gray-900 dark:text-white mb-1">
                            {testimonial.name}
                          </Title>
                          <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                            {testimonial.role}
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), 
                               radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`
            }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <ThunderboltOutlined className="text-8xl text-white mb-6" />
              </div>
              <Title level={1} className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Ready to Transform Your Hiring Process?
              </Title>
              <Paragraph className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of companies already using mirAI to find the best talent faster. 
                Start your free trial today and experience the future of AI-powered interviews.
              </Paragraph>
              <Space size="large" className="flex flex-wrap justify-center">
                <Button 
                  type="primary" 
                  size="large" 
                  className="h-16 px-12 text-lg font-bold bg-white text-indigo-600 border-white hover:bg-gray-50 hover:text-indigo-700 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  icon={<RocketOutlined />}
                  onClick={() => navigate('/login')}
                >
                  Start Your Free Trial
                </Button>
                <Button 
                  size="large" 
                  className="h-16 px-12 text-lg font-bold text-white border-2 border-white hover:bg-white hover:text-indigo-600 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  ghost
                >
                  Contact Sales
                </Button>
              </Space>
              
              <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <CheckCircleOutlined />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartOutlined />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleOutlined />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Content>

      {/* Enhanced Footer */}
      <Footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Row gutter={[48, 32]}>
            <Col xs={24} md={8}>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <RobotOutlined className="text-2xl text-white" />
                  </div>
                  <Title level={3} className="mb-0 text-white font-black">
                    mirAI
                  </Title>
                </div>
                <Paragraph className="text-gray-400 leading-relaxed">
                  AI-powered interview platform helping companies make better hiring decisions 
                  through intelligent automation and data-driven insights.
                </Paragraph>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <div className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <GlobalOutlined className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <TeamOutlined className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <StarOutlined className="text-white" />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[32, 32]}>
                <Col xs={12} md={6}>
                  <Title level={5} className="text-white mb-6 font-bold">Product</Title>
                  <ul className="space-y-3">
                    {['Features', 'Pricing', 'API Documentation', 'Integrations', 'Security'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <Title level={5} className="text-white mb-6 font-bold">Company</Title>
                  <ul className="space-y-3">
                    {['About Us', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <Title level={5} className="text-white mb-6 font-bold">Support</Title>
                  <ul className="space-y-3">
                    {['Help Center', 'Contact Support', 'Status Page', 'Community', 'Training'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <Title level={5} className="text-white mb-6 font-bold">Legal</Title>
                  <ul className="space-y-3">
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Compliance'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
          
          <Divider className="border-gray-700 my-12" />
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Paragraph className="text-gray-400 mb-0">
              © 2024 mirAI Interview Platform. All rights reserved.
            </Paragraph>
            <div className="flex items-center space-x-6 text-gray-400">
              <span>Made with</span>
              <HeartOutlined className="text-red-500" />
              <span>for better hiring</span>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Landing;