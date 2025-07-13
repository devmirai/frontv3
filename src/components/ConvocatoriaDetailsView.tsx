import type React from "react";
import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Table,
  Avatar,
  Statistic,
  Divider,
  message,
  Spin,
  Badge,
  Tooltip,
  Empty,
  Modal,
  Progress,
  Input,
  Select,
  Dropdown,
  Timeline,
  Steps,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  MessageOutlined,
  MoreOutlined,
  FileTextOutlined,
  BankOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  HeartOutlined,
  SendOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { convocatoriaAPI, postulacionAPI } from "../services/api";
import { mockJobs, mockApplications } from "../data/mockData";
import { getApplicationsByJob } from "../data/mockDataUtils";
import type { Convocatoria, Postulacion } from "../types/api";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { Step } = Steps;

// Enhanced Candidate Detail View Modal
const CandidateDetailView: React.FC<{
  visible: boolean;
  onClose: () => void;
  candidate: Postulacion | null;
  convocatoriaTitle: string;
  companyName?: string;
}> = ({ visible, onClose, candidate, convocatoriaTitle, companyName }) => {
  if (!candidate) return null;

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "#d1d5db";
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="candidate-detail-modal"
      centered
    >
      <div className="candidate-detail-content">
        {/* Header */}
        <div className="candidate-detail-header">
          <div className="header-background"></div>
          <div className="header-content">
            <div className="candidate-profile">
              <div className="candidate-avatar-wrapper">
                <Avatar size={80} className="candidate-main-avatar">
                  {candidate.usuario?.nombre?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="avatar-status">
                  <CheckCircleOutlined />
                </div>
              </div>
              <div className="candidate-info">
                <Title level={3} className="candidate-name">
                  {`${candidate.usuario?.nombre} ${candidate.usuario?.apellidoPaterno} ${candidate.usuario?.apellidoMaterno}`.trim()}
                </Title>
                <Text className="candidate-email">
                  {candidate.usuario?.email}
                </Text>
                <div className="candidate-meta">
                  <Tag color="blue" icon={<CalendarOutlined />}>
                    Applied {dayjs(candidate.fechaPostulacion).fromNow()}
                  </Tag>
                  <Tag
                    color={
                      candidate.estado === "COMPLETADA"
                        ? "green"
                        : candidate.estado === "EN_EVALUACION"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {candidate.estado}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="candidate-actions">
              <Button type="primary" icon={<MessageOutlined />} size="large">
                Message
              </Button>
              <Button icon={<PhoneOutlined />} size="large">
                Call
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "download",
                      label: "Download CV",
                      icon: <DownloadOutlined />,
                    },
                    {
                      key: "share",
                      label: "Share Profile",
                      icon: <ShareAltOutlined />,
                    },
                    { key: "note", label: "Add Note", icon: <EditOutlined /> },
                  ],
                }}
              >
                <Button icon={<MoreOutlined />} size="large" />
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="candidate-detail-body">
          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col xs={24} lg={16}>
              {/* Application Progress */}
              <Card className="progress-card" title="Application Progress">
                <Steps
                  current={
                    candidate.estado === "PENDIENTE"
                      ? 0
                      : candidate.estado === "EN_EVALUACION"
                        ? 1
                        : 2
                  }
                  items={[
                    {
                      title: "Application Submitted",
                      description: dayjs(candidate.fechaPostulacion).format(
                        "MMM DD, YYYY",
                      ),
                      icon: <SendOutlined />,
                    },
                    {
                      title: "Interview in Progress",
                      description:
                        candidate.estado === "EN_EVALUACION"
                          ? "Currently in progress"
                          : "Pending",
                      icon: <RobotOutlined />,
                    },
                    {
                      title: "Review Complete",
                      description:
                        candidate.estado === "COMPLETADA"
                          ? "Completed"
                          : "Pending",
                      icon: <CheckCircleOutlined />,
                    },
                  ]}
                />
              </Card>

              {/* Interview Score */}
              {candidate.puntuacion && (
                <Card className="score-card" title="Interview Performance">
                  <div className="score-display">
                    <div className="score-main">
                      <div
                        className="score-circle"
                        style={{
                          background: `conic-gradient(${getScoreColor(candidate.puntuacion)} ${candidate.puntuacion * 3.6}deg, #f3f4f6 0deg)`,
                        }}
                      >
                        <div className="score-inner">
                          <span className="score-number">
                            {candidate.puntuacion}
                          </span>
                          <span className="score-label">/ 100</span>
                        </div>
                      </div>
                    </div>
                    <div className="score-breakdown">
                      <div className="score-item">
                        <div className="score-item-label">Technical Skills</div>
                        <Progress
                          percent={candidate.puntuacion * 0.9}
                          strokeColor="#10b981"
                          showInfo={false}
                        />
                      </div>
                      <div className="score-item">
                        <div className="score-item-label">Communication</div>
                        <Progress
                          percent={candidate.puntuacion * 1.1}
                          strokeColor="#3b82f6"
                          showInfo={false}
                        />
                      </div>
                      <div className="score-item">
                        <div className="score-item-label">Problem Solving</div>
                        <Progress
                          percent={candidate.puntuacion * 0.8}
                          strokeColor="#8b5cf6"
                          showInfo={false}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Activity Timeline */}
              <Card className="timeline-card" title="Activity Timeline">
                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <Text strong>Application submitted</Text>
                          <br />
                          <Text type="secondary">
                            {dayjs(candidate.fechaPostulacion).format(
                              "MMM DD, YYYY HH:mm",
                            )}
                          </Text>
                        </div>
                      ),
                    },
                    ...(candidate.estado !== "PENDIENTE"
                      ? [
                          {
                            color: "orange",
                            children: (
                              <div>
                                <Text strong>Interview started</Text>
                                <br />
                                <Text type="secondary">
                                  AI interview session initiated
                                </Text>
                              </div>
                            ),
                          },
                        ]
                      : []),
                    ...(candidate.estado === "COMPLETADA"
                      ? [
                          {
                            color: "green",
                            children: (
                              <div>
                                <Text strong>Interview completed</Text>
                                <br />
                                <Text type="secondary">
                                  Final score: {candidate.puntuacion}/100
                                </Text>
                              </div>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </Card>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={8}>
              {/* Contact Information */}
              <Card className="contact-card" title="Contact Information">
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <div>
                    <Text className="contact-label">Email</Text>
                    <Text className="contact-value">
                      {candidate.usuario?.email}
                    </Text>
                  </div>
                </div>
                {candidate.usuario?.telefono && (
                  <div className="contact-item">
                    <PhoneOutlined className="contact-icon" />
                    <div>
                      <Text className="contact-label">Phone</Text>
                      <Text className="contact-value">
                        {candidate.usuario.telefono}
                      </Text>
                    </div>
                  </div>
                )}
                <div className="contact-item">
                  <BankOutlined className="contact-icon" />
                  <div>
                    <Text className="contact-label">Applied for</Text>
                    <Text className="contact-value">{convocatoriaTitle}</Text>
                  </div>
                </div>
                {companyName && (
                  <div className="contact-item">
                    <BankOutlined className="contact-icon" />
                    <div>
                      <Text className="contact-label">Company</Text>
                      <Text className="contact-value">{companyName}</Text>
                    </div>
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="actions-card" title="Quick Actions">
                <div className="quick-actions">
                  <Button
                    type="primary"
                    block
                    icon={<CheckCircleOutlined />}
                    className="action-button approve"
                    disabled={candidate.estado === "COMPLETADA"}
                  >
                    Approve Candidate
                  </Button>
                  <Button
                    block
                    icon={<PlayCircleOutlined />}
                    className="action-button interview"
                    disabled={candidate.estado !== "PENDIENTE"}
                  >
                    Start Interview
                  </Button>
                  <Button
                    block
                    icon={<MessageOutlined />}
                    className="action-button message"
                  >
                    Send Message
                  </Button>
                  <Button
                    block
                    icon={<DownloadOutlined />}
                    className="action-button download"
                  >
                    Download CV
                  </Button>
                </div>
              </Card>

              {/* Notes */}
              <Card className="notes-card" title="Internal Notes">
                <Input.TextArea
                  rows={4}
                  placeholder="Add internal notes about this candidate..."
                  className="notes-textarea"
                />
                <Button
                  type="primary"
                  size="small"
                  className="save-note-btn"
                  style={{ marginTop: 12 }}
                >
                  Save Note
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

const ConvocatoriaDetailsView: React.FC = () => {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [filteredPostulaciones, setFilteredPostulaciones] = useState<
    Postulacion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [detailViewVisible, setDetailViewVisible] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<Postulacion | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadConvocatoriaDetails();
    }
  }, [id]);

  useEffect(() => {
    filterPostulaciones();
  }, [postulaciones, searchText, statusFilter]);

  const filterPostulaciones = () => {
    let filtered = [...postulaciones];

    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.usuario?.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
          p.usuario?.apellidoPaterno
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          p.usuario?.email?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.estado === statusFilter);
    }

    setFilteredPostulaciones(filtered);
  };

  const loadConvocatoriaDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const jobId = Number.parseInt(id);

      // Buscar convocatoria en datos mock
      const mockConvocatoria = mockJobs.find((job) => job.id === jobId);
      if (mockConvocatoria) {
        setConvocatoria(mockConvocatoria);

        // Buscar postulaciones para esta convocatoria
        const mockPostulaciones = getApplicationsByJob(jobId);
        setPostulaciones(mockPostulaciones);

        console.log(
          `📊 [ConvocatoriaDetailsView] Mock data loaded: job ${jobId}, ${mockPostulaciones.length} applications`,
        );
      } else {
        console.log(
          `⚠️ [ConvocatoriaDetailsView] Job ${jobId} not found in mock data`,
        );
        message.error("Job posting not found");
      }
    } catch (error: any) {
      console.error("Error loading convocatoria details:", error);
      message.error("Error loading job posting details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDIENTE: {
        color: "#f59e0b",
        bg: "#fef3c7",
        text: "Pending Review",
        icon: <ClockCircleOutlined />,
      },
      EN_EVALUACION: {
        color: "#3b82f6",
        bg: "#dbeafe",
        text: "In Progress",
        icon: <RobotOutlined />,
      },
      COMPLETADA: {
        color: "#10b981",
        bg: "#d1fae5",
        text: "Completed",
        icon: <CheckCircleOutlined />,
      },
      RECHAZADA: {
        color: "#ef4444",
        bg: "#fee2e2",
        text: "Rejected",
        icon: <ExclamationCircleOutlined />,
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDIENTE;
  };

  const handleViewCandidate = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion);
    setDetailViewVisible(true);
  };

  const candidatesColumns = [
    {
      title: "Candidate",
      key: "candidate",
      width: 280,
      render: (_: any, record: Postulacion) => (
        <div className="candidate-cell">
          <Avatar
            size={48}
            className="candidate-avatar"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {record.usuario?.nombre?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="candidate-details">
            <div className="candidate-name">
              {`${record.usuario?.nombre} ${record.usuario?.apellidoPaterno} ${record.usuario?.apellidoMaterno}`.trim()}
            </div>
            <div className="candidate-email">{record.usuario?.email}</div>
            <div className="candidate-phone">
              {record.usuario?.telefono || "No phone"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Application Date",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      width: 140,
      render: (date: string) => (
        <div className="date-cell">
          <div className="date-primary">{dayjs(date).format("MMM DD")}</div>
          <div className="date-secondary">{dayjs(date).format("YYYY")}</div>
          <div className="date-time">{dayjs(date).format("HH:mm")}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "estado",
      key: "estado",
      width: 140,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <div className="status-cell">
            <div
              className="status-tag"
              style={{
                color: config.color,
                backgroundColor: config.bg,
                border: `1px solid ${config.color}20`,
              }}
            >
              {config.icon}
              <span>{config.text}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Score",
      key: "score",
      width: 100,
      render: (_: any, record: Postulacion) => (
        <div className="score-cell">
          {record.puntuacion ? (
            <div className="score-display-mini">
              <div className="score-number">{record.puntuacion}</div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${record.puntuacion}%`,
                    background:
                      record.puntuacion >= 80
                        ? "#10b981"
                        : record.puntuacion >= 60
                          ? "#f59e0b"
                          : "#ef4444",
                  }}
                />
              </div>
            </div>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: Postulacion) => (
        <div className="actions-cell">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCandidate(record)}
              className="view-button"
            />
          </Tooltip>
          <Tooltip title="Start Interview">
            <Button
              icon={<PlayCircleOutlined />}
              size="small"
              disabled={record.estado !== "PENDIENTE"}
              className="interview-button"
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "message",
                  label: "Send Message",
                  icon: <MessageOutlined />,
                },
                {
                  key: "download",
                  label: "Download CV",
                  icon: <DownloadOutlined />,
                },
                {
                  key: "approve",
                  label: "Approve",
                  icon: <CheckCircleOutlined />,
                },
              ],
            }}
          >
            <Button
              icon={<MoreOutlined />}
              size="small"
              className="more-button"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Applications",
      value: postulaciones.length,
      icon: <TeamOutlined />,
      color: "#3b82f6",
      bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Pending Review",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined />,
      color: "#f59e0b",
      bg: "linear-gradient(135deg, #f59e0b, #d97706)",
      change: "-5%",
      changeType: "decrease",
    },
    {
      title: "In Progress",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <RobotOutlined />,
      color: "#8b5cf6",
      bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Completed",
      value: postulaciones.filter((p) => p.estado === "COMPLETADA").length,
      icon: <CheckCircleOutlined />,
      color: "#10b981",
      bg: "linear-gradient(135deg, #10b981, #059669)",
      change: "+15%",
      changeType: "increase",
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Spin size="large" />
          <Title level={4} className="loading-text">
            Loading job posting details...
          </Title>
        </div>
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="error-container">
        <Empty
          description="Job posting not found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <Layout className="convocatoria-details-layout">
      <Content className="convocatoria-details-content">
        <div className="details-container">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-header"
          >
            <div className="hero-background">
              <div className="hero-gradient"></div>
              <div className="hero-pattern"></div>
            </div>
            <div className="hero-content">
              <div className="hero-main">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/empresa/dashboard")}
                  className="back-button"
                  size="large"
                >
                  Back to Dashboard
                </Button>
                <div className="job-info">
                  <div className="job-header">
                    <Title level={1} className="job-title">
                      {convocatoria.titulo}
                    </Title>
                    <div className="job-badges">
                      <Tag
                        color={convocatoria.activo ? "success" : "default"}
                        className="status-badge"
                      >
                        {convocatoria.activo ? "Active" : "Closed"}
                      </Tag>
                      <Tag className="difficulty-badge">
                        Level {convocatoria.dificultad}/10
                      </Tag>
                    </div>
                  </div>
                  <div className="job-meta">
                    <div className="meta-item">
                      <CalendarOutlined />
                      <span>
                        Created{" "}
                        {dayjs(convocatoria.fechaPublicacion).format(
                          "MMM DD, YYYY",
                        )}
                      </span>
                    </div>
                    <div className="meta-item">
                      <ClockCircleOutlined />
                      <span>
                        Closes{" "}
                        {dayjs(convocatoria.fechaCierre).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="meta-item">
                      <TeamOutlined />
                      <span>{postulaciones.length} Applications</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-actions">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  className="edit-button"
                >
                  Edit Job
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  size="large"
                  className="share-button"
                >
                  Share
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "duplicate",
                        label: "Duplicate Job",
                        icon: <PlusOutlined />,
                      },
                      {
                        key: "archive",
                        label: "Archive Job",
                        icon: <FileTextOutlined />,
                      },
                      {
                        key: "export",
                        label: "Export Data",
                        icon: <DownloadOutlined />,
                      },
                    ],
                  }}
                >
                  <Button icon={<MoreOutlined />} size="large" />
                </Dropdown>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="stats-section"
          >
            <Row gutter={[24, 24]}>
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="stat-card">
                      <div className="stat-content">
                        <div className="stat-header">
                          <div
                            className="stat-icon"
                            style={{ background: stat.bg }}
                          >
                            {stat.icon}
                          </div>
                          <div className={`stat-change ${stat.changeType}`}>
                            {stat.change}
                          </div>
                        </div>
                        <div className="stat-body">
                          <div className="stat-value">{stat.value}</div>
                          <div className="stat-title">{stat.title}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="description-card">
              <div className="description-header">
                <Title level={3} className="section-title">
                  Job Overview
                </Title>
              </div>
              <div className="description-content">
                <Row gutter={[32, 24]}>
                  <Col xs={24} lg={16}>
                    <div className="job-description">
                      <Title level={4}>Description</Title>
                      <Paragraph className="description-text">
                        {convocatoria.descripcion || "No description provided."}
                      </Paragraph>

                      <Title level={4}>Requirements</Title>
                      <Paragraph className="requirements-text">
                        {convocatoria.puesto ||
                          "No specific requirements listed."}
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="job-details">
                      <div className="detail-item">
                        <BankOutlined className="detail-icon" />
                        <div>
                          <Text className="detail-label">Company</Text>
                          <Text className="detail-value">
                            {convocatoria.empresa?.nombre || "Not specified"}
                          </Text>
                        </div>
                      </div>
                      <div className="detail-item">
                        <GlobalOutlined className="detail-icon" />
                        <div>
                          <Text className="detail-label">Work Mode</Text>
                          <Text className="detail-value">Remote</Text>
                        </div>
                      </div>
                      <div className="detail-item">
                        <DollarOutlined className="detail-icon" />
                        <div>
                          <Text className="detail-label">Salary Range</Text>
                          <Text className="detail-value">Competitive</Text>
                        </div>
                      </div>
                      <div className="detail-item">
                        <StarOutlined className="detail-icon" />
                        <div>
                          <Text className="detail-label">Experience Level</Text>
                          <Text className="detail-value">Mid to Senior</Text>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </motion.div>

          {/* Candidates Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="candidates-card">
              <div className="candidates-header">
                <div className="header-left">
                  <Title level={3} className="section-title">
                    Candidates ({filteredPostulaciones.length})
                  </Title>
                  <Text className="section-subtitle">
                    Manage and review all candidate applications
                  </Text>
                </div>
                <div className="header-right">
                  <Space size="middle">
                    <Input.Search
                      placeholder="Search candidates..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      className="search-input"
                    />
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 150 }}
                      className="status-filter"
                    >
                      <Option value="all">All Status</Option>
                      <Option value="PENDIENTE">Pending</Option>
                      <Option value="EN_EVALUACION">In Progress</Option>
                      <Option value="COMPLETADA">Completed</Option>
                      <Option value="RECHAZADA">Rejected</Option>
                    </Select>
                    <Button icon={<FilterOutlined />} className="filter-button">
                      Filters
                    </Button>
                  </Space>
                </div>
              </div>

              <div className="candidates-content">
                {filteredPostulaciones.length > 0 ? (
                  <Table
                    columns={candidatesColumns}
                    dataSource={filteredPostulaciones}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => (
                        <span className="pagination-info">
                          {`${range[0]}-${range[1]} of ${total} candidates`}
                        </span>
                      ),
                    }}
                    className="candidates-table"
                    scroll={{ x: 1000 }}
                    rowKey="id"
                    rowClassName="candidate-row"
                  />
                ) : (
                  <div className="empty-candidates">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <Text className="empty-title">
                            No candidates found
                          </Text>
                          <br />
                          <Text className="empty-subtitle">
                            {searchText || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "No candidates have applied for this position yet."}
                          </Text>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Candidate Detail Modal */}
        <CandidateDetailView
          visible={detailViewVisible}
          onClose={() => setDetailViewVisible(false)}
          candidate={selectedPostulacion}
          convocatoriaTitle={convocatoria.titulo}
          companyName={convocatoria.empresa?.nombre}
        />
      </Content>
    </Layout>
  );
};

export default ConvocatoriaDetailsView;
