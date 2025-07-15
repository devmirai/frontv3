"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { preguntaAPI, evaluacionAPI, postulacionAPI, convocatoriaAPI, entrevistaAPI } from "../services/api"
import {
  type Pregunta,
  type Postulacion,
  type Evaluacion,
  EstadoPostulacion,
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
const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const Interview: React.FC = () => {
  // Core interview state
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // V2 Flow state - Pasos 1-12
  const [currentStep, setCurrentStep] = useState(3) // Start directly at preparation phase
  const [job, setJob] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()

  // Add a ref to track if we've initiated question generation
  const questionGenerationInitiated = useRef(false);

  useEffect(() => {
    // Extract session ID from URL params
    const searchParams = new URLSearchParams(location.search);
    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      setSessionId(sessionParam);
      console.log('📝 [Interview] Session ID extracted from URL:', sessionParam);
    }
    
    loadInterviewData();
  }, [id, location.search])

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

  // Auto-generate questions when currentStep is 4 and no questions exist
  useEffect(() => {
    if (currentStep === 4 && questions.length === 0 && id && !questionGenerationInitiated.current && !isGeneratingQuestions) {
      questionGenerationInitiated.current = true;
      console.log('🤖 [Interview] Auto-generating questions for step 4');
      handleGenerateQuestions(Number(id));
    }
  }, [currentStep, questions.length, id, isGeneratingQuestions]);

  // Sync currentAnswer with saved responses when currentQuestion changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestion >= 0 && currentQuestion < answers.length) {
      const savedAnswer = answers[currentQuestion] || "";
      setCurrentAnswer(savedAnswer);
      console.log('📝 [Interview] Synced to question', currentQuestion + 1, '- Answer length:', savedAnswer.length);
    }
  }, [currentQuestion, questions.length, answers]);

  const loadInterviewData = async () => {
    if (!id) return

    try {
      setLoading(true);
      
      console.log('📝 [Interview] Loading interview data, ID:', id, 'Session ID:', sessionId);
      
      // The ID now refers to postulacion ID, not convocatoria ID
      const postulacionId = Number(id);
      
      // Step 1: Get postulation details to get job info
      const postulacionResponse = await postulacionAPI.getById(postulacionId);
      const postulacionData = postulacionResponse.data;
      console.log('📝 [Interview] Postulation data loaded:', postulacionData);
      
      setPostulacion(postulacionData);
      
      // Extract job data from postulation
      const jobData = postulacionData.convocatoria;
      console.log('📝 [Interview] Job data from postulation:', jobData);
      setJob(jobData);

      // Always try to get the latest question state using preguntaAPI.generar() 
      // which includes estadoRespuestas data
      console.log('📝 [Interview] Attempting to get latest question state with estadoRespuestas');
      try {
        const questionsResponse = await preguntaAPI.generar({ idPostulacion: postulacionId });
        const questionsData = questionsResponse.data;
        console.log('📝 [Interview] Latest question state loaded:', questionsData);
        
        if (questionsData && questionsData.success && Array.isArray(questionsData.questions) && questionsData.questions.length > 0) {
          // Sort questions by ID to maintain correct order  
          const sortedQuestions = questionsData.questions.sort((a, b) => a.id - b.id);
          
          // Map the API response using estadoRespuestas as source of truth
          const mappedQuestions: Pregunta[] = sortedQuestions.map((q: any) => {
            const questionId = q.id;
            const isAnswered = questionsData.estadoRespuestas ? questionsData.estadoRespuestas[questionId.toString()] === true : false;
            
            console.log(`🔍 [Interview] Question ${questionId} answered status from estadoRespuestas:`, isAnswered);
            
            return {
              id: questionId,
              pregunta: q.question || q.textoPregunta, // Support both formats
              tipo: q.typeReadable || q.tipoLegible || q.type || q.tipo || "Technical",
              dificultad: q.score ? Math.ceil(q.score / 2).toString() : (q.dificultad || "5"),
              categoria: q.typeReadable || q.tipoLegible || q.type || q.tipo || "Technical",
              postulacion: { id: postulacionId },
              // Keep original fields for reference
              numero: q.numero,
              typeKey: q.type || q.tipo,
              score: q.score,
              // Progress tracking fields - ONLY use estadoRespuestas as source of truth
              respondida: isAnswered,
              evaluada: q.evaluada || false,
              respuesta: isAnswered ? (q.respuesta || "Respondida anteriormente") : null,
              fechaRespuesta: q.fechaRespuesta || null,
            };
          });
          
          // Pre-fill answers array with existing responses or placeholder for answered questions
          const answersArray = mappedQuestions.map(q => {
            if (q.respondida) {
              return q.respuesta || "Respondida anteriormente";
            }
            return "";
          });
          
          // Find the first unanswered question to continue from
          const firstUnansweredIndex = mappedQuestions.findIndex(q => !q.respondida);
          const startingQuestion = firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;
          
          setQuestions(mappedQuestions);
          setAnswers(answersArray);
          setCurrentQuestion(startingQuestion);
          setCurrentStep(6); // Ready to answer questions
          setLoading(false); // Questions ready, stop loading
          
          console.log('✅ [Interview] Ready to start answering questions with estadoRespuestas data:', mappedQuestions.length);
          console.log('📝 [Interview] Continuing from question:', startingQuestion + 1, 'of', mappedQuestions.length);
          console.log('� [Interview] estadoRespuestas from API:', questionsData.estadoRespuestas);
          console.log('📊 [Interview] Progress summary:', {
            totalQuestions: questionsData.totalPreguntas || mappedQuestions.length,
            preguntasRespondidas: questionsData.preguntasRespondidas || mappedQuestions.filter(q => q.respondida).length,
            preguntasPendientes: questionsData.preguntasPendientes || mappedQuestions.filter(q => !q.respondida).length,
            progresoRespuestas: questionsData.progresoRespuestas || 0,
            startingFrom: startingQuestion + 1,
            allQuestionStates: mappedQuestions.map(q => ({
              id: q.id,
              respondida: q.respondida,
              hasResponse: !!q.respuesta
            }))
          });
          
          return; // Exit early since we have questions with proper estadoRespuestas data
        } else {
          console.log('📝 [Interview] No questions found in generar response, will generate new ones');
        }
      } catch (error) {
        console.log('📝 [Interview] Error loading questions via generar API, will generate new ones:', error);
      }

      // If sessionId is available, check other interview progress
      if (sessionId) {
        // Check if interview is already completed
        try {
          const resultsResponse = await entrevistaAPI.getResultados(sessionId);
          const results = resultsResponse.data;
          if (results) {
            console.log('📝 [Interview] Interview already completed, showing results');
            setConsolidatedResults(results);
            setShowResults(true);
            setInterviewCompleted(true);
            setCurrentStep(12);
            setLoading(false); // Results ready, stop loading
            return;
          }
        } catch (error) {
          console.log('📝 [Interview] No results found, interview not completed yet');
        }
      }
      
      // If we reach here, we need to generate questions
      console.log('📝 [Interview] Setting step to 4 for automatic question generation');
      setCurrentStep(4);
      setLoading(false); // Let the useEffect handle loading during question generation

      console.log(`📊 [Interview] Interview data loaded successfully, Current Step: 4`);
    } catch (error: any) {
      console.error("❌ [Interview] Error loading interview data:", error);
      setError('No se pudo cargar la información de la entrevista');
      message.error("Failed to load interview data. Please try again.");
      setTimeout(() => navigate("/usuario/dashboard"), 2000);
      setLoading(false);
    }
  }

  // Paso 4: Generar preguntas con postulacion ID
  const handleGenerateQuestions = async (postulacionId?: number) => {
    const targetPostulacionId = postulacionId || Number(id);
    if (!targetPostulacionId) {
      message.error('ID de postulación no disponible');
      questionGenerationInitiated.current = false; // Reset flag on error
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      console.log('📝 [Interview] Step 4: Generating questions for postulation', targetPostulacionId);
      
      const response = await preguntaAPI.generar({ idPostulacion: targetPostulacionId });
      const questionsData = response.data;
      
      if (questionsData && questionsData.success && Array.isArray(questionsData.questions)) {
        // Sort questions by ID to maintain correct order
        const sortedQuestions = questionsData.questions.sort((a, b) => a.id - b.id);
        
        const generatedQuestions: Pregunta[] = sortedQuestions.map((q: any, index: number) => {
          const questionId = q.id || index + 1;
          const isAnswered = questionsData.estadoRespuestas ? questionsData.estadoRespuestas[questionId.toString()] === true : false;
          
          console.log(`🔍 [Interview] Question ${questionId} answered status from estadoRespuestas:`, isAnswered);
          
          return {
            id: questionId,
            pregunta: q.question, // Map "question" field to "pregunta"
            tipo: q.typeReadable || q.type || "Technical", // Use readable type first, then fallback
            dificultad: q.score ? Math.ceil(q.score / 2).toString() : "5", // Convert score to difficulty (1-10 scale)
            categoria: q.typeReadable || q.type || "Technical", // Use readable category
            postulacion: { id: targetPostulacionId }, // Set the postulation reference
            // Additional fields from new API format
            score: q.score,
            typeKey: q.type, // Keep original type key for reference
            // New progress tracking fields - ONLY use estadoRespuestas as source of truth
            respondida: isAnswered,
            evaluada: q.evaluada || false,
            respuesta: isAnswered ? (q.respuesta || "Respondida anteriormente") : null,
            fechaRespuesta: q.fechaRespuesta || null,
          };
        });

        // Pre-fill answers array with existing responses or placeholder for answered questions
        const answersArray = generatedQuestions.map(q => {
          if (q.respondida) {
            return q.respuesta || "Respondida anteriormente";
          }
          return "";
        });
        
        // Find the first unanswered question to continue from (based on estadoRespuestas)
        const firstUnansweredIndex = generatedQuestions.findIndex(q => !q.respondida);
        const startingQuestion = firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;

        setQuestions(generatedQuestions);
        setAnswers(answersArray);
        setCurrentQuestion(startingQuestion);
        setCurrentStep(6); // Ready to answer questions
        
        console.log('✅ [Interview] Questions generated successfully:', generatedQuestions.length);
        console.log('📝 [Interview] Continuing from question:', startingQuestion + 1, 'of', generatedQuestions.length);
        console.log('� [Interview] estadoRespuestas from API:', questionsData.estadoRespuestas);
        console.log('�📝 [Interview] Sample question mapping:', {
          question: generatedQuestions[0]?.pregunta,
          type: generatedQuestions[0]?.tipo,
          score: generatedQuestions[0]?.score,
          answered: generatedQuestions[0]?.respondida,
          response: generatedQuestions[0]?.respuesta ? 'Has response' : 'No response',
          questionId: generatedQuestions[0]?.id,
          estadoRespuesta: questionsData.estadoRespuestas && generatedQuestions[0]?.id ? questionsData.estadoRespuestas[generatedQuestions[0].id.toString()] : 'N/A'
        });
        console.log('📊 [Interview] Progress summary:', {
          totalQuestions: generatedQuestions.length,
          answeredQuestions: generatedQuestions.filter(q => q.respondida).length,
          startingFrom: startingQuestion + 1,
          progressPercentage: questionsData.progresoRespuestas || 0,
          allQuestionStates: generatedQuestions.map(q => ({
            id: q.id,
            respondida: q.respondida,
            hasResponse: !!q.respuesta
          }))
        });
        
        // Questions are ready, stop loading
        setLoading(false);
        
      } else {
        throw new Error("Invalid response format from question generation API");
      }
    } catch (error: any) {
      console.error('❌ [Interview] Error generating questions:', error);
      message.error('Error al generar las preguntas');
      setLoading(false); // Stop loading on error too
      questionGenerationInitiated.current = false; // Reset flag on error
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  // Cargar resultados con postulacion ID
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
  };

  // Paso 7-8: Responder preguntas y evaluar respuestas
  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) {
      message.warning("Por favor proporciona una respuesta antes de continuar.")
      return
    }

    if (!questions[currentQuestion] || !id) {
      message.error("Datos de la entrevista no disponibles")
      return
    }

    setIsSubmitting(true)

    try {
      console.log(`📝 [Interview] Step 7-8: Answering question ${currentQuestion + 1}/${questions.length}`);
      
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = currentAnswer.trim()
      setAnswers(newAnswers)

      // Paso 8: Evaluar respuesta - usar postulation ID  
      const evaluationRequest = {
        preguntaId: questions[currentQuestion].id!,
        answer: currentAnswer.trim(),
        postulacionId: Number(id), // Usar postulation ID correctamente
      }

      const response = await evaluacionAPI.evaluar(evaluationRequest)

      if (response.data) {
        setEvaluations((prev) => [...prev, response.data])

        // Paso 9: Actualizar progreso (opcional)
        if (sessionId) {
          const progressStep = 7 + ((currentQuestion + 1) / questions.length) * 2; // Steps 7-9
          await entrevistaAPI.actualizarProgreso(sessionId, { step: Math.floor(progressStep) });
        }

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1)
          setCurrentAnswer("")
          message.success("¡Respuesta enviada exitosamente! Pasando a la siguiente pregunta...")
        } else {
          // All questions answered, proceed to step 10-12
          await handleSubmitInterview()
        }
      } else {
        throw new Error("Invalid evaluation response")
      }
    } catch (error: any) {
      console.error("❌ [Interview] Error submitting answer:", error)
      message.error("Error al evaluar tu respuesta: " + (error.response?.data?.message || "Por favor intenta de nuevo"))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pasos 10-12: Finalizar entrevista y mostrar resultados
  const handleSubmitInterview = async () => {
    try {
      console.log('📝 [Interview] Steps 10-12: Finalizing interview');
      setInterviewCompleted(true)

      // Paso 10: Finalizar entrevista v2
      if (sessionId) {
        await entrevistaAPI.finalizarV2(sessionId);
        console.log('✅ [Interview] Interview finalized via v2 API');
      }

      // Paso 12: Obtener resultados
      if (sessionId) {
        const resultsResponse = await entrevistaAPI.getResultados(sessionId);
        setConsolidatedResults(resultsResponse.data);
        setShowResults(true);
        setCurrentStep(12);
        console.log('✅ [Interview] Results loaded successfully');
      }

      message.success("¡Entrevista completada exitosamente!", 2)
      
    } catch (error) {
      console.error("❌ [Interview] Error completing interview:", error)
      message.error("Error al completar la entrevista. Tus respuestas fueron guardadas.", 2)
      
      // Still show results even if there's an error
      setShowResults(true);
      setCurrentStep(12);
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
              Preparing Your AI Interview
            </Title>
            <Paragraph className="loading-message">
              Preparing interview questions...
            </Paragraph>
            <div className="loading-progress">
              <Progress percent={50} strokeColor="#6366f1" showInfo={true} format={() => '50% Complete'} />
            </div>
            <div className="loading-details">
              <div className="detail-item">
                <Text strong>Position:</Text>
                <Text>{postulacion?.convocatoria?.titulo || 'Loading...'}</Text>
              </div>
              <div className="detail-item">
                <Text strong>Company:</Text>
                <Text>{postulacion?.convocatoria?.empresa?.nombre || 'Loading...'}</Text>
              </div>
            </div>
            <div className="loading-tips">
              <div className="loading-tips-title">
                <InfoCircleOutlined />
                <span>Interview Tips</span>
              </div>
              <Paragraph className="loading-tips-text">
                Our AI will evaluate your responses based on clarity, technical knowledge, problem-solving approach, and communication skills. Take your time to provide thoughtful, detailed answers.
              </Paragraph>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="error-icon">
              <InfoCircleOutlined style={{ color: '#ff4d4f', fontSize: '48px' }} />
            </div>
            <Title level={2} className="error-title">
              Error al Cargar la Entrevista
            </Title>
            <Paragraph className="error-message">
              {error}
            </Paragraph>
            <Button 
              type="primary" 
              onClick={() => navigate('/usuario/dashboard')}
              style={{ marginTop: '16px' }}
            >
              Volver al Dashboard
            </Button>
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

  // Simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  // Debug: Log current question state
  console.log('🔍 [Interview Debug] Current state:', {
    questionsLength: questions.length,
    currentQuestion: currentQuestion + 1,
    totalQuestions: questions.length,
    currentQ: currentQ ? { 
      id: currentQ.id,
      pregunta: currentQ.pregunta?.substring(0, 50) + '...', 
      tipo: currentQ.tipo,
      answered: currentQ.respondida,
      hasResponse: !!currentQ.respuesta
    } : null,
    currentAnswerLength: currentAnswer.length,
    answersArray: answers.map((ans, idx) => ({
      questionIndex: idx + 1,
      answerLength: ans.length,
      hasAnswer: ans.length > 0,
      questionAnswered: questions[idx]?.respondida || false
    })),
    isGeneratingQuestions,
    loading,
    currentStep
  });

  // Show loading state when generating questions
  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Spin size="large" />
          <Title level={4} className="mt-4">Generating your interview questions...</Title>
          <Paragraph className="text-gray-600">
            mirAI is creating personalized questions based on the job requirements.
          </Paragraph>
        </Card>
      </div>
    )
  }

  // Show error state when no questions are available
  if (!loading && !isGeneratingQuestions && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Title level={4}>No questions available</Title>
          <Paragraph className="text-gray-600">
            Unable to load interview questions. Please try again.
          </Paragraph>
          <Button 
            type="primary" 
            onClick={() => navigate("/usuario/dashboard")}
            className="btn-gradient"
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  // Get specific tips for current question type
  const getQuestionTypeTips = () => {
    const tipsByType: Record<string, { tip: string; practice: string }> = {
      'technical_knowledge': {
        tip: '💻 Focus on specific technologies, frameworks, and best practices. Provide concrete examples from your experience.',
        practice: '⚡ Mention specific tools, versions, and implementation details to demonstrate deep technical knowledge.'
      },
      'experience': {
        tip: '📈 Share specific projects and roles. Use the STAR method (Situation, Task, Action, Result) to structure your answer.',
        practice: '🎯 Quantify your achievements with metrics, timelines, and measurable outcomes whenever possible.'
      },
      'problem_solving': {
        tip: '🧩 Break down your approach step-by-step. Explain your thought process and reasoning clearly.',
        practice: '🔍 Consider multiple solutions, explain trade-offs, and mention how you would validate your approach.'
      },
      'tools': {
        tip: '🛠️ Be specific about which tools you\'ve used, for how long, and in what contexts (personal, professional, team).',
        practice: '⚙️ Mention integrations, configurations, and how these tools improved your workflow or project outcomes.'
      },
      'methodology': {
        tip: '📋 Explain the methodologies you prefer and why. Give examples of how you\'ve applied them in real projects.',
        practice: '🔄 Discuss adaptability - how you adjust methodologies based on team size, project requirements, or constraints.'
      },
      'teamwork': {
        tip: '👥 Share specific examples of collaboration, communication strategies, and conflict resolution.',
        practice: '🤝 Highlight leadership moments, mentoring experiences, and how you contribute to team culture.'
      },
      'challenge': {
        tip: '⛰️ Describe the challenge clearly, your approach to solving it, and the lessons learned.',
        practice: '💪 Focus on your problem-solving process, resilience, and how the experience made you a better professional.'
      },
      'best_practices': {
        tip: '✅ Discuss coding standards, code review processes, testing strategies, and quality assurance methods.',
        practice: '📊 Mention specific tools for code quality, monitoring, documentation, and how you ensure maintainability.'
      }
    };

    const questionTypeKey = currentQ?.typeKey || currentQ?.tipo?.toLowerCase().replace(/\s+/g, '_') || '';
    return tipsByType[questionTypeKey] || {
      tip: '💡 Be specific and provide concrete examples when possible. The AI evaluates clarity, technical accuracy, relevance, and communication skills.',
      practice: '⭐ Structure your answers clearly, explain your reasoning, and don\'t hesitate to mention alternative approaches or trade-offs.'
    };
  };

  const currentQuestionTips = getQuestionTypeTips();

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
          {/* Question Info Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="progress-container">
              <Row justify="space-between" align="middle" className="mb-0">
                <Col>
                  <Title level={4} className="mb-0">
                    Question {questions.length > 0 ? currentQuestion + 1 : 0} of {questions.length}
                    {currentQ?.respondida && (
                      <Tag color="green" className="ml-2">
                        <CheckCircleOutlined className="mr-1" />
                        Answered
                      </Tag>
                    )}
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                    {postulacion?.convocatoria?.titulo} - {postulacion?.convocatoria?.empresa?.nombre}
                  </Paragraph>
                  <div className="mt-1">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Progress: {questions.filter(q => q.respondida).length} answered, {questions.filter(q => !q.respondida).length} remaining
                    </Text>
                  </div>
                </Col>
                <Col>
                  <Space size="middle">
                    <Tag color="blue" className="px-3 py-1 text-sm font-medium">
                      {currentQ?.tipo || "Technical"}
                    </Tag>
                    {currentQ?.score && (
                      <Tag color="purple" className="px-3 py-1 text-sm font-medium">
                        Score: {currentQ.score}
                      </Tag>
                    )}
                    <Tag color="orange" className="px-3 py-1 text-sm font-medium">
                      Difficulty: {currentQ?.dificultad || 5}/10
                    </Tag>
                  </Space>
                </Col>
              </Row>
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
              {/* Show answered status if question is already answered */}
              {currentQ?.respondida && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleOutlined className="text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Question Already Answered
                    </span>
                  </div>
                  <Paragraph className="text-green-700 dark:text-green-400 mb-0 mt-2">
                    You have already answered this question. You can review or modify your answer below.
                  </Paragraph>
                </div>
              )}
              
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
                    <Paragraph className="text-lg mb-0 leading-relaxed">
                      {currentQ?.pregunta || "Loading question..."}
                    </Paragraph>
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
                        : currentQ?.respondida 
                          ? "Update Answer & Next"
                          : "Submit & Next"}
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
                      mirAI Tips for {currentQ?.tipo || 'this question'}
                    </Title>
                  </div>
                  <Paragraph className="text-indigo-700 dark:text-indigo-400 mb-0">
                    {currentQuestionTips.tip}
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
                    {currentQuestionTips.practice}
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
