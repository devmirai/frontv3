import type React from "react"
import { useState, useEffect } from "react"
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Typography,
  Space,
  Avatar,
  Tag,
  Empty,
  Dropdown,
  message,
  Modal,
  Progress,
  Form,
  Input,
  DatePicker,
  Select,
  Drawer,
  Divider,
} from "antd"
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  LoadingOutlined,
  BookOutlined,
  HeartOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { convocatoriaAPI, postulacionAPI } from "../services/api"
import type { Convocatoria, Postulacion } from "../types/api"
import { EstadoPostulacion } from "../types/api"
import ThemeToggle from "./ThemeToggle"
import NotificationDropdown from "./NotificationDropdown"
import dayjs from "dayjs"

const { Header, Sider, Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Option } = Select

const UserDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [availableJobs, setAvailableJobs] = useState<Convocatoria[]>([])
  const [myApplications, setMyApplications] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [applyModalVisible, setApplyModalVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Convocatoria | null>(null)
  const [applying, setApplying] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false)
  const [applicationsModalVisible, setApplicationsModalVisible] = useState(false)
  const [jobsModalVisible, setJobsModalVisible] = useState(false)
  const [profileForm] = Form.useForm()
  const [settingsForm] = Form.useForm()
  const [startingInterview, setStartingInterview] = useState<number | null>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      className: "sidebar-menu-item",
    },
    {
      key: "divider-1",
      type: "divider",
    },
    {
      key: "job-search",
      label: "Job Search",
      type: "group",
      children: [
        {
          key: "applications",
          icon: <FileTextOutlined />,
          label: "My Applications",
          className: "sidebar-menu-item",
          onClick: () => setApplicationsModalVisible(true),
        },
        {
          key: "browse-jobs",
          icon: <SearchOutlined />,
          label: "Browse Jobs",
          className: "sidebar-menu-item",
          onClick: () => setJobsModalVisible(true),
        },
        {
          key: "saved-jobs",
          icon: <HeartOutlined />,
          label: "Saved Jobs",
          className: "sidebar-menu-item",
        },
      ],
    },
    {
      key: "divider-2",
      type: "divider",
    },
    {
      key: "career",
      label: "Career",
      type: "group",
      children: [
        {
          key: "interviews",
          icon: <TrophyOutlined />,
          label: "Interview History",
          className: "sidebar-menu-item",
        },
        {
          key: "skills",
          icon: <BookOutlined />,
          label: "Skills Assessment",
          className: "sidebar-menu-item",
        },
      ],
    },
    {
      key: "divider-3",
      type: "divider",
    },
    {
      key: "account",
      label: "Account",
      type: "group",
      children: [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Profile",
          className: "sidebar-menu-item",
          onClick: () => setProfileModalVisible(true),
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Settings",
          className: "sidebar-menu-item",
          onClick: () => setSettingsDrawerVisible(true),
        },
      ],
    },
  ]

  useEffect(() => {
    loadDashboardData()
    // Initialize forms with user data
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.telefono,
        birthDate: user.nacimiento ? dayjs(user.nacimiento) : null,
      })
      settingsForm.setFieldsValue({
        notifications: true,
        emailUpdates: true,
        theme: "auto",
        language: "en",
      })
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Load available jobs
      const jobsResponse = await convocatoriaAPI.getActivas()
      setAvailableJobs(jobsResponse.data)

      // Load user's applications
      const applicationsResponse = await postulacionAPI.getByUsuario(user.id)
      setMyApplications(applicationsResponse.data)
    } catch (error: any) {
      console.error("Error loading dashboard data:", error)
      message.error("Error loading dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Applications Sent",
      value: myApplications.length,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: "blue",
      change: "+3 this month",
      trend: "up",
    },
    {
      title: "Completed Interviews",
      value: myApplications.filter((a) => a.estado === EstadoPostulacion.COMPLETADA).length,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: "green",
      change: `${Math.round((myApplications.filter((a) => a.estado === EstadoPostulacion.COMPLETADA).length / Math.max(myApplications.length, 1)) * 100)}% completion rate`,
      trend: "up",
    },
    {
      title: "In Progress",
      value: myApplications.filter((a) => a.estado === EstadoPostulacion.EN_EVALUACION).length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: "orange",
      change: "Active interviews",
      trend: "up",
    },
    {
      title: "Available Jobs",
      value: availableJobs.length,
      icon: <StarOutlined className="text-purple-600" />,
      color: "purple",
      change: "New opportunities",
      trend: "up",
    },
  ]

  const getStatusTag = (status: EstadoPostulacion) => {
    const statusConfig = {
      [EstadoPostulacion.PENDIENTE]: { color: "warning", text: "Pending" },
      [EstadoPostulacion.EN_EVALUACION]: { color: "processing", text: "In Progress" },
      [EstadoPostulacion.COMPLETADA]: { color: "success", text: "Completed" },
      [EstadoPostulacion.RECHAZADA]: { color: "error", text: "Rejected" },
    }
    const config = statusConfig[status]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <UserOutlined />,
        onClick: () => setProfileModalVisible(true),
      },
      {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
        onClick: () => setSettingsDrawerVisible(true),
      },
      {
        key: "divider",
        type: "divider",
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: logout,
      },
    ],
  }

  // Fixed interview start function - single request flow
  const handleStartInterview = async (postulacionId: number) => {
    try {
      setStartingInterview(postulacionId)
      
      // Update status first
      await postulacionAPI.iniciarEntrevista(postulacionId)
      
      // Navigate to interview page
      navigate(`/usuario/interview/${postulacionId}`)
    } catch (error) {
      console.error("Error starting interview:", error)
      message.error("Failed to start interview. Please try again.")
    } finally {
      setStartingInterview(null)
    }
  }

  const applicationColumns = [
    {
      title: "Job",
      key: "job",
      render: (_: any, record: Postulacion) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">{record.convocatoria?.titulo}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.convocatoria?.puesto}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.convocatoria?.empresa?.nombre}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "estado",
      key: "estado",
      render: (status: EstadoPostulacion) => getStatusTag(status),
    },
    {
      title: "Applied Date",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      render: (date: string) => (
        <span className="text-gray-600 dark:text-gray-300">{dayjs(date).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_: any, record: Postulacion) => {
        const getProgress = () => {
          switch (record.estado) {
            case EstadoPostulacion.PENDIENTE:
              return 25
            case EstadoPostulacion.EN_EVALUACION:
              return 75
            case EstadoPostulacion.COMPLETADA:
              return 100
            case EstadoPostulacion.RECHAZADA:
              return 100
            default:
              return 0
          }
        }
        return (
          <Progress
            percent={getProgress()}
            size="small"
            strokeColor={record.estado === EstadoPostulacion.RECHAZADA ? "#ef4444" : "#6366f1"}
            showInfo={false}
          />
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Postulacion) => (
        <Space>
          {record.estado === EstadoPostulacion.PENDIENTE && (
            <Button
              type="primary"
              size="small"
              icon={startingInterview === record.id ? <LoadingOutlined /> : <PlayCircleOutlined />}
              className="btn-gradient"
              loading={startingInterview === record.id}
              onClick={() => handleStartInterview(record.id!)}
            >
              Start Interview
            </Button>
          )}
          {record.estado === EstadoPostulacion.EN_EVALUACION && (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              className="btn-gradient"
              onClick={() => navigate(`/usuario/interview/${record.id}`)}
            >
              Continue
            </Button>
          )}
          {record.estado === EstadoPostulacion.COMPLETADA && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/usuario/interview/${record.id}/results`)}
            >
              View Results
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const jobsColumns = [
    {
      title: "Job Title",
      key: "title",
      render: (_: any, record: Convocatoria) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">{record.titulo}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.empresa?.nombre}</div>
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "puesto",
      key: "puesto",
      render: (puesto: string) => <Tag color="blue">{puesto}</Tag>,
    },
    {
      title: "Closing Date",
      dataIndex: "fechaCierre",
      key: "fechaCierre",
      render: (date: string) => (
        <span className="text-gray-600 dark:text-gray-300">{dayjs(date).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Convocatoria) => {
        const alreadyApplied = myApplications.some((app) => app.convocatoria?.id === record.id)
        return (
          <Button
            type="primary"
            size="small"
            className="btn-gradient"
            icon={<SendOutlined />}
            disabled={alreadyApplied}
            onClick={() => openApplyModal(record)}
          >
            {alreadyApplied ? "Applied" : "Apply Now"}
          </Button>
        )
      },
    },
  ]

  // Fixed Apply to Job function - creates application then starts interview
  const handleApplyToJob = async () => {
    if (!selectedJob || !user?.id) return

    setApplying(true)
    try {
      // Check if user already applied to prevent duplicates
      const existingApplication = myApplications.find((app) => app.convocatoria?.id === selectedJob.id)
      if (existingApplication) {
        message.warning("You have already applied to this position.")
        setApplyModalVisible(false)
        setSelectedJob(null)
        setApplying(false)
        return
      }

      message.loading("Creating your application...", 0)

      // Create a new application
      const applicationResponse = await postulacionAPI.create({
        usuario: { id: user.id },
        convocatoria: { id: selectedJob.id },
        estado: EstadoPostulacion.PENDIENTE,
        fechaPostulacion: new Date().toISOString(),
      })

      const newApplicationId = applicationResponse.data.id || applicationResponse.data

      if (!newApplicationId) {
        throw new Error("Failed to create application - no ID returned")
      }

      message.destroy()
      message.success("Application submitted successfully!")

      // Close modal and refresh data
      setApplyModalVisible(false)
      setSelectedJob(null)
      await loadDashboardData()

      // Ask if user wants to start interview immediately
      Modal.confirm({
        title: "Start Interview Now?",
        content: "Would you like to start your interview immediately?",
        okText: "Start Interview",
        cancelText: "Later",
        onOk: () => handleStartInterview(newApplicationId),
      })
    } catch (error: any) {
      console.error("Error in application process:", error)
      message.destroy()

      if (error.response?.status === 409) {
        message.error("You have already applied to this position.")
      } else {
        message.error(error.response?.data?.message || "Error processing your application. Please try again.")
      }
    } finally {
      setApplying(false)
    }
  }

  const openApplyModal = (job: Convocatoria) => {
    // Check if user already applied
    const alreadyApplied = myApplications.some((app) => app.convocatoria?.id === job.id)
    if (alreadyApplied) {
      message.warning("You have already applied to this position.")
      return
    }

    setSelectedJob(job)
    setApplyModalVisible(true)
  }

  const handleProfileSave = (values: any) => {
    console.log("Profile values:", values)
    message.success("Profile updated successfully!")
    setProfileModalVisible(false)
  }

  const handleSettingsSave = (values: any) => {
    console.log("Settings values:", values)
    message.success("Settings saved successfully!")
    setSettingsDrawerVisible(false)
  }

  return (
    <Layout className="main-layout min-h-screen">
      {/* Enhanced Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="enhanced-sidebar"
        width={280}
        collapsedWidth={80}
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Enhanced Logo Section */}
        <div className="sidebar-logo-container">
          <motion.div className="sidebar-logo" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <div className="logo-icon">
              <RobotOutlined />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="logo-content"
              >
                <span className="logo-text">mirAI</span>
                <span className="logo-subtitle">Career Portal</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Navigation Menu */}
        <div className="sidebar-menu-container">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            items={menuItems}
            className="enhanced-menu"
            onClick={(info) => {
              // Use the info.key instead of accessing item directly
              const clickedMenuItem = menuItems.find(item => {
                if ('key' in item && item.key === info.key) {
                  return item;
                } else if ('children' in item) {
                  return item.children?.find(child => 'key' in child && child.key === info.key);
                }
                return false;
              });
              
              if (clickedMenuItem && 'onClick' in clickedMenuItem && typeof clickedMenuItem.onClick === 'function') {
                clickedMenuItem.onClick();
              }
            }}
            style={{
              background: "transparent",
              border: "none",
            }}
          />
        </div>

        {/* Enhanced Status Card */}
        {!collapsed && (
          <motion.div
            className="sidebar-status-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mirabot-status-card">
              <div className="status-content">
                <div className="status-avatar">
                  <RobotOutlined />
                  <div className="status-indicator"></div>
                </div>
                <div className="status-info">
                  <Title level={5} className="status-title">
                    AI Assistant
                  </Title>
                  <Text className="status-description">Ready to help you succeed!</Text>
                  <div className="status-stats">
                    <div className="stat-item">
                      <span className="stat-number">{myApplications.length}</span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{availableJobs.length}</span>
                      <span className="stat-label">Jobs</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Collapse Toggle */}
        <div className="sidebar-footer">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
        </div>
      </Sider>

      <Layout>
        {/* Enhanced Header */}
        <Header className="enhanced-header">
          <div className="header-content">
            <div className="header-left">
              <div className="page-info">
                <Title level={3} className="page-title">
                  My Dashboard
                </Title>
                <Text className="page-subtitle">
                  Welcome back, {user?.name}! Track your applications and interviews.
                </Text>
              </div>
            </div>

            <div className="header-right">
              <Space size="large" className="header-actions">
                <Button
                  icon={<SearchOutlined />}
                  className="action-button"
                  size="large"
                  onClick={() => setJobsModalVisible(true)}
                >
                  Search Jobs
                </Button>
                <NotificationDropdown />
                <ThemeToggle />
                <Dropdown 
                  menu={{ 
                    items: [
                      {
                        key: "profile",
                        label: "Profile",
                        icon: <UserOutlined />,
                        onClick: () => setProfileModalVisible(true),
                      },
                      {
                        key: "settings",
                        label: "Settings",
                        icon: <SettingOutlined />,
                        onClick: () => setSettingsDrawerVisible(true),
                      },
                      {
                        key: "divider",
                        type: "divider",
                      },
                      {
                        key: "logout",
                        label: "Logout",
                        icon: <LogoutOutlined />,
                        onClick: logout,
                      },
                    ]
                  }} 
                  trigger={["click"]} 
                  placement="bottomRight"
                >
                  <Avatar src={user?.avatar} size="large" className="user-avatar" />
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="enhanced-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="content-wrapper"
          >
            {/* Welcome Section */}
            <Card className="welcome-card">
              <Row align="middle" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Title level={2} className="welcome-title">
                    Hello, {user?.name}! 👋
                  </Title>
                  <Paragraph className="welcome-description">
                    You have{" "}
                    <strong>
                      {myApplications.filter((a) => a.estado === EstadoPostulacion.EN_EVALUACION).length} interviews
                    </strong>{" "}
                    in progress and <strong>{availableJobs.length} new job opportunities</strong> available.
                  </Paragraph>
                  <Space wrap>
                    <Button
                      type="primary"
                      className="btn-gradient"
                      size="large"
                      disabled={myApplications.filter((a) => a.estado === EstadoPostulacion.EN_EVALUACION).length === 0}
                      onClick={() => {
                        const inProgressApp = myApplications.find((a) => a.estado === EstadoPostulacion.EN_EVALUACION)
                        if (inProgressApp) {
                          navigate(`/usuario/interview/${inProgressApp.id}`)
                        }
                      }}
                    >
                      Continue Interview
                    </Button>
                    <Button size="large" onClick={() => setJobsModalVisible(true)}>
                      Browse Jobs
                    </Button>
                  </Space>
                </Col>
                <Col xs={24} lg={8}>
                  <div className="welcome-illustration">
                    <img
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                      alt="AI Assistant"
                      className="illustration-image"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[24, 24]} className="stats-section">
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="enhanced-stats-card">
                      <div className="stats-header">
                        <div className="stats-icon">{stat.icon}</div>
                        <Tag color={stat.trend === "up" ? "success" : "default"} className="trend-tag">
                          {stat.change}
                        </Tag>
                      </div>
                      <div className="stats-content">
                        <Statistic
                          title={<span className="stats-title">{stat.title}</span>}
                          value={stat.value}
                          valueStyle={{
                            color: "var(--text-primary)",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            lineHeight: 1.2,
                          }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* My Applications Table */}
            <Card
              title={
                <div className="table-header">
                  <Title level={4} className="table-title">
                    My Applications
                  </Title>
                  <Button type="link" className="view-all-button" onClick={() => setApplicationsModalVisible(true)}>
                    View All
                  </Button>
                </div>
              }
              className="enhanced-table-card"
            >
              <div className="table-container">
                <Table
                  columns={applicationColumns}
                  dataSource={myApplications.slice(0, 5)}
                  loading={loading}
                  pagination={false}
                  className="enhanced-table"
                  scroll={{ x: 800 }}
                  rowKey="id"
                  size="middle"
                />
              </div>
            </Card>

            {/* Available Jobs */}
            <Card
              title={
                <div className="table-header">
                  <Title level={4} className="table-title">
                    Available Job Opportunities
                  </Title>
                  <Button type="link" className="view-all-button" onClick={() => setJobsModalVisible(true)}>
                    Browse All
                  </Button>
                </div>
              }
              className="enhanced-table-card"
            >
              {availableJobs.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {availableJobs.slice(0, 4).map((job) => {
                    const alreadyApplied = myApplications.some((app) => app.convocatoria?.id === job.id)
                    return (
                      <Col xs={24} lg={12} key={job.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card className="job-card">
                            <div className="job-content">
                              <div className="job-header">
                                <div className="job-info">
                                  <Title level={5} className="job-title">
                                    {job.titulo}
                                  </Title>
                                  <div className="job-meta">
                                    <Text className="job-company">{job.empresa?.nombre}</Text>
                                    <Tag color="blue" className="job-position">
                                      {job.puesto}
                                    </Tag>
                                  </div>
                                </div>
                              </div>

                              <div className="job-description-container">
                                <Text ellipsis={{ tooltip: job.descripcion }} className="job-description">
                                  {job.descripcion?.length > 100 ? `${job.descripcion.substring(0, 100)}...` : job.descripcion}
                                </Text>
                              </div>

                              <div className="job-footer">
                                <Space>
                                  <ClockCircleOutlined className="job-icon" />
                                  <Text className="job-date">Ends {dayjs(job.fechaCierre).format("MMM DD")}</Text>
                                </Space>
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-gradient job-apply-button"
                                  icon={<SendOutlined />}
                                  disabled={alreadyApplied}
                                  onClick={() => openApplyModal(job)}
                                >
                                  {alreadyApplied ? "Applied" : "Apply Now"}
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </Col>
                    )
                  })}
                </Row>
              ) : (
                <Empty
                  description="No job opportunities available at the moment"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>

            {/* Performance Insights */}
            <Row gutter={[24, 24]} className="insights-section">
              <Col xs={24} lg={12}>
                <Card
                  title="Performance Insights"
                  className="insights-card"
                  extra={<TrophyOutlined className="card-icon" />}
                >
                  <div className="insights-content">
                    <div className="insight-item insight-strong">
                      <div className="insight-header">
                        <span className="insight-emoji">🎯</span>
                        <Text strong className="insight-title">
                          Strong Areas
                        </Text>
                      </div>
                      <Text className="insight-description">
                        Technical skills and problem-solving approach show consistent improvement.
                      </Text>
                    </div>
                    <div className="insight-item insight-improvement">
                      <div className="insight-header">
                        <span className="insight-emoji">📈</span>
                        <Text strong className="insight-title">
                          Improvement Areas
                        </Text>
                      </div>
                      <Text className="insight-description">
                        Focus on communication clarity and providing more detailed examples.
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="AI Recommendations"
                  className="insights-card"
                  extra={<RobotOutlined className="card-icon" />}
                >
                  <div className="insights-content">
                    <div className="insight-item insight-skill">
                      <div className="insight-header">
                        <span className="insight-emoji">💡</span>
                        <Text strong className="insight-title">
                          Skill Focus
                        </Text>
                      </div>
                      <Text className="insight-description">
                        Based on your applications, consider strengthening your React and Node.js skills.
                      </Text>
                    </div>
                    <div className="insight-item insight-next">
                      <div className="insight-header">
                        <span className="insight-emoji">🚀</span>
                        <Text strong className="insight-title">
                          Next Steps
                        </Text>
                      </div>
                      <Text className="insight-description">
                        Apply to more senior positions to challenge yourself and grow your career.
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>

      {/* Apply to Job Modal */}
      <Modal
        title={
          <div className="modal-header">
            <SendOutlined className="modal-icon" />
            <span>Apply for Position</span>
          </div>
        }
        open={applyModalVisible}
        onCancel={() => {
          if (!applying) {
            setApplyModalVisible(false)
            setSelectedJob(null)
          }
        }}
        footer={[
          <Button key="cancel" onClick={() => setApplyModalVisible(false)} disabled={applying} className="modal-button">
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            className="btn-gradient modal-button"
            loading={applying}
            onClick={handleApplyToJob}
            icon={applying ? <LoadingOutlined /> : <SendOutlined />}
            disabled={applying}
          >
            {applying ? "Processing..." : "Apply Now"}
          </Button>,
        ]}
        className="enhanced-modal"
        closable={!applying}
        maskClosable={!applying}
      >
        {selectedJob && (
          <div className="modal-content">
            <div className="job-preview-card">
              <Title level={4} className="job-preview-title">
                {selectedJob.titulo}
              </Title>
              <div className="job-preview-details">
                <Text className="job-preview-detail">
                  <strong>Position:</strong> {selectedJob.puesto}
                </Text>
                <Text className="job-preview-detail">
                  <strong>Company:</strong> {selectedJob.empresa?.nombre}
                </Text>
                <Text className="job-preview-detail">
                  <strong>Closing Date:</strong> {dayjs(selectedJob.fechaCierre).format("MMM DD, YYYY")}
                </Text>
              </div>
            </div>

            <div className="process-info-card">
              <div className="process-header">
                <RobotOutlined className="process-icon" />
                <Text strong className="process-title">
                  What happens next?
                </Text>
              </div>
              <Text className="process-description">
                After submitting your application, you'll be able to start your AI-powered interview immediately or later.
                The interview is personalized based on the job requirements and typically takes 30-60 minutes.
              </Text>
            </div>

            <div className="warning-info-card">
              <div className="warning-header">
                <ExclamationCircleOutlined className="warning-icon" />
                <Text strong className="warning-title">
                  Important Note
                </Text>
              </div>
              <Text className="warning-description">
                You can only apply once per position. Make sure you're ready to start the interview process.
              </Text>
            </div>

            <Text className="confirmation-text">
              Are you ready to apply for this position?
            </Text>
          </div>
        )}
      </Modal>

      {/* Profile Modal */}
      <Modal
        title={
          <div className="modal-header">
            <UserOutlined className="modal-icon" />
            <span>My Profile</span>
          </div>
        }
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setProfileModalVisible(false)} className="modal-button">
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            className="btn-gradient modal-button"
            icon={<SaveOutlined />}
            onClick={() => profileForm.submit()}
          >
            Save Changes
          </Button>,
        ]}
        width={600}
        className="enhanced-modal"
      >
        <div className="modal-content">
          <Form form={profileForm} layout="vertical" onFinish={handleProfileSave} className="enhanced-form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input placeholder="Enter your full name" className="enhanced-input" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email" disabled className="enhanced-input" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input placeholder="Enter your phone number" className="enhanced-input" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthDate" label="Birth Date">
                  <DatePicker className="enhanced-input w-full" placeholder="Select birth date" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="bio" label="Bio">
              <Input.TextArea
                rows={4}
                placeholder="Tell us about yourself..."
                maxLength={500}
                showCount
                className="enhanced-textarea"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* My Applications Modal */}
      <Modal
        title={
          <div className="modal-header">
            <FileTextOutlined className="modal-icon" />
            <span>My Applications ({myApplications.length})</span>
          </div>
        }
        open={applicationsModalVisible}
        onCancel={() => setApplicationsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setApplicationsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={1000}
        className="enhanced-modal"
      >
        <div className="modal-content">
          <div className="table-container">
            <Table
              columns={applicationColumns}
              dataSource={myApplications}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} applications`,
              }}
              className="enhanced-table"
              scroll={{ x: 800 }}
              rowKey="id"
            />
          </div>
        </div>
      </Modal>

      {/* Browse Jobs Modal */}
      <Modal
        title={
          <div className="modal-header">
            <SearchOutlined className="modal-icon" />
            <span>Browse Jobs ({availableJobs.length})</span>
          </div>
        }
        open={jobsModalVisible}
        onCancel={() => setJobsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setJobsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={1000}
        className="enhanced-modal"
      >
        <div className="modal-content">
          <div className="table-container">
            <Table
              columns={jobsColumns}
              dataSource={availableJobs}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs`,
              }}
              className="enhanced-table"
              scroll={{ x: 800 }}
              rowKey="id"
            />
          </div>
        </div>
      </Modal>

      {/* Settings Drawer */}
      <Drawer
        title={
          <div className="drawer-header">
            <SettingOutlined className="drawer-icon" />
            <span>Settings</span>
          </div>
        }
        placement="right"
        onClose={() => setSettingsDrawerVisible(false)}
        open={settingsDrawerVisible}
        width={400}
        className="enhanced-drawer"
        extra={
          <Button type="primary" className="btn-gradient" icon={<SaveOutlined />} onClick={() => settingsForm.submit()}>
            Save
          </Button>
        }
      >
        <div className="drawer-content">
          <Form form={settingsForm} layout="vertical" onFinish={handleSettingsSave} className="enhanced-form">
            <div className="form-section">
              <Title level={5} className="section-title">
                Notifications
              </Title>
              <Form.Item name="notifications" valuePropName="checked">
                <div className="setting-item">
                  <div className="setting-info">
                    <Text strong>Push Notifications</Text>
                    <Text type="secondary" className="setting-description">
                      Receive notifications about your applications
                    </Text>
                  </div>
                  <input type="checkbox" className="setting-toggle" />
                </div>
              </Form.Item>
              <Form.Item name="emailUpdates" valuePropName="checked">
                <div className="setting-item">
                  <div className="setting-info">
                    <Text strong>Email Updates</Text>
                    <Text type="secondary" className="setting-description">
                      Get email updates about new job opportunities
                    </Text>
                  </div>
                  <input type="checkbox" className="setting-toggle" />
                </div>
              </Form.Item>
            </div>

            <Divider />

            <div className="form-section">
              <Title level={5} className="section-title">
                Preferences
              </Title>
              <Form.Item name="theme" label="Theme">
                <Select placeholder="Select theme" className="enhanced-select">
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                  <Option value="auto">Auto</Option>
                </Select>
              </Form.Item>
              <Form.Item name="language" label="Language">
                <Select placeholder="Select language" className="enhanced-select">
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>
            </div>

            <Divider />

            <div className="form-section">
              <Title level={5} className="section-title">
                Privacy
              </Title>
              <div className="privacy-setting">
                <div className="setting-info">
                  <Text strong>Profile Visibility</Text>
                  <Text type="secondary" className="setting-description">
                    Control who can see your profile
                  </Text>
                </div>
                <Select defaultValue="public" className="enhanced-select">
                  <Option value="public">Public</Option>
                  <Option value="private">Private</Option>
                  <Option value="contacts">Contacts Only</Option>
                </Select>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </Layout>
  )
}

export default UserDashboard