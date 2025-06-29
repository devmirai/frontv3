"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Progress,
  Select,
  DatePicker,
  Input,
  Form,
  message,
  Tabs,
  Avatar,
  Dropdown,
  Badge,
  Menu,
} from "antd"
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  RobotOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  PlusOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { usuarioAPI, empresaAPI, convocatoriaAPI, postulacionAPI } from "../services/api"
import ThemeToggle from "./ThemeToggle"
import NotificationDropdown from "./NotificationDropdown"
import PrintReport from "./PrintReport"
import dayjs from "dayjs"

const { Header, Sider, Content } = Layout
const { Title, Paragraph } = Typography
const { RangePicker } = DatePicker
const { TabPane } = Tabs

interface AdminStats {
  totalUsers: number
  totalCompanies: number
  totalInterviews: number
  completedInterviews: number
  activeJobs: number
  completionRate: number
  avgScore: number
  monthlyGrowth: number
}

interface ChartData {
  name: string
  users: number
  companies: number
  interviews: number
  completion: number
}

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    activeJobs: 0,
    completionRate: 0,
    avgScore: 0,
    monthlyGrowth: 0,
  })
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [interviews, setInterviews] = useState([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<any>([dayjs().subtract(30, "day"), dayjs()])
  const [activeTab, setActiveTab] = useState("overview")
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: "overview",
      icon: <DashboardOutlined />,
      label: "Overview",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "companies",
      icon: <TeamOutlined />,
      label: "Companies",
    },
    {
      key: "interviews",
      icon: <FileTextOutlined />,
      label: "Interviews",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ]

  useEffect(() => {
    loadAdminData()
  }, [selectedDateRange])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Load all data
      const [usersRes, companiesRes, convocatoriasRes, postulacionesRes] = await Promise.all([
        usuarioAPI.getAll(),
        empresaAPI.getAll(),
        convocatoriaAPI.getAll(),
        postulacionAPI.getAll(),
      ])

      const usersData = usersRes.data
      const companiesData = companiesRes.data
      const convocatoriasData = convocatoriasRes.data
      const postulacionesData = postulacionesRes.data

      setUsers(usersData)
      setCompanies(companiesData)
      setInterviews(postulacionesData)

      // Calculate stats
      const completedCount = postulacionesData.filter((p: any) => p.estado === "COMPLETADA").length
      const completionRate = postulacionesData.length > 0 ? (completedCount / postulacionesData.length) * 100 : 0

      setStats({
        totalUsers: usersData.length,
        totalCompanies: companiesData.length,
        totalInterviews: postulacionesData.length,
        completedInterviews: completedCount,
        activeJobs: convocatoriasData.filter((c: any) => c.activo).length,
        completionRate: Math.round(completionRate),
        avgScore: 85, // Mock average score
        monthlyGrowth: 12, // Mock growth percentage
      })

      // Generate chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(6 - i, "day")
        return {
          name: date.format("MMM DD"),
          users: Math.floor(Math.random() * 20) + 10,
          companies: Math.floor(Math.random() * 5) + 2,
          interviews: Math.floor(Math.random() * 15) + 5,
          completion: Math.floor(Math.random() * 30) + 70,
        }
      })
      setChartData(last7Days)
    } catch (error) {
      console.error("Error loading admin data:", error)
      message.error("Error loading admin data")
    } finally {
      setLoading(false)
    }
  }

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <UserOutlined />,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
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

  const pieData = [
    { name: "Completed", value: stats.completedInterviews, color: "#10b981" },
    { name: "In Progress", value: stats.totalInterviews - stats.completedInterviews, color: "#f59e0b" },
  ]

  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">
              {record.nombre} {record.apellidoPaterno}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "rol",
      key: "rol",
      render: (rol: string) => (
        <Tag color={rol === "USUARIO" ? "blue" : "green"}>{rol === "USUARIO" ? "Candidate" : "Company"}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="success">Active</Tag>,
    },
    {
      title: "Joined",
      key: "joined",
      render: () =>
        dayjs()
          .subtract(Math.floor(Math.random() * 365), "day")
          .format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Details", icon: <EyeOutlined /> },
              { key: "edit", label: "Edit", icon: <EditOutlined /> },
              { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const companyColumns = [
    {
      title: "Company",
      key: "company",
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.logo} icon={<TeamOutlined />} />
          <div>
            <div className="font-medium">{record.nombre}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Industry",
      key: "industry",
      render: () => <Tag>Technology</Tag>,
    },
    {
      title: "Active Jobs",
      key: "activeJobs",
      render: () => Math.floor(Math.random() * 5) + 1,
    },
    {
      title: "Total Interviews",
      key: "totalInterviews",
      render: () => Math.floor(Math.random() * 50) + 10,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Details", icon: <EyeOutlined /> },
              { key: "edit", label: "Edit", icon: <EditOutlined /> },
              { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const interviewColumns = [
    {
      title: "Candidate",
      key: "candidate",
      render: (record: any) => (
        <div>
          <div className="font-medium">
            {record.usuario?.nombre} {record.usuario?.apellidoPaterno}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.convocatoria?.titulo}</div>
        </div>
      ),
    },
    {
      title: "Company",
      key: "company",
      render: (record: any) => record.convocatoria?.empresa?.nombre || "N/A",
    },
    {
      title: "Status",
      dataIndex: "estado",
      key: "estado",
      render: (estado: string) => {
        const statusConfig = {
          PENDIENTE: { color: "warning", text: "Pending" },
          EN_EVALUACION: { color: "processing", text: "In Progress" },
          COMPLETADA: { color: "success", text: "Completed" },
          RECHAZADA: { color: "error", text: "Rejected" },
        }
        const config = statusConfig[estado as keyof typeof statusConfig] || { color: "default", text: estado }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: "Date",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Details", icon: <EyeOutlined /> },
              { key: "results", label: "View Results", icon: <TrophyOutlined /> },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="stats-card">
              <div className="flex justify-between items-start mb-4">
                <UserOutlined className="text-3xl text-blue-600" />
                <div className="flex items-center gap-1">
                  <CheckCircleOutlined className="text-green-500 text-sm" />
                  <Tag color="success">+{stats.monthlyGrowth}%</Tag>
                </div>
              </div>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                valueStyle={{
                  color: "var(--ant-color-text)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              />
              <Progress percent={85} size="small" strokeColor="#6366f1" showInfo={false} className="mt-3" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">85% active users</div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="stats-card">
              <div className="flex justify-between items-start mb-4">
                <TeamOutlined className="text-3xl text-green-600" />
                <Tag color="success">Active</Tag>
              </div>
              <Statistic
                title="Companies"
                value={stats.totalCompanies}
                valueStyle={{
                  color: "var(--ant-color-text)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              />
              <Progress percent={92} size="small" strokeColor="#10b981" showInfo={false} className="mt-3" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">92% satisfaction rate</div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="stats-card">
              <div className="flex justify-between items-start mb-4">
                <FileTextOutlined className="text-3xl text-purple-600" />
                <Tag color="processing">{stats.completionRate}% completed</Tag>
              </div>
              <Statistic
                title="Total Interviews"
                value={stats.totalInterviews}
                valueStyle={{
                  color: "var(--ant-color-text)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              />
              <Progress percent={stats.completionRate} size="small" strokeColor="#8b5cf6" showInfo={false} className="mt-3" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.completedInterviews} completed</div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="stats-card">
              <div className="flex justify-between items-start mb-4">
                <TrophyOutlined className="text-3xl text-orange-600" />
                <Tag color="success">Excellent</Tag>
              </div>
              <Statistic
                title="Avg Score"
                value={stats.avgScore}
                suffix="%"
                valueStyle={{
                  color: "var(--ant-color-text)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              />
              <Progress percent={stats.avgScore} size="small" strokeColor="#f59e0b" showInfo={false} className="mt-3" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platform average</div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Enhanced Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Platform Activity" extra={<Button icon={<ExportOutlined />}>Export</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} />
                <Line type="monotone" dataKey="interviews" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Interview Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[
            {
              type: "user",
              message: "New user registered: John Doe",
              time: "2 minutes ago",
              icon: <UserOutlined className="text-blue-600" />,
            },
            {
              type: "interview",
              message: "Interview completed: Frontend Developer position",
              time: "5 minutes ago",
              icon: <CheckCircleOutlined className="text-green-600" />,
            },
            {
              type: "company",
              message: "New company joined: TechCorp Inc.",
              time: "10 minutes ago",
              icon: <TeamOutlined className="text-purple-600" />,
            },
            {
              type: "system",
              message: "System maintenance completed",
              time: "1 hour ago",
              icon: <SettingOutlined className="text-gray-600" />,
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
            >
              <div className="text-xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{activity.message}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            title="Advanced Analytics"
            extra={
              <Space>
                <RangePicker value={selectedDateRange} onChange={setSelectedDateRange} />
                <PrintReport data={stats} title="Platform Analytics Report" type="analytics" />
              </Space>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Title level={5}>User Growth</Title>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Col>
              <Col xs={24} lg={12}>
                <Title level={5}>Interview Completion Rate</Title>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Performance Metrics">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>System Uptime</span>
                  <span>99.9%</span>
                </div>
                <Progress percent={99.9} strokeColor="#10b981" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>User Satisfaction</span>
                  <span>94%</span>
                </div>
                <Progress percent={94} strokeColor="#6366f1" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Interview Success Rate</span>
                  <span>{stats.completionRate}%</span>
                </div>
                <Progress percent={stats.completionRate} strokeColor="#f59e0b" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Top Performing Categories">
            <Table
              dataSource={[
                { category: "Frontend Development", interviews: 45, avgScore: 87, completion: 92 },
                { category: "Backend Development", interviews: 38, avgScore: 84, completion: 89 },
                { category: "Data Science", interviews: 29, avgScore: 91, completion: 95 },
                { category: "DevOps", interviews: 22, avgScore: 86, completion: 88 },
                { category: "Mobile Development", interviews: 18, avgScore: 83, completion: 85 },
              ]}
              columns={[
                { title: "Category", dataIndex: "category", key: "category" },
                { title: "Interviews", dataIndex: "interviews", key: "interviews" },
                { title: "Avg Score", dataIndex: "avgScore", key: "avgScore", render: (score: number) => `${score}%` },
                {
                  title: "Completion",
                  dataIndex: "completion",
                  key: "completion",
                  render: (rate: number) => `${rate}%`,
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar-layout" width={280}>
        <div className="logo-container">
          <div className="logo-icon">
            <RobotOutlined />
          </div>
          {!collapsed && <span className="logo-text">mirAI Admin</span>}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={menuItems}
          className="border-r-0 mt-4"
          onClick={({ key }) => setActiveTab(key)}
        />

        {!collapsed && (
          <div className="p-6 mt-8">
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  <WarningOutlined className="text-red-600" />
                </div>
                <Title level={5} className="mb-2 text-red-800 dark:text-red-300">
                  Admin Access
                </Title>
                <Paragraph className="text-red-600 dark:text-red-400 text-sm mb-0">
                  You have full system privileges
                </Paragraph>
              </div>
            </Card>
          </div>
        )}
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="header-layout border-b">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-6">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              />
              <div>
                <Title level={4} className="mb-0">
                  Admin Dashboard
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400 text-sm mb-0">
                  Platform management and analytics
                </Paragraph>
              </div>
            </div>

            <Space size="large">
              <Input.Search
                placeholder="Search..."
                style={{ width: 200 }}
                className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400"
              />
              <NotificationDropdown />
              <ThemeToggle />
              <Dropdown menu={userMenu} trigger={["click"]}>
                <Avatar src={user?.avatar} size="large" className="cursor-pointer border-2 border-red-200" />
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="content-layout">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="admin-tabs">
              <TabPane tab="Overview" key="overview">
                {renderOverview()}
              </TabPane>

              <TabPane tab="Users" key="users">
                <Card
                  title={`Users (${users.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Search users..." />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button type="primary" icon={<PlusOutlined />}>
                        Add User
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={userColumns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Companies" key="companies">
                <Card
                  title={`Companies (${companies.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Search companies..." />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button type="primary" icon={<PlusOutlined />}>
                        Add Company
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={companyColumns}
                    dataSource={companies}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Interviews" key="interviews">
                <Card
                  title={`Interviews (${interviews.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Search interviews..." />
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                      </Select>
                      <Button icon={<ExportOutlined />}>Export</Button>
                    </Space>
                  }
                >
                  <Table
                    columns={interviewColumns}
                    dataSource={interviews}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Analytics" key="analytics">
                {renderAnalytics()}
              </TabPane>

              <TabPane tab="Settings" key="settings">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="System Settings">
                      <Form layout="vertical">
                        <Form.Item label="Platform Name">
                          <Input defaultValue="mirAI" />
                        </Form.Item>
                        <Form.Item label="Max Interview Duration (minutes)">
                          <Input defaultValue="60" type="number" />
                        </Form.Item>
                        <Form.Item label="Default AI Model">
                          <Select defaultValue="gpt-4">
                            <Select.Option value="gpt-4">GPT-4</Select.Option>
                            <Select.Option value="gpt-3.5">GPT-3.5</Select.Option>
                          </Select>
                        </Form.Item>
                        <Button type="primary">Save Settings</Button>
                      </Form>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Email Settings">
                      <Form layout="vertical">
                        <Form.Item label="SMTP Server">
                          <Input placeholder="smtp.gmail.com" />
                        </Form.Item>
                        <Form.Item label="SMTP Port">
                          <Input defaultValue="587" type="number" />
                        </Form.Item>
                        <Form.Item label="Email Templates">
                          <Select defaultValue="default">
                            <Select.Option value="default">Default</Select.Option>
                            <Select.Option value="modern">Modern</Select.Option>
                          </Select>
                        </Form.Item>
                        <Button type="primary">Save Settings</Button>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminDashboard