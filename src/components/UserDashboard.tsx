"use client"

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
  Badge,
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
  InfoCircleOutlined,
  BellOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
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
const { Title, Paragraph } = Typography
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
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "applications",
      icon: <FileTextOutlined />,
      label: "My Applications",
      onClick: () => setApplicationsModalVisible(true),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => setProfileModalVisible(true),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => setSettingsDrawerVisible(true),
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
        theme: 'auto',
        language: 'en',
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
              icon={<PlayCircleOutlined />}
              className="btn-gradient"
              onClick={async () => {
                try {
                  message.loading("Starting your interview...", 1)
                  
                  // Use the new specific endpoint to start the interview
                  await postulacionAPI.iniciarEntrevista(record.id!)
                  
                  setTimeout(() => {
                    navigate(`/usuario/interview/${record.id}`)
                  }, 1000)
                } catch (error: any) {
                  console.error("Error starting interview:", error)
                  message.error("Error starting interview. Please try again.")
                }
              }}
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
            <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/usuario/interview/${record.id}/results`)}>
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

  const handleApplyToJob = async () => {
    if (!selectedJob || !user?.id) return

    setApplying(true)
    try {
      // Create a new application
      const applicationResponse = await postulacionAPI.create({
        usuario: { id: user.id },
        convocatoria: { id: selectedJob.id },
        estado: EstadoPostulacion.PENDIENTE,
        fechaPostulacion: new Date().toISOString()
      })

      const newApplicationId = applicationResponse.data.id || applicationResponse.data

      message.success("Application submitted successfully!")
      
      // Automatically start the interview
      if (newApplicationId) {
        try {
          // Explicitly log the request to debug
          console.log(`Starting interview for application ID: ${newApplicationId}`)
          
          // Make sure we're calling the correct endpoint
          await postulacionAPI.iniciarEntrevista(newApplicationId)
          
          message.loading("Preparing your interview...", 1.5)
          
          setTimeout(() => {
            setApplyModalVisible(false)
            setSelectedJob(null)
            
            // Redirect to interview questions
            navigate(`/usuario/interview/${newApplicationId}`)
          }, 1500)
          
        } catch (interviewError) {
          console.error("Error starting interview:", interviewError)
          // Still close modal and refresh data even if interview start fails
          setApplyModalVisible(false)
          setSelectedJob(null)
          loadDashboardData()
          message.warning("Application submitted, but couldn't start interview automatically. Please try from your dashboard.")
        }
      } else {
        // Fallback if we don't get the application ID
        setApplyModalVisible(false)
        setSelectedJob(null)
        loadDashboardData()
      }

    } catch (error: any) {
      console.error("Error submitting application:", error)
      message.error(error.response?.data?.message || "Error submitting application")
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
    console.log('Profile values:', values)
    message.success('Profile updated successfully!')
    setProfileModalVisible(false)
  }

  const handleSettingsSave = (values: any) => {
    console.log('Settings values:', values)
    message.success('Settings saved successfully!')
    setSettingsDrawerVisible(false)
  }

  return (
    <Layout className="main-layout min-h-screen">
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar-layout" width={280}>
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">
            <RobotOutlined />
          </div>
          {!collapsed && <span className="logo-text">mirAI</span>}
        </div>

        {/* Navigation Menu */}
        <Menu 
          mode="inline" 
          defaultSelectedKeys={["dashboard"]} 
          items={menuItems} 
          className="border-r-0 mt-4"
          onClick={({ key, item }) => {
            if (item?.props?.onClick) {
              item.props.onClick()
            }
          }}
        />

        {/* Mirabot Status */}
        {!collapsed && (
          <div className="p-6 mt-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
              <div className="text-center">
                <div className="mirabot-avatar mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                  <RobotOutlined className="text-2xl text-white" />
                </div>
                <Title level={5} className="mb-2 text-indigo-800 dark:text-indigo-300">
                  mirAI
                </Title>
                <Paragraph className="text-indigo-600 dark:text-indigo-400 text-sm mb-0">
                  Ready to help you succeed!
                </Paragraph>
              </div>
            </Card>
          </div>
        )}
      </Sider>

      <Layout>
        {/* Enhanced Header */}
        <Header className="header-layout border-b bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center h-full px-6 lg:px-8">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
              />
              <div className="hidden sm:block">
                <Title level={4} className="mb-0">
                  My Dashboard
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400 text-sm mb-0">
                  Welcome back, {user?.name}! Track your applications and interviews.
                </Paragraph>
              </div>
            </div>

            <Space size="middle" className="flex items-center">
              <Button
                icon={<SearchOutlined />}
                className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 hidden sm:inline-flex"
                onClick={() => setJobsModalVisible(true)}
              >
                <span className="hidden md:inline">Search Jobs</span>
              </Button>
              <NotificationDropdown />
              <ThemeToggle />
              <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight">
                <Avatar 
                  src={user?.avatar} 
                  size="large" 
                  className="cursor-pointer border-2 border-indigo-200 hover:border-indigo-300 transition-colors" 
                />
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="content-layout p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Welcome Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <Row align="middle" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Title level={3} className="mb-3">
                    Hello, {user?.name}! 👋
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-4">
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
                    <Button onClick={() => setJobsModalVisible(true)}>Browse Jobs</Button>
                  </Space>
                </Col>
                <Col xs={24} lg={8}>
                  <div className="text-center">
                    <img
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                      alt="AI Assistant"
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-lg mx-auto"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="lg:gutter-24">
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="stats-card h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-2xl lg:text-3xl">{stat.icon}</div>
                        <Tag color={stat.trend === "up" ? "success" : "default"} className="border-0 text-xs">
                          {stat.change}
                        </Tag>
                      </div>
                      <Statistic
                        title={<span className="text-gray-600 dark:text-gray-400 font-medium text-sm">{stat.title}</span>}
                        value={stat.value}
                        valueStyle={{
                          color: "var(--ant-color-text)",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          lineHeight: 1.2,
                        }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* My Applications Table */}
            <Card
              title={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <Title level={4} className="mb-0">
                    My Applications
                  </Title>
                  <Button 
                    type="link" 
                    className="text-indigo-600 font-medium self-start sm:self-auto"
                    onClick={() => setApplicationsModalVisible(true)}
                  >
                    View All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <div className="overflow-x-auto">
                <Table
                  columns={applicationColumns}
                  dataSource={myApplications.slice(0, 5)}
                  loading={loading}
                  pagination={false}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowKey="id"
                  size="middle"
                />
              </div>
            </Card>

            {/* Available Jobs */}
            <Card
              title={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <Title level={4} className="mb-0">
                    Available Job Opportunities
                  </Title>
                  <Button 
                    type="link" 
                    className="text-indigo-600 font-medium self-start sm:self-auto"
                    onClick={() => setJobsModalVisible(true)}
                  >
                    Browse All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              {availableJobs.length > 0 ? (
                <Row gutter={[16, 16]} className="lg:gutter-24">
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
                          <Card className="hover-card border border-gray-200 dark:border-gray-600 transition-all duration-300 h-full">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <Title level={5} className="mb-1 line-clamp-2">
                                    {job.titulo}
                                  </Title>
                                  <Paragraph className="text-gray-600 dark:text-gray-300 mb-2">
                                    {job.empresa?.nombre}
                                  </Paragraph>
                                  <Tag color="blue">{job.puesto}</Tag>
                                </div>
                              </div>

                              <Paragraph className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                                {job.descripcion.length > 150
                                  ? `${job.descripcion.substring(0, 150)}...`
                                  : job.descripcion}
                              </Paragraph>

                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <Space>
                                  <ClockCircleOutlined className="text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Ends {dayjs(job.fechaCierre).format("MMM DD")}
                                  </span>
                                </Space>
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-gradient w-full sm:w-auto"
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
                <Empty description="No job opportunities available at the moment" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>

            {/* Performance Insights */}
            <Row gutter={[16, 16]} className="lg:gutter-24">
              <Col xs={24} lg={12}>
                <Card
                  title="Performance Insights"
                  className="border-0 shadow-sm h-full"
                  extra={<TrophyOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <Paragraph className="text-green-800 dark:text-green-300 mb-2 font-medium">
                        🎯 Strong Areas
                      </Paragraph>
                      <Paragraph className="text-green-700 dark:text-green-400 mb-0 text-sm">
                        Technical skills and problem-solving approach show consistent improvement.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Paragraph className="text-blue-800 dark:text-blue-300 mb-2 font-medium">
                        📈 Improvement Areas
                      </Paragraph>
                      <Paragraph className="text-blue-700 dark:text-blue-400 mb-0 text-sm">
                        Focus on communication clarity and providing more detailed examples.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="AI Recommendations"
                  className="border-0 shadow-sm h-full"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <Paragraph className="text-purple-800 dark:text-purple-300 mb-2 font-medium">
                        💡 Skill Focus
                      </Paragraph>
                      <Paragraph className="text-purple-700 dark:text-purple-400 mb-0 text-sm">
                        Based on your applications, consider strengthening your React and Node.js skills.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <Paragraph className="text-orange-800 dark:text-orange-300 mb-2 font-medium">
                        🚀 Next Steps
                      </Paragraph>
                      <Paragraph className="text-orange-700 dark:text-orange-400 mb-0 text-sm">
                        Apply to more senior positions to challenge yourself and grow your career.
                      </Paragraph>
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
          <div className="flex items-center space-x-3">
            <SendOutlined className="text-indigo-600" />
            <span>Apply for Position</span>
          </div>
        }
        open={applyModalVisible}
        onCancel={() => {
          setApplyModalVisible(false)
          setSelectedJob(null)
        }}
        footer={[
          <Button key="cancel" onClick={() => setApplyModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            className="btn-gradient"
            loading={applying}
            onClick={handleApplyToJob}
            icon={<SendOutlined />}
          >
            {applying ? "Submitting..." : "Apply & Start Interview"}
          </Button>,
        ]}
        className="apply-modal"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <Title level={4} className="mb-2 text-indigo-800 dark:text-indigo-300">
                {selectedJob.titulo}
              </Title>
              <Paragraph className="text-indigo-600 dark:text-indigo-400 mb-2">
                <strong>Position:</strong> {selectedJob.puesto}
              </Paragraph>
              <Paragraph className="text-indigo-600 dark:text-indigo-400 mb-2">
                <strong>Company:</strong> {selectedJob.empresa?.nombre}
              </Paragraph>
              <Paragraph className="text-indigo-600 dark:text-indigo-400 mb-0">
                <strong>Closing Date:</strong> {dayjs(selectedJob.fechaCierre).format("MMM DD, YYYY")}
              </Paragraph>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <RobotOutlined className="text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-300">What happens next?</span>
              </div>
              <Paragraph className="text-blue-700 dark:text-blue-400 mb-0 text-sm">
                After submitting your application, you'll be immediately redirected to start your AI-powered interview. 
                The interview is personalized based on the job requirements and typically takes 30-60 minutes.
              </Paragraph>
            </div>

            <Paragraph className="text-gray-600 dark:text-gray-400">
              Are you ready to apply for this position and begin your interview?
            </Paragraph>
          </div>
        )}
      </Modal>

      {/* Profile Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <UserOutlined className="text-indigo-600" />
            <span>My Profile</span>
          </div>
        }
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setProfileModalVisible(false)} className="mr-3">
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            className="btn-gradient" 
            icon={<SaveOutlined />}
            onClick={() => profileForm.submit()}
          >
            Save Changes
          </Button>,
        ]}
        width={600}
        className="profile-modal"
      >
        <div className="p-4">
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileSave}
            className="space-y-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Enter your email" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="birthDate"
                  label="Birth Date"
                >
                  <DatePicker className="w-full" placeholder="Select birth date" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="bio"
              label="Bio"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Tell us about yourself..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* My Applications Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <FileTextOutlined className="text-indigo-600" />
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
        className="applications-modal"
      >
        <div className="p-4">
          <div className="overflow-x-auto">
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
              className="custom-table"
              scroll={{ x: 800 }}
              rowKey="id"
            />
          </div>
        </div>
      </Modal>

      {/* Browse Jobs Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-2">
            <SearchOutlined className="text-indigo-600" />
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
        className="jobs-modal"
      >
        <div className="p-4">
          <div className="overflow-x-auto">
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
              className="custom-table"
              scroll={{ x: 800 }}
              rowKey="id"
            />
          </div>
        </div>
      </Modal>

      {/* Settings Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <SettingOutlined className="text-indigo-600" />
            <span>Settings</span>
          </div>
        }
        placement="right"
        onClose={() => setSettingsDrawerVisible(false)}
        open={settingsDrawerVisible}
        width={400}
        className="settings-drawer"
        extra={
          <Button 
            type="primary" 
            className="btn-gradient" 
            icon={<SaveOutlined />}
            onClick={() => settingsForm.submit()}
          >
            Save
          </Button>
        }
      >
        <div className="p-4">
          <Form
            form={settingsForm}
            layout="vertical"
            onFinish={handleSettingsSave}
            className="space-y-6"
          >
            <div>
              <Title level={5} className="mb-4">Notifications</Title>
              <Form.Item
                name="notifications"
                valuePropName="checked"
              >
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications about your applications</div>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </Form.Item>
              <Form.Item
                name="emailUpdates"
                valuePropName="checked"
              >
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Updates</div>
                    <div className="text-sm text-gray-500">Get email updates about new job opportunities</div>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </Form.Item>
            </div>

            <div>
              <Title level={5} className="mb-4">Preferences</Title>
              <Form.Item
                name="theme"
                label="Theme"
              >
                <Select placeholder="Select theme">
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                  <Option value="auto">Auto</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="language"
                label="Language"
              >
                <Select placeholder="Select language">
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Title level={5} className="mb-4">Privacy</Title>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium mb-1">Profile Visibility</div>
                  <div className="text-sm text-gray-500 mb-2">Control who can see your profile</div>
                  <Select defaultValue="public" className="w-full">
                    <Option value="public">Public</Option>
                    <Option value="private">Private</Option>
                    <Option value="contacts">Contacts Only</Option>
                  </Select>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </Layout>
  )
}

export default UserDashboard