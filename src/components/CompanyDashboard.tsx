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
  Dropdown,
  message,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  Drawer,
  Divider,
} from "antd"
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  PlusOutlined,
  RobotOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  LogoutOutlined,
  ArrowUpOutlined,
  SaveOutlined,
  BarChartOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { convocatoriaAPI, postulacionAPI } from "../services/api"
import type { Convocatoria, Postulacion } from "../types/api"
import ThemeToggle from "./ThemeToggle"
import NotificationDropdown from "./NotificationDropdown"
import dayjs from "dayjs"

const { Header, Sider, Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Option } = Select

const CompanyDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([])
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false)
  const [profileForm] = Form.useForm()
  const [settingsForm] = Form.useForm()
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
      key: "job-management",
      label: "Job Management",
      type: "group",
      children: [
        {
          key: "convocatorias",
          icon: <FileTextOutlined />,
          label: "Job Postings",
          className: "sidebar-menu-item",
        },
        {
          key: "candidates",
          icon: <TeamOutlined />,
          label: "Candidates",
          className: "sidebar-menu-item",
        },
        {
          key: "analytics",
          icon: <BarChartOutlined />,
          label: "Analytics",
          className: "sidebar-menu-item",
        },
      ],
    },
    {
      key: "divider-2",
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
        address: user.direccion,
        description: user.descripcion,
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

      // Load company's convocatorias
      const convocatoriasResponse = await convocatoriaAPI.getByEmpresa(user.id)
      setConvocatorias(convocatoriasResponse.data)

      // Load all postulaciones for company's convocatorias
      const allPostulaciones: Postulacion[] = []
      for (const convocatoria of convocatoriasResponse.data) {
        if (convocatoria.id) {
          const postulacionesResponse = await postulacionAPI.getByConvocatoria(convocatoria.id)
          allPostulaciones.push(...postulacionesResponse.data)
        }
      }
      setPostulaciones(allPostulaciones)
    } catch (error: any) {
      console.error("Error loading dashboard data:", error)
      message.error("Error loading dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Active Job Postings",
      value: convocatorias.filter((c) => c.activo).length,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: "blue",
      change: `${convocatorias.length} total`,
      trend: "up",
      percentage:
        convocatorias.length > 0
          ? Math.round((convocatorias.filter((c) => c.activo).length / convocatorias.length) * 100)
          : 0,
    },
    {
      title: "Total Applications",
      value: postulaciones.length,
      icon: <TeamOutlined className="text-green-600" />,
      color: "green",
      change: `${postulaciones.filter((p) => p.estado === "COMPLETADA").length} completed`,
      trend: "up",
      percentage:
        postulaciones.length > 0
          ? Math.round((postulaciones.filter((p) => p.estado === "COMPLETADA").length / postulaciones.length) * 100)
          : 0,
    },
    {
      title: "Pending Review",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: "orange",
      change: "Need attention",
      trend: "neutral",
      percentage:
        postulaciones.length > 0
          ? Math.round((postulaciones.filter((p) => p.estado === "PENDIENTE").length / postulaciones.length) * 100)
          : 0,
    },
    {
      title: "In Progress",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <ExclamationCircleOutlined className="text-purple-600" />,
      color: "purple",
      change: "Active interviews",
      trend: "up",
      percentage:
        postulaciones.length > 0
          ? Math.round((postulaciones.filter((p) => p.estado === "EN_EVALUACION").length / postulaciones.length) * 100)
          : 0,
    },
  ]

  const getStatusTag = (status: string) => {
    const statusConfig = {
      ACTIVA: { color: "success", text: "Active" },
      CERRADA: { color: "default", text: "Closed" },
      PAUSADA: { color: "warning", text: "Paused" },
      PENDIENTE: { color: "warning", text: "Pending" },
      EN_EVALUACION: { color: "processing", text: "In Progress" },
      COMPLETADA: { color: "success", text: "Completed" },
      RECHAZADA: { color: "error", text: "Rejected" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const actionMenu = (record: any) => ({
    items: [
      {
        key: "view",
        label: "View Details",
        icon: <EyeOutlined />,
        onClick: () => navigate(`/empresa/convocatoria/${record.id}`),
      },
      {
        key: "candidates",
        label: "View Candidates",
        icon: <TeamOutlined />,
        onClick: () => navigate(`/empresa/convocatoria/${record.id}/candidates`),
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
      },
      {
        key: "delete",
        label: "Delete",
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
  })

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
        key: "divider-1",
        type: "divider" as const,
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: logout,
      },
    ],
  }

  const convocatoriaColumns = [
    {
      title: "Job Posting",
      dataIndex: "titulo",
      key: "titulo",
      render: (text: string, record: Convocatoria) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">{text}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.puesto}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "activo",
      key: "activo",
      render: (activo: boolean) => getStatusTag(activo ? "ACTIVA" : "CERRADA"),
    },
    {
      title: "Applications",
      key: "applications",
      render: (_: any, record: Convocatoria) => {
        const count = postulaciones.filter((p) => p.convocatoria?.id === record.id).length
        const completed = postulaciones.filter(
          (p) => p.convocatoria?.id === record.id && p.estado === "COMPLETADA",
        ).length
        return (
          <div>
            <span className="font-medium">{count}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">{completed} completed</div>
          </div>
        )
      },
    },
    {
      title: "End Date",
      dataIndex: "fechaCierre",
      key: "fechaCierre",
      render: (date: string) => (
        <span className="text-gray-600 dark:text-gray-400">{dayjs(date).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Convocatoria) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

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
                <span className="logo-subtitle">Company Portal</span>
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
            onClick={({ key, item }) => {
              if (item?.props?.onClick) {
                item.props.onClick()
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
                  <Text className="status-description">Ready to help with interviews</Text>
                  <div className="status-stats">
                    <div className="stat-item">
                      <span className="stat-number">{postulaciones.length}</span>
                      <span className="stat-label">Interviews</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{convocatorias.length}</span>
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
                  Company Dashboard
                </Title>
                <Text className="page-subtitle">
                  Welcome back, {user?.name}! Manage your job postings and candidates.
                </Text>
              </div>
            </div>

            <div className="header-right">
              <Space size="middle" className="header-actions">
                <Button icon={<SearchOutlined />} className="action-button" size="large">
                  Search
                </Button>
                <NotificationDropdown />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-gradient"
                  size="large"
                  onClick={() => navigate("/empresa/convocatoria/create")}
                >
                  New Job Posting
                </Button>
                <ThemeToggle />
                <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight">
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
                    Welcome back, {user?.name}! 👋
                  </Title>
                  <Paragraph className="welcome-description">
                    You have{" "}
                    <strong>{postulaciones.filter((p) => p.estado === "PENDIENTE").length} pending applications</strong>{" "}
                    to review and{" "}
                    <strong>{postulaciones.filter((p) => p.estado === "EN_EVALUACION").length} interviews</strong> in
                    progress.
                  </Paragraph>
                  <Space wrap>
                    <Button
                      type="primary"
                      className="btn-gradient"
                      size="large"
                      disabled={postulaciones.filter((p) => p.estado === "PENDIENTE").length === 0}
                    >
                      Review Applications
                    </Button>
                    <Button size="large">View Analytics</Button>
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
                        <div className="stats-trend">
                          <ArrowUpOutlined className="trend-icon" />
                          <Tag color={stat.trend === "up" ? "success" : "default"} className="trend-tag">
                            {stat.change}
                          </Tag>
                        </div>
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
                        <div className="stats-progress">
                          <Progress
                            percent={stat.percentage}
                            size="small"
                            strokeColor="var(--primary-color)"
                            showInfo={false}
                          />
                          <Text className="progress-text">{stat.percentage}% completion rate</Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Job Postings Table */}
            <Card
              title={
                <div className="table-header">
                  <Title level={4} className="table-title">
                    Your Job Postings
                  </Title>
                  <Button type="link" className="view-all-button">
                    View All
                  </Button>
                </div>
              }
              className="enhanced-table-card"
            >
              <div className="table-container">
                <Table
                  columns={convocatoriaColumns}
                  dataSource={convocatorias}
                  loading={loading}
                  pagination={false}
                  className="enhanced-table"
                  scroll={{ x: 800 }}
                  rowKey="id"
                  size="middle"
                />
              </div>
            </Card>

            {/* Quick Actions */}
            <Row gutter={[24, 24]} className="actions-section">
              <Col xs={24} lg={12}>
                <Card title="Quick Actions" className="actions-card" extra={<RobotOutlined className="card-icon" />}>
                  <Space direction="vertical" className="w-full" size="large">
                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<PlusOutlined />}
                      className="btn-gradient action-button-large"
                      onClick={() => navigate("/empresa/convocatoria/create")}
                    >
                      Create New Job Posting
                    </Button>
                    <Button block size="large" icon={<TeamOutlined />} className="action-button-large">
                      Manage Candidates
                    </Button>
                    <Button block size="large" icon={<BarChartOutlined />} className="action-button-large">
                      View Reports
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="AI Insights" className="insights-card" extra={<RobotOutlined className="card-icon" />}>
                  <div className="insights-content">
                    <div className="insight-item insight-trending">
                      <div className="insight-header">
                        <span className="insight-emoji">💡</span>
                        <Text strong className="insight-title">
                          Trending Skills
                        </Text>
                      </div>
                      <Text className="insight-description">
                        React and TypeScript are the most requested skills this month.
                      </Text>
                    </div>
                    <div className="insight-item insight-performance">
                      <div className="insight-header">
                        <span className="insight-emoji">📈</span>
                        <Text strong className="insight-title">
                          Performance Insight
                        </Text>
                      </div>
                      <Text className="insight-description">
                        Your interview completion rate increased by 15% this week.
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>

      {/* Profile Modal */}
      <Modal
        title={
          <div className="modal-header">
            <UserOutlined className="modal-icon" />
            <span>Company Profile</span>
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
                  label="Company Name"
                  rules={[{ required: true, message: "Please enter company name" }]}
                >
                  <Input placeholder="Enter company name" className="enhanced-input" />
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
                  <Input placeholder="Enter phone number" className="enhanced-input" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="Address">
                  <Input placeholder="Enter company address" className="enhanced-input" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Company Description">
              <Input.TextArea
                rows={4}
                placeholder="Describe your company..."
                maxLength={500}
                showCount
                className="enhanced-textarea"
              />
            </Form.Item>
          </Form>
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
                      Receive notifications about applications
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
                      Get email updates about new candidates
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
                Company Settings
              </Title>
              <div className="company-setting">
                <div className="setting-info">
                  <Text strong>Auto-approve Applications</Text>
                  <Text type="secondary" className="setting-description">
                    Automatically approve qualified candidates
                  </Text>
                </div>
                <Select defaultValue="manual" className="enhanced-select">
                  <Option value="manual">Manual Review</Option>
                  <Option value="auto">Auto Approve</Option>
                  <Option value="conditional">Conditional</Option>
                </Select>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </Layout>
  )
}

export default CompanyDashboard
