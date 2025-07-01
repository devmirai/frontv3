"use client"

import type React from "react"
import { useState } from "react"
import { Layout, Button, Typography, Row, Col, Card, Statistic, Divider, Drawer } from "antd"
import {
  RobotOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  HeartOutlined,
  RocketOutlined,
  MenuOutlined,
  CloseOutlined,
  SafetyOutlined,
  UserOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  AimOutlined,
  FireOutlined,
  CrownOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import ThemeToggle from "./ThemeToggle"

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const features = [
    {
      icon: <RobotOutlined className="text-6xl text-indigo-600" />,
      title: "AI-Powered Questions",
      description:
        "Generate personalized technical and behavioral questions tailored to each role and candidate profile with advanced machine learning algorithms that adapt to your hiring needs.",
      color: "indigo",
    },
    {
      icon: <BulbOutlined className="text-6xl text-emerald-600" />,
      title: "Smart Evaluation",
      description:
        "Advanced AI analyzes responses in real-time and provides detailed feedback on candidate performance, skills assessment, and cultural fit with comprehensive scoring metrics.",
      color: "emerald",
    },
    {
      icon: <ClockCircleOutlined className="text-6xl text-blue-600" />,
      title: "Asynchronous Interviews",
      description:
        "Conduct interviews on your schedule. Candidates can complete assessments at their convenience, saving valuable time for everyone while maintaining interview quality.",
      color: "blue",
    },
    {
      icon: <BarChartOutlined className="text-6xl text-purple-600" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and insights dashboard to make informed hiring decisions quickly and efficiently with data-driven recommendations and performance tracking.",
      color: "purple",
    },
  ]

  const stats = [
    {
      title: "Interviews Conducted",
      value: 12500,
      suffix: "+",
      icon: <CheckCircleOutlined className="text-green-600 text-3xl" />,
      description: "Successful interviews completed",
    },
    {
      title: "Companies Trust Us",
      value: 250,
      suffix: "+",
      icon: <CrownOutlined className="text-yellow-600 text-3xl" />,
      description: "Active enterprise clients",
    },
    {
      title: "Time Saved",
      value: 85,
      suffix: "%",
      icon: <ThunderboltOutlined className="text-blue-600 text-3xl" />,
      description: "Reduction in hiring time",
    },
    {
      title: "Accuracy Rate",
      value: 94,
      suffix: "%",
      icon: <AimOutlined className="text-purple-600 text-3xl" />,
      description: "Interview assessment accuracy",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Talent, TechCorp",
      content:
        "mirAI transformed our hiring process completely. We've reduced time-to-hire by 60% while improving candidate quality significantly. The AI insights are incredibly accurate.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CEO, StartupXYZ",
      content:
        "The AI-powered insights help us identify the best candidates faster than ever before. This is truly game-changing technology that every modern company needs.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director, GlobalTech",
      content:
        "Our candidates love the modern interview experience, and we get detailed analytics to make better hiring decisions. The ROI has been exceptional.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100",
      rating: 5,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const navigationItems = [
    {
      label: "Home",
      href: "#home",
      icon: <HomeOutlined className="text-lg" />,
      description: "Back to top",
    },
    {
      label: "Features",
      href: "#features",
      icon: <BulbOutlined className="text-lg" />,
      description: "Explore our capabilities",
    },
    {
      label: "Pricing",
      href: "#pricing",
      icon: <DollarOutlined className="text-lg" />,
      description: "View pricing plans",
    },
    {
      label: "About",
      href: "#about",
      icon: <InfoCircleOutlined className="text-lg" />,
      description: "Learn about mirAI",
    },
    {
      label: "Contact",
      href: "#contact",
      icon: <PhoneOutlined className="text-lg" />,
      description: "Get in touch",
    },
  ]

  return (
    <Layout className="main-layout">
      {/* Enhanced Navigation Header */}
z      <Header className="header-layout bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <div className="logo-icon">
                <RobotOutlined />
              </div>
              <div>
                <span className="logo-text">mirAI</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">Interview Platform</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden lg:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Action Buttons & Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  type="text"
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button
                  type="primary"
                  className="btn-gradient"
                  onClick={() => navigate("/login")}
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
                className="lg:hidden flex items-center justify-center ml-2"
              />
            </div>
          </div>
        </div>
      </Header>

      {/* Enhanced Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="sidebar-logo">
            <div className="logo-icon">
              <RobotOutlined />
            </div>
            <div className="logo-content">
              <span className="logo-text">mirAI</span>
              <span className="logo-subtitle">Interview Platform</span>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={360}
        className="lg:hidden enhanced-drawer mobile-drawer"
        closeIcon={<CloseOutlined className="text-xl" />}
      >
        <div className="drawer-content">
          {/* Enhanced Navigation Links */}
          <div className="form-section">
            <div className="section-title">Navigation</div>
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="setting-item cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    <div className="setting-info">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-base">{item.label}</div>
                          <div className="setting-description">{item.description}</div>
                        </div>
                      </div>
                    </div>
                    <ArrowRightOutlined className="text-gray-400 text-sm" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Divider className="border-gray-300 dark:border-gray-600" />

          {/* Enhanced Action Buttons */}
          <div className="form-section">
            <div className="section-title">Account</div>
            <div className="space-y-3">
              <Button
                type="text"
                size="large"
                block
                onClick={() => {
                  navigate("/login")
                  setMobileMenuVisible(false)
                }}
                className="action-button-large text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <UserOutlined className="text-lg" />
                    <span className="text-lg font-semibold">Sign In</span>
                  </div>
                  <ArrowRightOutlined className="text-sm opacity-50" />
                </div>
              </Button>

              <Button
                type="primary"
                size="large"
                block
                className="btn-gradient action-button-large"
                icon={<RocketOutlined />}
                onClick={() => {
                  navigate("/login")
                  setMobileMenuVisible(false)
                }}
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Enhanced Status Card */}
          <div className="mirabot-status-card">
            <div className="status-content">
              <div className="status-avatar">
                <RobotOutlined />
                <div className="status-indicator"></div>
              </div>
              <div className="status-info">
                <div className="status-title">mirAI Assistant</div>
                <div className="status-description">
                  AI-powered interview platform ready to transform your hiring process
                </div>
                <div className="status-stats">
                  <div className="stat-item">
                    <div className="stat-number">250+</div>
                    <div className="stat-label">Companies</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">12.5K+</div>
                    <div className="stat-label">Interviews</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">94%</div>
                    <div className="stat-label">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Content className="pt-20">
        {/* Enhanced Hero Section */}
        <section className="hero-section">
          <div className="container">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8 text-center lg:text-left"
                >
                  <motion.div variants={itemVariants}>
                    <Title className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight text-gray-900 dark:text-white mb-8">
                      The Future of <span className="gradient-text">AI Interviews</span>
                    </Title>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Paragraph className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto lg:mx-0 mb-8">
                      mirAI revolutionizes hiring with intelligent interview assistance. Generate personalized
                      questions, evaluate candidates with AI precision, and make better hiring decisions faster than
                      ever before.
                    </Paragraph>
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8">
                      <Button
                        type="primary"
                        size="large"
                        className="cta-button h-20 px-12 text-xl"
                        icon={<RocketOutlined />}
                        onClick={() => navigate("/login")}
                      >
                        Start Free Trial
                      </Button>
                      <Button
                        size="large"
                        className="h-20 px-12 text-xl font-bold border-2 border-indigo-200 hover:border-indigo-400 dark:border-indigo-700 dark:hover:border-indigo-500 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                        icon={<PlayCircleOutlined />}
                      >
                        Watch Demo
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-8 text-base text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        <CheckCircleOutlined className="text-green-500 text-lg" />
                        <span className="font-semibold">Free 14-day trial</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <SafetyOutlined className="text-blue-500 text-lg" />
                        <span className="font-semibold">No credit card required</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GlobalOutlined className="text-purple-500 text-lg" />
                        <span className="font-semibold">Used by 250+ companies</span>
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
                  className="relative mt-12 lg:mt-0"
                >
                  <div className="relative max-w-lg mx-auto">
                    {/* Main Hero Image */}
                    <div className="relative z-10">
                      <img
                        src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop"
                        alt="AI Interview Assistant"
                        className="w-full rounded-3xl shadow-2xl"
                      />
                    </div>

                    {/* Enhanced Floating Cards */}
                    <motion.div
                      className="floating-card absolute -top-6 -left-6 sm:-top-8 sm:-left-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <CheckCircleOutlined className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">94% Accuracy</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">AI Assessment</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="floating-card absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <ThunderboltOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">85% Faster</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Hiring Process</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="floating-card absolute top-1/2 -left-10 hidden sm:block"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <div className="flex items-center space-x-4">
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

        {/* Enhanced Stats Section */}
        <section className="section-padding bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Title level={2} className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">
                Trusted by Industry Leaders
              </Title>
              <Paragraph className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Join thousands of companies that have transformed their hiring process with mirAI's intelligent
                interview platform and cutting-edge AI technology.
              </Paragraph>
            </motion.div>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="enhanced-stats-card">
                    <div className="stats-header">
                      <div className="stats-icon text-indigo-600">{stat.icon}</div>
                    </div>
                    <div className="stats-content">
                      <Statistic
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: isDarkMode ? "#f1f5f9" : "#1f2937",
                          fontSize: "clamp(2.5rem, 4vw, 4rem)",
                          fontWeight: "900",
                          lineHeight: 1,
                          fontFamily: "Poppins, sans-serif",
                        }}
                        className="mb-4"
                      />
                      <Title level={4} className="stats-title">
                        {stat.title}
                      </Title>
                      <Paragraph className="text-gray-600 dark:text-gray-400 mb-0 leading-relaxed">
                        {stat.description}
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <Title level={2} className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">
                Why Choose <span className="gradient-text">mirAI</span>?
              </Title>
              <Paragraph className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our AI-powered platform streamlines the entire interview process with intelligent automation,
                comprehensive analytics, and seamless candidate experience that delivers results.
              </Paragraph>
            </motion.div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="feature-card group">
                    <div className="text-center">
                      <div className="mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {feature.icon}
                      </div>
                      <Title level={3} className="mb-6 text-gray-900 dark:text-white font-bold text-2xl">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="section-padding bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Title level={2} className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8">
                What Our Clients Say
              </Title>
              <Paragraph className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover how companies worldwide are transforming their hiring process with mirAI and achieving
                unprecedented results in talent acquisition.
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
                    <Card className="testimonial-card">
                      <div className="text-center">
                        <div className="mb-6">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg object-cover"
                          />
                          <div className="flex justify-center mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <StarOutlined key={i} className="text-yellow-400 text-xl mx-1" />
                            ))}
                          </div>
                        </div>
                        <Paragraph className="text-gray-700 dark:text-gray-300 italic text-xl mb-8 leading-relaxed font-medium">
                          "{testimonial.content}"
                        </Paragraph>
                        <div>
                          <Title level={4} className="text-gray-900 dark:text-white mb-2 text-xl">
                            {testimonial.name}
                          </Title>
                          <Paragraph className="text-gray-600 dark:text-gray-400 mb-0 font-medium">
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

        {/* Enhanced CTA Section */}
        <section className="cta-section section-padding">
          <div className="container text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-12">
                <FireOutlined className="text-9xl text-white mb-8 animate-pulse" />
              </div>
              <Title level={1} className="text-5xl lg:text-7xl font-black text-white mb-10 leading-tight">
                Ready to Transform Your Hiring Process?
              </Title>
              <Paragraph className="text-2xl lg:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
                Join hundreds of companies already using mirAI to find the best talent faster. Start your free trial
                today and experience the future of AI-powered interviews.
              </Paragraph>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button
                  type="primary"
                  size="large"
                  className="h-20 px-16 text-2xl font-bold bg-white text-indigo-600 border-white hover:bg-gray-50 hover:text-indigo-700 rounded-3xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                  icon={<RocketOutlined />}
                  onClick={() => navigate("/login")}
                >
                  Start Your Free Trial
                </Button>
                <Button
                  size="large"
                  className="h-20 px-16 text-2xl font-bold text-white border-2 border-white hover:bg-white hover:text-indigo-600 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                  ghost
                >
                  Contact Sales
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-12 text-white/80 text-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircleOutlined className="text-xl" />
                  <span className="font-semibold">14-day free trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HeartOutlined className="text-xl" />
                  <span className="font-semibold">No setup fees</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafetyOutlined className="text-xl" />
                  <span className="font-semibold">Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Content>

      {/* Enhanced Footer */}
      <Footer className="bg-gray-900 dark:bg-black text-white section-padding">
        <div className="container">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <div className="space-y-8">
                <div className="sidebar-logo">
                  <div className="logo-icon">
                    <RobotOutlined />
                  </div>
                  <div className="logo-content">
                    <Title level={2} className="logo-text text-white mb-0">
                      mirAI
                    </Title>
                    <div className="logo-subtitle text-gray-400">Interview Platform</div>
                  </div>
                </div>
                <Paragraph className="text-gray-400 leading-relaxed text-lg">
                  AI-powered interview platform helping companies make better hiring decisions through intelligent
                  automation and data-driven insights that transform recruitment.
                </Paragraph>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <div className="w-12 h-12 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                    <GlobalOutlined className="text-white text-lg" />
                  </div>
                  <div
                    className="w-12 h-12 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-
center cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <TeamOutlined className="text-white text-lg" />
                  </div>
                  <div className="w-12 h-12 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                    <StarOutlined className="text-white text-lg" />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[32, 32]}>
                <Col xs={12} sm={6}>
                  <Title level={4} className="text-white mb-8 font-bold text-xl">
                    Product
                  </Title>
                  <ul className="space-y-4">
                    {["Features", "Pricing", "API Documentation", "Integrations", "Security"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-300 font-medium text-base hover:underline"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={4} className="text-white mb-8 font-bold text-xl">
                    Company
                  </Title>
                  <ul className="space-y-4">
                    {["About Us", "Blog", "Careers", "Press", "Partners"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-300 font-medium text-base hover:underline"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={4} className="text-white mb-8 font-bold text-xl">
                    Support
                  </Title>
                  <ul className="space-y-4">
                    {["Help Center", "Contact Support", "Status Page", "Community", "Training"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-300 font-medium text-base hover:underline"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={12} sm={6}>
                  <Title level={4} className="text-white mb-8 font-bold text-xl">
                    Legal
                  </Title>
                  <ul className="space-y-4">
                    {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Compliance"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-300 font-medium text-base hover:underline"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider className="border-gray-700 my-16" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <Paragraph className="text-gray-400 mb-0 text-base">
              © 2024 mirAI Interview Platform. All rights reserved.
            </Paragraph>
            <div className="flex items-center space-x-8 text-gray-400 text-base">
              <span>Made with</span>
              <HeartOutlined className="text-red-500 text-lg" />
              <span>for better hiring</span>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default Landing
