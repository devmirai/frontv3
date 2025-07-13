import type React from "react"
import { useState, useEffect } from "react"
import { Layout, Card, Typography, Button, Progress, message, Spin } from "antd"
import {
  RobotOutlined,
  LoadingOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { preguntaAPI, postulacionAPI } from "../services/api"
import { generateMockQuestions } from "../data/mockDataUtils"
import { mockApplications } from "../data/mockData"
import { type Postulacion, EstadoPostulacion } from "../types/api"
import ThemeToggle from "./ThemeToggle"

const { Header, Content } = Layout
const { Title, Paragraph } = Typography

const InterviewLoading: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Initializing interview...")
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    initializeInterview()
  }, [id])

  const initializeInterview = async () => {
    if (!id) return

    try {
      setLoading(true)
      setLoadingProgress(10)
      setLoadingMessage("Loading interview data...")

      // 🔧 SIEMPRE usar datos mock para pruebas de diseño
      console.log('🔧 [InterviewLoading] Usando datos mock para inicialización');
      
      const postulacionId = Number.parseInt(id);
      
      // Buscar postulación en datos mock
      const mockPostulacion = mockApplications.find(app => app.id === postulacionId);
      
      if (!mockPostulacion) {
        throw new Error(`Postulación ${postulacionId} no encontrada en datos mock`);
      }
      
      setPostulacion(mockPostulacion);
      setLoadingProgress(30)
      setLoadingMessage("Validating interview status...")

      // Check if interview is already completed
      if (mockPostulacion.estado === EstadoPostulacion.COMPLETADA) {
        console.log('🔧 [InterviewLoading] Interview already completed, redirecting to results');
        setLoadingProgress(100)
        setLoadingMessage("Loading results...")
        setTimeout(() => {
          navigate(`/usuario/interview/${postulacionId}/results`, { replace: true });
        }, 1500);
        return;
      }

      setLoadingProgress(50)
      setLoadingMessage("Preparing interview questions...")

      // Generate or load questions
      await generateQuestions(mockPostulacion);
      
      setLoadingProgress(80)
      setLoadingMessage("Setting up interview environment...")

      // Small delay for better UX
      setTimeout(() => {
        setLoadingProgress(100)
        setLoadingMessage("Interview ready! Starting...")
        setTimeout(() => {
          // Navigate to actual interview (not results)
          navigate(`/usuario/interview/${postulacionId}/start`, { replace: true });
        }, 1000);
      }, 1000);
      
    } catch (error: any) {
      console.error("Error initializing interview:", error)
      message.error("Failed to initialize interview. Please try again.")
      setTimeout(() => navigate("/usuario/dashboard"), 2000)
    }
  }

  const generateQuestions = async (postulacionData: Postulacion) => {
    try {
      if (!postulacionData.id) {
        throw new Error("Postulation ID is missing")
      }

      // Check if questions already exist for this postulation
      try {
        const existingResponse = await preguntaAPI.getByPostulacion(postulacionData.id)
        const existingQuestionsData = existingResponse.data || []
        
        if (existingQuestionsData.length > 0) {
          console.log("Questions already exist for this interview")
          return;
        }
      } catch (error) {
        console.log("No existing questions found, will generate new ones")
      }

      // Mark questions as being generated
      await postulacionAPI.marcarPreguntasGeneradas(postulacionData.id, true)

      // Generate new questions
      console.log(`Generating new questions for postulation ${postulacionData.id}`)
      const response = await preguntaAPI.generar({ idPostulacion: postulacionData.id })

      if (!response.data || !response.data.success || !Array.isArray(response.data.questions)) {
        throw new Error("Invalid response format from question generation API")
      }

      console.log("Questions generated successfully")
    } catch (error: any) {
      console.error("Error generating questions:", error)
      
      // 🔧 FALLBACK: Si falla la API, usar preguntas mock para que siempre haya preguntas disponibles
      console.log('🔧 Usando preguntas mock como fallback para pruebas de diseño');
      
      const jobTitle = postulacionData.convocatoria?.titulo || 'Software Developer';
      const jobLevel = postulacionData.convocatoria?.dificultad || 'Mid-Level';
      
      const mockQuestions = generateMockQuestions(jobTitle, jobLevel);
      console.log(`📊 Mock questions prepared: ${mockQuestions.length} questions`);
    }
  }

  const handleBackToDashboard = () => {
    navigate("/usuario/dashboard")
  }

  return (
    <Layout className="main-layout min-h-screen">
      <Header className="header-layout">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToDashboard}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="logo-icon text-lg">
              <RobotOutlined />
            </div>
            <span className="font-semibold">AI Interview Setup</span>
          </div>
          <ThemeToggle />
        </div>
      </Header>

      <Content className="content-layout">
        <div className="loading-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="loading-content"
          >
            <motion.div
              className="loading-icon"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <RobotOutlined />
            </motion.div>

            <Title className="loading-title">
              Preparing Your AI Interview
            </Title>

            <Paragraph className="loading-message">
              {loadingMessage}
            </Paragraph>

            <div className="loading-progress">
              <Progress
                percent={loadingProgress}
                strokeColor={{
                  "0%": "#6366f1",
                  "100%": "#8b5cf6",
                }}
                strokeWidth={8}
                showInfo={false}
              />
              <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                {loadingProgress}% Complete
              </div>
            </div>

            {postulacion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6"
              >
                <Paragraph className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Position: {postulacion.convocatoria?.titulo}
                </Paragraph>
                <Paragraph className="text-gray-600 dark:text-gray-400">
                  Company: {postulacion.convocatoria?.empresa?.nombre}
                </Paragraph>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="loading-tips"
            >
              <div className="loading-tips-title">
                <BulbOutlined />
                <span>Interview Tips</span>
              </div>
              <Paragraph className="loading-tips-text">
                Our AI will evaluate your responses based on clarity, technical knowledge, 
                problem-solving approach, and communication skills. Take your time to 
                provide thoughtful, detailed answers.
              </Paragraph>
            </motion.div>

            {loadingProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-6"
              >
                <CheckCircleOutlined className="text-4xl text-green-500 mb-2" />
                <Paragraph className="text-green-600 dark:text-green-400 font-medium">
                  Interview is ready! Redirecting...
                </Paragraph>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Content>
    </Layout>
  )
}

export default InterviewLoading
