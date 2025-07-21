"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
} from "antd";
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
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  LogoutOutlined,
  ArrowUpOutlined,
  SaveOutlined,
  BarChartOutlined,
  CalendarOutlined,
  StarOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { convocatoriaAPI, postulacionAPI } from "../services/api";
import type { Convocatoria, Postulacion } from "../types/api";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import dayjs from "dayjs";

const { Header, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const CompanyDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [jobPostingsModalVisible, setJobPostingsModalVisible] = useState(false);
  const [candidatesModalVisible, setCandidatesModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Panel",
      className: "sidebar-menu-item",
    },
    {
      key: "divider-1",
      type: "divider",
    },
    {
      key: "job-management",
      label: "Gestión de Empleos",
      type: "group",
      children: [
        {
          key: "convocatorias",
          icon: <FileTextOutlined />,
          label: "Ofertas de Trabajo",
          className: "sidebar-menu-item",
          onClick: () => setJobPostingsModalVisible(true),
        },
        {
          key: "candidates",
          icon: <TeamOutlined />,
          label: "Candidatos",
          className: "sidebar-menu-item",
          onClick: () => setCandidatesModalVisible(true),
        },
        {
          key: "analytics",
          icon: <BarChartOutlined />,
          label: "Analíticas",
          className: "sidebar-menu-item",
          onClick: () => message.info("¡Función de analíticas próximamente!"),
        },
      ],
    },
    {
      key: "divider-2",
      type: "divider",
    },
    {
      key: "account",
      label: "Cuenta",
      type: "group",
      children: [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Perfil",
          className: "sidebar-menu-item",
          onClick: () => setProfileModalVisible(true),
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Configuración",
          className: "sidebar-menu-item",
          onClick: () => setSettingsDrawerVisible(true),
        },
      ],
    },
  ];

  useEffect(() => {
    loadDashboardData();
    // Initialize forms with user data
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.telefono,
        address: user.direccion,
        description: user.descripcion,
      });
      settingsForm.setFieldsValue({
        notifications: true,
        emailUpdates: true,
        theme: "auto",
        language: "en",
      });
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      console.log("📊 [CompanyDashboard] Loading data from backend");

      // Load company job postings from backend using v2 API
      const convocatoriasResponse = await convocatoriaAPI.getByEmpresaV2(user.id);
      console.log("API Response:", convocatoriasResponse.data);
      
      // Handle the new API v2 response structure
      const responseData = convocatoriasResponse.data;
      const companyJobs = Array.isArray(responseData?.data) ? responseData.data : [];
      
      // Transform the API response to match our interface
      const transformedJobs = companyJobs.map((job: any) => ({
        id: job.id,
        titulo: job.jobTitle,
        descripcion: job.jobDescription,
        puesto: job.category,
        categoria: job.category,
        dificultad: job.dificultad?.toString(),
        fechaPublicacion: job.publicationDate,
        fechaCierre: job.closingDate,
        activo: job.activo,
        // V2 API fields
        publicationDate: job.publicationDate,
        closingDate: job.closingDate,
        formattedSalaryRange: job.formattedSalaryRange,
        isActive: job.isActive,
        daysUntilClosing: job.daysUntilClosing,
        status: job.status,
        // Additional V2 fields
        experienceLevel: job.experienceLevel,
        workMode: job.workMode,
        location: job.location,
        technicalRequirements: job.technicalRequirements,
        benefitsPerks: job.benefitsPerks,
        empresa: {
          id: job.empresaId,
          nombre: job.empresaNombre
        }
      }));
      
      setConvocatorias(transformedJobs);

      // Load all applications for company job postings
      const allPostulaciones: Postulacion[] = [];
      for (const convocatoria of transformedJobs) {
        if (convocatoria.id) {
          try {
            const postulacionesResponse = await postulacionAPI.getByConvocatoria(convocatoria.id);
            const convocatoriaApplications = postulacionesResponse.data || [];
            allPostulaciones.push(...convocatoriaApplications);
          } catch (error) {
            console.warn(`Failed to load applications for job ${convocatoria.id}:`, error);
          }
        }
      }
      setPostulaciones(allPostulaciones);

      console.log(
        `📊 [CompanyDashboard] Backend data loaded: ${companyJobs.length} jobs, ${allPostulaciones.length} applications`,
      );
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      message.error("Error loading dashboard data. Please check your connection and try again.");
      
      // Set empty arrays if backend fails
      setConvocatorias([]);
      setPostulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Convocatorias Activas",
      value: convocatorias.filter((c) => c.activo).length,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: "blue",
      change: `${convocatorias.length} total`,
      trend: "up",
      percentage:
        convocatorias.length > 0
          ? Math.round(
              (convocatorias.filter((c) => c.activo).length /
                convocatorias.length) *
                100,
            )
          : 0,
    },
    {
      title: "Postulaciones Totales",
      value: postulaciones.length,
      icon: <TeamOutlined className="text-green-600" />,
      color: "green",
      change: `${postulaciones.filter((p) => p.estado === "COMPLETADA").length} completadas`,
      trend: "up",
      percentage:
        postulaciones.length > 0
          ? Math.round(
              (postulaciones.filter((p) => p.estado === "COMPLETADA").length /
                postulaciones.length) *
                100,
            )
          : 0,
    },
    {
      title: "Pendiente de Revisión",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: "orange",
      change: "Necesita atención",
      trend: "neutral",
      percentage:
        postulaciones.length > 0
          ? Math.round(
              (postulaciones.filter((p) => p.estado === "PENDIENTE").length /
                postulaciones.length) *
                100,
            )
          : 0,
    },
    {
      title: "En Progreso",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <ExclamationCircleOutlined className="text-purple-600" />,
      color: "purple",
      change: "Entrevistas activas",
      trend: "up",
      percentage:
        postulaciones.length > 0
          ? Math.round(
              (postulaciones.filter((p) => p.estado === "EN_EVALUACION")
                .length /
                postulaciones.length) *
                100,
            )
          : 0,
    },
  ];

  const handleDeleteConvocatoria = async (convocatoriaId: number, titulo: string) => {
    try {
      console.log(`🗑️ [CompanyDashboard] Attempting to delete convocatoria ${convocatoriaId}: "${titulo}"`);
      
      // Verify we have authentication token
      const token = localStorage.getItem('mirai_token');
      if (!token) {
        console.error(`❌ [CompanyDashboard] No authentication token found`);
        message.error("No tienes autorización. Por favor inicia sesión nuevamente.");
        return;
      }
      
      console.log(`🔑 [CompanyDashboard] Authentication token found, proceeding with deletion`);
      
      const response = await convocatoriaAPI.delete(convocatoriaId);
      console.log(`✅ [CompanyDashboard] Successfully deleted convocatoria ${convocatoriaId}:`, response);
      
      message.success(`Convocatoria "${titulo}" eliminada exitosamente`);
      
      // Reload dashboard data to reflect changes
      await loadDashboardData();
      
      console.log(`🔄 [CompanyDashboard] Dashboard data reloaded after deletion`);
    } catch (error: any) {
      console.error(`❌ [CompanyDashboard] Error deleting convocatoria ${convocatoriaId}:`, error);
      
      // Provide more detailed error information
      let errorMessage = "Error al eliminar la convocatoria.";
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        console.error(`HTTP ${status} Error:`, data);
        
        switch (status) {
          case 401:
            errorMessage = "No tienes autorización para eliminar esta convocatoria. Por favor inicia sesión nuevamente.";
            break;
          case 403:
            errorMessage = "No tienes permisos para eliminar esta convocatoria.";
            break;
          case 404:
            errorMessage = "La convocatoria no fue encontrada. Puede que ya haya sido eliminada.";
            break;
          case 409:
            errorMessage = "No se puede eliminar la convocatoria porque tiene postulaciones asociadas.";
            break;
          case 500:
            errorMessage = "Error interno del servidor. Por favor contacta al administrador.";
            break;
          default:
            errorMessage = `Error del servidor (${status}): ${data?.message || 'Error desconocido'}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        errorMessage = `Error inesperado: ${error.message}`;
      }
      
      message.error(errorMessage);
    }
  };

  const actionMenu = (record: any) => ({
    items: [
      {
        key: "view",
        label: "Ver Detalles",
        icon: <EyeOutlined />,
        onClick: () => navigate(`/empresa/convocatoria/${record.id}`),
      },
      {
        key: "candidates",
        label: "Ver Candidatos",
        icon: <TeamOutlined />,
        onClick: () =>
          navigate(`/empresa/convocatoria/${record.id}/candidates`),
      },
      {
        key: "delete",
        label: "Eliminar",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: "Confirmar Eliminación",
            content: `¿Estás seguro de que quieres eliminar la convocatoria "${record.titulo}"? Esta acción no se puede deshacer.`,
            okText: "Sí, Eliminar",
            cancelText: "Cancelar",
            okType: "danger",
            onOk: () => handleDeleteConvocatoria(record.id, record.titulo),
          });
        },
      },
    ],
  });

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Perfil",
        icon: <UserOutlined />,
        onClick: () => setProfileModalVisible(true),
      },
      {
        key: "settings",
        label: "Configuración",
        icon: <SettingOutlined />,
        onClick: () => setSettingsDrawerVisible(true),
      },
      {
        key: "divider-1",
        type: "divider" as const,
      },
      {
        key: "logout",
        label: "Cerrar Sesión",
        icon: <LogoutOutlined />,
        onClick: logout,
      },
    ],
  };

  const convocatoriaColumns = [
    {
      title: "Convocatoria",
      dataIndex: "titulo",
      key: "titulo",
      width: 280,
      render: (text: string, record: Convocatoria) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
            {text}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.puesto}
          </div>
          {record.formattedSalaryRange && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
              {record.formattedSalaryRange}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Categoría y Experiencia",
      key: "categoryInfo",
      width: 180,
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {record.categoria}
          </div>
          {record.experienceLevel && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {record.experienceLevel}
            </div>
          )}
          {record.workMode && (
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {record.workMode}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ubicación",
      key: "location",
      width: 150,
      render: (_: any, record: any) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {record.location || "No especificada"}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (_status: string, record: any) => {
        const isActive = record.isActive;
        const daysLeft = record.daysUntilClosing;
        
        if (!isActive) {
          return <Tag color="red">CERRADA</Tag>;
        }
        
        if (daysLeft <= 3 && daysLeft > 0) {
          return <Tag color="orange">CIERRA PRONTO ({daysLeft}d)</Tag>;
        }
        
        if (daysLeft <= 0) {
          return <Tag color="red">EXPIRADA</Tag>;
        }
        
        return <Tag color="green">ACTIVA ({daysLeft}d restantes)</Tag>;
      },
    },
    {
      title: "Aplicaciones",
      key: "applications",
      width: 120,
      render: (_: any, record: Convocatoria) => {
        const count = postulaciones.filter(
          (p) => p.convocatoria?.id === record.id,
        ).length;
        const completed = postulaciones.filter(
          (p) => p.convocatoria?.id === record.id && p.estado === "COMPLETADA",
        ).length;
        const pending = postulaciones.filter(
          (p) => p.convocatoria?.id === record.id && p.estado === "PENDIENTE",
        ).length;
        return (
          <div>
            <div className="font-medium text-lg">{count}</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {completed} completadas
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {pending} pendientes
            </div>
          </div>
        );
      },
    },
    {
      title: "Fecha de Publicación",
      dataIndex: "publicationDate",
      key: "publicationDate",
      width: 130,
      render: (date: string) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {dayjs(date).format("MMM DD, YYYY")}
        </div>
      ),
    },
    {
      title: "Fecha de Cierre",
      dataIndex: "closingDate",
      key: "closingDate",
      width: 130,
      render: (date: string, record: any) => (
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {dayjs(date).format("DD [de] MMM [de] YYYY")}
          </div>
          {record.daysUntilClosing <= 7 && record.daysUntilClosing > 0 && (
            <div className="text-xs text-orange-500 font-medium">
              {record.daysUntilClosing} días restantes
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Convocatoria) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleProfileSave = (values: any) => {
    console.log("Profile values:", values);
    message.success("Profile updated successfully!");
    setProfileModalVisible(false);
  };

  const handleSettingsSave = (values: any) => {
    console.log("Settings values:", values);
    message.success("Settings saved successfully!");
    setSettingsDrawerVisible(false);
  };

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
          <motion.div
            className="sidebar-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
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
            items={menuItems as any}
            className="enhanced-menu"
            onClick={({ key }) => {
              // Handle menu clicks
              console.log('Menu clicked:', key);
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
                  <Text className="status-description">
                    Ready to help with interviews
                  </Text>
                  <div className="status-stats">
                    <div className="stat-item">
                      <span className="stat-number">
                        {postulaciones.length}
                      </span>
                      <span className="stat-label">Interviews</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {convocatorias.length}
                      </span>
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
                  Panel de Empresa
                </Title>
                <Text className="page-subtitle">
                  ¡Bienvenido de vuelta, {user?.name}! Administra tus
                  publicaciones de trabajo y candidatos.
                </Text>
              </div>
            </div>

            <div className="header-right">
              <Space size="middle" className="header-actions">
                <Button
                  icon={<SearchOutlined />}
                  className="action-button"
                  size="large"
                >
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
                <Dropdown
                  menu={userMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Avatar
                    src={user?.avatar}
                    size="large"
                    className="user-avatar"
                  />
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
                    ¡Bienvenido de vuelta, {user?.name}! 👋
                  </Title>
                  <Paragraph className="welcome-description">
                    Tienes{" "}
                    <strong>
                      {
                        postulaciones.filter((p) => p.estado === "PENDIENTE")
                          .length
                      }{" "}
                      postulaciones pendientes
                    </strong>{" "}
                    para revisar y{" "}
                    <strong>
                      {
                        postulaciones.filter(
                          (p) => p.estado === "EN_EVALUACION",
                        ).length
                      }{" "}
                      entrevistas
                    </strong>{" "}
                    en progreso.
                  </Paragraph>
                  <Space wrap>
                    <Button
                      type="primary"
                      className="btn-gradient"
                      size="large"
                      disabled={
                        postulaciones.filter((p) => p.estado === "PENDIENTE")
                          .length === 0
                      }
                    >
                      Revisar Postulaciones
                    </Button>
                    <Button size="large">Ver Analíticas</Button>
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
                          <Tag
                            color={stat.trend === "up" ? "success" : "default"}
                            className="trend-tag"
                          >
                            {stat.change}
                          </Tag>
                        </div>
                      </div>
                      <div className="stats-content">
                        <Statistic
                          title={
                            <span className="stats-title">{stat.title}</span>
                          }
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
                          <Text className="progress-text">
                            {stat.percentage}% completion rate
                          </Text>
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
                  <Button
                    type="link"
                    className="view-all-button"
                    onClick={() => setJobPostingsModalVisible(true)}
                  >
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
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
                  className="enhanced-table"
                  scroll={{ x: 1200, y: 400 }}
                  rowKey="id"
                  size="middle"
                />
              </div>
            </Card>

            {/* Quick Actions */}
            <Row gutter={[24, 24]} className="actions-section">
              <Col xs={24} lg={12}>
                <Card
                  title="Acciones Rápidas"
                  className="actions-card"
                  extra={<RobotOutlined className="card-icon" />}
                >
                  <Space direction="vertical" className="w-full" size="large">
                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<PlusOutlined />}
                      className="btn-gradient action-button-large"
                      onClick={() => navigate("/empresa/convocatoria/create")}
                    >
                      Crear Nueva Publicación de Trabajo
                    </Button>
                    <Button
                      block
                      size="large"
                      icon={<TeamOutlined />}
                      className="action-button-large"
                    >
                      Gestionar Candidatos
                    </Button>
                    <Button
                      block
                      size="large"
                      icon={<BarChartOutlined />}
                      className="action-button-large"
                    >
                      Ver Reportes
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="Información de IA"
                  className="insights-card"
                  extra={<RobotOutlined className="card-icon" />}
                >
                  <div className="insights-content">
                    <div className="insight-item insight-trending">
                      <div className="insight-header">
                        <span className="insight-emoji">💡</span>
                        <Text strong className="insight-title">
                          Habilidades Tendencia
                        </Text>
                      </div>
                      <Text className="insight-description">
                        React y TypeScript son las habilidades más solicitadas este
                        month.
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
                        Your interview completion rate increased by 15% this
                        week.
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
          <Button
            key="cancel"
            onClick={() => setProfileModalVisible(false)}
            className="modal-button"
          >
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
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileSave}
            className="enhanced-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Company Name"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                >
                  <Input
                    placeholder="Enter company name"
                    className="enhanced-input"
                  />
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
                  <Input
                    placeholder="Enter your email"
                    disabled
                    className="enhanced-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input
                    placeholder="Enter phone number"
                    className="enhanced-input"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="Address">
                  <Input
                    placeholder="Enter company address"
                    className="enhanced-input"
                  />
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
        <div className="drawer-content">
          <Form
            form={settingsForm}
            layout="vertical"
            onFinish={handleSettingsSave}
            className="enhanced-form"
          >
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
                <Select
                  placeholder="Select language"
                  className="enhanced-select"
                >
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

      {/* Job Postings Modal */}
      <Modal
        title={null}
        open={jobPostingsModalVisible}
        onCancel={() => setJobPostingsModalVisible(false)}
        footer={null}
        width={1200}
        className="professional-jobs-modal"
        centered
      >
        <div className="professional-jobs-content">
          {/* Header Section */}
          <div className="jobs-header">
            <div className="header-main">
              <div className="header-icon-wrapper">
                <FileTextOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <Title level={3} className="jobs-title">
                  Job Postings Management
                </Title>
                <Text className="jobs-subtitle">
                  Manage your active job postings and track applications
                </Text>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">{convocatorias.length}</div>
                <div className="stat-label">Total Jobs</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {convocatorias.filter((job) => job.activo).length}
                </div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">{postulaciones.length}</div>
                <div className="stat-label">Applications</div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="jobs-controls">
            <div className="controls-left">
              <Input.Search
                placeholder="Search job postings..."
                className="search-input"
                size="large"
                style={{ width: 300 }}
              />
              <Select
                placeholder="Filter by status"
                className="filter-select"
                size="large"
                style={{ width: 150 }}
                allowClear
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="draft">Draft</Option>
              </Select>
            </div>
            <div className="controls-right">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="create-job-button"
                onClick={() => {
                  setJobPostingsModalVisible(false);
                  navigate("/empresa/convocatoria/create");
                }}
              >
                Create New Job
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {convocatorias.length > 0 ? (
              convocatorias.map((job: any) => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div className="job-title-section">
                      <Title level={4} className="job-title">
                        {job.titulo}
                      </Title>
                      <div className="job-category-info">
                        <Tag color="blue" className="category-tag">
                          {job.categoria}
                        </Tag>
                        {job.experienceLevel && (
                          <Tag color="purple" className="experience-tag">
                            {job.experienceLevel}
                          </Tag>
                        )}
                        {job.workMode && (
                          <Tag color="cyan" className="workmode-tag">
                            {job.workMode}
                          </Tag>
                        )}
                      </div>
                      {job.formattedSalaryRange && (
                        <div className="salary-range">
                          💰 {job.formattedSalaryRange}
                        </div>
                      )}
                      {job.location && (
                        <div className="job-location">
                          📍 {job.location}
                        </div>
                      )}
                    </div>
                    <div className="job-status-section">
                      {(() => {
                        const isActive = job.isActive;
                        const daysLeft = job.daysUntilClosing;
                        
                        if (!isActive) {
                          return <Tag color="red" className="job-status-tag">CLOSED</Tag>;
                        }
                        
                        if (daysLeft !== undefined && daysLeft <= 3 && daysLeft > 0) {
                          return <Tag color="orange" className="job-status-tag">CLOSING SOON ({daysLeft}d)</Tag>;
                        }
                        
                        if (daysLeft !== undefined && daysLeft <= 0) {
                          return <Tag color="red" className="job-status-tag">EXPIRED</Tag>;
                        }
                        
                        return <Tag color="green" className="job-status-tag">ACTIVE {daysLeft !== undefined ? `(${daysLeft}d left)` : ''}</Tag>;
                      })()}
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "view",
                              label: "View Details",
                              icon: <EyeOutlined />,
                              onClick: () =>
                                navigate(`/empresa/convocatoria/${job.id}`),
                            },
                            {
                              key: "candidates",
                              label: "View Candidates",
                              icon: <TeamOutlined />,
                              onClick: () =>
                                navigate(
                                  `/empresa/convocatoria/${job.id}/candidates`,
                                ),
                            },
                            {
                              key: "divider",
                              type: "divider",
                            },
                            {
                              key: "delete",
                              label: "Eliminar Trabajo",
                              icon: <DeleteOutlined />,
                              danger: true,
                              onClick: () => {
                                Modal.confirm({
                                  title: "Confirmar Eliminación",
                                  content: `¿Estás seguro de que quieres eliminar la convocatoria "${job.titulo}"? Esta acción no se puede deshacer y eliminará todas las aplicaciones asociadas.`,
                                  okText: "Sí, Eliminar",
                                  cancelText: "Cancelar",
                                  okType: "danger",
                                  onOk: () => handleDeleteConvocatoria(job.id, job.titulo),
                                });
                              },
                            },
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          className="job-actions-button"
                        />
                      </Dropdown>
                    </div>
                  </div>

                  <div className="job-description">
                    <Text type="secondary" className="job-desc-text">
                      {job.descripcion?.substring(0, 180)}...
                    </Text>
                  </div>

                  {/* Enhanced Technical Requirements and Benefits */}
                  {(job.technicalRequirements || job.benefitsPerks) && (
                    <div className="job-additional-info">
                      {job.technicalRequirements && (
                        <div className="tech-requirements">
                          <Text strong className="info-label">🔧 Tech Requirements:</Text>
                          <Text className="info-text">
                            {job.technicalRequirements.substring(0, 100)}...
                          </Text>
                        </div>
                      )}
                      {job.benefitsPerks && (
                        <div className="benefits-perks">
                          <Text strong className="info-label">✨ Benefits:</Text>
                          <Text className="info-text">
                            {job.benefitsPerks.substring(0, 100)}...
                          </Text>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="job-meta">
                    <div className="meta-row">
                      <div className="meta-item">
                        <CalendarOutlined className="meta-icon" />
                        <span>
                          Published: {dayjs(job.publicationDate).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <div className="meta-item">
                        <ClockCircleOutlined className="meta-icon" />
                        <span>
                          Closes: {dayjs(job.closingDate).format("MMM DD, YYYY")}
                          {job.daysUntilClosing !== undefined && job.daysUntilClosing <= 7 && job.daysUntilClosing > 0 && (
                            <span className="urgent-text"> ({job.daysUntilClosing} days left)</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="meta-row">
                      <div className="meta-item">
                        <StarOutlined className="meta-icon" />
                        <span>Difficulty: {job.dificultad}/10</span>
                      </div>
                      {job.puesto && (
                        <div className="meta-item">
                          <span>Position: {job.puesto}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="job-stats">
                    <div className="stat-item">
                      <div className="stat-number">
                        {
                          postulaciones.filter(
                            (p) => p.convocatoriaId === job.id,
                          ).length
                        }
                      </div>
                      <div className="stat-label">Total Applications</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {
                          postulaciones.filter(
                            (p) => p.convocatoriaId === job.id && p.estado === "PENDIENTE",
                          ).length
                        }
                      </div>
                      <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {
                          postulaciones.filter(
                            (p) =>
                              p.convocatoriaId === job.id &&
                              p.estado === "EN_EVALUACION",
                          ).length
                        }
                      </div>
                      <div className="stat-label">In Review</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {
                          postulaciones.filter(
                            (p) =>
                              p.convocatoriaId === job.id &&
                              p.estado === "COMPLETADA",
                          ).length
                        }
                      </div>
                      <div className="stat-label">Completed</div>
                    </div>
                  </div>

                  <div className="job-actions">
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() =>
                        navigate(`/empresa/convocatoria/${job.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      icon={<TeamOutlined />}
                      type="primary"
                      onClick={() =>
                        navigate(`/empresa/convocatoria/${job.id}/candidates`)
                      }
                    >
                      View Candidates
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FileTextOutlined className="empty-icon" />
                <Title level={4} className="empty-title">
                  No Job Postings Yet
                </Title>
                <Text className="empty-description">
                  Create your first job posting to start receiving applications
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  className="empty-action-button"
                  onClick={() => {
                    setJobPostingsModalVisible(false);
                    navigate("/empresa/convocatoria/create");
                  }}
                >
                  Create Job Posting
                </Button>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="footer-actions">
              <Button
                size="large"
                onClick={() => setJobPostingsModalVisible(false)}
                className="close-button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Candidates Modal */}
      <Modal
        title={null}
        open={candidatesModalVisible}
        onCancel={() => setCandidatesModalVisible(false)}
        footer={null}
        width={1200}
        className="professional-candidates-modal"
        centered
      >
        <div className="professional-candidates-content">
          {/* Header Section */}
          <div className="candidates-header">
            <div className="header-main">
              <div className="header-icon-wrapper">
                <TeamOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <Title level={3} className="candidates-title">
                  Candidates Management
                </Title>
                <Text className="candidates-subtitle">
                  Review and manage candidate applications across all job
                  postings
                </Text>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">{postulaciones.length}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {postulaciones.filter((p) => p.estado === "PENDIENTE").length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {
                    postulaciones.filter((p) => p.estado === "EN_EVALUACION")
                      .length
                  }
                </div>
                <div className="stat-label">In Review</div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="candidates-controls">
            <div className="controls-left">
              <Input.Search
                placeholder="Search candidates..."
                className="search-input"
                size="large"
                style={{ width: 300 }}
              />
              <Select
                placeholder="Filter by status"
                className="filter-select"
                size="large"
                style={{ width: 150 }}
                allowClear
              >
                <Option value="PENDIENTE">Pending</Option>
                <Option value="EN_EVALUACION">In Review</Option>
                <Option value="COMPLETADA">Completed</Option>
                <Option value="RECHAZADA">Rejected</Option>
              </Select>
              <Select
                placeholder="Filter by job"
                className="filter-select"
                size="large"
                style={{ width: 200 }}
                allowClear
              >
                {convocatorias.map((job) => (
                  <Option key={job.id} value={job.id}>
                    {job.titulo}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="candidates-grid">
            {postulaciones.length > 0 ? (
              postulaciones.map((application) => {
                const job = convocatorias.find(
                  (j) => j.id === application.convocatoriaId,
                );
                return (
                  <div key={application.id} className="candidate-card">
                    <div className="candidate-header">
                      <div className="candidate-info">
                        <Avatar size={48} className="candidate-avatar">
                          {application.usuario?.nombre?.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="candidate-details">
                          <Title level={5} className="candidate-name">
                            {application.usuario?.nombre}{" "}
                            {application.usuario?.apellidoPaterno}
                          </Title>
                          <Text type="secondary" className="candidate-email">
                            {application.usuario?.email}
                          </Text>
                        </div>
                      </div>
                      <Tag
                        color={
                          application.estado === "PENDIENTE"
                            ? "orange"
                            : application.estado === "EN_EVALUACION"
                              ? "blue"
                              : application.estado === "COMPLETADA"
                                ? "green"
                                : "red"
                        }
                        className="application-status-tag"
                      >
                        {application.estado}
                      </Tag>
                    </div>

                    <div className="application-meta">
                      <div className="meta-item">
                        <FileTextOutlined className="meta-icon" />
                        <span>Job: {job?.titulo || "Unknown"}</span>
                      </div>
                      <div className="meta-item">
                        <CalendarOutlined className="meta-icon" />
                        <span>
                          Applied:{" "}
                          {dayjs(application.fechaPostulacion).format(
                            "MMM DD, YYYY",
                          )}
                        </span>
                      </div>
                      {application.puntuacion && (
                        <div className="meta-item">
                          <StarOutlined className="meta-icon" />
                          <span>Score: {application.puntuacion}/100</span>
                        </div>
                      )}
                    </div>

                    {application.estado === "EN_EVALUACION" && (
                      <div className="interview-progress">
                        <Text className="progress-label">
                          Interview Progress
                        </Text>
                        <Progress
                          percent={application.puntuacion || 0}
                          size="small"
                          strokeColor="#10b981"
                        />
                      </div>
                    )}

                    <div className="candidate-actions">
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() =>
                          navigate(`/empresa/candidate/${application.id}`)
                        }
                      >
                        View Profile
                      </Button>
                      <Button
                        size="small"
                        icon={<PlayCircleOutlined />}
                        type="primary"
                        disabled={application.estado !== "PENDIENTE"}
                      >
                        Start Interview
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <TeamOutlined className="empty-icon" />
                <Title level={4} className="empty-title">
                  No Applications Yet
                </Title>
                <Text className="empty-description">
                  When candidates apply to your job postings, they will appear
                  here
                </Text>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="footer-actions">
              <Button
                size="large"
                onClick={() => setCandidatesModalVisible(false)}
                className="close-button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CompanyDashboard;
