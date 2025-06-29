"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Layout,
  Card,
  Typography,
  Button,
  Input,
  Progress,
  Space,
  Tag,
  Avatar,
  Divider,
  message,
  Row,
  Col,
  Spin,
} from "antd"
import {
  RobotOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  BulbOutlined,
  StarOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { preguntaAPI, evaluacionAPI, postulacionAPI } from "../services/api"
import {
  type Pregunta,
  type Postulacion,
  type Evaluacion,
  EstadoPostulacion,
  type EvaluacionRequest,
} from "../types/api"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts"
import ThemeToggle from "./ThemeToggle"
import PrintReport from "./PrintReport"

const { Header, Content } = Layout
const { Title, Paragraph } = Typography
const { TextArea } = Input

const Interview: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Pregunta[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([])
  const [showResults, setShowResults] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [consolidatedResults, setConsolidatedResults] = useState<any>(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    loadInterviewData()
  }, [id])

  useEffect(() => {
    if (!showResults && questions.length > 0 && !interviewCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            message.warning("Time is up! Submitting your interview...")
            handleSubmitInterview()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [showResults, questions.length, interviewCompleted])

  const loadInterviewData = async () => {
    if (!id) return

    try {
      setLoading(true)

      // Load postulacion details
      const postulacionResponse = await postulacionAPI.getById(Number.parseInt(id))
      const postulacionData = postulacionResponse.data
      setPostulacion(postulacionData)

      // Check if interview is completed and we should show results
      if (window.location.pathname.includes("/results") || postulacionData.estado === EstadoPostulacion.COMPLETADA) {
        await loadResults(Number.parseInt(id))
        setShowResults(true)
        setInterviewCompleted(true)
        return
      }

      // Generate questions for the interview
      await generateQuestions(postulacionData)
    } catch (error: any) {
      console.error("Error loading interview data:", error)
      message.error("Failed to load interview data. Please try again.")
      setTimeout(() => navigate("/usuario/dashboard"), 2000)
    } finally {
      setLoading(false)
    }
  }

  const generateQuestions = async (postulacionData: Postulacion) => {
    try {
      setLoading(true)

      message.loading({
        content: "Generating personalized interview questions...",
        duration: 0,
        key: "questionGeneration",
      })

      if (!postulacionData.id) {
        throw new Error("Postulation ID is missing")
      }

      const response = await preguntaAPI.generar({ idPostulacion: postulacionData.id })

      if (response.data && response.data.success && Array.isArray(response.data.questions)) {
        const generatedQuestions: Pregunta[] = response.data.questions.map((q: any, index: number) => ({
          id: q.id || index + 1,
          texto: q.question,
          tipo: q.typeReadable || q.type || "Technical",
          dificultad: q.score ? Math.ceil(q.score / 1.5) : 5,
          postulacion: postulacionData,
        }))

        setQuestions(generatedQuestions)
        setAnswers(new Array(generatedQuestions.length).fill(""))
        message.success({
          content: response.data.mensaje || "Interview questions ready!",
          key: "questionGeneration",
        })

        if (postulacionData.estado === EstadoPostulacion.PENDIENTE && postulacionData.id) {
          try {
            await postulacionAPI.update(postulacionData.id, {
              id: postulacionData.id,
              usuario: {
                id: postulacionData.usuario?.id,
              },
              convocatoria: {
                id: postulacionData.convocatoria?.id,
              },
              estado: EstadoPostulacion.EN_EVALUACION,
              preguntasGeneradas: true,
            })
          } catch (statusError) {
            console.error("Error updating postulation status:", statusError)
          }
        }
      } else {
        throw new Error("Invalid response format from question generation API")
      }
    } catch (error: any) {
      console.error("Error generating questions:", error)
      message.error({
        content:
          "Error generating interview questions: " +
          (error.response?.data?.message || error.message || "Please try again."),
        key: "questionGeneration",
        duration: 5,
      })
      setLoading(false)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const loadResults = async (postulacionId: number) => {
    try {
      const evaluationResponse = await evaluacionAPI.getResultados(postulacionId)
      setConsolidatedResults(evaluationResponse.data)
    } catch (error: any) {
      console.error("Error loading results:", error)
      message.error("Error loading interview results")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) {
      message.warning("Please provide an answer before proceeding.")
      return
    }

    if (!questions[currentQuestion] || !postulacion?.id) {
      message.error("Interview data not available")
      return
    }

    setIsSubmitting(true)

    try {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = currentAnswer.trim()
      setAnswers(newAnswers)

      const evaluationRequest: EvaluacionRequest = {
        preguntaId: questions[currentQuestion].id!,
        answer: currentAnswer.trim(),
        postulacionId: postulacion.id,
      }

      const response = await evaluacionAPI.evaluar(evaluationRequest)

      if (response.data) {
        setEvaluations((prev) => [...prev, response.data])

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1)
          setCurrentAnswer("")
          message.success("Answer submitted successfully! Moving to next question...")
        } else {
          await handleSubmitInterview()
        }
      } else {
        throw new Error("Invalid evaluation response")
      }
    } catch (error: any) {
      console.error("Error submitting answer:", error)
      message.error("Error evaluating your answer: " + (error.response?.data?.message || "Please try again"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitInterview = async () => {
    try {
      setInterviewCompleted(true)

      if (postulacion?.id) {
        await postulacionAPI.update(postulacion.id, {
          id: postulacion.id,
          usuario: {
            id: postulacion.usuario?.id,
          },
          convocatoria: {
            id: postulacion.convocatoria?.id,
          },
          estado: EstadoPostulacion.COMPLETADA,
          preguntasGeneradas: true,
        })
      }

      message.success("Interview completed successfully! Generating your results...")
      setTimeout(() => {
        navigate(`/usuario/interview/${id}/results`)
      }, 2000)
    } catch (error) {
      console.error("Error completing interview:", error)
      message.error("Error completing interview. Your answers were saved, but status update failed.")
      setTimeout(() => {
        navigate(`/usuario/interview/${id}/results`)
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="loading-icon">
              <RobotOutlined />
            </div>
            <Title level={2} className="loading-title">
              Preparing Your Interview
            </Title>
            <Paragraph className="loading-message">
              mirAI is generating personalized questions based on the job requirements.
              <br />
              <strong>This process may take a few moments.</strong>
            </Paragraph>
            <div className="loading-progress">
              <Progress percent={75} strokeColor="#6366f1" showInfo={false} />
            </div>
            <div className="loading-tips">
              <div className="loading-tips-title">
                <InfoCircleOutlined />
                <span>Did you know?</span>
              </div>
              <Paragraph className="loading-tips-text">
                Our AI analyzes the position details to create the most relevant questions for your interview. Take a
                moment to prepare yourself mentally!
              </Paragraph>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (showResults) {
    // Prepare chart data
    const radarData = [
      {
        subject: "Clarity & Structure",
        A: consolidatedResults?.resumenPorCriterio?.claridad_estructura / 10 || 0,
        fullMark: 10,
      },
      {
        subject: "Technical Knowledge",
        A: consolidatedResults?.resumenPorCriterio?.dominio_tecnico / 10 || 0,
        fullMark: 10,
      },
      { subject: "Relevance", A: consolidatedResults?.resumenPorCriterio?.pertinencia / 10 || 0, fullMark: 10 },
      {
        subject: "Communication",
        A: consolidatedResults?.resumenPorCriterio?.comunicacion_seguridad / 10 || 0,
        fullMark: 10,
      },
    ]

    const lineData =
      consolidatedResults?.evaluacionesPorPregunta?.map((item: any, index: number) => ({
        question: `Q${index + 1}`,
        score: item.evaluacion?.puntuacionFinal || 0,
      })) || []

    const barData =
      consolidatedResults?.evaluacionesPorPregunta?.map((item: any, index: number) => ({
        question: `Q${index + 1}`,
        clarity: item.evaluacion?.claridadEstructura || 0,
        technical: item.evaluacion?.dominioTecnico || 0,
        relevance: item.evaluacion?.pertinencia || 0,
        communication: item.evaluacion?.comunicacionSeguridad || 0,
      })) || []

    return (
      <Layout className="main-layout min-h-screen">
        <Header className="header-layout border-b">
          <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
            <div className="flex items-center space-x-6">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/usuario/dashboard")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="logo-icon text-lg">
                  <RobotOutlined />
                </div>
                <span className="font-semibold">Interview Results</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <PrintReport
                data={consolidatedResults}
                candidateName={`${user?.name}`}
                jobTitle={postulacion?.convocatoria?.titulo}
                companyName={postulacion?.convocatoria?.empresa?.nombre}
              />
              <ThemeToggle />
              <Avatar src={user?.avatar} size="large" className="border-2 border-indigo-200" />
            </div>
          </div>
        </Header>

        <Content className="content-layout">
          <div className="interview-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Results Header */}
              <Card className="border-0 shadow-sm mb-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <CheckCircleOutlined className="text-6xl text-green-600 mb-4" />
                  </motion.div>
                  <Title level={2} className="mb-4">
                    Interview Completed!
                  </Title>
                  <Paragraph className="text-lg text-gray-600 dark:text-gray-300">
                    Congratulations! You have successfully completed the AI interview for{" "}
                    <strong>{postulacion?.convocatoria?.titulo}</strong> at{" "}
                    <strong>{postulacion?.convocatoria?.empresa?.nombre}</strong>.
                  </Paragraph>

                  {/* Overall Score */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <TrophyOutlined className="text-3xl text-indigo-600" />
                      <div>
                        <Title level={3} className="mb-0 text-indigo-800 dark:text-indigo-300">
                          Final Score: {consolidatedResults?.puntajeFinal?.toFixed(1) || "N/A"}/100
                        </Title>
                        <Paragraph className="text-indigo-600 dark:text-indigo-400 mb-0">
                          {(consolidatedResults?.puntajeFinal || 0) >= 80
                            ? "Excellent Performance!"
                            : (consolidatedResults?.puntajeFinal || 0) >= 60
                              ? "Good Performance!"
                              : "Room for Improvement"}
                        </Paragraph>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {consolidatedResults?.evaluacionesPorPregunta?.length > 0 && (
                  <>
                    {/* Performance Charts */}
                    <Row gutter={[24, 24]} className="mb-8">
                      <Col xs={24} lg={8}>
                        <Card title="Overall Performance" className="h-full">
                          <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={radarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis domain={[0, 10]} />
                              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Card title="Question Scores" className="h-full">
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={lineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="question" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Card title="Skills Breakdown" className="h-full">
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="question" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Bar dataKey="clarity" fill="#8884d8" />
                              <Bar dataKey="technical" fill="#82ca9d" />
                              <Bar dataKey="relevance" fill="#ffc658" />
                              <Bar dataKey="communication" fill="#ff7300" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                    </Row>

                    {/* Detailed Results */}
                    <Row gutter={[24, 24]} className="mb-8">
                      {consolidatedResults.evaluacionesPorPregunta.map((item: any, index: number) => (
                        <Col xs={24} lg={12} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                          >
                            <Card className="h-full">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <Title level={4}>Question {index + 1} Results</Title>
                                  <Tag
                                    color={
                                      item.evaluacion?.puntuacionFinal >= 8
                                        ? "success"
                                        : item.evaluacion?.puntuacionFinal >= 6
                                          ? "warning"
                                          : "error"
                                    }
                                  >
                                    {item.evaluacion?.puntuacionFinal?.toFixed(1) || "N/A"}/10
                                  </Tag>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <Paragraph className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                      Clarity & Structure
                                    </Paragraph>
                                    <Progress
                                      percent={(item.evaluacion?.claridadEstructura || 0) * 10}
                                      strokeColor="#52c41a"
                                      size="small"
                                    />
                                  </div>

                                  <div>
                                    <Paragraph className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                      Technical Knowledge
                                    </Paragraph>
                                    <Progress
                                      percent={(item.evaluacion?.dominioTecnico || 0) * 10}
                                      strokeColor="#1890ff"
                                      size="small"
                                    />
                                  </div>

                                  <div>
                                    <Paragraph className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                      Relevance
                                    </Paragraph>
                                    <Progress
                                      percent={(item.evaluacion?.pertinencia || 0) * 10}
                                      strokeColor="#722ed1"
                                      size="small"
                                    />
                                  </div>

                                  <div>
                                    <Paragraph className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                      Communication
                                    </Paragraph>
                                    <Progress
                                      percent={(item.evaluacion?.comunicacionSeguridad || 0) * 10}
                                      strokeColor="#fa8c16"
                                      size="small"
                                    />
                                  </div>
                                </div>

                                {item.evaluacion?.feedback && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <Paragraph className="text-blue-800 dark:text-blue-300 text-sm mb-0">
                                      <strong>AI Feedback:</strong> {item.evaluacion.feedback}
                                    </Paragraph>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>

                    {/* Strengths and Improvement Areas */}
                    <Row gutter={[24, 24]} className="mb-8">
                      <Col xs={24} lg={12}>
                        <Card title="Strengths" className="h-full" extra={<StarOutlined className="text-green-600" />}>
                          <div className="space-y-3">
                            {consolidatedResults?.fortalezas?.map((strength: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <Paragraph className="text-green-700 dark:text-green-300 mb-0">{strength}</Paragraph>
                              </motion.div>
                            )) || (
                              <Paragraph className="text-gray-500 dark:text-gray-400">
                                No specific strengths identified.
                              </Paragraph>
                            )}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card
                          title="Areas for Improvement"
                          className="h-full"
                          extra={<BulbOutlined className="text-orange-600" />}
                        >
                          <div className="space-y-3">
                            {consolidatedResults?.oportunidadesMejora?.map((improvement: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                              >
                                <Paragraph className="text-orange-700 dark:text-orange-300 mb-0">
                                  {improvement}
                                </Paragraph>
                              </motion.div>
                            )) || (
                              <Paragraph className="text-gray-500 dark:text-gray-400">
                                No specific improvement areas identified.
                              </Paragraph>
                            )}
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="text-center mt-8">
                  <Space size="large">
                    <Button
                      type="primary"
                      size="large"
                      className="btn-gradient"
                      onClick={() => navigate("/usuario/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                    <PrintReport
                      data={consolidatedResults}
                      candidateName={`${user?.name}`}
                      jobTitle={postulacion?.convocatoria?.titulo}
                      companyName={postulacion?.convocatoria?.empresa?.nombre}
                    />
                  </Space>
                </div>
              </Card>
            </motion.div>
          </div>
        </Content>
      </Layout>
    )
  }

  // Loading state for question generation
  if (questions.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="loading-icon">
              <RobotOutlined />
            </div>
            <Title level={2} className="loading-title">
              Preparing Your Interview
            </Title>
            <Paragraph className="loading-message">
              mirAI is generating personalized questions based on the job requirements.
              <br />
              <strong>This process may take a few moments.</strong>
            </Paragraph>
            <div className="loading-progress">
              <Progress percent={75} strokeColor="#6366f1" showInfo={false} />
            </div>
            <div className="loading-tips">
              <div className="loading-tips-title">
                <InfoCircleOutlined />
                <span>Did you know?</span>
              </div>
              <Paragraph className="loading-tips-text">
                Our AI analyzes the position details to create the most relevant questions for your interview. Take a
                moment to prepare yourself mentally!
              </Paragraph>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Layout className="main-layout min-h-screen">
      {/* Header */}
      <Header className="header-layout border-b">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/usuario/dashboard")}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="logo-icon text-lg">
                <RobotOutlined />
              </div>
              <span className="font-semibold">AI Interview Assessment</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
              <ClockCircleOutlined className="text-orange-600" />
              <span className="font-mono text-lg font-semibold text-orange-700 dark:text-orange-300">
                {formatTime(timeLeft)}
              </span>
            </div>
            <ThemeToggle />
            <Avatar src={user?.avatar} size="large" className="border-2 border-indigo-200" />
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content className="content-layout">
        <div className="interview-container">
          {/* Progress Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="progress-container">
              <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                  <Title level={4} className="mb-0">
                    Question {currentQuestion + 1} of {questions.length}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                    {postulacion?.convocatoria?.titulo} - {postulacion?.convocatoria?.empresa?.nombre}
                  </Paragraph>
                </Col>
                <Col>
                  <Space size="middle">
                    <Tag color="blue" className="px-3 py-1">
                      {currentQ?.tipo || "Technical"}
                    </Tag>
                    <Tag color="orange" className="px-3 py-1">
                      Difficulty: {currentQ?.dificultad || 5}/10
                    </Tag>
                  </Space>
                </Col>
              </Row>
              <Progress
                percent={progress}
                strokeColor={{
                  "0%": "#6366f1",
                  "100%": "#8b5cf6",
                }}
                strokeWidth={8}
                className="mb-0"
              />
            </Card>
          </motion.div>

          {/* Question Section */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="question-card">
              {/* AI Assistant Header */}
              <div className="flex items-start space-x-4 mb-8">
                <div className="mirabot-avatar flex-shrink-0">
                  <RobotOutlined className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <div className="ai-message">
                    <Title level={5} className="mb-3 text-indigo-800 dark:text-indigo-300">
                      mirAI asks:
                    </Title>
                    <Paragraph className="text-lg mb-0 leading-relaxed">{currentQ?.texto}</Paragraph>
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <RobotOutlined className="text-indigo-500" />
                    <span>mirAI will analyze your response for technical accuracy and clarity...</span>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Answer Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Title level={5} className="mb-0">
                    Your Answer:
                  </Title>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{currentAnswer.length} characters</div>
                </div>

                <TextArea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your detailed answer here... Be specific and provide examples where possible."
                  rows={10}
                  className="text-base"
                  style={{ resize: "none" }}
                />

                {/* Hint Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BulbOutlined className="text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-300">Tip:</span>
                  </div>
                  <Paragraph className="text-blue-700 dark:text-blue-400 mb-0">
                    Provide specific examples, explain your reasoning, and structure your answer clearly. The AI
                    evaluates technical accuracy, clarity, relevance, and communication skills.
                  </Paragraph>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={
                      isSubmitting ? (
                        <LoadingOutlined />
                      ) : currentQuestion === questions.length - 1 ? (
                        <CheckCircleOutlined />
                      ) : (
                        <SendOutlined />
                      )
                    }
                    onClick={handleNextQuestion}
                    loading={isSubmitting}
                    className="btn-gradient px-8 h-12 text-lg font-medium"
                    disabled={!currentAnswer.trim()}
                  >
                    {isSubmitting
                      ? "Analyzing Answer..."
                      : currentQuestion === questions.length - 1
                        ? "Complete Interview"
                        : "Next Question"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <RobotOutlined className="text-indigo-600 text-xl" />
                    <Title level={5} className="mb-0 text-indigo-800 dark:text-indigo-300">
                      mirAI Tips
                    </Title>
                  </div>
                  <Paragraph className="text-indigo-700 dark:text-indigo-400 mb-0">
                    💡 Be specific and provide concrete examples when possible. The AI evaluates clarity, technical
                    accuracy, relevance, and communication skills.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <StarOutlined className="text-green-600 text-xl" />
                    <Title level={5} className="mb-0 text-green-800 dark:text-green-300">
                      Best Practices
                    </Title>
                  </div>
                  <Paragraph className="text-green-700 dark:text-green-400 mb-0">
                    ⭐ Structure your answers clearly, explain your reasoning, and don't hesitate to mention alternative
                    approaches or trade-offs.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </Content>
    </Layout>
  )
}

export default Interview