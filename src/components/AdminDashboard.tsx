"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Menu,
} from "antd";
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
  LogoutOutlined,
  PlusOutlined,
  BarChartOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
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
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  usuarioAPI,
  empresaAPI,
  convocatoriaAPI,
  postulacionAPI,
} from "../services/api";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import PrintReport from "./PrintReport";
import dayjs from "dayjs";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalInterviews: number;
  completedInterviews: number;
  activeJobs: number;
  completionRate: number;
  avgScore: number;
  monthlyGrowth: number;
}

interface ChartData {
  name: string;
  users: number;
  companies: number;
  interviews: number;
  completion: number;
}

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    activeJobs: 0,
    completionRate: 0,
    avgScore: 0,
    monthlyGrowth: 0,
  });
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<any>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [activeTab, setActiveTab] = useState("overview");
  const [systemForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: "overview",
      icon: <DashboardOutlined />,
      label: "Resumen",
      className: "sidebar-menu-item",
    },
    {
      type: "divider",
    },
    {
      key: "user-management",
      label: "Gestión de Usuarios",
      type: "group",
      children: [
        {
          key: "users",
          icon: <UserOutlined />,
          label: "Usuarios",
          className: "sidebar-menu-item",
        },
        {
          key: "companies",
          icon: <TeamOutlined />,
          label: "Empresas",
          className: "sidebar-menu-item",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "platform",
      label: "Plataforma",
      type: "group",
      children: [
        {
          key: "interviews",
          icon: <FileTextOutlined />,
          label: "Entrevistas",
          className: "sidebar-menu-item",
        },
        {
          key: "analytics",
          icon: <BarChartOutlined />,
          label: "Analíticas",
          className: "sidebar-menu-item",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "system",
      label: "Sistema",
      type: "group",
      children: [
        {
          key: "security",
          icon: <SecurityScanOutlined />,
          label: "Seguridad",
          className: "sidebar-menu-item",
        },
        {
          key: "database",
          icon: <DatabaseOutlined />,
          label: "Base de Datos",
          className: "sidebar-menu-item",
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Configuración",
          className: "sidebar-menu-item",
        },
      ],
    },
  ];

  useEffect(() => {
    loadAdminData();
  }, [selectedDateRange]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load all data
      const [usersRes, companiesRes, convocatoriasRes, postulacionesRes] =
        await Promise.all([
          usuarioAPI.getAll(),
          empresaAPI.getAll(),
          convocatoriaAPI.getAll(),
          postulacionAPI.getAll(),
        ]);

      const usersData = usersRes.data;
      const companiesData = companiesRes.data;
      const convocatoriasData = convocatoriasRes.data;
      const postulacionesData = postulacionesRes.data;

      setUsers(usersData);
      setCompanies(companiesData);
      setInterviews(postulacionesData);

      // Calculate stats
      const completedCount = postulacionesData.filter(
        (p: any) => p.estado === "COMPLETADA",
      ).length;
      const completionRate =
        postulacionesData.length > 0
          ? (completedCount / postulacionesData.length) * 100
          : 0;

      setStats({
        totalUsers: usersData.length,
        totalCompanies: companiesData.length,
        totalInterviews: postulacionesData.length,
        completedInterviews: completedCount,
        activeJobs: convocatoriasData.filter((c: any) => c.activo).length,
        completionRate: Math.round(completionRate),
        avgScore: 85, // Mock average score
        monthlyGrowth: 12, // Mock growth percentage
      });

      // Generate chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(6 - i, "day");
        return {
          name: date.format("MMM DD"),
          users: Math.floor(Math.random() * 20) + 10,
          companies: Math.floor(Math.random() * 5) + 2,
          interviews: Math.floor(Math.random() * 15) + 5,
          completion: Math.floor(Math.random() * 30) + 70,
        };
      });
      setChartData(last7Days);
    } catch (error) {
      console.error("Error loading admin data:", error);
      message.error("Error loading admin data");
    } finally {
      setLoading(false);
    }
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Perfil",
        icon: <UserOutlined />,
      },
      {
        key: "settings",
        label: "Configuración",
        icon: <SettingOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: "Cerrar Sesión",
        icon: <LogoutOutlined />,
        onClick: logout,
      },
    ],
  };

  const pieData = [
    { name: "Completadas", value: stats.completedInterviews, color: "#10b981" },
    {
      name: "En Progreso",
      value: stats.totalInterviews - stats.completedInterviews,
      color: "#f59e0b",
    },
  ];

  const userColumns = [
    {
      title: "Usuario",
      key: "user",
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">
              {record.nombre} {record.apellidoPaterno}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
      render: (rol: string) => (
        <Tag color={rol === "USUARIO" ? "blue" : "green"}>
          {rol === "USUARIO" ? "Candidato" : "Empresa"}
        </Tag>
      ),
    },
    {
      title: "Estado",
      key: "status",
      render: () => <Tag color="success">Activo</Tag>,
    },
    {
      title: "Registro",
      key: "joined",
      render: () =>
        dayjs()
          .subtract(Math.floor(Math.random() * 365), "day")
          .format("MMM DD, YYYY"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "Ver Detalles", icon: <EyeOutlined /> },
              { key: "edit", label: "Editar", icon: <EditOutlined /> },
              {
                key: "delete",
                label: "Eliminar",
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const companyColumns = [
    {
      title: "Empresa",
      key: "company",
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.logo} icon={<TeamOutlined />} />
          <div>
            <div className="font-medium">{record.nombre}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Industria",
      key: "industry",
      render: () => <Tag>Tecnología</Tag>,
    },
    {
      title: "Trabajos Activos",
      key: "activeJobs",
      render: () => Math.floor(Math.random() * 5) + 1,
    },
    {
      title: "Total Entrevistas",
      key: "totalInterviews",
      render: () => Math.floor(Math.random() * 50) + 10,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "Ver Detalles", icon: <EyeOutlined /> },
              { key: "edit", label: "Editar", icon: <EditOutlined /> },
              {
                key: "delete",
                label: "Eliminar",
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const interviewColumns = [
    {
      title: "Candidato",
      key: "candidate",
      render: (record: any) => (
        <div>
          <div className="font-medium">
            {record.usuario?.nombre} {record.usuario?.apellidoPaterno}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.convocatoria?.titulo}
          </div>
        </div>
      ),
    },
    {
      title: "Empresa",
      key: "company",
      render: (record: any) => record.convocatoria?.empresa?.nombre || "N/A",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: string) => {
        const statusConfig = {
          PENDIENTE: { color: "warning", text: "Pendiente" },
          EN_EVALUACION: { color: "processing", text: "En Progreso" },
          COMPLETADA: { color: "success", text: "Completada" },
          RECHAZADA: { color: "error", text: "Rechazada" },
        };
        const config = statusConfig[estado as keyof typeof statusConfig] || {
          color: "default",
          text: estado,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Fecha",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_record: any) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "Ver Detalles", icon: <EyeOutlined /> },
              {
                key: "results",
                label: "Ver Resultados",
                icon: <TrophyOutlined />,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const renderOverview = () => (
    <div className="overview-content">
      {/* Enhanced Stats Cards */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="enhanced-stats-card">
              <div className="stats-header">
                <UserOutlined className="stats-icon text-blue-600" />
                <div className="stats-trend">
                  <CheckCircleOutlined className="trend-icon" />
                  <Tag color="success" className="trend-tag">
                    +{stats.monthlyGrowth}%
                  </Tag>
                </div>
              </div>
              <div className="stats-content">
                <Statistic
                  title="Usuarios Totales"
                  value={stats.totalUsers}
                  valueStyle={{
                    color: "var(--text-primary)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
                <Progress
                  percent={85}
                  size="small"
                  strokeColor="#6366f1"
                  showInfo={false}
                  className="stats-progress"
                />
                <Text className="progress-text">85% usuarios activos</Text>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="enhanced-stats-card">
              <div className="stats-header">
                <TeamOutlined className="stats-icon text-green-600" />
                <Tag color="success" className="trend-tag">
                  Activo
                </Tag>
              </div>
              <div className="stats-content">
                <Statistic
                  title="Empresas"
                  value={stats.totalCompanies}
                  valueStyle={{
                    color: "var(--text-primary)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
                <Progress
                  percent={92}
                  size="small"
                  strokeColor="#10b981"
                  showInfo={false}
                  className="stats-progress"
                />
                <Text className="progress-text">92% tasa de satisfacción</Text>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="enhanced-stats-card">
              <div className="stats-header">
                <FileTextOutlined className="stats-icon text-purple-600" />
                <Tag color="processing" className="trend-tag">
                  {stats.completionRate}% completadas
                </Tag>
              </div>
              <div className="stats-content">
                <Statistic
                  title="Entrevistas Totales"
                  value={stats.totalInterviews}
                  valueStyle={{
                    color: "var(--text-primary)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
                <Progress
                  percent={stats.completionRate}
                  size="small"
                  strokeColor="#8b5cf6"
                  showInfo={false}
                  className="stats-progress"
                />
                <Text className="progress-text">
                  {stats.completedInterviews} completadas
                </Text>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="enhanced-stats-card">
              <div className="stats-header">
                <TrophyOutlined className="stats-icon text-orange-600" />
                <Tag color="success" className="trend-tag">
                  Excelente
                </Tag>
              </div>
              <div className="stats-content">
                <Statistic
                  title="Puntuación Promedio"
                  value={stats.avgScore}
                  suffix="%"
                  valueStyle={{
                    color: "var(--text-primary)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
                <Progress
                  percent={stats.avgScore}
                  size="small"
                  strokeColor="#f59e0b"
                  showInfo={false}
                  className="stats-progress"
                />
                <Text className="progress-text">Promedio de la plataforma</Text>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Enhanced Charts */}
      <Row gutter={[24, 24]} className="charts-section">
        <Col xs={24} lg={16}>
          <Card
            title="Actividad de la Plataforma"
            extra={<Button icon={<ExportOutlined />}>Exportar</Button>}
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Estado de Entrevistas" className="chart-card">
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
      <Card title="Actividad Reciente" className="activity-card">
        <div className="activity-list">
          {[
            {
              type: "user",
              message: "Nuevo usuario registrado: John Doe",
              time: "hace 2 minutos",
              icon: <UserOutlined className="activity-icon text-blue-600" />,
            },
            {
              type: "interview",
              message: "Entrevista completada: posición Frontend Developer",
              time: "hace 5 minutos",
              icon: (
                <CheckCircleOutlined className="activity-icon text-green-600" />
              ),
            },
            {
              type: "company",
              message: "Nueva empresa se unió: TechCorp Inc.",
              time: "hace 10 minutos",
              icon: <TeamOutlined className="activity-icon text-purple-600" />,
            },
            {
              type: "system",
              message: "Mantenimiento del sistema completado",
              time: "hace 1 hora",
              icon: <SettingOutlined className="activity-icon text-gray-600" />,
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="activity-item"
            >
              <div className="activity-icon-wrapper">{activity.icon}</div>
              <div className="activity-content">
                <Text className="activity-message">{activity.message}</Text>
                <Text className="activity-time">{activity.time}</Text>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            title="Analíticas Avanzadas"
            extra={
              <Space>
                <RangePicker
                  value={selectedDateRange}
                  onChange={setSelectedDateRange}
                />
                <PrintReport
                  data={stats}
                  title="Reporte de Analíticas de la Plataforma"
                  type="analytics"
                />
              </Space>
            }
            className="analytics-card"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Title level={5}>Crecimiento de Usuarios</Title>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Col>
              <Col xs={24} lg={12}>
                <Title level={5}>Tasa de Finalización de Entrevistas</Title>
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
          <Card title="Métricas de Rendimiento" className="metrics-card">
            <div className="metrics-list">
              <div className="metric-item">
                <div className="metric-header">
                  <Text>Tiempo de Actividad del Sistema</Text>
                  <Text strong>99.9%</Text>
                </div>
                <Progress percent={99.9} strokeColor="#10b981" />
              </div>
              <div className="metric-item">
                <div className="metric-header">
                  <Text>Satisfacción del Usuario</Text>
                  <Text strong>94%</Text>
                </div>
                <Progress percent={94} strokeColor="#6366f1" />
              </div>
              <div className="metric-item">
                <div className="metric-header">
                  <Text>Tasa de Éxito de Entrevistas</Text>
                  <Text strong>{stats.completionRate}%</Text>
                </div>
                <Progress
                  percent={stats.completionRate}
                  strokeColor="#f59e0b"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Categorías de Mejor Rendimiento" className="categories-card">
            <Table
              dataSource={[
                {
                  category: "Frontend Development",
                  interviews: 45,
                  avgScore: 87,
                  completion: 92,
                },
                {
                  category: "Backend Development",
                  interviews: 38,
                  avgScore: 84,
                  completion: 89,
                },
                {
                  category: "Data Science",
                  interviews: 29,
                  avgScore: 91,
                  completion: 95,
                },
                {
                  category: "DevOps",
                  interviews: 22,
                  avgScore: 86,
                  completion: 88,
                },
                {
                  category: "Mobile Development",
                  interviews: 18,
                  avgScore: 83,
                  completion: 85,
                },
              ]}
              columns={[
                { title: "Categoría", dataIndex: "category", key: "category" },
                {
                  title: "Entrevistas",
                  dataIndex: "interviews",
                  key: "interviews",
                },
                {
                  title: "Puntuación Promedio",
                  dataIndex: "avgScore",
                  key: "avgScore",
                  render: (score: number) => `${score}%`,
                },
                {
                  title: "Finalización",
                  dataIndex: "completion",
                  key: "completion",
                  render: (rate: number) => `${rate}%`,
                },
              ]}
              pagination={false}
              size="small"
              className="enhanced-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout className="min-h-screen">
      {/* Enhanced Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="enhanced-sidebar admin-sidebar"
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
          <motion.div
            className="sidebar-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="logo-icon admin-logo">
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
                <span className="logo-text">mirAI Admin</span>
                <span className="logo-subtitle">Control del Sistema</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Navigation Menu */}
        <div className="sidebar-menu-container">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems as any}
            className="enhanced-menu admin-menu"
            onClick={({ key }) => setActiveTab(key)}
            style={{
              background: "transparent",
              border: "none",
            }}
          />
        </div>

        {/* Enhanced Admin Status Card */}
        {!collapsed && (
          <motion.div
            className="sidebar-status-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="admin-status-card">
              <div className="status-content">
                <div className="admin-status-header">
                  <WarningOutlined className="admin-warning-icon" />
                  <Title level={5} className="admin-status-title">
                    Acceso de Administrador
                  </Title>
                </div>
                <Text className="admin-status-description">
                  Tienes privilegios completos del sistema
                </Text>
                <div className="admin-status-stats">
                  <div className="admin-stat-item">
                    <span className="admin-stat-number">
                      {stats.totalUsers + stats.totalCompanies}
                    </span>
                    <span className="admin-stat-label">Usuarios Totales</span>
                  </div>
                  <div className="admin-stat-item">
                    <span className="admin-stat-number">
                      {stats.totalInterviews}
                    </span>
                    <span className="admin-stat-label">Entrevistas</span>
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
        <Header className="enhanced-header admin-header">
          <div className="header-content">
            <div className="header-left">
              <div className="page-info">
                <Title level={3} className="page-title">
                  Panel de Administración
                </Title>
                <Text className="page-subtitle">
                  Gestión de plataforma y analíticas
                </Text>
              </div>
            </div>

            <div className="header-right">
              <Space size="middle" className="header-actions">
                <Input.Search
                  placeholder="Buscar..."
                  style={{ width: 200 }}
                  className="admin-search"
                />
                <NotificationDropdown />
                <ThemeToggle />
                <Dropdown menu={userMenu as any} trigger={["click"]}>
                  <Avatar
                    src={user?.avatar}
                    size="large"
                    className="admin-avatar"
                  />
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="enhanced-content admin-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="admin-tabs"
            >
              <TabPane tab="Resumen" key="overview">
                {renderOverview()}
              </TabPane>

              <TabPane tab="Usuarios" key="users">
                <Card
                  title={`Users (${users.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Buscar usuarios..." />
                      <Button icon={<FilterOutlined />}>Filtrar</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="btn-gradient"
                      >
                        Agregar Usuario
                      </Button>
                    </Space>
                  }
                  className="enhanced-table-card"
                >
                  <Table
                    columns={userColumns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="enhanced-table"
                  />
                </Card>
              </TabPane>

              <TabPane tab="Empresas" key="companies">
                <Card
                  title={`Companies (${companies.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Buscar empresas..." />
                      <Button icon={<FilterOutlined />}>Filtrar</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="btn-gradient"
                      >
                        Agregar Empresa
                      </Button>
                    </Space>
                  }
                  className="enhanced-table-card"
                >
                  <Table
                    columns={companyColumns}
                    dataSource={companies}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="enhanced-table"
                  />
                </Card>
              </TabPane>

              <TabPane tab="Interviews" key="interviews">
                <Card
                  title={`Interviews (${interviews.length})`}
                  extra={
                    <Space>
                      <Input.Search placeholder="Buscar entrevistas..." />
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Select.Option value="all">Todos los Estados</Select.Option>
                        <Select.Option value="pending">Pendientes</Select.Option>
                        <Select.Option value="completed">
                          Completadas
                        </Select.Option>
                      </Select>
                      <Button icon={<ExportOutlined />}>Exportar</Button>
                    </Space>
                  }
                  className="enhanced-table-card"
                >
                  <Table
                    columns={interviewColumns}
                    dataSource={interviews}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="enhanced-table"
                  />
                </Card>
              </TabPane>

              <TabPane tab="Analíticas" key="analytics">
                {renderAnalytics()}
              </TabPane>

              <TabPane tab="Configuración" key="settings">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="Configuración del Sistema" className="settings-card">
                      <Form
                        form={systemForm}
                        layout="vertical"
                        className="enhanced-form"
                      >
                        <Form.Item label="Nombre de la Plataforma">
                          <Input
                            defaultValue="mirAI"
                            className="enhanced-input"
                          />
                        </Form.Item>
                        <Form.Item label="Duración Máxima de Entrevista (minutos)">
                          <Input
                            defaultValue="60"
                            type="number"
                            className="enhanced-input"
                          />
                        </Form.Item>
                        <Form.Item label="Modelo de IA por Defecto">
                          <Select
                            defaultValue="gpt-4"
                            className="enhanced-select"
                          >
                            <Select.Option value="gpt-4">GPT-4</Select.Option>
                            <Select.Option value="gpt-3.5">
                              GPT-3.5
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Button type="primary" className="btn-gradient">
                          Guardar Configuración
                        </Button>
                      </Form>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Configuración de Email" className="settings-card">
                      <Form
                        form={emailForm}
                        layout="vertical"
                        className="enhanced-form"
                      >
                        <Form.Item label="Servidor SMTP">
                          <Input
                            placeholder="smtp.gmail.com"
                            className="enhanced-input"
                          />
                        </Form.Item>
                        <Form.Item label="Puerto SMTP">
                          <Input
                            defaultValue="587"
                            type="number"
                            className="enhanced-input"
                          />
                        </Form.Item>
                        <Form.Item label="Plantillas de Email">
                          <Select
                            defaultValue="default"
                            className="enhanced-select"
                          >
                            <Select.Option value="default">
                              Por Defecto
                            </Select.Option>
                            <Select.Option value="modern">Moderno</Select.Option>
                          </Select>
                        </Form.Item>
                        <Button type="primary" className="btn-gradient">
                          Guardar Configuración
                        </Button>
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
  );
};

export default AdminDashboard;
