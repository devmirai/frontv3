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
} from "antd";
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
  BankOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { convocatoriaAPI, postulacionAPI, preguntaAPI } from "../services/api";
import type { Convocatoria, Postulacion } from "../types/api";
import { EstadoPostulacion } from "../types/api";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import dayjs from "dayjs";

const { Header, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const UserDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Convocatoria[]>([]);
  const [myApplications, setMyApplications] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Convocatoria | null>(null);
  const [applying, setApplying] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [applicationsModalVisible, setApplicationsModalVisible] =
    useState(false);
  const [jobsModalVisible, setJobsModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const [startingInterview, setStartingInterview] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Early return if user is not loaded yet
  if (!user) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      className: "sidebar-menu-item",
    },
    {
      key: "divider-1",
      type: "divider" as const,
    },
    {
      key: "job-search",
      label: "Job Search",
      type: "group" as const,
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
      type: "divider" as const,
    },
    {
      key: "career",
      label: "Career",
      type: "group" as const,
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
      type: "divider" as const,
    },
    {
      key: "account",
      label: "Account",
      type: "group" as const,
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
  ];

  useEffect(() => {
    loadDashboardData();
    // Initialize forms with user data
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.telefono,
        birthDate: user.nacimiento ? dayjs(user.nacimiento) : null,
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

      console.log("📊 [UserDashboard] Loading dashboard data from backend v2 API...");

      // Load active job postings from backend using v2 API
      const convocatoriasResponse = await convocatoriaAPI.getActivasV2();
      console.log("V2 API Response:", convocatoriasResponse.data);
      
      // Handle the new API v2 response structure
      const convocatoriasData = convocatoriasResponse.data;
      const activeJobsData = Array.isArray(convocatoriasData?.data) ? convocatoriasData.data : [];
      
      // Transform the API response to match our interface
      const transformedJobs = activeJobsData.map((job: any) => ({
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
        isActive: job.active,
        daysUntilClosing: job.daysUntilClosing,
        status: job.status,
        // Additional V2 fields
        experienceLevel: job.experienceLevel,
        workMode: job.workMode,
        location: job.location,
        technicalRequirements: job.technicalRequirements,
        benefitsPerks: job.benefitsPerks,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        empresa: {
          id: job.empresaId,
          nombre: job.empresaNombre
        }
      }));
      
      setAvailableJobs(transformedJobs);

      // Load user's applications from backend using JWT-based endpoint
      const postulacionesResponse = await postulacionAPI.getMisPostulaciones();
      console.log("📊 [UserDashboard] Raw postulaciones response:", postulacionesResponse.data);
      
      // Handle the new API response structure
      const postulacionesData = postulacionesResponse.data;
      const userApplicationsData = Array.isArray(postulacionesData?.data) ? postulacionesData.data : [];
      
      // Transform the API response to match our Postulacion interface
      const transformedApplications = userApplicationsData.map((app: any) => ({
        id: app.id,
        fechaPostulacion: app.fechaPostulacion || new Date().toISOString().split('T')[0], // Use current date if not provided
        estado: app.estado,
        preguntasGeneradas: app.preguntasGeneradas,
        entrevistaSessionId: app.entrevistaSessionId,
        usuario: app.usuario,
        convocatoria: {
          id: app.convocatoria.id,
          titulo: app.convocatoria.jobTitle,
          descripcion: app.convocatoria.jobDescription || '',
          puesto: app.convocatoria.category,
          categoria: app.convocatoria.category,
          fechaCierre: app.convocatoria.closingDate,
          activo: app.convocatoria.activo,
          // Additional v2 fields from the new API
          salaryRange: app.convocatoria.salaryRange,
          experienceLevel: app.convocatoria.experienceLevel,
          workMode: app.convocatoria.workMode,
          location: app.convocatoria.location,
          empresa: {
            id: app.convocatoria.empresaId,
            nombre: app.convocatoria.empresaNombre
          }
        }
      }));
      
      setMyApplications(transformedApplications);

      console.log(
        `📊 [UserDashboard] Backend data loaded: ${transformedJobs.length} active jobs, ${transformedApplications.length} applications`,
        transformedApplications
      );

    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      message.error("Error loading dashboard data. Please check your connection and try again.");
      
      // Set empty arrays if backend fails
      setAvailableJobs([]);
      setMyApplications([]);
    } finally {
      setLoading(false);
    }
  };

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
      value: myApplications.filter(
        (a) => a.estado === EstadoPostulacion.COMPLETADA,
      ).length,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: "green",
      change: `${Math.round((myApplications.filter((a) => a.estado === EstadoPostulacion.COMPLETADA).length / Math.max(myApplications.length, 1)) * 100)}% completion rate`,
      trend: "up",
    },
    {
      title: "In Progress",
      value: myApplications.filter(
        (a) => a.estado === EstadoPostulacion.EN_EVALUACION,
      ).length,
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
  ];

  const getStatusTag = (status: EstadoPostulacion) => {
    const statusConfig = {
      [EstadoPostulacion.PENDIENTE]: { color: "warning", text: "Pending" },
      [EstadoPostulacion.EN_EVALUACION]: {
        color: "processing",
        text: "In Progress",
      },
      [EstadoPostulacion.COMPLETADA]: { color: "success", text: "Completed" },
      [EstadoPostulacion.RECHAZADA]: { color: "error", text: "Rejected" },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

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
  };

  // Combined function for Steps 2-3: Create postulation and start interview immediately
  const handleApplyAndStartInterview = async (job: any) => {
    if (!user?.id) {
      message.error('User information not available');
      return;
    }

    try {
      console.log('🎯 [UserDashboard] Step 1: Creating postulation for job:', job.id);
      
      if (!job.id) {
        throw new Error("Job ID is missing");
      }

      // Step 1: Create postulation first
      const postulacionData = {
        usuario: {
          id: user.id
        },
        convocatoria: {
          id: job.id
        }
      };

      const postulacionResponse = await postulacionAPI.create(postulacionData);
      const postulacion = postulacionResponse.data;
      const postulacionId = postulacion.data.id; // Extract ID from nested data object
      
      console.log('✅ [UserDashboard] Step 1: Postulation created:', postulacionId);
      
      // Step 2: Start interview with the postulation ID
      console.log('🎯 [UserDashboard] Step 2: Starting interview with postulation:', postulacionId);
      const interviewResponse = await postulacionAPI.iniciarEntrevista(postulacionId);
      const { sessionId } = interviewResponse.data;
      
      console.log('✅ [UserDashboard] Step 2: Interview started:', sessionId);
      message.success("Application submitted and interview started! Redirecting...");

      // Reload dashboard data to show the new application
      await loadDashboardData();

      // Navigate to the interview with the postulation ID
      navigate(`/usuario/interview/${postulacionId}?session=${sessionId}`);
      
    } catch (error: any) {
      console.error("❌ [UserDashboard] Error in application process:", error);
      
      if (error.response?.status === 409) {
        message.error("You have already applied to this position.");
      } else if (error.response?.status === 400) {
        message.error("Invalid application data. Please try again.");
      } else {
        message.error("Failed to submit application. Please try again.");
      }
    }
  }

  // Interview start function - uses backend API to start interview (Step 3)
  const handleStartInterview = async (postulacionId: number) => {
    try {
      setStartingInterview(postulacionId);

      console.log('🎯 [UserDashboard] Step 3: Starting interview via backend API');
      
      // Step 3: Start interview using backend API and get session_id
      const response = await postulacionAPI.iniciarEntrevista(postulacionId);
      const sessionId = response.data?.sessionId || response.data?.session_id;
      
      console.log(`✅ [UserDashboard] Interview started successfully: ${postulacionId}, Session: ${sessionId}`);
      message.success("Interview started successfully!");
      
      // Reload data to update the state
      await loadDashboardData();
      
      // Navigate to the interview with session info
      if (sessionId) {
        navigate(`/usuario/interview/${postulacionId}?session=${sessionId}`);
      } else {
        navigate(`/usuario/interview/${postulacionId}`);
      }
    } catch (error: any) {
      console.error("Error starting interview:", error);
      message.error("Failed to start interview. Please try again.");
    } finally {
      setStartingInterview(null);
    }
  };

  // Continue Interview function - generates questions again for existing interviews (Step 4)
  const handleContinueInterview = async (postulacionId: number) => {
    try {
      setStartingInterview(postulacionId);

      console.log('🎯 [UserDashboard] Step 4: Continuing interview and generating questions for postulation:', postulacionId);
      console.log('🔍 [UserDashboard] DEBUG: preguntaAPI object:', preguntaAPI);
      console.log('🔍 [UserDashboard] DEBUG: preguntaAPI.generar function:', preguntaAPI.generar);
      
      message.loading("Generating your interview questions...", 0);
      
      // Generate questions for the existing postulation using the API
      console.log('🔍 [UserDashboard] DEBUG: About to call preguntaAPI.generar with:', { idPostulacion: postulacionId });
      const questionsResponse = await preguntaAPI.generar({ idPostulacion: postulacionId });
      console.log('✅ [UserDashboard] Questions generated for continue interview:', questionsResponse.data);
      
      message.destroy();
      message.success("Questions ready! Redirecting to interview...");
      
      // Reload data to update the state
      await loadDashboardData();
      
      // Navigate to the interview - now with questions pre-generated
      navigate(`/usuario/interview/${postulacionId}`);
      
    } catch (error: any) {
      console.error("❌ [UserDashboard] Error continuing interview:", error);
      console.error("❌ [UserDashboard] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      message.destroy();
      message.error("Failed to generate interview questions. Please try again.");
    } finally {
      setStartingInterview(null);
    }
  };

  const applicationColumns = [
    {
      title: "Job",
      key: "job",
      render: (_: any, record: Postulacion) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {record.convocatoria?.titulo}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.convocatoria?.puesto}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.convocatoria?.empresa?.nombre}
          </div>
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
        <span className="text-gray-600 dark:text-gray-300">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_: any, record: Postulacion) => {
        const getProgress = () => {
          switch (record.estado) {
            case EstadoPostulacion.PENDIENTE:
              return 25;
            case EstadoPostulacion.EN_EVALUACION:
              return 75;
            case EstadoPostulacion.COMPLETADA:
              return 100;
            case EstadoPostulacion.RECHAZADA:
              return 100;
            default:
              return 0;
          }
        };
        return (
          <Progress
            percent={getProgress()}
            size="small"
            strokeColor={
              record.estado === EstadoPostulacion.RECHAZADA
                ? "#ef4444"
                : "#6366f1"
            }
            showInfo={false}
          />
        );
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
              icon={
                startingInterview === record.id ? (
                  <LoadingOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
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
              icon={
                startingInterview === record.id ? (
                  <LoadingOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              className="btn-gradient"
              loading={startingInterview === record.id}
              onClick={() => {
                console.log('🖱️ [UserDashboard] Continue button clicked for record:', record.id);
                handleContinueInterview(record.id!);
              }}
            >
              Continue
            </Button>
          )}
          {record.estado === EstadoPostulacion.COMPLETADA && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(`/usuario/interview/${record.id}/results`)
              }
            >
              View Results
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const jobsColumns = [
    {
      title: "Job Title",
      key: "title",
      render: (_: any, record: Convocatoria) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {record.titulo}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.empresa?.nombre}
          </div>
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
        <span className="text-gray-600 dark:text-gray-300">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Convocatoria) => {
        const alreadyApplied = myApplications.some(
          (app) => app.convocatoria?.id === record.id,
        );
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
        );
      },
    },
  ];

  // Apply to Job function - creates postulation first, then starts interview
  const handleApplyToJob = async () => {
    if (!selectedJob || !user?.id) return;

    setApplying(true);
    try {
      message.loading("Creating your application...", 0);

      console.log('📊 [UserDashboard] Step 1: Creating postulation for job:', selectedJob.id);
      
      if (!selectedJob.id) {
        throw new Error("Job ID is missing");
      }

      // Step 1: Create postulation first
      const postulacionData = {
        usuario: {
          id: user.id
        },
        convocatoria: {
          id: selectedJob.id
        }
      };

      const postulacionResponse = await postulacionAPI.create(postulacionData);
      const postulacion = postulacionResponse.data;
      const postulacionId = postulacion.data.id; // Extract ID from nested data object

      console.log('✅ [UserDashboard] Step 1: Postulation created:', postulacionId);
      
      message.destroy();
      message.loading("Starting your interview...", 0);

      // Step 2: Start interview with the postulation ID
      console.log('📊 [UserDashboard] Step 2: Starting interview with postulation:', postulacionId);
      const interviewResponse = await postulacionAPI.iniciarEntrevista(postulacionId);
      const { sessionId } = interviewResponse.data;

      message.destroy();
      message.success("Application submitted and interview started!");

      // Close modal and navigate to interview
      setApplyModalVisible(false);
      setSelectedJob(null);

      // Reload dashboard data to show the new application
      await loadDashboardData();

      // Navigate to interview with postulation ID and session ID
      navigate(`/usuario/interview/${postulacionId}?session=${sessionId}`);
      
    } catch (error: any) {
      console.error("Error in application process:", error);
      message.destroy();

      if (error.response?.status === 409) {
        message.error("You have already applied to this position.");
      } else if (error.response?.status === 400) {
        message.error("Invalid application data. Please try again.");
      } else {
        message.error(
          error.response?.data?.message ||
            "Error submitting application. Please try again.",
        );
      }
    } finally {
      setApplying(false);
    }
  };

  const openApplyModal = (job: Convocatoria) => {
    // Check if user already applied
    const alreadyApplied = myApplications.some(
      (app) => app.convocatoria?.id === job.id,
    );
    if (alreadyApplied) {
      message.warning("You have already applied to this position.");
      return;
    }

    setSelectedJob(job);
    setApplyModalVisible(true);
  };

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
              const clickedMenuItem = menuItems.find((item) => {
                if ("key" in item && item.key === info.key) {
                  return item;
                } else if ("children" in item) {
                  return item.children?.find(
                    (child) => "key" in child && child.key === info.key,
                  );
                }
                return false;
              });

              if (
                clickedMenuItem &&
                "onClick" in clickedMenuItem &&
                typeof clickedMenuItem.onClick === "function"
              ) {
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
                  <Text className="status-description">
                    Ready to help you succeed!
                  </Text>
                  <div className="status-stats">
                    <div className="stat-item">
                      <span className="stat-number">
                        {myApplications.length}
                      </span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {availableJobs.length}
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
                  My Dashboard
                </Title>
                <Text className="page-subtitle">
                  Welcome back, {user?.name}! Track your applications and
                  interviews.
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
                    ],
                  }}
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
                    Hello, {user?.name}! 👋
                  </Title>
                  <Paragraph className="welcome-description">
                    You have{" "}
                    <strong>
                      {
                        myApplications.filter(
                          (a) => a.estado === EstadoPostulacion.EN_EVALUACION,
                        ).length
                      }{" "}
                      interviews
                    </strong>{" "}
                    in progress and{" "}
                    <strong>
                      {availableJobs.length} new job opportunities
                    </strong>{" "}
                    available.
                  </Paragraph>
                  <Space wrap>
                    <Button
                      type="primary"
                      className="btn-gradient"
                      size="large"
                      disabled={
                        myApplications.filter(
                          (a) => a.estado === EstadoPostulacion.EN_EVALUACION,
                        ).length === 0
                      }
                      onClick={() => {
                        console.log('🖱️ [UserDashboard] Main Continue Interview button clicked');
                        const inProgressApp = myApplications.find(
                          (a) => a.estado === EstadoPostulacion.EN_EVALUACION,
                        );
                        console.log('🔍 [UserDashboard] Found in progress app:', inProgressApp);
                        if (inProgressApp && inProgressApp.id) {
                          handleContinueInterview(inProgressApp.id);
                        } else {
                          console.warn('⚠️ [UserDashboard] No in progress app found or missing ID');
                        }
                      }}
                    >
                      Continue Interview
                    </Button>
                    <Button
                      size="large"
                      onClick={() => setJobsModalVisible(true)}
                    >
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
                        <Tag
                          color={stat.trend === "up" ? "success" : "default"}
                          className="trend-tag"
                        >
                          {stat.change}
                        </Tag>
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
                  <Button
                    type="link"
                    className="view-all-button"
                    onClick={() => setApplicationsModalVisible(true)}
                  >
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
                  <Button
                    type="link"
                    className="view-all-button"
                    onClick={() => setJobsModalVisible(true)}
                  >
                    Browse All
                  </Button>
                </div>
              }
              className="enhanced-table-card"
            >
              {availableJobs.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {availableJobs.slice(0, 4).map((job: any) => {
                    const alreadyApplied = myApplications.some(
                      (app) => app.convocatoria?.id === job.id,
                    );
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
                                    <Text className="job-company">
                                      {job.empresa?.nombre}
                                    </Text>
                                    <div className="job-tags">
                                      <Tag color="blue" className="job-position">
                                        {job.puesto}
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
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Information Display */}
                              <div className="job-enhanced-info">
                                {job.formattedSalaryRange && (
                                  <div className="salary-info">
                                    <Text className="salary-label">💰 Salary:</Text>
                                    <Text className="salary-value">{job.formattedSalaryRange}</Text>
                                  </div>
                                )}
                                {job.location && (
                                  <div className="location-info">
                                    <Text className="location-label">📍 Location:</Text>
                                    <Text className="location-value">{job.location}</Text>
                                  </div>
                                )}
                              </div>

                              <div className="job-description-container">
                                <Text
                                  ellipsis={{ tooltip: job.descripcion }}
                                  className="job-description"
                                >
                                  {job.descripcion?.length > 100
                                    ? `${job.descripcion.substring(0, 100)}...`
                                    : job.descripcion}
                                </Text>
                              </div>

                              {/* Technical Requirements Preview */}
                              {job.technicalRequirements && (
                                <div className="tech-requirements-preview">
                                  <Text strong className="tech-label">🔧 Requirements:</Text>
                                  <Text className="tech-text">
                                    {job.technicalRequirements.length > 80
                                      ? `${job.technicalRequirements.substring(0, 80)}...`
                                      : job.technicalRequirements}
                                  </Text>
                                </div>
                              )}

                              {/* Benefits Preview */}
                              {job.benefitsPerks && (
                                <div className="benefits-preview">
                                  <Text strong className="benefits-label">✨ Benefits:</Text>
                                  <Text className="benefits-text">
                                    {job.benefitsPerks.length > 80
                                      ? `${job.benefitsPerks.substring(0, 80)}...`
                                      : job.benefitsPerks}
                                  </Text>
                                </div>
                              )}

                              <div className="job-footer">
                                <div className="job-footer-info">
                                  <Space>
                                    <ClockCircleOutlined className="job-icon" />
                                    <Text className="job-date">
                                      Closes {dayjs(job.fechaCierre).format("MMM DD")}
                                    </Text>
                                  </Space>
                                  {job.daysUntilClosing !== undefined && job.daysUntilClosing <= 7 && (
                                    <Text className="urgency-indicator">
                                      ⚡ {job.daysUntilClosing} days left!
                                    </Text>
                                  )}
                                </div>
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
                    );
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
                        Technical skills and problem-solving approach show
                        consistent improvement.
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
                        Focus on communication clarity and providing more
                        detailed examples.
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
                        Based on your applications, consider strengthening your
                        React and Node.js skills.
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
                        Apply to more senior positions to challenge yourself and
                        grow your career.
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>

      {/* Professional Apply Modal */}
      <Modal
        title={null}
        open={applyModalVisible}
        onCancel={() => {
          if (!applying) {
            setApplyModalVisible(false);
            setSelectedJob(null);
          }
        }}
        footer={null}
        className="professional-apply-modal"
        closable={!applying}
        maskClosable={!applying}
        width={680}
        centered
      >
        {selectedJob && (
          <div className="professional-modal-content">
            {/* Header Section */}
            <div className="professional-modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <div className="icon-wrapper">
                    <SendOutlined />
                  </div>
                </div>
                <div className="header-text">
                  <Title level={3} className="header-title">
                    Start Interview
                  </Title>
                  <Text className="header-subtitle">
                    Begin your AI-powered interview process
                  </Text>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="professional-job-details">
              <div className="job-header">
                <div className="company-avatar">
                  <div className="avatar-placeholder">
                    <BankOutlined />
                  </div>
                </div>
                <div className="job-info">
                  <Title level={4} className="job-title">
                    {selectedJob.titulo}
                  </Title>
                  <Text className="company-name">
                    {selectedJob.empresa?.nombre}
                  </Text>
                  <div className="job-meta">
                    <div className="meta-item">
                      <UserOutlined className="meta-icon" />
                      <span>{selectedJob.puesto}</span>
                    </div>
                    <div className="meta-item">
                      <ClockCircleOutlined className="meta-icon" />
                      <span>
                        Closes{" "}
                        {dayjs(selectedJob.fechaCierre).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob.descripcion && (
                <div className="job-description">
                  <Text className="description-text">
                    {selectedJob.descripcion.length > 150
                      ? `${selectedJob.descripcion.substring(0, 150)}...`
                      : selectedJob.descripcion}
                  </Text>
                </div>
              )}
            </div>

            {/* Process Timeline */}
            <div className="application-process">
              <Title level={5} className="process-title">
                Interview Process
              </Title>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number active">1</div>
                  <div className="step-content">
                    <Text className="step-title">Start Interview</Text>
                    <Text className="step-description">
                      Begin your AI-powered assessment
                    </Text>
                  </div>
                </div>
                <div className="step-connector"></div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <Text className="step-title">Answer Questions</Text>
                    <Text className="step-description">
                      Complete personalized interview questions
                    </Text>
                  </div>
                </div>
                <div className="step-connector"></div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <Text className="step-title">Review Results</Text>
                    <Text className="step-description">
                      Receive feedback and next steps
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="key-information">
              <div className="info-grid">
                <div className="info-card">
                  <RobotOutlined className="info-icon ai-icon" />
                  <div className="info-content">
                    <Text className="info-title">AI-Powered Assessment</Text>
                    <Text className="info-description">
                      Personalized questions based on job requirements
                    </Text>
                  </div>
                </div>
                <div className="info-card">
                  <ClockCircleOutlined className="info-icon time-icon" />
                  <div className="info-content">
                    <Text className="info-title">30-60 Minutes</Text>
                    <Text className="info-description">
                      Complete at your own pace
                    </Text>
                  </div>
                </div>
                <div className="info-card">
                  <SafetyOutlined className="info-icon security-icon" />
                  <div className="info-content">
                    <Text className="info-title">One Application</Text>
                    <Text className="info-description">
                      Single submission per position
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="professional-modal-footer">
              <div className="footer-actions">
                <Button
                  size="large"
                  onClick={() => setApplyModalVisible(false)}
                  disabled={applying}
                  className="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="apply-button"
                  loading={applying}
                  onClick={handleApplyToJob}
                  icon={applying ? <LoadingOutlined /> : <RobotOutlined />}
                  disabled={applying}
                >
                  {applying
                    ? "Starting Interview..."
                    : "Start Interview"}
                </Button>
              </div>
              <Text className="footer-note">
                By starting the interview, you agree to our terms and conditions
              </Text>
            </div>
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
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input
                    placeholder="Enter your full name"
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
                    placeholder="Enter your phone number"
                    className="enhanced-input"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthDate" label="Birth Date">
                  <DatePicker
                    className="enhanced-input w-full"
                    placeholder="Select birth date"
                  />
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

      {/* Professional My Applications Modal */}
      <Modal
        title={null}
        open={applicationsModalVisible}
        onCancel={() => setApplicationsModalVisible(false)}
        footer={null}
        width={1100}
        className="professional-applications-modal"
        centered
      >
        <div className="professional-applications-content">
          {/* Header Section */}
          <div className="applications-header">
            <div className="header-main">
              <div className="header-icon-wrapper">
                <FileTextOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <Title level={3} className="applications-title">
                  My Applications
                </Title>
                <Text className="applications-subtitle">
                  Track your job applications and interview progress
                </Text>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">{myApplications.length}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {
                    myApplications.filter(
                      (a) => a.estado === EstadoPostulacion.EN_EVALUACION,
                    ).length
                  }
                </div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {
                    myApplications.filter(
                      (a) => a.estado === EstadoPostulacion.COMPLETADA,
                    ).length
                  }
                </div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Filter and Search Section */}
          <div className="applications-controls">
            <div className="controls-left">
              <Input
                placeholder="Search applications..."
                prefix={<SearchOutlined />}
                style={{ width: 280 }}
                className="search-input"
              />
            </div>
            <div className="controls-right">
              <Select
                placeholder="Filter by status"
                style={{ width: 180 }}
                className="status-filter"
                allowClear
              >
                <Option value="all">All Applications</Option>
                <Option value={EstadoPostulacion.PENDIENTE}>Pending</Option>
                <Option value={EstadoPostulacion.EN_EVALUACION}>
                  In Progress
                </Option>
                <Option value={EstadoPostulacion.COMPLETADA}>Completed</Option>
                <Option value={EstadoPostulacion.RECHAZADA}>Rejected</Option>
              </Select>
            </div>
          </div>

          {/* Applications Content */}
          <div className="applications-body">
            {myApplications.length > 0 ? (
              <div className="applications-grid">
                {myApplications.map((application) => (
                  <motion.div
                    key={application.id}
                    className="application-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="card-header">
                      <div className="company-info">
                        <div className="company-avatar">
                          <BankOutlined />
                        </div>
                        <div className="company-details">
                          <Text className="job-title">
                            {application.convocatoria?.titulo}
                          </Text>
                          <Text className="company-name">
                            {application.convocatoria?.empresa?.nombre}
                          </Text>
                        </div>
                      </div>
                      <div className="application-status">
                        {getStatusTag(application.estado)}
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="job-meta">
                        <div className="meta-row">
                          <UserOutlined className="meta-icon" />
                          <span>{application.convocatoria?.puesto}</span>
                        </div>
                        <div className="meta-row">
                          <ClockCircleOutlined className="meta-icon" />
                          <span>
                            Applied{" "}
                            {dayjs(application.fechaPostulacion).format(
                              "MMM DD, YYYY",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>
                            {(() => {
                              switch (application.estado) {
                                case EstadoPostulacion.PENDIENTE:
                                  return "25%";
                                case EstadoPostulacion.EN_EVALUACION:
                                  return "75%";
                                case EstadoPostulacion.COMPLETADA:
                                  return "100%";
                                case EstadoPostulacion.RECHAZADA:
                                  return "100%";
                                default:
                                  return "0%";
                              }
                            })()}
                          </span>
                        </div>
                        <Progress
                          percent={(() => {
                            switch (application.estado) {
                              case EstadoPostulacion.PENDIENTE:
                                return 25;
                              case EstadoPostulacion.EN_EVALUACION:
                                return 75;
                              case EstadoPostulacion.COMPLETADA:
                                return 100;
                              case EstadoPostulacion.RECHAZADA:
                                return 100;
                              default:
                                return 0;
                            }
                          })()}
                          strokeColor={
                            application.estado === EstadoPostulacion.RECHAZADA
                              ? "#ef4444"
                              : "#667eea"
                          }
                          showInfo={false}
                          className="progress-bar"
                        />
                      </div>
                    </div>

                    <div className="card-actions">
                      {application.estado === EstadoPostulacion.PENDIENTE && (
                        <Button
                          type="primary"
                          className="action-button primary"
                          icon={
                            startingInterview === application.id ? (
                              <LoadingOutlined />
                            ) : (
                              <PlayCircleOutlined />
                            )
                          }
                          loading={startingInterview === application.id}
                          onClick={() => handleStartInterview(application.id!)}
                          block
                        >
                          Start Interview
                        </Button>
                      )}
                      {application.estado ===
                        EstadoPostulacion.EN_EVALUACION && (
                        <Button
                          type="primary"
                          className="action-button primary"
                          icon={
                            startingInterview === application.id ? (
                              <LoadingOutlined />
                            ) : (
                              <PlayCircleOutlined />
                            )
                          }
                          loading={startingInterview === application.id}
                          onClick={() => handleContinueInterview(application.id!)}
                          block
                        >
                          Continue Interview
                        </Button>
                      )}
                      {application.estado === EstadoPostulacion.COMPLETADA && (
                        <Button
                          className="action-button secondary"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            navigate(
                              `/usuario/interview/${application.id}/results`,
                            )
                          }
                          block
                        >
                          View Results
                        </Button>
                      )}
                      {application.estado === EstadoPostulacion.RECHAZADA && (
                        <Button
                          className="action-button disabled"
                          disabled
                          block
                        >
                          Application Closed
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileTextOutlined />
                </div>
                <Title level={4} className="empty-title">
                  No Applications Yet
                </Title>
                <Text className="empty-description">
                  You haven't applied to any positions yet. Start exploring job
                  opportunities!
                </Text>
                <Button
                  type="primary"
                  className="btn-gradient"
                  size="large"
                  onClick={() => {
                    setApplicationsModalVisible(false);
                    setJobsModalVisible(true);
                  }}
                >
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="applications-footer">
            <div className="footer-info">
              <Text className="footer-text">
                Showing {myApplications.length} application
                {myApplications.length !== 1 ? "s" : ""}
              </Text>
            </div>
            <div className="footer-actions">
              <Button
                size="large"
                onClick={() => setApplicationsModalVisible(false)}
                className="close-button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Professional Browse Jobs Modal */}
      <Modal
        title={null}
        open={jobsModalVisible}
        onCancel={() => setJobsModalVisible(false)}
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
                <SearchOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <Title level={3} className="jobs-title">
                  Browse Jobs
                </Title>
                <Text className="jobs-subtitle">
                  Discover your next career opportunity with AI-powered
                  interviews
                </Text>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">{availableJobs.length}</div>
                <div className="stat-label">Open Positions</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {
                    Array.isArray(availableJobs) ? 
                    new Set(availableJobs.map((job) => job.empresa?.nombre)).size :
                    0
                  }
                </div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">
                  {
                    availableJobs.filter((job) => {
                      const alreadyApplied = myApplications.some(
                        (app) => app.convocatoria?.id === job.id,
                      );
                      return !alreadyApplied;
                    }).length
                  }
                </div>
                <div className="stat-label">Available to Apply</div>
              </div>
            </div>
          </div>

          {/* Filter and Search Section */}
          <div className="jobs-controls">
            <div className="controls-left">
              <Input
                placeholder="Search by job title, company, or position..."
                prefix={<SearchOutlined />}
                style={{ width: 320 }}
                className="search-input"
              />
            </div>
            <div className="controls-right">
              <Select
                placeholder="Filter by company"
                style={{ width: 200 }}
                className="company-filter"
                allowClear
              >
                {Array.from(
                  new Set(Array.isArray(availableJobs) ? availableJobs.map((job) => job.empresa?.nombre) : []),
                ).map((company) => (
                  <Option key={company} value={company}>
                    {company}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Filter by position"
                style={{ width: 180 }}
                className="position-filter"
                allowClear
              >
                {Array.from(
                  new Set(Array.isArray(availableJobs) ? availableJobs.map((job) => job.puesto) : []),
                ).map((position) => (
                  <Option key={position} value={position}>
                    {position}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Jobs Content */}
          <div className="jobs-body">
            {Array.isArray(availableJobs) && availableJobs.length > 0 ? (
              <div className="jobs-grid">
                {availableJobs.map((job) => {
                  const alreadyApplied = Array.isArray(myApplications) ? myApplications.some(
                    (app) => app.convocatoria?.id === job.id,
                  ) : false;
                  const daysLeft = dayjs(job.fechaCierre).diff(dayjs(), "day");
                  const urgency =
                    daysLeft <= 3
                      ? "urgent"
                      : daysLeft <= 7
                        ? "moderate"
                        : "normal";

                  return (
                    <motion.div
                      key={job.id}
                      className={`job-opportunity-card ${alreadyApplied ? "applied" : ""}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -6 }}
                    >
                      <div className="job-card-header">
                        <div className="company-section">
                          <div className="company-avatar">
                            <BankOutlined />
                          </div>
                          <div className="company-details">
                            <Text className="company-name">
                              {job.empresa?.nombre}
                            </Text>
                            <Text className="job-location">
                              Remote • Full-time
                            </Text>
                          </div>
                        </div>
                        <div className="job-status">
                          {alreadyApplied ? (
                            <Tag color="green" className="applied-tag">
                              <CheckCircleOutlined /> Applied
                            </Tag>
                          ) : (
                            <Tag
                              color={
                                urgency === "urgent"
                                  ? "red"
                                  : urgency === "moderate"
                                    ? "orange"
                                    : "blue"
                              }
                              className="urgency-tag"
                            >
                              {daysLeft > 0
                                ? `${daysLeft} days left`
                                : "Deadline today"}
                            </Tag>
                          )}
                        </div>
                      </div>

                      <div className="job-card-content">
                        <Title level={4} className="job-title">
                          {job.titulo}
                        </Title>

                        <div className="job-meta">
                          <div className="meta-row">
                            <UserOutlined className="meta-icon" />
                            <span>{job.puesto}</span>
                          </div>
                          <div className="meta-row">
                            <ClockCircleOutlined className="meta-icon" />
                            <span>
                              Closes{" "}
                              {dayjs(job.fechaCierre).format("MMM DD, YYYY")}
                            </span>
                          </div>
                          <div className="meta-row">
                            <StarOutlined className="meta-icon" />
                            <span>AI Interview</span>
                          </div>
                        </div>

                        {job.descripcion && (
                          <div className="job-description">
                            <Text className="description-text">
                              {job.descripcion.length > 120
                                ? `${job.descripcion.substring(0, 120)}...`
                                : job.descripcion}
                            </Text>
                          </div>
                        )}

                        <div className="job-highlights">
                          <div className="highlight-item">
                            <RobotOutlined className="highlight-icon" />
                            <span>AI-Powered Assessment</span>
                          </div>
                          <div className="highlight-item">
                            <ThunderboltOutlined className="highlight-icon" />
                            <span>Instant Feedback</span>
                          </div>
                        </div>
                      </div>

                      <div className="job-card-footer">
                        <div className="footer-info">
                          <Text className="posted-date">
                            Posted {dayjs(job.fechaPublicacion).fromNow()}
                          </Text>
                        </div>
                        <div className="footer-actions">
                          {alreadyApplied ? (
                            <Button className="view-application-button" block>
                              View Application
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              className="apply-job-button"
                              icon={<RobotOutlined />}
                              onClick={() => handleApplyAndStartInterview(job)}
                              block
                            >
                              Start Interview
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <SearchOutlined />
                </div>
                <Title level={4} className="empty-title">
                  No Jobs Available
                </Title>
                <Text className="empty-description">
                  There are currently no open positions. Check back later for
                  new opportunities!
                </Text>
                <Button
                  type="primary"
                  className="btn-gradient"
                  size="large"
                  onClick={() => setJobsModalVisible(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="jobs-footer">
            <div className="footer-info">
              <Text className="footer-text">
                Showing {availableJobs.length} job
                {availableJobs.length !== 1 ? "s" : ""} •{" "}
                {
                  availableJobs.filter((job) => {
                    const alreadyApplied = myApplications.some(
                      (app) => app.convocatoria?.id === job.id,
                    );
                    return !alreadyApplied;
                  }).length
                }{" "}
                available to apply
              </Text>
            </div>
            <div className="footer-actions">
              <Button
                size="large"
                onClick={() => setJobsModalVisible(false)}
                className="close-button"
              >
                Close
              </Button>
            </div>
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
  );
};

export default UserDashboard;
