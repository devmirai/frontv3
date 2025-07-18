"use client"

import type React from "react"
import { useState } from "react"
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
  Row,
  Col,
} from "antd"
import {
  ArrowLeftOutlined,
  RobotOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ThemeToggle from "./ThemeToggle"

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

// Preguntas mock para modo diseño
const mockQuestions = [
  {
    id: 1,
    pregunta: "¿Cuál es la diferencia entre useState y useReducer en React? ¿Cuándo usarías cada uno?",
    tipo: "Técnica",
    dificultad: "7",
    categoria: "React",
  },
  {
    id: 2,
    pregunta: "Explica cómo implementarías testing unitario para un componente React usando Jest y React Testing Library.",
    tipo: "Técnica",
    dificultad: "8",
    categoria: "Testing",
  },
  {
    id: 3,
    pregunta: "¿Qué estrategias usarías para optimizar el rendimiento de una aplicación React con muchos componentes?",
    tipo: "Técnica",
    dificultad: "9",
    categoria: "Performance",
  },
]

const DesignModeInterview: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(mockQuestions.length).fill(""))
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  
  const navigate = useNavigate()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      return
    }

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = currentAnswer.trim()
    setAnswers(newAnswers)

    if (currentQuestion === mockQuestions.length - 1) {
      // Última pregunta - mostrar resultados
      alert("¡Entrevista de diseño completada! (En la versión real se mostrarían los resultados)")
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setCurrentAnswer("")
    }
  }

  const currentQ = mockQuestions[currentQuestion]

  return (
    <Layout className="main-layout min-h-screen">
      {/* Header */}
      <Header className="header-layout border-b">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Back to Home
            </Button>
            <div className="flex items-center space-x-3">
              <div className="logo-icon text-lg">
                <RobotOutlined />
              </div>
              <span className="font-semibold">🥧 Design Mode Interview</span>
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
            <Avatar size="large" className="border-2 border-indigo-200">
              DM
            </Avatar>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content className="content-layout">
        <div className="interview-container max-w-4xl mx-auto p-6">
          {/* Progress Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="mb-8 shadow-sm">
              <Row justify="space-between" align="middle" className="mb-4">
                <Col>
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-lg">
                      <RobotOutlined className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <Title level={4} className="mb-0">
                        Frontend Developer Position - Design Mode
                      </Title>
                      <Text className="text-gray-600 dark:text-gray-300">
                        TechCorp Solutions
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="text-right">
                    <Text strong className="block">
                      Question {currentQuestion + 1} of {mockQuestions.length}
                    </Text>
                    <Text className="text-gray-500">
                      {Math.round(((currentQuestion + 1) / mockQuestions.length) * 100)}% Complete
                    </Text>
                  </div>
                </Col>
              </Row>
              <Progress 
                percent={Math.round(((currentQuestion + 1) / mockQuestions.length) * 100)} 
                strokeColor="#6366f1" 
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
            <Card className="mb-8 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Tag color="blue" className="px-3 py-1 text-sm font-medium">
                      {currentQ?.tipo || "Technical"}
                    </Tag>
                    <Tag color="orange" className="px-3 py-1 text-sm font-medium">
                      Difficulty: {currentQ?.dificultad || "7"}/10
                    </Tag>
                    <Tag color="green" className="px-3 py-1 text-sm font-medium">
                      {currentQ?.categoria || "React"}
                    </Tag>
                  </div>
                </div>

                <Title level={3} className="text-gray-800 dark:text-gray-100 leading-relaxed">
                  {currentQ?.pregunta || "Sample question for design mode"}
                </Title>
              </div>

              <Divider />

              <div className="space-y-6">
                <div>
                  <Title level={5} className="mb-3 text-gray-700 dark:text-gray-200">
                    Your Answer:
                  </Title>
                  <TextArea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Provide a detailed answer to this question..."
                    rows={8}
                    className="resize-none"
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <Text className="text-gray-500 text-sm">
                      {currentAnswer.length}/2000 characters
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    disabled={currentQuestion === 0}
                    onClick={() => {
                      setCurrentQuestion((prev) => prev - 1)
                      setCurrentAnswer(answers[currentQuestion - 1] || "")
                    }}
                  >
                    Previous Question
                  </Button>

                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="btn-gradient px-8"
                    >
                      {currentQuestion === mockQuestions.length - 1 ? "Complete Interview" : "Next Question"}
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Title level={5} className="text-blue-800 dark:text-blue-300 mb-3">
                💡 Design Mode Tips
              </Title>
              <Paragraph className="text-blue-700 dark:text-blue-400 mb-2">
                This is a design mode preview of the interview interface. In the real application, 
                your responses would be evaluated by AI and you would receive detailed feedback.
              </Paragraph>
              <Paragraph className="text-blue-700 dark:text-blue-400 mb-0">
                Be specific, provide examples, and explain your reasoning clearly for the best results.
              </Paragraph>
            </Card>
          </motion.div>
        </div>
      </Content>
    </Layout>
  )
}

export default DesignModeInterview
