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
const { Title, Paragraph } = Typography
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
    },
    {
      key: "convocatorias",
      icon: <FileTextOutlined />,
      label: "Job Postings",
    },
    {
      key: "candidates",
      icon: <TeamOutlined />,
      label: "Candidates",
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
        address: user.direccion,
        description: user.descripcion,
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
      percentage: convocatorias.length > 0 ? Math.round((convocatorias.filter((c) => c.activo).length / convocatorias.length) * 100) : 0,
    },
    {
      title: "Total Applications",
      value: postulaciones.length,
      icon: <TeamOutlined className="text-green-600" />,
      color: "green",
      change: `${postulaciones.filter((p) => p.estado === "COMPLETADA").length} completed`,
      trend: "up",
      percentage: postulaciones.length > 0 ? Math.round((postulaciones.filter((p) => p.estado === "COMPLETADA").length / postulaciones.length) * 100) : 0,
    },
    {
      title: "Pending Review",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: "orange",
      change: "Need attention",
      trend: "neutral",
      percentage: postulaciones.length > 0 ? Math.round((postulaciones.filter((p) => p.estado === "PENDIENTE").length / postulaciones.length) * 100) : 0,
    },
    {
      title: "In Progress",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <ExclamationCircleOutlined className="text-purple-600" />,
      color: "purple",
      change: "Active interviews",
      trend: "up",
      percentage: postulaciones.length > 0 ? Math.round((postulaciones.filter((p) => p.estado === "EN_EVALUACION").length / postulaciones.length) * 100) : 0,
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
        const completed = postulaciones.filter((p) => p.convocatoria?.id === record.id && p.estado === "COMPLETADA").length
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
                  Ready to help with interviews!
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
                  Company Dashboard
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400 text-sm mb-0">
                  Welcome back, {user?.name}! Manage your job postings and candidates.
                </Paragraph>
              </div>
            </div>

            <Space size="middle" className="flex items-center">
              <Button
                icon={<SearchOutlined />}
                className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 hidden sm:inline-flex"
              >
                <span className="hidden md:inline">Search</span>
              </Button>
              <NotificationDropdown />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="btn-gradient hidden sm:inline-flex"
                size="large"
                onClick={() => navigate("/empresa/convocatoria/create")}
              >
                <span className="hidden md:inline">New Job Posting</span>
                <span className="md:hidden">New Job</span>
              </Button>
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
                    Welcome back, {user?.name}! 👋
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-4">
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
                      disabled={postulaciones.filter((p) => p.estado === "PENDIENTE").length === 0}
                    >
                      Review Applications
                    </Button>
                    <Button>View Analytics</Button>
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
                        <div className="flex items-center gap-1">
                          <ArrowUpOutlined className="text-green-500 text-sm" />
                          <Tag color={stat.trend === "up" ? "success" : "default"} className="border-0 text-xs">
                            {stat.change}
                          </Tag>
                        </div>
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
                      <div className="mt-3">
                        <Progress
                          percent={stat.percentage}
                          size="small"
                          strokeColor="#6366f1"
                          showInfo={false}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {stat.percentage}% completion rate
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <Title level={4} className="mb-0">
                    Your Job Postings
                  </Title>
                  <Button type="link" className="text-indigo-600 font-medium self-start sm:self-auto">
                    View All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <div className="overflow-x-auto">
                <Table
                  columns={convocatoriaColumns}
                  dataSource={convocatorias}
                  loading={loading}
                  pagination={false}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowKey="id"
                  size="middle"
                />
              </div>
            </Card>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} className="lg:gutter-24">
              <Col xs={24} lg={12}>
                <Card
                  title="Quick Actions"
                  className="border-0 shadow-sm h-full"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <Space direction="vertical" className="w-full" size="middle">
                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<PlusOutlined />}
                      className="btn-gradient h-12"
                      onClick={() => navigate("/empresa/convocatoria/create")}
                    >
                      Create New Job Posting
                    </Button>
                    <Button
                      block
                      size="large"
                      icon={<TeamOutlined />}
                      className="h-12 border-2 border-gray-200 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400"
                    >
                      Manage Candidates
                    </Button>
                    <Button
                      block
                      size="large"
                      icon={<FileTextOutlined />}
                      className="h-12 border-2 border-gray-200 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400"
                    >
                      View Reports
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="AI Insights"
                  className="border-0 shadow-sm h-full"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Paragraph className="text-blue-800 dark:text-blue-300 mb-2 font-medium">
                        💡 Trending Skills
                      </Paragraph>
                      <Paragraph className="text-blue-700 dark:text-blue-400 mb-0 text-sm">
                        React and TypeScript are the most requested skills this month.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <Paragraph className="text-green-800 dark:text-green-300 mb-2 font-medium">
                        📈 Performance Insight
                      </Paragraph>
                      <Paragraph className="text-green-700 dark:text-green-400 mb-0 text-sm">
                        Your interview completion rate increased by 15% this week.
                      </Paragraph>
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
          <div className="flex items-center gap-3 p-2">
            <UserOutlined className="text-indigo-600" />
            <span>Company Profile</span>
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
                  label="Company Name"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="Enter company name" />
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
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Address"
                >
                  <Input placeholder="Enter company address" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="Company Description"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Describe your company..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
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
                    <div className="text-sm text-gray-500">Receive notifications about applications</div>
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
                    <div className="text-sm text-gray-500">Get email updates about new candidates</div>
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
              <Title level={5} className="mb-4">Company Settings</Title>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium mb-1">Auto-approve Applications</div>
                  <div className="text-sm text-gray-500 mb-2">Automatically approve qualified candidates</div>
                  <Select defaultValue="manual" className="w-full">
                    <Option value="manual">Manual Review</Option>
                    <Option value="auto">Auto Approve</Option>
                    <Option value="conditional">Conditional</Option>
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

export default CompanyDashboard
