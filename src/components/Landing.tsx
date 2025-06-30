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
import "../styles/landing.css"

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
      icon: <HomeOutlined />,
      description: "Back to top",
    },
    {
      label: "Features",
      href: "#features",
      icon: <BulbOutlined />,
      description: "Explore our capabilities",
    },
    {
      label: "Pricing",
      href: "#pricing",
      icon: <DollarOutlined />,
      description: "View pricing plans",
    },
    {
      label: "About",
      href: "#about",
      icon: <InfoCircleOutlined />,
      description: "Learn about mirAI",
    },
    {
      label: "Contact",
      href: "#contact",
      icon: <PhoneOutlined />,
      description: "Get in touch",
    },
  ]

  return (
    <Layout className="main-layout">
      {/* Enhanced Navigation Header */}
      <Header className="landing-header">
        <div className="landing-header-content">
          {/* Logo Section */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <RobotOutlined />
              </div>
              <div className="landing-logo-content">
                <span className="landing-logo-text">mirAI</span>
                <span className="landing-logo-subtitle">Interview Platform</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="landing-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="landing-nav-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <span className="landing-nav-item-icon">{item.icon}</span>
                {item.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Action Buttons & Theme Toggle */}
          <div className="landing-header-actions">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                className="landing-action-button landing-signin-button"
                icon={<UserOutlined />}
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
                className="landing-action-button landing-cta-button"
                icon={<RocketOutlined />}
                onClick={() => navigate("/login")}
              >
                Start Free Trial
              </Button>
            </motion.div>
            <ThemeToggle />
            <Button
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="landing-menu-button"
            />
          </div>
        </div>
      </Header>

      {/* Enhanced Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <RobotOutlined />
            </div>
            <div className="landing-logo-content">
              <span className="landing-logo-text">mirAI</span>
              <span className="landing-logo-subtitle">Interview Platform</span>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={360}
        className="landing-drawer"
        closeIcon={<CloseOutlined />}
      >
        <div className="landing-drawer-content">
          {/* Enhanced Navigation Links */}
          <div className="landing-nav-section">
            <div className="landing-section-title">Navigation</div>
            <div className="landing-nav-items">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="landing-mobile-nav-item">
                    <div className="landing-mobile-nav-content">
                      <div className="landing-mobile-nav-icon">{item.icon}</div>
                      <div className="landing-mobile-nav-info">
                        <div className="landing-mobile-nav-title">{item.label}</div>
                        <div className="landing-mobile-nav-desc">{item.description}</div>
                      </div>
                    </div>
                    <ArrowRightOutlined className="landing-mobile-nav-arrow" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Enhanced Action Buttons */}
          <div className="landing-nav-section">
            <div className="landing-section-title">Account</div>
            <div className="landing-mobile-actions">
              <Button
                className="landing-mobile-signin"
                onClick={() => {
                  navigate("/login")
                  setMobileMenuVisible(false)
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <UserOutlined />
                    <span>Sign In</span>
                  </div>
                  <ArrowRightOutlined className="text-sm opacity-50" />
                </div>
              </Button>

              <Button
                className="landing-mobile-cta"
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
          <div className="landing-status-card">
            <div className="landing-status-content">
              <div className="landing-status-avatar">
                <RobotOutlined />
                <div className="landing-status-indicator"></div>
              </div>
              <div className="landing-status-info">
                <div className="landing-status-title">mirAI Assistant</div>
                <div className="landing-status-desc">
                  AI-powered interview platform ready to transform your hiring process
                </div>
                <div className="landing-status-stats">
                  <div className="landing-stat-item">
                    <div className="landing-stat-number">250+</div>
                    <div className="landing-stat-label">Companies</div>
                  </div>
                  <div className="landing-stat-item">
                    <div className="landing-stat-number">12.5K+</div>
                    <div className="landing-stat-label">Interviews</div>
                  </div>
                  <div className="landing-stat-item">
                    <div className="landing-stat-number">94%</div>
                    <div className="landing-stat-label">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Content>
        {/* Enhanced Hero Section */}
        <section className="landing-hero">
          <div className="container landing-hero-content">
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
                          <ClockCircleOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">85% Faster</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Hiring Process</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="floating-card absolute top-1/2 -left-8 transform -translate-y-1/2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                          <TeamOutlined className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">12.5K+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
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
        <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Trusted by Industry Leaders
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of companies that have transformed their hiring process with mirAI
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <div className="mb-4">{stat.icon}</div>
                      <Statistic
                        title={<span className="text-lg font-bold text-gray-900 dark:text-white">{stat.title}</span>}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: isDarkMode ? "#ffffff" : "#1f2937",
                          fontSize: "2.5rem",
                          fontWeight: "900",
                        }}
                      />
                      <Paragraph className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-0">
                        {stat.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Title level={2} className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Powerful Features for Modern Hiring
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Our AI-powered platform provides everything you need to conduct efficient, fair, and insightful
                interviews that help you find the perfect candidates.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white dark:bg-gray-900 group">
                      <div className="text-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <Title level={4} className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Title level={2} className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
                What Our Customers Say
              </Title>
              <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what industry leaders are saying about mirAI.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <div className="flex items-center mb-6">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-indigo-100 dark:border-indigo-900"
                        />
                        <div>
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarOutlined key={i} className="text-yellow-400 text-lg" />
                        ))}
                      </div>
                      <Paragraph className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{testimonial.content}"
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Title level={2} className="text-4xl sm:text-5xl font-black text-white mb-6">
                Ready to Transform Your Hiring?
              </Title>
              <Paragraph className="text-xl text-indigo-100 max-w-3xl mx-auto mb-12">
                Join thousands of companies using mirAI to make better hiring decisions. Start your free trial today and
                experience the future of interviews.
              </Paragraph>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="h-16 px-12 text-xl font-bold bg-white text-indigo-600 border-0 hover:bg-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  icon={<RocketOutlined />}
                  onClick={() => navigate("/login")}
                >
                  Start Free Trial
                </Button>
                <Button
                  size="large"
                  className="h-16 px-12 text-xl font-bold border-2 border-white text-white hover:bg-white hover:text-indigo-600 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  icon={<PhoneOutlined />}
                >
                  Schedule Demo
                </Button>
              </div>
              <div className="mt-8 text-indigo-200 text-sm">
                <CheckCircleOutlined className="mr-2" />
                No credit card required • 14-day free trial • Cancel anytime
              </div>
            </motion.div>
          </div>
        </section>
      </Content>

      {/* Enhanced Footer */}
      <Footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="container">
          <Row gutter={[48, 48]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="landing-logo mb-6">
                <div className="landing-logo-icon">
                  <RobotOutlined />
                </div>
                <div className="landing-logo-content">
                  <span className="landing-logo-text text-white">mirAI</span>
                  <span className="landing-logo-subtitle">Interview Platform</span>
                </div>
              </div>
              <Paragraph className="text-gray-400 mb-6 leading-relaxed">
                The future of AI-powered interviews. Transform your hiring process with intelligent automation and
                data-driven insights.
              </Paragraph>
              <div className="flex space-x-4">
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg"
                >
                  Made with ❤️
                </Button>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} className="text-white mb-6">
                Product
              </Title>
              <div className="space-y-3">
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Integrations
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} className="text-white mb-6">
                Company
              </Title>
              <div className="space-y-3">
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Title level={5} className="text-white mb-6">
                Stay Updated
              </Title>
              <Paragraph className="text-gray-400 mb-4">
                Get the latest updates on new features and industry insights.
              </Paragraph>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <Button type="primary" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg">
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
          <Divider className="border-gray-700 my-12" />
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2024 mirAI. All rights reserved. Built with ❤️ for better hiring.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default Landing
