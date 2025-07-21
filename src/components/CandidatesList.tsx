"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Layout,
  Card,
  Typography,
  Button,
  Table,
  Space,
  Tag,
  Avatar,
  message,
  Row,
  Col,
  Spin,
  Modal,
  Progress,
} from "antd"
import {
  ArrowLeftOutlined,
  UserOutlined,
  EyeOutlined,
  CalendarOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { convocatoriaAPI, postulacionAPI, evaluacionAPI } from "../services/api"
import { type Convocatoria, type Postulacion, EstadoPostulacion } from "../types/api"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import ThemeToggle from "./ThemeToggle"
import PrintReport from "./PrintReport"
import dayjs from "dayjs"

const { Header, Content } = Layout
const { Title, Paragraph } = Typography

const CandidatesList: React.FC = () => {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null)
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Postulacion | null>(null)
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false)
  const [evaluationLoading, setEvaluationLoading] = useState(false)
  const [consolidatedResults, setConsolidatedResults] = useState<any>(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    loadCandidatesData()
  }, [id])

  const loadCandidatesData = async () => {
    if (!id) return

    try {
      setLoading(true)

      // SIEMPRE usar datos mock para pruebas de diseño
      console.log('🔧 [CandidatesList] Usando datos mock para pruebas de diseño');
      
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
        
        console.log(`📊 [CandidatesList] Backend data loaded: job ${jobId}, ${applications.length} applications`);
      } else {
        console.log(`⚠️ [CandidatesList] Job ${jobId} not found`);
        message.error("Job posting not found");
        navigate(-1);
      }
    } catch (error: any) {
      console.error("Error loading candidates data:", error)
      message.error("Failed to load candidates data. Please check your connection and try again.")
      navigate(-1);
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleViewEvaluation = async (postulacion: Postulacion) => {
    if (postulacion.estado !== EstadoPostulacion.COMPLETADA) {
      message.warning("Este candidato aún no ha completado la entrevista.")
      return
    }

    setSelectedCandidate(postulacion)
    setEvaluationLoading(true)
    setEvaluationModalVisible(true)

    try {
      const evaluationResponse = await evaluacionAPI.getResultados(postulacion.id!)
      setConsolidatedResults(evaluationResponse.data)
    } catch (error: any) {
      console.error("Error loading candidate evaluation:", error)
      message.error("Error al cargar la evaluación del candidato")
    } finally {
      setEvaluationLoading(false)
    }
  }

  const getStatusTag = (status: EstadoPostulacion) => {
    const statusConfig = {
      [EstadoPostulacion.PENDIENTE]: { color: "warning", text: "Pendiente", icon: <ClockCircleOutlined /> },
      [EstadoPostulacion.EN_EVALUACION]: {
        color: "processing",
        text: "En Progreso",
        icon: <ExclamationCircleOutlined />,
      },
      [EstadoPostulacion.COMPLETADA]: { color: "success", text: "Completada", icon: <CheckCircleOutlined /> },
      [EstadoPostulacion.RECHAZADA]: { color: "error", text: "Rechazada", icon: <ExclamationCircleOutlined /> },
    }
    const config = statusConfig[status]
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    )
  }

  const columns = [
    {
      title: "Candidato",
      key: "candidate",
      render: (_: any, record: Postulacion) => (
        <div className="flex items-center space-x-3">
          <Avatar size="large" className="bg-indigo-600">
            {record.usuario?.nombre?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">
              {record.usuario?.nombre} {record.usuario?.apellidoPaterno} {record.usuario?.apellidoMaterno}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.usuario?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Fecha de Postulación",
      dataIndex: "fechaPostulacion",
      key: "fechaPostulacion",
      render: (date: string) => (
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-gray-400" />
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (status: EstadoPostulacion) => getStatusTag(status),
    },
    {
      title: "Contacto",
      key: "contact",
      render: (_: any, record: Postulacion) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>📞 {record.usuario?.telefono}</div>
          <div>🎂 {dayjs(record.usuario?.nacimiento).format("MMM DD, YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Postulacion) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewEvaluation(record)}
            disabled={record.estado !== EstadoPostulacion.COMPLETADA}
            className="btn-gradient"
          >
            Ver Evaluación
          </Button>
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Layout className="main-layout min-h-screen">
      <Header className="header-layout border-b">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/empresa/convocatoria/${id}`)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Volver a Detalles del Trabajo
            </Button>
            <div>
              <Title level={4} className="mb-0">
                Lista de Candidatos
              </Title>
              <Paragraph className="text-gray-500 dark:text-gray-400 text-sm mb-0">
                {convocatoria?.titulo} - {postulaciones.length} postulaciones
              </Paragraph>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Avatar src={user?.avatar} size="large" className="border-2 border-indigo-200" />
          </div>
        </div>
      </Header>

      <Content className="content-layout">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Statistics Cards */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={6}>
                <Card className="text-center stats-card">
                  <div className="text-3xl text-blue-600 mb-2">
                    <UserOutlined />
                  </div>
                  <Title level={3} className="mb-0">
                    {postulaciones.length}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">Postulaciones Totales</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="text-center stats-card">
                  <div className="text-3xl text-orange-600 mb-2">
                    <ClockCircleOutlined />
                  </div>
                  <Title level={3} className="mb-0">
                    {postulaciones.filter((p) => p.estado === EstadoPostulacion.PENDIENTE).length}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">Pendientes</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="text-center stats-card">
                  <div className="text-3xl text-purple-600 mb-2">
                    <ExclamationCircleOutlined />
                  </div>
                  <Title level={3} className="mb-0">
                    {postulaciones.filter((p) => p.estado === EstadoPostulacion.EN_EVALUACION).length}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">En Progreso</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="text-center stats-card">
                  <div className="text-3xl text-green-600 mb-2">
                    <CheckCircleOutlined />
                  </div>
                  <Title level={3} className="mb-0">
                    {postulaciones.filter((p) => p.estado === EstadoPostulacion.COMPLETADA).length}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">Completadas</Paragraph>
                </Card>
              </Col>
            </Row>

            {/* Candidates Table */}
            <Card
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">
                    Postulaciones de Candidatos
                  </Title>
                  <Tag color="blue">{postulaciones.length} total</Tag>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <Table
                columns={columns}
                dataSource={postulaciones}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} candidatos`,
                }}
                className="custom-table"
                scroll={{ x: 800 }}
                rowKey="id"
              />
            </Card>
          </motion.div>
        </div>
      </Content>

      {/* Evaluation Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <TrophyOutlined className="text-indigo-600" />
            <span>Resultados de Evaluación del Candidato</span>
          </div>
        }
        open={evaluationModalVisible}
        onCancel={() => setEvaluationModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedCandidate && (
          <div className="space-y-6">
            {/* Candidate Info */}
            <Card className="bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar size={64} className="bg-indigo-600">
                    {selectedCandidate.usuario?.nombre?.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <Title level={4} className="mb-1">
                      {selectedCandidate.usuario?.nombre} {selectedCandidate.usuario?.apellidoPaterno}{" "}
                      {selectedCandidate.usuario?.apellidoMaterno}
                    </Title>
                    <Paragraph className="text-gray-600 dark:text-gray-400 mb-2">
                      {selectedCandidate.usuario?.email}
                    </Paragraph>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📞 {selectedCandidate.usuario?.telefono}</span>
                      <span>🎂 {dayjs(selectedCandidate.usuario?.nacimiento).format("MMM DD, YYYY")}</span>
                      <span>📅 Postulado: {dayjs(selectedCandidate.fechaPostulacion).format("MMM DD, YYYY")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusTag(selectedCandidate.estado)}
                  <PrintReport
                    data={consolidatedResults}
                    candidateName={`${selectedCandidate.usuario?.nombre} ${selectedCandidate.usuario?.apellidoPaterno} ${selectedCandidate.usuario?.apellidoMaterno}`}
                    jobTitle={convocatoria?.titulo}
                    companyName={convocatoria?.empresa?.nombre}
                  />
                </div>
              </div>
            </Card>

            {evaluationLoading ? (
              <div className="text-center py-8">
                <Spin size="large" />
                <Paragraph className="mt-4">Cargando resultados de evaluación...</Paragraph>
              </div>
            ) : consolidatedResults ? (
              <>
                {/* Overall Score */}
                <Card>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <TrophyOutlined className="text-4xl text-indigo-600" />
                      <div>
                        <Title level={2} className="mb-0 text-indigo-800 dark:text-indigo-300">
                          {consolidatedResults?.puntajeFinal?.toFixed(1) || "N/A"}/100
                        </Title>
                        <Paragraph className="text-indigo-600 dark:text-indigo-400 mb-0">Puntuación General</Paragraph>
                      </div>
                    </div>
                    <Tag
                      color={
                        (consolidatedResults?.puntajeFinal || 0) >= 80
                          ? "success"
                          : (consolidatedResults?.puntajeFinal || 0) >= 60
                            ? "warning"
                            : "error"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {(consolidatedResults?.puntajeFinal || 0) >= 80
                        ? "Candidato Excelente"
                        : (consolidatedResults?.puntajeFinal || 0) >= 60
                          ? "Buen Candidato"
                          : "Necesita Mejoras"}
                    </Tag>
                  </div>

                  {/* Skills Radar Chart */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <div className="text-center">
                        <Title level={5} className="mb-4">
                          Evaluación de Competencias
                        </Title>
                        <ResponsiveContainer width="100%" height={250}>
                          <RadarChart
                            data={[
                              {
                                subject: "Claridad",
                                A: consolidatedResults?.resumenPorCriterio?.claridad_estructura / 10 || 0,
                                fullMark: 10,
                              },
                              {
                                subject: "Técnico",
                                A: consolidatedResults?.resumenPorCriterio?.dominio_tecnico / 10 || 0,
                                fullMark: 10,
                              },
                              {
                                subject: "Relevancia",
                                A: consolidatedResults?.resumenPorCriterio?.pertinencia / 10 || 0,
                                fullMark: 10,
                              },
                              {
                                subject: "Comunicación",
                                A: consolidatedResults?.resumenPorCriterio?.comunicacion_seguridad / 10 || 0,
                                fullMark: 10,
                              },
                            ]}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 10]} />
                            <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="space-y-4">
                        <Title level={5}>Desglose de Competencias</Title>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Claridad y Estructura</span>
                              <span>
                                {(consolidatedResults?.resumenPorCriterio?.claridad_estructura || 0).toFixed(1)}/10
                              </span>
                            </div>
                            <Progress
                              percent={(consolidatedResults?.resumenPorCriterio?.claridad_estructura || 0) * 10}
                              strokeColor="#52c41a"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Conocimiento Técnico</span>
                              <span>
                                {(consolidatedResults?.resumenPorCriterio?.dominio_tecnico || 0).toFixed(1)}/10
                              </span>
                            </div>
                            <Progress
                              percent={(consolidatedResults?.resumenPorCriterio?.dominio_tecnico || 0) * 10}
                              strokeColor="#1890ff"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Relevancia</span>
                              <span>{(consolidatedResults?.resumenPorCriterio?.pertinencia || 0).toFixed(1)}/10</span>
                            </div>
                            <Progress
                              percent={(consolidatedResults?.resumenPorCriterio?.pertinencia || 0) * 10}
                              strokeColor="#722ed1"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Comunicación</span>
                              <span>
                                {(consolidatedResults?.resumenPorCriterio?.comunicacion_seguridad || 0).toFixed(1)}/10
                              </span>
                            </div>
                            <Progress
                              percent={(consolidatedResults?.resumenPorCriterio?.comunicacion_seguridad || 0) * 10}
                              strokeColor="#fa8c16"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Detailed Question Results */}
                <Card title="Análisis Pregunta por Pregunta">
                  <div className="space-y-4">
                    {consolidatedResults?.evaluacionesPorPregunta?.map((item: any, index: number) => (
                      <Card key={index} size="small" className="bg-gray-50 dark:bg-gray-800">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} lg={16}>
                            <Title level={5}>Pregunta {index + 1}</Title>
                            <Paragraph className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {item.pregunta?.texto || "Texto de pregunta no disponible"}
                            </Paragraph>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Claridad:</span>
                                <Progress percent={(item.evaluacion?.claridadEstructura || 0) * 10} size="small" />
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Técnico:</span>
                                <Progress percent={(item.evaluacion?.dominioTecnico || 0) * 10} size="small" />
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Relevancia:</span>
                                <Progress percent={(item.evaluacion?.pertinencia || 0) * 10} size="small" />
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Comunicación:</span>
                                <Progress percent={(item.evaluacion?.comunicacionSeguridad || 0) * 10} size="small" />
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} lg={8} className="text-center">
                            <Title level={4} className="mb-0">
                              {item.evaluacion?.puntuacionFinal?.toFixed(1) || "N/A"}/10
                            </Title>
                            <Tag
                              color={
                                item.evaluacion?.puntuacionFinal >= 8
                                  ? "success"
                                  : item.evaluacion?.puntuacionFinal >= 6
                                    ? "warning"
                                    : "error"
                              }
                            >
                              {item.evaluacion?.puntuacionFinal >= 8
                                ? "Excelente"
                                : item.evaluacion?.puntuacionFinal >= 6
                                  ? "Bueno"
                                  : "Deficiente"}
                            </Tag>
                          </Col>
                        </Row>

                        {(item.evaluacion?.fortalezas || item.evaluacion?.oportunidadesMejora) && (
                          <Row gutter={[16, 16]} className="mt-4">
                            {item.evaluacion?.fortalezas && (
                              <Col xs={24} lg={12}>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <StarOutlined className="text-green-600" />
                                    <span className="font-medium text-green-800 dark:text-green-300">Fortalezas</span>
                                  </div>
                                  <Paragraph className="text-green-700 dark:text-green-400 mb-0 text-sm">
                                    {item.evaluacion.fortalezas}
                                  </Paragraph>
                                </div>
                              </Col>
                            )}
                            {item.evaluacion?.oportunidadesMejora && (
                              <Col xs={24} lg={12}>
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <ExclamationCircleOutlined className="text-orange-600" />
                                    <span className="font-medium text-orange-800 dark:text-orange-300">
                                      Áreas de Mejora
                                    </span>
                                  </div>
                                  <Paragraph className="text-orange-700 dark:text-orange-400 mb-0 text-sm">
                                    {item.evaluacion.oportunidadesMejora}
                                  </Paragraph>
                                </div>
                              </Col>
                            )}
                          </Row>
                        )}
                      </Card>
                    )) || (
                      <Paragraph className="text-center text-gray-500 dark:text-gray-400">
                        No hay resultados detallados de preguntas disponibles.
                      </Paragraph>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <ExclamationCircleOutlined className="text-4xl text-gray-400 mb-4" />
                  <Title level={4} className="text-gray-600 dark:text-gray-400">
                    Evaluación No Disponible
                  </Title>
                  <Paragraph className="text-gray-500 dark:text-gray-400">
                    Este candidato aún no ha completado la entrevista o los datos de evaluación no están disponibles.
                  </Paragraph>
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default CandidatesList
