"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import type React from "react";
import { useState, useEffect } from "react";
>>>>>>> 99b89cf860c8fcc571c6ea7cf2d3bc99457d6469
import {
  Layout,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Divider,
  Drawer,
} from "antd";
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
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import "../styles/landing.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({
    status: 'operational',
    loading: true
  });

  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to get service status from OpenAI
  const getServiceStatus = async () => {
    try {
      const response = await fetch('https://status.openai.com/api/v2/components.json');
      const data = await response.json();
      
      // Find the Chat component
      const chatComponent = data.components.find((component: any) => component.name === 'Chat');
      
      if (chatComponent) {
        setServiceStatus({
          status: chatComponent.status,
          loading: false
        });
      } else {
        setServiceStatus({
          status: 'operational',
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching service status:', error);
      setServiceStatus({
        status: 'operational',
        loading: false
      });
    }
  };

  // Get status text and color based on status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          text: 'All systems operational',
          color: 'green',
          dotClass: 'operational'
        };
      case 'degraded_performance':
        return {
          text: 'Degraded performance',
          color: 'orange',
          dotClass: 'degraded'
        };
      case 'partial_outage':
        return {
          text: 'Partial outage',
          color: 'orange',
          dotClass: 'partial-outage'
        };
      case 'major_outage':
        return {
          text: 'Major outage',
          color: 'red',
          dotClass: 'major-outage'
        };
      case 'under_maintenance':
        return {
          text: 'Under maintenance',
          color: 'blue',
          dotClass: 'maintenance'
        };
      default:
        return {
          text: 'Status unknown',
          color: 'gray',
          dotClass: 'unknown'
        };
    }
  };

  // Fetch service status on component mount
  useEffect(() => {
    getServiceStatus();
    // Refresh status every 5 minutes
    const interval = setInterval(getServiceStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      icon: <RobotOutlined className="text-6xl text-indigo-600" />,
      title: "AI-Powered Questions",
      description:
        "Generate personalized technical and behavioral questions tailored to each role and candidate profile with advanced machine learning algorithms that adapt to your hiring needs.",
      color: "indigo",
      category: "AI Intelligence",
      capabilities: [
        "Natural Language Processing",
        "Dynamic Question Generation",
        "Skill-Based Targeting",
      ],
      metrics: { accuracy: "96%", questions: "10K+", languages: "15+" },
      demoFeature: "Smart Question Builder",
    },
    {
      icon: <BulbOutlined className="text-6xl text-emerald-600" />,
      title: "Smart Evaluation",
      description:
        "Advanced AI analyzes responses in real-time and provides detailed feedback on candidate performance, skills assessment, and cultural fit with comprehensive scoring metrics.",
      color: "emerald",
      category: "Assessment",
      capabilities: [
        "Real-time Analysis",
        "Behavioral Insights",
        "Cultural Fit Scoring",
      ],
      metrics: { speed: "2.3s", accuracy: "94%", insights: "50+" },
      demoFeature: "Live Response Analysis",
    },
    {
      icon: <ClockCircleOutlined className="text-6xl text-blue-600" />,
      title: "Asynchronous Interviews",
      description:
        "Conduct interviews on your schedule. Candidates can complete assessments at their convenience, saving valuable time for everyone while maintaining interview quality.",
      color: "blue",
      category: "Scheduling",
      capabilities: [
        "Flexible Timing",
        "Multi-timezone Support",
        "Calendar Integration",
      ],
      metrics: { timeSaved: "75%", satisfaction: "98%", completion: "89%" },
      demoFeature: "Schedule Demo",
    },
    {
      icon: <BarChartOutlined className="text-6xl text-purple-600" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and insights dashboard to make informed hiring decisions quickly and efficiently with data-driven recommendations and performance tracking.",
      color: "purple",
      category: "Analytics",
      capabilities: [
        "Performance Tracking",
        "Predictive Analytics",
        "Custom Reports",
      ],
      metrics: { dataPoints: "200+", reports: "25+", accuracy: "92%" },
      demoFeature: "Analytics Preview",
    },
    {
      icon: <SafetyOutlined className="text-6xl text-red-600" />,
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with end-to-end encryption, GDPR compliance, and SOC 2 Type II certification. Your data and candidate information is always protected.",
      color: "red",
      category: "Security",
      capabilities: [
        "End-to-end Encryption",
        "GDPR Compliance",
        "SOC 2 Certified",
      ],
      metrics: { uptime: "99.9%", compliance: "100%", certifications: "5+" },
      demoFeature: "Security Overview",
    },
    {
      icon: <GlobalOutlined className="text-6xl text-cyan-600" />,
      title: "Global Integration",
      description:
        "Seamlessly integrate with your existing HR tools, ATS systems, and workflow management platforms. Support for 50+ integrations and custom API connections.",
      color: "cyan",
      category: "Integration",
      capabilities: ["API Integration", "ATS Sync", "Webhook Support"],
      metrics: { integrations: "50+", uptime: "99.8%", sync: "<1min" },
      demoFeature: "Integration Hub",
    },
    {
      icon: <TeamOutlined className="text-6xl text-orange-600" />,
      title: "Collaborative Hiring",
      description:
        "Enable team-based decision making with shared evaluations, comment systems, and real-time collaboration tools. Perfect for distributed teams and panel interviews.",
      color: "orange",
      category: "Collaboration",
      capabilities: [
        "Team Evaluations",
        "Real-time Comments",
        "Decision Workflows",
      ],
      metrics: { teamSize: "20+", decisions: "3x faster", satisfaction: "96%" },
      demoFeature: "Team Collaboration",
    },
    {
      icon: <ThunderboltOutlined className="text-6xl text-yellow-600" />,
      title: "AI Video Analysis",
      description:
        "Advanced computer vision analyzes candidate video responses for communication skills, engagement levels, and non-verbal cues with privacy-first approach.",
      color: "yellow",
      category: "Video Intelligence",
      capabilities: [
        "Facial Expression Analysis",
        "Speech Patterns",
        "Engagement Metrics",
      ],
      metrics: { accuracy: "91%", processing: "Real-time", privacy: "100%" },
      demoFeature: "Video AI Demo",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  // Navigation functions
  const goToFeature = (index: number) => {
    setActiveFeatureIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextFeature = () => {
    setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevFeature = () => {
    setActiveFeatureIndex(
      (prev) => (prev - 1 + features.length) % features.length,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

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
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Talent, TechCorp",
      content:
        "mirAI transformed our hiring process completely. We've reduced time-to-hire by 60% while improving candidate quality significantly. The AI insights are incredibly accurate.",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CEO, StartupXYZ",
      content:
        "The AI-powered insights help us identify the best candidates faster than ever before. This is truly game-changing technology that every modern company needs.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director, GlobalTech",
      content:
        "Our candidates love the modern interview experience, and we get detailed analytics to make better hiring decisions. The ROI has been exceptional.",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

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
  ];

  return (
    <Layout className="main-layout">
      {/* Enhanced Navigation Header */}
      <Header className="landing-header">
        <div className="landing-header-content">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <RobotOutlined />
              </div>
              <div className="landing-logo-content">
                <span className="landing-logo-text">mirAI</span>
                <span className="landing-logo-subtitle">
                  Interview Platform
                </span>
              </div>
            </div>
          </motion.div>

          {/* Simplified Navigation - Clean & Minimal */}
          <motion.div
            className="landing-nav-simple"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="nav-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="badge-content">
                <div className="status-dot"></div>
                <span className="badge-text">Now Live</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Streamlined Actions */}
          <div className="landing-header-actions-simple">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                className="landing-signin-simple"
                type="text"
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
                className="landing-cta-simple"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            </motion.div>
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
                        <div className="landing-mobile-nav-title">
                          {item.label}
                        </div>
                        <div className="landing-mobile-nav-desc">
                          {item.description}
                        </div>
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
                  navigate("/login");
                  setMobileMenuVisible(false);
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
                  navigate("/login");
                  setMobileMenuVisible(false);
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
                  AI-powered interview platform ready to transform your hiring
                  process
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
                      The Future of{" "}
                      <span className="gradient-text">AI Interviews</span>
                    </Title>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Paragraph className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto lg:mx-0 mb-8">
                      mirAI revolutionizes hiring with intelligent interview
                      assistance. Generate personalized questions, evaluate
                      candidates with AI precision, and make better hiring
                      decisions faster than ever before.
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

                  <motion.div variants={itemVariants} className="pt-8">
                    <div className="hero-trust-section">
                      <div className="trust-badge">
                        <div className="trust-icon-wrapper">
                          <CrownOutlined className="trust-icon" />
                        </div>
                        <div className="trust-content">
                          <div className="trust-stat">250+</div>
                          <div className="trust-label">
                            Enterprise Companies
                          </div>
                          <div className="trust-description">
                            Trust our AI platform
                          </div>
                        </div>
                      </div>

                      <div className="trust-indicators">
                        <div className="indicator-item">
                          <div className="indicator-icon">
                            <StarOutlined className="text-yellow-500" />
                          </div>
                          <span className="indicator-text">
                            Enterprise Grade
                          </span>
                        </div>
                        <div className="indicator-item">
                          <div className="indicator-icon">
                            <SafetyOutlined className="text-green-500" />
                          </div>
                          <span className="indicator-text">
                            SOC 2 Compliant
                          </span>
                        </div>
                        <div className="indicator-item">
                          <div className="indicator-icon">
                            <GlobalOutlined className="text-blue-500" />
                          </div>
                          <span className="indicator-text">Global Support</span>
                        </div>
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

                    {/* Enhanced Floating Stats Cards */}
                    <motion.div
                      className="enhanced-floating-card accuracy-card"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.8,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="card-glow"></div>
                      <div className="card-content">
                        <div className="icon-container accuracy-icon">
                          <CheckCircleOutlined className="card-icon" />
                          <div className="icon-pulse"></div>
                        </div>
                        <div className="text-content">
                          <div className="metric-value">94%</div>
                          <div className="metric-label">AI Accuracy</div>
                          <div className="metric-description">
                            Precision Rate
                          </div>
                        </div>
                      </div>
                      <div className="card-pattern"></div>
                    </motion.div>

                    <motion.div
                      className="enhanced-floating-card speed-card"
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 1.0,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="card-glow"></div>
                      <div className="card-content">
                        <div className="icon-container speed-icon">
                          <ThunderboltOutlined className="card-icon" />
                          <div className="icon-pulse"></div>
                        </div>
                        <div className="text-content">
                          <div className="metric-value">85%</div>
                          <div className="metric-label">Faster Process</div>
                          <div className="metric-description">
                            Time Reduction
                          </div>
                        </div>
                      </div>
                      <div className="card-pattern"></div>
                    </motion.div>

                    <motion.div
                      className="enhanced-floating-card volume-card"
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 1.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <div className="card-glow"></div>
                      <div className="card-content">
                        <div className="icon-container volume-icon">
                          <TeamOutlined className="card-icon" />
                          <div className="icon-pulse"></div>
                        </div>
                        <div className="text-content">
                          <div className="metric-value">12.5K+</div>
                          <div className="metric-label">Interviews</div>
                          <div className="metric-description">Completed</div>
                        </div>
                      </div>
                      <div className="card-pattern"></div>
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Dynamic Performance Dashboard */}
        <section id="performance" className="performance-dashboard-section">
          <div className="dashboard-background">
            <div className="dashboard-grid-pattern"></div>
            <div className="dashboard-particle-field">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`particle particle-${i + 1}`}></div>
              ))}
            </div>
          </div>

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="dashboard-header"
            >
              <div className="performance-badge">
                <BarChartOutlined className="performance-badge-icon" />
                <span>Live Performance</span>
                <div className="live-indicator">
                  <div className="pulse-dot"></div>
                  <span>LIVE</span>
                </div>
              </div>

              <Title level={2} className="dashboard-title">
                Real-time Platform
                <span className="dashboard-title-gradient"> Metrics</span>
              </Title>

              <Paragraph className="dashboard-subtitle">
                Watch our AI platform perform in real-time across global
                enterprises
              </Paragraph>
            </motion.div>

            <div className="metrics-dashboard">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="metrics-grid"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="metric-card-advanced"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.05 }}
                  >
                    <div className="metric-card-glow"></div>

                    {/* Progress Ring */}
                    <div className="progress-ring-container">
                      <svg className="progress-ring" viewBox="0 0 120 120">
                        <circle
                          className="progress-ring-background"
                          cx="60"
                          cy="60"
                          r="54"
                        />
                        <circle
                          className="progress-ring-progress"
                          cx="60"
                          cy="60"
                          r="54"
                          style={{
                            strokeDasharray: `${(stat.value / (stat.title.includes("Rate") ? 100 : 15000)) * 339.29} 339.29`,
                          }}
                        />
                      </svg>

                      <div className="metric-icon-wrapper">
                        <div className="metric-icon-glow"></div>
                        {stat.icon}
                      </div>
                    </div>

                    {/* Metric Content */}
                    <div className="metric-content">
                      <div className="metric-value-container">
                        <motion.div
                          className="metric-value-large"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.2 + 0.5,
                          }}
                          viewport={{ once: true }}
                        >
                          {stat.value}
                          <span className="metric-suffix">{stat.suffix}</span>
                        </motion.div>

                        <div className="metric-change">
                          <ArrowRightOutlined className="change-arrow" />
                          <span className="change-text">+12% this month</span>
                        </div>
                      </div>

                      <div className="metric-info">
                        <div className="metric-title-modern">{stat.title}</div>
                        <div className="metric-description-modern">
                          {stat.description}
                        </div>

                        {/* Mini Chart */}
                        <div className="mini-chart">
                          <div className="chart-bars">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="chart-bar"
                                initial={{ height: 0 }}
                                whileInView={{
                                  height: `${Math.random() * 30 + 10}px`,
                                }}
                                transition={{
                                  duration: 0.6,
                                  delay: index * 0.1 + i * 0.05,
                                }}
                                viewport={{ once: true }}
                              ></motion.div>
                            ))}
                          </div>
                          <div className="chart-label">Trending Up</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Effects */}
                    <div className="metric-card-border"></div>
                    <div className="metric-card-shine"></div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Real-time Activity Feed */}
              <motion.div
                className="activity-feed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <div className="activity-header">
                  <div className="activity-title">
                    <GlobalOutlined className="activity-icon" />
                    <span>Global Activity</span>
                  </div>
                  <div className="activity-status">
                    <div className="status-dot active"></div>
                    <span>1,247 active sessions</span>
                  </div>
                </div>

                <div className="activity-items">
                  <motion.div
                    className="activity-item"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="activity-dot"></div>
                    <span>New interview completed in San Francisco</span>
                    <span className="activity-time">2s ago</span>
                  </motion.div>

                  <motion.div
                    className="activity-item"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="activity-dot"></div>
                    <span>AI assessment generated for TechCorp</span>
                    <span className="activity-time">5s ago</span>
                  </motion.div>

                  <motion.div
                    className="activity-item"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.0 }}
                  >
                    <div className="activity-dot"></div>
                    <span>Candidate matched in London</span>
                    <span className="activity-time">8s ago</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modern Features Carousel Section */}
        <section id="features" className="features-carousel-section">
          <div className="features-background">
            <div className="features-pattern"></div>
          </div>

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="features-header"
            >
              <div className="features-badge">
                <BulbOutlined className="features-badge-icon" />
                <span>Key Features</span>
              </div>
              <Title level={2} className="features-title">
                Experience the Future of
                <span className="features-title-gradient">
                  {" "}
                  AI-Powered Hiring
                </span>
              </Title>
              <Paragraph className="features-subtitle">
                Revolutionary technology that transforms how you discover,
                evaluate, and hire exceptional talent
              </Paragraph>
            </motion.div>

            <div className="features-carousel-container">
              {/* Carousel Controls */}
              <div className="carousel-controls">
                <div className="carousel-info">
                  <div className="feature-counter">
                    <span className="counter-current">
                      {String(activeFeatureIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="counter-divider">/</span>
                    <span className="counter-total">
                      {String(features.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="autoplay-control">
                    <Button
                      className="autoplay-button"
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      icon={
                        isAutoPlaying ? (
                          <PlayCircleOutlined />
                        ) : (
                          <PlayCircleOutlined />
                        )
                      }
                    >
                      {isAutoPlaying ? "Auto-playing" : "Paused"}
                    </Button>
                  </div>
                </div>

                <div className="navigation-arrows">
                  <Button
                    className="nav-arrow prev-arrow"
                    onClick={prevFeature}
                  >
                    <ArrowRightOutlined
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </Button>
                  <Button
                    className="nav-arrow next-arrow"
                    onClick={nextFeature}
                  >
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>

              {/* Enhanced Carousel */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="features-carousel-wrapper"
              >
                <div
                  className="features-carousel-track"
                  style={{
                    transform: `translateX(-${activeFeatureIndex * 100}%)`,
                  }}
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`feature-slide ${index === activeFeatureIndex ? "active" : ""}`}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="feature-card-enhanced">
                        <div className="feature-card-glow"></div>

                        {/* Feature Header */}
                        <div className="feature-header">
                          <div className="feature-category">
                            <span className="category-badge">
                              {feature.category}
                            </span>
                            <div className="feature-status">
                              <div className="status-dot active"></div>
                              <span>Live</span>
                            </div>
                          </div>

                          <div
                            className={`feature-icon-container ${feature.color}-gradient`}
                          >
                            <div className="feature-icon-inner">
                              {feature.icon}
                            </div>
                            <div className="feature-icon-pulse"></div>
                          </div>
                        </div>

                        {/* Feature Content */}
                        <div className="feature-content">
                          <Title level={2} className="feature-title">
                            {feature.title}
                          </Title>
                          <Paragraph className="feature-description">
                            {feature.description}
                          </Paragraph>

                          {/* Capabilities List */}
                          <div className="feature-capabilities">
                            <h4 className="capabilities-title">
                              Key Capabilities
                            </h4>
                            <div className="capabilities-list">
                              {feature.capabilities.map(
                                (capability, capIndex) => (
                                  <div
                                    key={capIndex}
                                    className="capability-item"
                                  >
                                    <CheckCircleOutlined className="capability-icon" />
                                    <span>{capability}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Metrics Grid */}
                          <div className="feature-metrics">
                            {Object.entries(feature.metrics).map(
                              ([key, value], metricIndex) => (
                                <div key={metricIndex} className="metric-item">
                                  <div className="metric-value">{value}</div>
                                  <div className="metric-label">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          {/* Feature Actions */}
                          <div className="feature-actions">
                            <Button className="demo-button primary">
                              <PlayCircleOutlined />
                              <span>{feature.demoFeature}</span>
                            </Button>
                            <Button className="learn-more-button">
                              <span>Documentation</span>
                              <ArrowRightOutlined />
                            </Button>
                          </div>
                        </div>

                        <div className="feature-card-border"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Navigation */}
              <motion.div
                className="carousel-navigation-enhanced"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="nav-thumbnails">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`nav-thumbnail ${index === activeFeatureIndex ? "active" : ""}`}
                      onClick={() => goToFeature(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="thumbnail-icon">{feature.icon}</div>
                      <div className="thumbnail-info">
                        <div className="thumbnail-title">{feature.title}</div>
                        <div className="thumbnail-category">
                          {feature.category}
                        </div>
                      </div>
                      {index === activeFeatureIndex && (
                        <motion.div
                          className="active-indicator"
                          layoutId="activeIndicator"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="carousel-progress">
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((activeFeatureIndex + 1) / features.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="progress-labels">
                    <span>Features</span>
                    <span>
                      {activeFeatureIndex + 1} of {features.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Revolutionary Testimonials Showcase */}
        <section id="testimonials" className="testimonials-showcase-section">
          <div className="testimonials-background">
            <div className="testimonials-pattern"></div>
            <div className="floating-elements">
              <div className="floating-element element-1"></div>
              <div className="floating-element element-2"></div>
              <div className="floating-element element-3"></div>
            </div>
          </div>

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="testimonials-header"
            >
              <div className="testimonials-badge">
                <HeartOutlined className="testimonials-badge-icon" />
                <span>Customer Stories</span>
              </div>
              <Title level={2} className="testimonials-title">
                Loved by Industry
                <span className="testimonials-title-gradient"> Leaders</span>
              </Title>
              <Paragraph className="testimonials-subtitle">
                Discover how leading companies are transforming their hiring
                process with mirAI
              </Paragraph>

              <div className="testimonials-stats">
                <div className="stat-item">
                  <div className="stat-number">4.9</div>
                  <div className="stat-label">Average Rating</div>
                  <div className="stat-stars">
                    {[...Array(5)].map((_, i) => (
                      <StarOutlined key={i} className="star-icon" />
                    ))}
                  </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">250+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            <div className="testimonials-carousel-container">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="testimonials-carousel"
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="testimonial-card-modern"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.03 }}
                  >
                    <div className="testimonial-card-glow"></div>

                    {/* Quote Icon */}
                    <div className="quote-icon">
                      <svg viewBox="0 0 24 24" className="quote-svg">
                        <path
                          d="M14.017,21v-8l6.017-8H18L14.017,9v2H18V21H14.017z M2,21v-8L8.017,5H6L2,9v2h4v10H2z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    <div className="testimonial-content">
                      {/* Rating Section */}
                      <div className="rating-section">
                        <div className="stars-container">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="star-wrapper"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.5 + i * 0.1,
                              }}
                            >
                              <StarOutlined className="star-icon-modern" />
                            </motion.div>
                          ))}
                        </div>
                        <div className="rating-text">
                          {testimonial.rating}.0
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <Paragraph className="testimonial-text">
                        "{testimonial.content}"
                      </Paragraph>

                      {/* Customer Info */}
                      <div className="customer-info">
                        <div className="customer-avatar-container">
                          <div className="avatar-glow"></div>
                          <img
                            src={
                              testimonial.avatar ||
                              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100"
                            }
                            alt={testimonial.name}
                            className="customer-avatar"
                          />
                          <div className="avatar-ring"></div>
                        </div>
                        <div className="customer-details">
                          <div className="customer-name">
                            {testimonial.name}
                          </div>
                          <div className="customer-role">
                            {testimonial.role}
                          </div>
                          <div className="company-badge">
                            <CrownOutlined className="company-icon" />
                            <span>Verified Customer</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="testimonial-decoration">
                      <div className="decoration-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Navigation */}
              <motion.div
                className="testimonials-navigation"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="nav-controls">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`nav-control ${index === 0 ? "active" : ""}`}
                    >
                      <div className="control-inner"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Elegant Connection Experience */}
        <section className="connection-experience-section">
          <div className="connection-background">
            <div className="connection-aurora"></div>
            <div className="connection-mesh-gradient"></div>
            <div className="floating-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
              <div className="orb orb-4"></div>
            </div>
          </div>

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="connection-content"
            >
              <div className="connection-header">
                <motion.div
                  className="connection-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <RocketOutlined className="connection-badge-icon" />
                  <span>Ready When You Are</span>
                </motion.div>

                <Title level={2} className="connection-title">
                  Let's Build the Future of
                  <span className="connection-title-gradient">
                    {" "}
                    Hiring Together
                  </span>
                </Title>

                <Paragraph className="connection-subtitle">
                  Join the AI revolution that's reshaping how companies discover
                  exceptional talent. Your journey towards smarter hiring starts
                  here.
                </Paragraph>
              </div>

              <div className="connection-options">
                <motion.div
                  className="connection-card primary-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => navigate("/login")}
                >
                  <div className="card-glow-effect"></div>
                  <div className="card-content">
                    <div className="card-icon-section">
                      <div className="card-icon-wrapper">
                        <UserOutlined className="card-icon" />
                      </div>
                      <div className="card-status">
                        <div className="status-indicator"></div>
                        <span>Instant Access</span>
                      </div>
                    </div>

                    <div className="card-info">
                      <h3 className="card-title">Get Started Now</h3>
                      <p className="card-description">
                        Join our platform and start experiencing the power of
                        AI-driven interviews immediately. Perfect for teams
                        ready to innovate.
                      </p>

                      <div className="card-features">
                        <div className="feature-item">
                          <CheckCircleOutlined className="feature-icon" />
                          <span>Immediate platform access</span>
                        </div>
                        <div className="feature-item">
                          <CheckCircleOutlined className="feature-icon" />
                          <span>Full feature availability</span>
                        </div>
                        <div className="feature-item">
                          <CheckCircleOutlined className="feature-icon" />
                          <span>24/7 AI assistance</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-action">
                      <Button className="connection-button primary-button">
                        <span>Begin Your Journey</span>
                        <ArrowRightOutlined className="button-arrow" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="connection-card secondary-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="card-glow-effect"></div>
                  <div className="card-content">
                    <div className="card-icon-section">
                      <div className="card-icon-wrapper secondary">
                        <TeamOutlined className="card-icon" />
                      </div>
                      <div className="card-status">
                        <div className="status-indicator secondary"></div>
                        <span>Personalized</span>
                      </div>
                    </div>

                    <div className="card-info">
                      <h3 className="card-title">Expert Consultation</h3>
                      <p className="card-description">
                        Let our specialists craft a customized solution for your
                        unique hiring challenges. Ideal for enterprise teams
                        with specific requirements.
                      </p>

                      <div className="card-features">
                        <div className="feature-item">
                          <StarOutlined className="feature-icon secondary" />
                          <span>Custom implementation plan</span>
                        </div>
                        <div className="feature-item">
                          <StarOutlined className="feature-icon secondary" />
                          <span>Dedicated success manager</span>
                        </div>
                        <div className="feature-item">
                          <StarOutlined className="feature-icon secondary" />
                          <span>Priority enterprise support</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-action">
                      <Button className="connection-button secondary-button">
                        <span>Connect With Expert</span>
                        <ArrowRightOutlined className="button-arrow" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="trust-indicators-section"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="trust-message">
                  <GlobalOutlined className="trust-icon" />
                  <span>
                    Trusted by 250+ companies worldwide • Built with enterprise
                    security • Available in 15+ languages
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Content>

      {/* Modern Footer */}
      <Footer className="modern-footer">
        <div className="footer-background">
          <div className="footer-gradient"></div>
          <div className="footer-pattern"></div>
        </div>

        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <motion.div
              className="footer-brand"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <RobotOutlined />
                </div>
                <div className="footer-logo-content">
                  <span className="footer-logo-text">mirAI</span>
                  <span className="footer-logo-subtitle">
                    Interview Platform
                  </span>
                </div>
              </div>

              <Paragraph className="footer-description">
                Revolutionizing the future of hiring with AI-powered interview
                intelligence. Trusted by leading companies worldwide.
              </Paragraph>

              <div className="footer-stats">
                <div className="footer-stat">
                  <div className="stat-value">250+</div>
                  <div className="stat-label">Companies</div>
                </div>
                <div className="footer-stat">
                  <div className="stat-value">12.5K+</div>
                  <div className="stat-label">Interviews</div>
                </div>
                <div className="footer-stat">
                  <div className="stat-value">94%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="footer-navigation">
              <motion.div
                className="footer-nav-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-nav-title">Platform</h4>
                <div className="footer-nav-links">
                  <button 
                    onClick={() => scrollToSection('#features')} 
                    className="footer-nav-link"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <BulbOutlined className="link-icon" />
                    <span>Features</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#performance')} 
                    className="footer-nav-link"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <BarChartOutlined className="link-icon" />
                    <span>Performance</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#testimonials')} 
                    className="footer-nav-link"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <HeartOutlined className="link-icon" />
                    <span>Customer Stories</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="footer-nav-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-nav-title">Connect</h4>
                <div className="footer-nav-links">
                  <button
                    className="footer-nav-link"
                    onClick={() => navigate("/login")}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    <UserOutlined className="link-icon" />
                    <span>Get Started</span>
                  </button>
                  <a href="#support" className="footer-nav-link">
                    <TeamOutlined className="link-icon" />
                    <span>Expert Consultation</span>
                  </a>
                  <a href="#help" className="footer-nav-link">
                    <SafetyOutlined className="link-icon" />
                    <span>Help Center</span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="footer-nav-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-nav-title">Resources</h4>
                <div className="footer-nav-links">
                  <a href="#documentation" className="footer-nav-link">
                    <InfoCircleOutlined className="link-icon" />
                    <span>Documentation</span>
                  </a>
                  <a href="#api" className="footer-nav-link">
                    <ThunderboltOutlined className="link-icon" />
                    <span>API Reference</span>
                  </a>
                  <a href="#security" className="footer-nav-link">
                    <SafetyOutlined className="link-icon" />
                    <span>Security</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Action Section */}
            <motion.div
              className="footer-action"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="footer-cta">
                <h4 className="footer-cta-title">Ready to Transform Hiring?</h4>
                <p className="footer-cta-text">
                  Join the AI revolution and discover how mirAI can enhance your
                  recruitment process.
                </p>
                <Button
                  className="footer-cta-button"
                  onClick={() => navigate("/login")}
                >
                  <span>Explore Platform</span>
                  <ArrowRightOutlined className="cta-arrow" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="footer-bottom-content">
              <div className="footer-copyright">
                <span>© 2024 mirAI. All rights reserved.</span>
                <div className="footer-status">
                  <div className={`status-dot-footer ${getStatusInfo(serviceStatus.status).dotClass}`}></div>
                  <span style={{ color: getStatusInfo(serviceStatus.status).color }}>
                    {serviceStatus.loading ? 'Checking status...' : getStatusInfo(serviceStatus.status).text}
                  </span>
                </div>
              </div>

              <div className="footer-legal">
                <a href="#privacy" className="footer-legal-link">
                  Privacy
                </a>
                <a href="#terms" className="footer-legal-link">
                  Terms
                </a>
                <a href="#security" className="footer-legal-link">
                  Security
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Landing;
