"use client"

import type React from "react"
import { useState } from "react"
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Slider,
  Typography,
  Row,
  Col,
  Tag,
  message,
  Divider,
  Layout,
  Avatar,
} from "antd"
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  RobotOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { convocatoriaAPI } from "../services/api"
import ThemeToggle from "./ThemeToggle"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Header, Content } = Layout

interface ConvocatoriaFormData {
  titulo: string
  descripcion: string
  puesto: string
  fechaPublicacion: dayjs.Dayjs
  fechaCierre: dayjs.Dayjs
  dificultad: number
}

const CreateConvocatoria: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return "green"
    if (difficulty <= 6) return "blue"
    if (difficulty <= 8) return "orange"
    return "red"
  }

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 3) return "Junior"
    if (difficulty <= 6) return "Middle"
    if (difficulty <= 8) return "Senior"
    return "Expert"
  }

  const onFinish = async (values: ConvocatoriaFormData) => {
    if (!user?.id) {
      message.error("Error: No se pudo identificar el usuario")
      return
    }

    setLoading(true)
    try {
      const convocatoriaData = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        puesto: values.puesto,
        activo: true,
        fechaPublicacion: values.fechaPublicacion.format("YYYY-MM-DD"),
        fechaCierre: values.fechaCierre.format("YYYY-MM-DD"),
        dificultad: values.dificultad,
        empresa: {
          id: user.id,
        },
      }

      console.log("Sending convocatoria data:", convocatoriaData)
      await convocatoriaAPI.create(convocatoriaData)
      message.success("¡Convocatoria creada exitosamente!")
      navigate("/empresa/dashboard")
    } catch (error: any) {
      console.error("Error creating convocatoria:", error)
      const errorMessage = error.response?.data?.message || "Error al crear la convocatoria"
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validateDates = (_: any, value: dayjs.Dayjs) => {
    if (!value) return Promise.resolve()

    const publicationDate = form.getFieldValue("fechaPublicacion")
    const closeDate = form.getFieldValue("fechaCierre")

    if (publicationDate && closeDate && closeDate.isBefore(publicationDate)) {
      return Promise.reject(new Error("La fecha de cierre debe ser posterior a la fecha de publicación"))
    }

    return Promise.resolve()
  }

  const formValues = Form.useWatch([], form)

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header className="app-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/empresa/dashboard")}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Volver al Dashboard
          </Button>
          <Divider type="vertical" />
          <div>
            <Title level={4} className="mb-0">
              Crear Nueva Convocatoria
            </Title>
            <Text type="secondary" className="text-sm">
              Configura una entrevista con IA para tu posición
            </Text>
          </div>
        </div>

        <div className="header-right">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => setShowPreview(!showPreview)}
            className={showPreview ? "bg-blue-50 border-blue-200 text-blue-600" : ""}
          >
            {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
          </Button>
          <ThemeToggle />
          <Avatar src={user?.avatar} size="large">
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      </Header>

      <Content className="main-content">
        <Row gutter={[24, 24]}>
          {/* Form Section */}
          <Col xs={24} lg={showPreview ? 12 : 24}>
            <div className="fade-in">
              <Card className="form-container">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    dificultad: 5,
                    fechaPublicacion: dayjs(),
                    fechaCierre: dayjs().add(30, "day"),
                  }}
                  className="space-y-6"
                >
                  <div className="form-section">
                    <Title level={5} className="form-title">
                      Información Básica
                    </Title>

                    <Row gutter={16}>
                      <Col xs={24}>
                        <Form.Item
                          name="titulo"
                          label="Título del Puesto"
                          rules={[
                            { required: true, message: "Por favor ingrese el título del puesto" },
                            { min: 5, message: "El título debe tener al menos 5 caracteres" },
                            { max: 100, message: "El título no puede exceder 100 caracteres" },
                          ]}
                        >
                          <Input
                            placeholder="Ej: Desarrollador Full Stack Senior"
                            size="large"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="descripcion"
                      label="Descripción del Trabajo"
                      rules={[
                        { required: true, message: "Por favor ingrese la descripción" },
                        { min: 50, message: "La descripción debe tener al menos 50 caracteres" },
                        { max: 1000, message: "La descripción no puede exceder 1000 caracteres" },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Describe las responsabilidades principales, el ambiente de trabajo y lo que hace atractivo este puesto..."
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="puesto"
                      label="Requisitos y Habilidades Técnicas"
                      rules={[
                        { required: true, message: "Por favor ingrese los requisitos del puesto" },
                        { min: 100, message: "Los requisitos deben tener al menos 100 caracteres" },
                        { max: 2000, message: "Los requisitos no pueden exceder 2000 caracteres" },
                      ]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Detalle las tecnologías, experiencia requerida, habilidades técnicas, conocimientos específicos, años de experiencia, metodologías, herramientas, etc..."
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </div>

                  <div className="form-section">
                    <Title level={5} className="form-title">
                      Fechas y Configuración
                    </Title>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="fechaPublicacion"
                          label="Fecha de Publicación"
                          rules={[{ required: true, message: "Seleccione la fecha de publicación" }]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            size="large"
                            className="rounded-lg"
                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="fechaCierre"
                          label="Fecha de Cierre"
                          rules={[
                            { required: true, message: "Seleccione la fecha de cierre" },
                            { validator: validateDates },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            size="large"
                            className="rounded-lg"
                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="dificultad" label="Nivel de Dificultad de la Entrevista IA">
                      <div className="difficulty-container">
                        <div className="difficulty-slider">
                          <Slider
                            min={1}
                            max={10}
                            marks={{
                              1: "1",
                              3: "3",
                              5: "5",
                              7: "7",
                              10: "10",
                            }}
                            tooltip={{
                              formatter: (value) => `${value}/10 - ${getDifficultyLabel(value || 5)}`,
                            }}
                          />
                        </div>

                        <div className="text-center mt-4">
                          <Tag color={getDifficultyColor(formValues?.dificultad || 5)} className="mb-2">
                            Nivel {formValues?.dificultad || 5}/10 - {getDifficultyLabel(formValues?.dificultad || 5)}
                          </Tag>
                        </div>

                        <div className="difficulty-labels">
                          <span>Junior</span>
                          <span>Middle</span>
                          <span>Senior</span>
                          <span>Expert</span>
                        </div>

                        <div className="difficulty-description">
                          <Text type="secondary">
                            <strong>1-3:</strong> Preguntas básicas y conceptos fundamentales | <strong>4-6:</strong>{" "}
                            Preguntas intermedias con casos prácticos | <strong>7-8:</strong> Preguntas avanzadas y
                            arquitectura | <strong>9-10:</strong> Preguntas expertas y optimización compleja
                          </Text>
                        </div>
                      </div>
                    </Form.Item>
                  </div>

                  <Divider />

                  <div className="action-buttons">
                    <Button size="large" onClick={() => navigate("/empresa/dashboard")}>
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      icon={<SaveOutlined />}
                      className="btn-gradient action-button"
                    >
                      Crear Convocatoria
                    </Button>
                  </div>
                </Form>
              </Card>
            </div>
          </Col>

          {/* Preview Section */}
          {showPreview && (
            <Col xs={24} lg={12}>
              <div className="slide-up">
                <Card className="preview-card">
                  <div className="preview-header">
                    <EyeOutlined className="text-blue-600" />
                    <Title level={4} className="preview-title">
                      Vista Previa
                    </Title>
                  </div>

                  <div className="space-y-6">
                    {/* Job Header */}
                    <div className="border-b pb-4">
                      <Title level={3} className="mb-2">
                        {formValues?.titulo || "Título del Puesto"}
                      </Title>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <UserOutlined />
                          <span>Posición Técnica</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          <span>Entrevista con IA</span>
                        </span>
                      </div>
                      {formValues?.dificultad && (
                        <div className="flex items-center gap-2">
                          <StarOutlined className="text-yellow-500" />
                          <Tag color={getDifficultyColor(formValues.dificultad)}>
                            Nivel {formValues.dificultad}/10 - {getDifficultyLabel(formValues.dificultad)}
                          </Tag>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <Title level={5}>Descripción del Trabajo</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-400">
                        {formValues?.descripcion || "La descripción del trabajo aparecerá aquí..."}
                      </Paragraph>
                    </div>

                    {/* Requirements */}
                    <div>
                      <Title level={5}>Requisitos y Habilidades Técnicas</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-400">
                        {formValues?.puesto || "Los requisitos técnicos aparecerán aquí..."}
                      </Paragraph>
                    </div>

                    {/* Dates */}
                    {formValues?.fechaPublicacion && formValues?.fechaCierre && (
                      <div>
                        <Title level={5}>Período de Aplicación</Title>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CalendarOutlined />
                          <span>
                            {formValues.fechaPublicacion.format("DD/MM/YYYY")} -{" "}
                            {formValues.fechaCierre.format("DD/MM/YYYY")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Interview Info */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center gap-2 mb-2">
                        <RobotOutlined className="text-indigo-600" />
                        <Title level={5} className="mb-0 text-indigo-800 dark:text-indigo-300">
                          Entrevista Potenciada por IA
                        </Title>
                      </div>
                      <Paragraph className="text-indigo-700 dark:text-indigo-400 mb-0 text-sm">
                        Los candidatos participarán en un proceso de entrevista inteligente potenciado por mirAI, con
                        preguntas personalizadas basadas en los requisitos del trabajo y evaluación en tiempo real con
                        nivel de dificultad {formValues?.dificultad || 5}/10.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          )}
        </Row>
      </Content>
    </Layout>
  )
}

export default CreateConvocatoria
