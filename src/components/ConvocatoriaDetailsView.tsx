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
  message,
  Spin,
  Tooltip,
  Empty,
  Modal,
  Progress,
  Input,
  Select,
  Dropdown,
  Timeline,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  StarOutlined,
  UserOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  MessageOutlined,
  MoreOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { convocatoriaAPI, postulacionAPI } from "../services/api";
import type { Convocatoria, Postulacion } from "../types/api";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Content, Header } = Layout;
const { Option } = Select;

// Enhanced Candidate Detail View Modal following dashboard pattern
const CandidateDetailView: React.FC<{
  visible: boolean;
  onClose: () => void;
  candidate: Postulacion | null;
  convocatoriaTitle: string;
  companyName?: string;
}> = ({ visible, onClose, candidate, convocatoriaTitle, companyName: _companyName }) => {
  if (!candidate) return null;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="professional-candidate-modal"
      centered
    >
      <div className="professional-candidate-content">
        {/* Header Section */}
        <div className="candidate-modal-header">
          <div className="header-main">
            <div className="header-icon-wrapper">
              <UserOutlined className="header-icon" />
            </div>
            <div className="header-text">
              <Title level={3} className="candidate-modal-title">
                Perfil del Candidato
              </Title>
              <Text className="candidate-modal-subtitle">
                Información detallada y progreso de la aplicación
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="candidate-modal-body">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              {/* Candidate Info Card */}
              <Card className="candidate-info-card">
                <div className="candidate-profile-section">
                  <Avatar size={80} className="candidate-profile-avatar">
                    {candidate.usuario?.nombre?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="candidate-profile-info">
                    <Title level={4} className="candidate-profile-name">
                      {`${candidate.usuario?.nombre} ${candidate.usuario?.apellidoPaterno} ${candidate.usuario?.apellidoMaterno}`.trim()}
                    </Title>
                    <Text className="candidate-profile-email">
                      {candidate.usuario?.email}
                    </Text>
                    <div className="candidate-profile-meta">
                      <Tag
                        color={
                          candidate.estado === "COMPLETADA"
                            ? "green"
                            : candidate.estado === "EN_EVALUACION"
                              ? "blue"
                              : "orange"
                        }
                        className="status-tag"
                      >
                        {candidate.estado === "PENDIENTE"
                          ? "Revisión Pendiente"
                          : candidate.estado === "EN_EVALUACION"
                            ? "En Progreso"
                            : candidate.estado === "COMPLETADA"
                              ? "Completada"
                              : "Rechazada"}
                      </Tag>
                      <Text type="secondary">
                        Aplicó {dayjs(candidate.fechaPostulacion).fromNow()}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Score Card */}
              {candidate.puntuacion && (
                <Card className="score-info-card" title="Rendimiento en la Entrevista">
                  <div className="score-section">
                    <div className="score-main">
                      <div className="score-circle">
                        <span className="score-value">
                          {candidate.puntuacion}
                        </span>
                        <span className="score-max">/100</span>
                      </div>
                    </div>
                    <div className="score-details">
                      <div className="score-breakdown">
                        <div className="breakdown-item">
                          <Text className="breakdown-label">
                            Habilidades Técnicas
                          </Text>
                          <Progress
                            percent={candidate.puntuacion * 0.9}
                            strokeColor="#10b981"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                        <div className="breakdown-item">
                          <Text className="breakdown-label">Comunicación</Text>
                          <Progress
                            percent={candidate.puntuacion * 1.1}
                            strokeColor="#3b82f6"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Timeline Card */}
              <Card className="timeline-info-card" title="Cronología de la Aplicación">
                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <Text strong>Aplicación enviada</Text>
                          <br />
                          <Text type="secondary">
                            {dayjs(candidate.fechaPostulacion).format(
                              "DD [de] MMM [de] YYYY HH:mm",
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
                                <Text strong>Entrevista iniciada</Text>
                                <br />
                                <Text type="secondary">
                                  Sesión de entrevista IA iniciada
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
                                <Text strong>Entrevista completada</Text>
                                <br />
                                <Text type="secondary">
                                  Puntuación final: {candidate.puntuacion}/100
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

            <Col xs={24} lg={8}>
              {/* Contact Info */}
              <Card className="contact-info-card" title="Información de Contacto">
                <div className="contact-info-grid">
                  <div className="contact-item">
                    <MailOutlined className="contact-icon" />
                    <div className="contact-details">
                      <Text className="contact-label">Email</Text>
                      <Text className="contact-value">
                        {candidate.usuario?.email}
                      </Text>
                    </div>
                  </div>
                  {candidate.usuario?.telefono && (
                    <div className="contact-item">
                      <PhoneOutlined className="contact-icon" />
                      <div className="contact-details">
                        <Text className="contact-label">Teléfono</Text>
                        <Text className="contact-value">
                          {candidate.usuario.telefono}
                        </Text>
                      </div>
                    </div>
                  )}
                  <div className="contact-item">
                    <BankOutlined className="contact-icon" />
                    <div className="contact-details">
                      <Text className="contact-label">Puesto</Text>
                      <Text className="contact-value">{convocatoriaTitle}</Text>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions Card */}
              <Card className="actions-info-card" title="Acciones Rápidas">
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Button
                    type="primary"
                    block
                    icon={<MessageOutlined />}
                    size="large"
                    className="action-btn primary"
                  >
                    Enviar Mensaje
                  </Button>
                  <Button
                    block
                    icon={<PlayCircleOutlined />}
                    size="large"
                    className="action-btn secondary"
                    disabled={candidate.estado !== "PENDIENTE"}
                  >
                    Iniciar Entrevista
                  </Button>
                  <Button
                    block
                    icon={<DownloadOutlined />}
                    size="large"
                    className="action-btn secondary"
                  >
                    Descargar CV
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Footer */}
        <div className="candidate-modal-footer">
          <Button size="large" onClick={onClose} className="modal-close-btn">
            Cerrar
          </Button>
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

      // Load job posting from backend
      const jobResponse = await convocatoriaAPI.getById(jobId);
      const jobData = jobResponse.data;
      
      if (jobData) {
        setConvocatoria(jobData);

        // Load applications for this job posting
        const applicationsResponse = await postulacionAPI.getByConvocatoria(jobId);
        const applications = applicationsResponse.data || [];
        setPostulaciones(applications);

        console.log(
          `📊 [ConvocatoriaDetailsView] Backend data loaded: job ${jobId}, ${applications.length} applications`,
        );
      } else {
        console.log(
          `⚠️ [ConvocatoriaDetailsView] Job ${jobId} not found`,
        );
        message.error("Convocatoria no encontrada");
      }
    } catch (error: any) {
      console.error("Error loading convocatoria details:", error);
      message.error("Error al cargar los detalles de la convocatoria. Por favor verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidate = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion);
    setDetailViewVisible(true);
  };

  const candidatesColumns = [
    {
      title: "Candidato",
      key: "candidate",
      width: 280,
      render: (_: any, record: Postulacion) => (
        <div className="table-candidate-cell">
          <Avatar size={48} className="table-candidate-avatar">
            {record.usuario?.nombre?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="table-candidate-info">
            <div className="table-candidate-name">
              {`${record.usuario?.nombre} ${record.usuario?.apellidoPaterno} ${record.usuario?.apellidoMaterno}`.trim()}
            </div>
            <div className="table-candidate-email">{record.usuario?.email}</div>
            {record.usuario?.telefono && (
              <div className="table-candidate-phone">
                {record.usuario.telefono}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Fecha de Aplicación",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      width: 160,
      render: (date: string) => (
        <div className="table-date-cell">
          <div className="date-primary">
            {dayjs(date).format("DD [de] MMM [de] YYYY")}
          </div>
          <div className="date-time">{dayjs(date).format("HH:mm")}</div>
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 140,
      render: (status: string) => (
        <Tag
          color={
            status === "COMPLETADA"
              ? "green"
              : status === "EN_EVALUACION"
                ? "blue"
                : status === "PENDIENTE"
                  ? "orange"
                  : "red"
          }
          className="table-status-tag"
        >
          {status === "PENDIENTE"
            ? "Pendiente"
            : status === "EN_EVALUACION"
              ? "En Progreso"
              : status === "COMPLETADA"
                ? "Completada"
                : "Rechazada"}
        </Tag>
      ),
    },
    {
      title: "Puntuación",
      key: "score",
      width: 100,
      render: (_: any, record: Postulacion) => (
        <div className="table-score-cell">
          {record.puntuacion ? (
            <div className="score-display">
              <div className="score-number">{record.puntuacion}</div>
              <Progress
                percent={record.puntuacion}
                showInfo={false}
                size="small"
                strokeColor={
                  record.puntuacion >= 80
                    ? "#10b981"
                    : record.puntuacion >= 60
                      ? "#f59e0b"
                      : "#ef4444"
                }
              />
            </div>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 160,
      render: (_: any, record: Postulacion) => (
        <Space>
          <Tooltip title="Ver Detalles">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCandidate(record)}
              className="table-action-btn primary"
            />
          </Tooltip>
          <Tooltip title="Iniciar Entrevista">
            <Button
              icon={<PlayCircleOutlined />}
              size="small"
              disabled={record.estado !== "PENDIENTE"}
              className="table-action-btn secondary"
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "message",
                  label: "Enviar Mensaje",
                  icon: <MessageOutlined />,
                },
                {
                  key: "download",
                  label: "Descargar CV",
                  icon: <DownloadOutlined />,
                },
              ],
            }}
          >
            <Button
              icon={<MoreOutlined />}
              size="small"
              className="table-action-btn secondary"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="details-loading-container">
        <Spin size="large" />
        <Title level={4} className="loading-text">
          Cargando detalles de la convocatoria...
        </Title>
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="details-error-container">
        <Empty
          description="Convocatoria no encontrada"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const stats = [
    {
      title: "Total de Aplicaciones",
      value: postulaciones.length,
      icon: <TeamOutlined />,
      color: "#3b82f6",
    },
    {
      title: "Revisión Pendiente",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined />,
      color: "#f59e0b",
    },
    {
      title: "En Progreso",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <RobotOutlined />,
      color: "#8b5cf6",
    },
    {
      title: "Completadas",
      value: postulaciones.filter((p) => p.estado === "COMPLETADA").length,
      icon: <CheckCircleOutlined />,
      color: "#10b981",
    },
  ];

  return (
    <Layout className="convocatoria-details-layout">
      {/* Modern Header following dashboard pattern */}
      <Header className="convocatoria-details-header">
        <div className="details-header-container">
          <div className="header-left">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/empresa/dashboard")}
              className="details-back-button"
              size="large"
            >
              Volver al Dashboard
            </Button>
            <div className="header-info">
              <Title level={3} className="details-header-title">
                {convocatoria.titulo}
              </Title>
              <Text className="details-header-subtitle">
                Detalles de la convocatoria y gestión de candidatos
              </Text>
            </div>
          </div>

          <div className="header-right">
            <div className="header-meta">
              <div className="meta-item">
                <CalendarOutlined />
                <span>
                  <span>Cierra:&nbsp;&nbsp;</span>
                  {dayjs(convocatoria.fechaCierre).format("DD [de] MMM [de] YYYY")}
                </span>
              </div>
              <Tag
                color={convocatoria.activo ? "success" : "default"}
                className="header-status-tag"
              >
                {convocatoria.activo ? "Activa" : "Cerrada"}
              </Tag>
            </div>
          </div>
        </div>
      </Header>

      <Content className="convocatoria-details-content">
        <div className="details-content-container">
          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="details-stats-section"
          >
            <Row gutter={[24, 24]}>
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="details-stat-card">
                      <div className="stat-card-content">
                        <div
                          className="stat-icon"
                          style={{ color: stat.color }}
                        >
                          {stat.icon}
                        </div>
                        <div className="stat-info">
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

          {/* Job Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="details-info-card">
              <div className="info-card-header">
                <Title level={4} className="info-card-title">
                  Información del Trabajo
                </Title>
              </div>
              <Row gutter={[32, 24]}>
                <Col xs={24} lg={16}>
                  <div className="job-description-section">
                    <Title level={5} className="section-subtitle">
                      Descripción
                    </Title>
                    <Paragraph className="job-description-text">
                      {convocatoria.descripcion || "No se proporcionó descripción."}
                    </Paragraph>

                    <Title level={5} className="section-subtitle">
                      Requisitos
                    </Title>
                    <Paragraph className="job-requirements-text">
                      {convocatoria.puesto ||
                        "No se especificaron requisitos."}
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div className="job-details-panel">
                    <div className="detail-info-item">
                      <div className="detail-icon">
                        <CalendarOutlined />
                      </div>
                      <div className="detail-content">
                        <Text className="detail-label">Creada</Text>
                        <Text className="detail-value">
                          {dayjs(convocatoria.fechaPublicacion).format(
                            "DD [de] MMM [de] YYYY",
                          )}
                        </Text>
                      </div>
                    </div>
                    <div className="detail-info-item">
                      <div className="detail-icon">
                        <ClockCircleOutlined />
                      </div>
                      <div className="detail-content">
                        <Text className="detail-label">Cierra</Text>
                        <Text className="detail-value">
                          {dayjs(convocatoria.fechaCierre).format(
                            "DD [de] MMM [de] YYYY",
                          )}
                        </Text>
                      </div>
                    </div>
                    <div className="detail-info-item">
                      <div className="detail-icon">
                        <StarOutlined />
                      </div>
                      <div className="detail-content">
                        <Text className="detail-label">Dificultad</Text>
                        <Text className="detail-value">
                          Nivel {convocatoria.dificultad}/10
                        </Text>
                      </div>
                    </div>
                    <div className="detail-info-item">
                      <div className="detail-icon">
                        <TeamOutlined />
                      </div>
                      <div className="detail-content">
                        <Text className="detail-label">Aplicaciones</Text>
                        <Text className="detail-value">
                          {postulaciones.length} candidatos
                        </Text>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Candidates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="details-candidates-card">
              <div className="candidates-card-header">
                <div className="candidates-header-left">
                  <Title level={4} className="candidates-card-title">
                    Candidatos ({filteredPostulaciones.length})
                  </Title>
                  <Text className="candidates-card-subtitle">
                    Gestionar y revisar aplicaciones de candidatos
                  </Text>
                </div>
                <div className="candidates-header-right">
                  <Space size="middle">
                    <Input.Search
                      placeholder="Buscar candidatos..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      className="candidates-search"
                    />
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 150 }}
                      className="candidates-filter"
                    >
                      <Option value="all">Todos los Estados</Option>
                      <Option value="PENDIENTE">Pendiente</Option>
                      <Option value="EN_EVALUACION">En Progreso</Option>
                      <Option value="COMPLETADA">Completada</Option>
                      <Option value="RECHAZADA">Rechazada</Option>
                    </Select>
                  </Space>
                </div>
              </div>

              <div className="candidates-table-container">
                {filteredPostulaciones.length > 0 ? (
                  <Table
                    columns={candidatesColumns}
                    dataSource={filteredPostulaciones}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => (
                        <span className="table-pagination-info">
                          {`${range[0]}-${range[1]} de ${total} candidatos`}
                        </span>
                      ),
                    }}
                    className="details-candidates-table"
                    scroll={{ x: 1000 }}
                    rowKey="id"
                    rowClassName="candidates-table-row"
                  />
                ) : (
                  <div className="candidates-empty-state">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <Text className="empty-title">
                            No se encontraron candidatos
                          </Text>
                          <br />
                          <Text className="empty-subtitle">
                            {searchText || statusFilter !== "all"
                              ? "Intenta ajustar tu búsqueda o filtros"
                              : "Aún no hay candidatos que hayan aplicado para esta posición."}
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

        {/* Candidate Detail Modal */}
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
