import type React from "react"
import { useState, useEffect } from "react"
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
} from "antd"
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
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { convocatoriaAPI, postulacionAPI } from "../services/api"
import { mockJobs, mockApplications } from "../data/mockData"
import { getApplicationsByJob } from "../data/mockDataUtils"
import type { Convocatoria, Postulacion } from "../types/api"
import dayjs from "dayjs"

const { Title, Paragraph } = Typography
const { Content } = Layout

// Simple candidate detail view component (you can replace this with your actual component)
const CandidateDetailView: React.FC<{
  visible: boolean
  onClose: () => void
  candidate: Postulacion | null
  convocatoriaTitle: string
  companyName?: string
}> = ({ visible, onClose, candidate, convocatoriaTitle, companyName }) => {
  return (
    <Modal
      title="Candidate Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {candidate && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar size={64} className="bg-gradient-to-br from-indigo-500 to-purple-600">
              {candidate.usuario?.nombre?.charAt(0)}
            </Avatar>
            <div>
              <Title level={4} className="mb-1">
                {`${candidate.usuario?.nombre} ${candidate.usuario?.apellidoPaterno} ${candidate.usuario?.apellidoMaterno}`.trim()}
              </Title>
              <Paragraph className="text-gray-600 mb-0">{candidate.usuario?.email}</Paragraph>
            </div>
          </div>
          <Divider />
          <div>
            <Title level={5}>Application Status</Title>
            <Tag color={candidate.estado === 'COMPLETADA' ? 'success' : 'processing'}>
              {candidate.estado}
            </Tag>
          </div>
          <div>
            <Title level={5}>Applied for</Title>
            <Paragraph>{convocatoriaTitle}</Paragraph>
          </div>
          {companyName && (
            <div>
              <Title level={5}>Company</Title>
              <Paragraph>{companyName}</Paragraph>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

const ConvocatoriaDetailsView: React.FC = () => {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null)
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [detailViewVisible, setDetailViewVisible] = useState(false)
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      loadConvocatoriaDetails()
    }
  }, [id])

  const loadConvocatoriaDetails = async () => {
    if (!id) return

    try {
      setLoading(true)

      // SIEMPRE usar datos mock para pruebas de diseño
      console.log('🔧 [ConvocatoriaDetailsView] Usando datos mock para pruebas de diseño');
      
      const jobId = Number.parseInt(id);
      
      // Buscar convocatoria en datos mock
      const mockConvocatoria = mockJobs.find(job => job.id === jobId);
      if (mockConvocatoria) {
        setConvocatoria(mockConvocatoria);
        
        // Buscar postulaciones para esta convocatoria
        const mockPostulaciones = getApplicationsByJob(jobId);
        setPostulaciones(mockPostulaciones);
        
        console.log(`📊 [ConvocatoriaDetailsView] Mock data loaded: job ${jobId}, ${mockPostulaciones.length} applications`);
      } else {
        console.log(`⚠️ [ConvocatoriaDetailsView] Job ${jobId} not found in mock data`);
        message.error("Job posting not found");
      }
    } catch (error: any) {
      console.error("Error loading convocatoria details:", error)
      message.error("Error loading job posting details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      PENDIENTE: { color: "warning", text: "Pending", icon: <ClockCircleOutlined /> },
      EN_EVALUACION: { color: "processing", text: "In Progress", icon: <ExclamationCircleOutlined /> },
      COMPLETADA: { color: "success", text: "Completed", icon: <CheckCircleOutlined /> },
      RECHAZADA: { color: "error", text: "Rejected", icon: <ExclamationCircleOutlined /> },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    )
  }

  const handleViewCandidate = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion)
    setDetailViewVisible(true)
  }

  const candidatesColumns = [
    {
      title: "Candidate",
      key: "candidate",
      render: (_: any, record: Postulacion) => (
        <div className="flex items-center space-x-3">
          <Avatar size="large" className="bg-gradient-to-br from-indigo-500 to-purple-600">
            {record.usuario?.nombre?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {`${record.usuario?.nombre} ${record.usuario?.apellidoPaterno} ${record.usuario?.apellidoMaterno}`.trim()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.usuario?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Application Date",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      render: (date: string) => (
        <div className="text-gray-600 dark:text-gray-300">{dayjs(date).format("MMM DD, YYYY")}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "estado",
      key: "estado",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: Postulacion) => (
        <Space direction="vertical" size="small">
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
            <MailOutlined />
            <span>{record.usuario?.email}</span>
          </div>
          {record.usuario?.telefono && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <PhoneOutlined />
              <span>{record.usuario.telefono}</span>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Postulacion) => (
        <Space>
          <Tooltip title="View candidate details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCandidate(record)}
              className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
            >
              View Details
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const stats = [
    {
      title: "Total Applications",
      value: postulaciones.length,
      icon: <TeamOutlined className="text-blue-600" />,
      color: "blue",
    },
    {
      title: "Pending Review",
      value: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: "orange",
    },
    {
      title: "In Progress",
      value: postulaciones.filter((p) => p.estado === "EN_EVALUACION").length,
      icon: <ExclamationCircleOutlined className="text-purple-600" />,
      color: "purple",
    },
    {
      title: "Completed",
      value: postulaciones.filter((p) => p.estado === "COMPLETADA").length,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: "green",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spin size="large" />
        <Paragraph className="ml-4 mb-0 text-gray-600 dark:text-gray-300">Loading job posting details...</Paragraph>
      </div>
    )
  }

  if (!convocatoria) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Empty description="Job posting not found" />
      </div>
    )
  }

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/empresa/dashboard")}
                  className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 dark:text-gray-300"
                >
                  Back to Dashboard
                </Button>
                <div>
                  <Title level={2} className="mb-1 text-gray-800 dark:text-gray-200">
                    {convocatoria.titulo}
                  </Title>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <span>{convocatoria.puesto}</span>
                    <Divider type="vertical" />
                    <div className="flex items-center space-x-1">
                      <CalendarOutlined />
                      <span>Closes: {dayjs(convocatoria.fechaCierre).format("MMM DD, YYYY")}</span>
                    </div>
                    <Tag color={convocatoria.activo ? "success" : "default"}>
                      {convocatoria.activo ? "Active" : "Closed"}
                    </Tag>
                  </div>
                </div>
              </div>
              <Space>
                <Button
                  type="primary"
                  className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
                >
                  Edit Job Posting
                </Button>
              </Space>
            </div>
          </Card>

          {/* Job Description */}
          <Card title="Job Description" className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <div className="space-y-4">
              <div>
                <Title level={4} className="text-gray-800 dark:text-gray-200">
                  Description
                </Title>
                <Paragraph className="text-gray-600 dark:text-gray-300">
                  {convocatoria.descripcion || "No description provided."}
                </Paragraph>
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CalendarOutlined className="text-2xl text-blue-600 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {dayjs(convocatoria.fechaPublicacion).format("MMM DD, YYYY")}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <CalendarOutlined className="text-2xl text-red-600 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Closes</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {dayjs(convocatoria.fechaCierre).format("MMM DD, YYYY")}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TeamOutlined className="text-2xl text-green-600 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Applications</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{postulaciones.length}</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <TrophyOutlined className="text-2xl text-purple-600 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {postulaciones.filter((p) => p.estado === "COMPLETADA").length}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Statistics */}
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-3xl">{stat.icon}</div>
                    </div>
                    <Statistic
                      title={<span className="text-gray-600 dark:text-gray-400 font-medium">{stat.title}</span>}
                      value={stat.value}
                      valueStyle={{
                        color: "var(--ant-color-text)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Candidates Table */}
          <Card
            title={
              <div className="flex justify-between items-center">
                <Title level={4} className="mb-0 text-gray-800 dark:text-gray-200">
                  Candidates ({postulaciones.length})
                </Title>
                <Space>
                  <Badge count={postulaciones.filter((p) => p.estado === "PENDIENTE").length} size="small">
                    <Button className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 dark:text-gray-300">
                      Pending Review
                    </Button>
                  </Badge>
                </Space>
              </div>
            }
            className="border-0 shadow-sm bg-white dark:bg-gray-800"
          >
            {postulaciones.length > 0 ? (
              <Table
                columns={candidatesColumns}
                dataSource={postulaciones}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <span className="text-gray-600 dark:text-gray-400">
                      {`${range[0]}-${range[1]} of ${total} candidates`}
                    </span>
                  ),
                }}
                className="custom-table"
                scroll={{ x: 800 }}
                rowKey="id"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500 dark:text-gray-400">
                    No candidates have applied for this position yet.
                  </span>
                }
              />
            )}
          </Card>
        </motion.div>

        {/* Candidate Detail View Modal */}
        <CandidateDetailView
          visible={detailViewVisible}
          onClose={() => setDetailViewVisible(false)}
          candidate={selectedPostulacion}
          convocatoriaTitle={convocatoria.titulo}
          companyName={convocatoria.empresa?.nombre}
        />
      </Content>
    </Layout>
  )
}

export default ConvocatoriaDetailsView
