"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Steps,
  Select,
  Switch,
  Progress,
  Tooltip,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  RobotOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  CheckCircleOutlined,
  FormOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { convocatoriaAPI } from "../services/api";
import ThemeToggle from "./ThemeToggle";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Option } = Select;

interface ConvocatoriaFormData {
  jobTitle: string;
  jobDescription: string;
  technicalRequirements: string;
  fechaPublicacion: dayjs.Dayjs;
  fechaCierre: dayjs.Dayjs;
  dificultad: number;
  category: number;  // Número que representa el ENUM
  experienceLevel: number;  // Número que representa el ENUM
  workMode: number;  // Número que representa el ENUM
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  benefitsPerks: string;
  isActive: boolean;
  empresaId: number;
}

// Mapeo de categorías (usando ENUMs del backend con valores numéricos)
const CATEGORIES = [
  { value: 1, label: "Tecnología", enum: "TECHNOLOGY" },
  { value: 2, label: "Marketing", enum: "MARKETING" },
  { value: 3, label: "Ventas", enum: "SALES" },
  { value: 4, label: "Finanzas", enum: "FINANCE" },
  { value: 5, label: "Recursos Humanos", enum: "HUMAN_RESOURCES" },
  { value: 6, label: "Operaciones", enum: "OPERATIONS" },
  { value: 7, label: "Diseño", enum: "DESIGN" },
  { value: 8, label: "Producto", enum: "PRODUCT" }
];

// Mapeo de niveles de experiencia (usando ENUMs del backend con valores numéricos)
const EXPERIENCE_LEVELS = [
  { value: 1, label: "Sin experiencia", enum: "NO_EXPERIENCE" },
  { value: 2, label: "Junior (1-2 años)", enum: "JUNIOR" },
  { value: 3, label: "Semi-Senior (3-5 años)", enum: "MID_LEVEL" },
  { value: 4, label: "Senior (5+ años)", enum: "SENIOR" },
  { value: 5, label: "Lead/Expert (8+ años)", enum: "LEAD" }
];

// Mapeo de modalidades de trabajo (usando ENUMs del backend con valores numéricos)
const WORK_MODES = [
  { value: 1, label: "Presencial", enum: "ON_SITE" },
  { value: 2, label: "Remoto", enum: "REMOTE" },
  { value: 3, label: "Híbrido", enum: "HYBRID" }
];

const CreateConvocatoria: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ConvocatoriaFormData>>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sincronizar valores iniciales del formulario
  useEffect(() => {
    const initialValues = form.getFieldsValue();
    setFormData(initialValues);
  }, [form]);

  // Actualizar formData cada vez que cambie algo en el formulario
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setFormData(prev => ({ ...prev, ...values }));
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return "green";
    if (difficulty <= 6) return "blue";
    if (difficulty <= 8) return "orange";
    return "red";
  };

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 3) return "Junior";
    if (difficulty <= 6) return "Middle";
    if (difficulty <= 8) return "Senior";
    return "Expert";
  };

  // Validación completa antes del envío
  const validateAllFields = (allValues: any): boolean => {
    const errors: string[] = [];
    
    if (!allValues.jobTitle || String(allValues.jobTitle).trim() === '') {
      errors.push("El título del trabajo es requerido");
    }
    
    if (!allValues.jobDescription || String(allValues.jobDescription).trim() === '') {
      errors.push("La descripción del trabajo es requerida");
    }
    
    if (!allValues.technicalRequirements || String(allValues.technicalRequirements).trim() === '') {
      errors.push("Los requisitos técnicos son requeridos");
    }
    
    if (!allValues.category || Number(allValues.category) < 1) {
      errors.push("La categoría es requerida");
    }
    
    if (!allValues.experienceLevel || Number(allValues.experienceLevel) < 1) {
      errors.push("El nivel de experiencia es requerido");
    }
    
    if (!allValues.workMode || Number(allValues.workMode) < 1) {
      errors.push("El modo de trabajo es requerido");
    }
    
    if (!allValues.fechaPublicacion) {
      errors.push("La fecha de publicación es requerida");
    }
    
    if (!allValues.fechaCierre) {
      errors.push("La fecha de cierre es requerida");
    }
    
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      message.error(`Campos requeridos faltantes: ${errors.join(", ")}`);
      return false;
    }
    
    return true;
  };

  const onFinish = async (values: ConvocatoriaFormData) => {
    console.log("onFinish called with values:", values);
    
    if (!user?.id) {
      message.error("Error: No se pudo identificar el usuario");
      return;
    }

    // Guardar los valores actuales del formulario antes de procesar
    const currentFormValues = form.getFieldsValue();
    setFormData(prev => ({ ...prev, ...currentFormValues }));
    
    // Combinar TODOS los datos: formData guardado + valores actuales + valores del onFinish
    const allValues = { 
      ...formData,           // Datos guardados de pasos anteriores
      ...currentFormValues,  // Valores actuales del formulario
      ...values             // Valores del submit
    };
    
    console.log("All combined form values:", allValues);

    setLoading(true);
    try {
      // Validar todos los campos antes de proceder
      if (!validateAllFields(allValues)) {
        setLoading(false);
        return;
      }

      const convocatoriaData = {
        jobTitle: String(allValues.jobTitle || "").trim(),
        categoryNumber: Number(allValues.category) || 1,
        jobDescription: String(allValues.jobDescription || "").trim(),
        technicalRequirements: String(allValues.technicalRequirements || "").trim(),
        experienceLevelNumber: Number(allValues.experienceLevel) || 2,
        workModeNumber: Number(allValues.workMode) || 2,
        location: String(allValues.location || "").trim(),
        salaryMin: parseFloat(String(allValues.salaryMin || "0")),
        salaryMax: parseFloat(String(allValues.salaryMax || "0")),
        salaryCurrency: String(allValues.salaryCurrency || "USD"),
        benefitsPerks: String(allValues.benefitsPerks || "").trim(),
        publicationDate: allValues.fechaPublicacion ? allValues.fechaPublicacion.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        closingDate: allValues.fechaCierre ? allValues.fechaCierre.format("YYYY-MM-DD") : dayjs().add(30, "day").format("YYYY-MM-DD"),
        dificultad: Number(allValues.dificultad) || 5,
        empresaId: user.id,
      };

      console.log("Final convocatoria data to send:", convocatoriaData);
      await convocatoriaAPI.createV2(convocatoriaData);
      message.success("¡Convocatoria creada exitosamente!");
      navigate("/empresa/dashboard");
    } catch (error: any) {
      console.error("Error creating convocatoria:", error);
      const errorMessage =
        error.response?.data?.message || "Error al crear la convocatoria";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (_: any, value: dayjs.Dayjs) => {
    if (!value) return Promise.resolve();

    const publicationDate = form.getFieldValue("fechaPublicacion");
    const closeDate = form.getFieldValue("fechaCierre");

    if (publicationDate && closeDate && closeDate.isBefore(publicationDate)) {
      return Promise.reject(
        new Error(
          "La fecha de cierre debe ser posterior a la fecha de publicación",
        ),
      );
    }

    return Promise.resolve();
  };

  // Validación por pasos
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ["jobTitle", "category", "jobDescription"];
      case 1:
        return ["technicalRequirements", "experienceLevel"];
      case 2:
        return ["workMode", "fechaPublicacion", "fechaCierre"];
      case 3:
        return ["dificultad"];
      default:
        return [];
    }
  };

  const formValues = Form.useWatch([], form);
  
  // Combinar formValues con formData guardado para vista previa completa
  const previewData = { ...formData, ...formValues };

  const steps = [
    {
      title: "Información Básica",
      description: "Título y descripción del puesto",
      icon: <FormOutlined />,
    },
    {
      title: "Requisitos",
      description: "Habilidades y experiencia",
      icon: <FileTextOutlined />,
    },
    {
      title: "Detalles",
      description: "Ubicación y beneficios",
      icon: <SettingOutlined />,
    },
    {
      title: "Configuración IA",
      description: "Configuraciones de entrevista",
      icon: <RobotOutlined />,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Guardar valores actuales antes de validar
      const currentValues = form.getFieldsValue();
      setFormData(prev => ({ ...prev, ...currentValues }));
      
      // Validar solo los campos del paso actual
      const fieldsToValidate = getFieldsForStep(currentStep);
      
      if (fieldsToValidate.length > 0) {
        form.validateFields(fieldsToValidate).then(() => {
          setCurrentStep(currentStep + 1);
        }).catch((errorInfo) => {
          console.log('Validation failed for step', currentStep, ':', errorInfo);
          message.error('Por favor complete todos los campos requeridos antes de continuar');
        });
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // Guardar valores actuales antes de retroceder
      const currentValues = form.getFieldsValue();
      setFormData(prev => ({ ...prev, ...currentValues }));
      setCurrentStep(currentStep - 1);
    }
  };

  const getFormProgress = () => {
    const allValues = { ...formData, ...form.getFieldsValue() };
    const requiredFields = [
      "jobTitle",
      "jobDescription",
      "technicalRequirements",
      "fechaPublicacion",
      "fechaCierre",
      "category",
      "experienceLevel",
      "workMode",
    ];
    const filledFields = requiredFields.filter((field) => allValues[field]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  return (
    <Layout className="modern-create-layout">
      {/* Modern Header */}
      <Header className="modern-header">
        <div className="header-container">
          <div className="header-left">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/empresa/dashboard")}
              className="back-button"
            >
              Volver al Panel
            </Button>
            <div className="header-info">
              <Title level={3} className="header-title">
                Crear Nueva Oferta de Trabajo
              </Title>
              <Text className="header-subtitle">
                Configura una entrevista impulsada por IA para tu posición
              </Text>
            </div>
          </div>

          <div className="header-right">
            <div className="progress-indicator">
              <Text className="progress-text">Progreso del Formulario</Text>
              <Progress
                percent={getFormProgress()}
                size="small"
                strokeColor="#10b981"
                className="progress-bar"
              />
            </div>
            <Tooltip title="Alternar Vista Previa">
              <Button
                type={showPreview ? "primary" : "default"}
                icon={<EyeOutlined />}
                onClick={() => setShowPreview(!showPreview)}
                className="preview-toggle"
              >
                Vista Previa
              </Button>
            </Tooltip>
            <ThemeToggle />
            <Avatar src={user?.avatar} size="large" className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </div>
      </Header>

      <Content className="modern-content">
        <div className="content-container">
          <Row gutter={[32, 32]}>
            {/* Main Form Section */}
            <Col xs={24} lg={showPreview ? 14 : 24}>
              <div className="form-wrapper">
                {/* Step Indicator */}
                <Card className="steps-card">
                  <Steps
                    current={currentStep}
                    items={steps}
                    className="modern-steps"
                    size="small"
                  />
                </Card>

                {/* Main Form Card */}
                <Card className="main-form-card">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={handleFormChange}
                    initialValues={{
                      dificultad: 5,
                      fechaPublicacion: dayjs(),
                      fechaCierre: dayjs().add(30, "day"),
                      isActive: true,
                      category: 1,
                      experienceLevel: 2,
                      workMode: 2,
                      salaryMin: 0,
                      salaryMax: 0,
                      salaryCurrency: "USD",
                    }}
                    className="modern-form"
                  >
                    {/* Step 0: Basic Information */}
                    {currentStep === 0 && (
                      <div className="form-step">
                        <div className="step-header">
                          <div className="step-icon">
                            <FormOutlined />
                          </div>
                          <div className="step-info">
                            <Title level={4} className="step-title">
                              Información Básica
                            </Title>
                            <Text className="step-description">
                              Comience con los detalles esenciales sobre su oferta de trabajo
                            </Text>
                          </div>
                        </div>

                        <div className="form-section">
                            <Form.Item
                            name="jobTitle"
                            label={
                              <span className="form-label">
                                <UserOutlined /> Título del Trabajo
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Por favor ingrese el título del trabajo",
                              },
                              {
                                min: 5,
                                message: "El título debe tener al menos 5 caracteres",
                              },
                              {
                                max: 100,
                                message: "El título no puede exceder los 100 caracteres",
                              },
                            ]}
                          >
                            <Input
                              placeholder="ej., Desarrollador Full Stack Senior"
                              size="large"
                              className="modern-input"
                            />
                          </Form.Item>

                            <Form.Item
                            name="category"
                            label={
                              <span className="form-label">
                                <BulbOutlined /> Categoría
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Por favor seleccione una categoría",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Seleccione la categoría del trabajo"
                            >
                              {CATEGORIES.map((cat) => (
                                <Option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name="jobDescription"
                            label={
                              <span className="form-label">
                                <FileTextOutlined /> Descripción del Trabajo
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Por favor ingrese la descripción del trabajo",
                              },
                              {
                                min: 50,
                                message:
                                  "La descripción debe tener al menos 50 caracteres",
                              },
                              {
                                max: 1000,
                                message:
                                  "La descripción no puede exceder los 1000 caracteres",
                              },
                            ]}
                          >
                            <TextArea
                              rows={6}
                              placeholder="Describe las principales responsabilidades, ambiente de trabajo y qué hace atractiva esta posición..."
                              className="modern-textarea"
                              showCount
                              maxLength={1000}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Requirements */}
                    {currentStep === 1 && (
                      <div className="form-step">
                        <div className="step-header">
                          <div className="step-icon">
                            <FileTextOutlined />
                          </div>
                          <div className="step-info">
                            <Title level={4} className="step-title">
                              Requisitos y Habilidades
                            </Title>
                            <Text className="step-description">
                              Define las habilidades técnicas y experiencia necesarias
                            </Text>
                          </div>
                        </div>

                        <div className="form-section">
                          <Form.Item
                            name="technicalRequirements"
                            label={
                              <span className="form-label">
                                <ThunderboltOutlined /> Requisitos Técnicos
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Por favor ingrese los requisitos",
                              },
                              {
                                min: 100,
                                message:
                                  "Los requisitos deben tener al menos 100 caracteres",
                              },
                              {
                                max: 2000,
                                message:
                                  "Los requisitos no pueden exceder los 2000 caracteres",
                              },
                            ]}
                          >
                            <TextArea
                              rows={8}
                              placeholder="Detalla las tecnologías, experiencia requerida, habilidades técnicas, conocimientos específicos, años de experiencia, metodologías, herramientas, etc..."
                              className="modern-textarea"
                              showCount
                              maxLength={2000}
                            />
                          </Form.Item>

                          <Form.Item
                            name="experienceLevel"
                            label={
                              <span className="form-label">
                                <StarOutlined /> Nivel de Experiencia
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Por favor seleccione el nivel de experiencia",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Seleccione la experiencia requerida"
                            >
                              {EXPERIENCE_LEVELS.map((exp) => (
                                <Option key={exp.value} value={exp.value}>
                                  {exp.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Job Details */}
                    {currentStep === 2 && (
                      <div className="form-step">
                        <div className="step-header">
                          <div className="step-icon">
                            <SettingOutlined />
                          </div>
                          <div className="step-info">
                            <Title level={4} className="step-title">
                              Detalles del Trabajo
                            </Title>
                            <Text className="step-description">
                              Configure el modo de trabajo, ubicación y compensación
                            </Text>
                          </div>
                        </div>

                        <div className="form-section">
                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="workMode"
                                label={
                                  <span className="form-label">
                                    <GlobalOutlined /> Modo de Trabajo
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Por favor seleccione el modo de trabajo",
                                  },
                                ]}
                              >
                                <Select
                                  size="large"
                                  className="modern-select"
                                  placeholder="Seleccione el modo de trabajo"
                                >
                                  {WORK_MODES.map((mode) => (
                                    <Option key={mode.value} value={mode.value}>
                                      {mode.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="location"
                                label={
                                  <span className="form-label">
                                    <EnvironmentOutlined /> Ubicación
                                  </span>
                                }
                              >
                                <Input
                                  placeholder="ej., San Francisco, CA o Remoto"
                                  size="large"
                                  className="modern-input"
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="salaryMin"
                                label={
                                  <span className="form-label">
                                    <DollarOutlined /> Salario Mínimo
                                  </span>
                                }
                              >
                                <Input
                                  type="number"
                                  placeholder="ej., 80000"
                                  size="large"
                                  className="modern-input"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="salaryMax"
                                label={
                                  <span className="form-label">
                                    <DollarOutlined /> Salario Máximo
                                  </span>
                                }
                              >
                                <Input
                                  type="number"
                                  placeholder="ej., 120000"
                                  size="large"
                                  className="modern-input"
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            name="salaryCurrency"
                            label={
                              <span className="form-label">
                                <DollarOutlined /> Moneda
                              </span>
                            }
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Seleccione la moneda"
                            >
                              <Option value="USD">USD - US Dollar</Option>
                              <Option value="MXN">MXN - Mexican Peso</Option>
                              <Option value="EUR">EUR - Euro</Option>
                              <Option value="CAD">CAD - Canadian Dollar</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name="benefitsPerks"
                            label={
                              <span className="form-label">
                                <SafetyOutlined /> Beneficios y Ventajas
                              </span>
                            }
                          >
                            <TextArea
                              rows={4}
                              placeholder="Describe beneficios como seguro médico, vacaciones, 401k, horarios flexibles, etc."
                              className="modern-textarea"
                              showCount
                              maxLength={500}
                            />
                          </Form.Item>

                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="fechaPublicacion"
                                label={
                                  <span className="form-label">
                                    <CalendarOutlined /> Fecha de Publicación
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Seleccione la fecha de publicación",
                                  },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: "100%" }}
                                  format="DD/MM/YYYY"
                                  size="large"
                                  className="modern-datepicker"
                                  disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="fechaCierre"
                                label={
                                  <span className="form-label">
                                    <ClockCircleOutlined /> Fecha de Cierre
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Seleccione la fecha de cierre",
                                  },
                                  { validator: validateDates },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: "100%" }}
                                  format="DD/MM/YYYY"
                                  size="large"
                                  className="modern-datepicker"
                                  disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                  }
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    )}

                    {/* Step 3: AI Configuration */}
                    {currentStep === 3 && (
                      <div className="form-step">
                        <div className="step-header">
                          <div className="step-icon ai-icon">
                            <RobotOutlined />
                          </div>
                          <div className="step-info">
                            <Title level={4} className="step-title">
                              Configuración de Entrevista IA
                            </Title>
                            <Text className="step-description">
                              Configure los ajustes de la entrevista impulsada por IA
                            </Text>
                          </div>
                        </div>

                        <div className="ai-config-section">
                          <Card className="ai-info-card">
                            <div className="ai-info-header">
                              <RobotOutlined className="ai-info-icon" />
                              <div>
                                <Title level={5} className="ai-info-title">
                                  Entrevista Impulsada por IA
                                </Title>
                                <Text className="ai-info-description">
                                  Los candidatos participarán en una entrevista inteligente
                                  impulsada por mirAI
                                </Text>
                              </div>
                            </div>
                          </Card>

                          <Form.Item
                            name="dificultad"
                            label={
                              <span className="form-label">
                                <StarOutlined /> Nivel de Dificultad de la Entrevista
                              </span>
                            }
                          >
                            <div className="difficulty-container">
                              <div className="difficulty-slider">
                                <Slider
                                  min={1}
                                  max={10}
                                  marks={{
                                    1: "Principiante",
                                    3: "Junior",
                                    5: "Intermedio",
                                    7: "Senior",
                                    10: "Experto",
                                  }}
                                  tooltip={{
                                    formatter: (value) =>
                                      `Nivel ${value}/10 - ${getDifficultyLabel(value || 5)}`,
                                  }}
                                  className="modern-slider"
                                />
                              </div>

                              <div className="difficulty-display">
                                <Badge
                                  count={`${previewData?.dificultad || 5}/10`}
                                  style={{
                                    backgroundColor:
                                      getDifficultyColor(
                                        previewData?.dificultad || 5,
                                      ) === "green"
                                        ? "#10b981"
                                        : getDifficultyColor(
                                              previewData?.dificultad || 5,
                                            ) === "blue"
                                          ? "#3b82f6"
                                          : getDifficultyColor(
                                                previewData?.dificultad || 5,
                                              ) === "orange"
                                            ? "#f59e0b"
                                            : "#ef4444",
                                  }}
                                  className="difficulty-badge"
                                />
                                <div className="difficulty-info">
                                  <Text className="difficulty-level">
                                    {getDifficultyLabel(
                                      previewData?.dificultad || 5,
                                    )}{" "}
                                    Nivel
                                  </Text>
                                  <Text
                                    className="difficulty-desc"
                                    type="secondary"
                                  >
                                    {previewData?.dificultad <= 3
                                      ? "Conceptos básicos y fundamentos"
                                      : previewData?.dificultad <= 6
                                        ? "Preguntas intermedias con casos prácticos"
                                        : previewData?.dificultad <= 8
                                          ? "Preguntas avanzadas y arquitectura"
                                          : "Optimización de nivel experto y escenarios complejos"}
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </Form.Item>

                          <Form.Item
                            name="isActive"
                            valuePropName="checked"
                            label={
                              <span className="form-label">
                                <CheckCircleOutlined /> Publicar Inmediatamente
                              </span>
                            }
                          >
                            <Switch
                              checkedChildren="Activo"
                              unCheckedChildren="Borrador"
                              className="modern-switch"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="form-navigation">
                      <div className="nav-left">
                        {currentStep > 0 && (
                          <Button
                            size="large"
                            onClick={prevStep}
                            className="nav-button secondary"
                          >
                            Anterior
                          </Button>
                        )}
                      </div>

                      <div className="nav-right">
                        <Button
                          size="large"
                          onClick={() => navigate("/empresa/dashboard")}
                          className="nav-button cancel"
                        >
                          Cancelar
                        </Button>

                        {currentStep < steps.length - 1 ? (
                          <Button
                            type="primary"
                            size="large"
                            onClick={nextStep}
                            className="nav-button primary"
                          >
                            Siguiente Paso
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="large"
                              onClick={() => {
                                const currentValues = form.getFieldsValue();
                                setFormData(prev => ({ ...prev, ...currentValues }));
                                const allData = { ...formData, ...currentValues };
                                console.log("DEBUG - Current form values:", currentValues);
                                console.log("DEBUG - Saved form data:", formData);
                                console.log("DEBUG - All combined data:", allData);
                                message.info("Revise la consola para ver los valores actuales del formulario");
                              }}
                              className="nav-button debug"
                              style={{ marginRight: 8 }}
                            >
                              Depurar Valores
                            </Button>
                            <Button
                              type="primary"
                              size="large"
                              loading={loading}
                              icon={<SendOutlined />}
                              className="nav-button submit"
                              onClick={() => {
                                // Primero guardar los valores actuales
                                const currentValues = form.getFieldsValue();
                                setFormData(prev => ({ ...prev, ...currentValues }));
                                
                                // Luego enviar el formulario
                                form.submit();
                              }}
                            >
                              Crear Oferta de Trabajo
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Form>
                </Card>
              </div>
            </Col>

            {/* Preview Section */}
            {showPreview && (
              <Col xs={24} lg={10}>
                <div className="preview-wrapper">
                  <Card className="preview-card">
                    <div className="preview-header">
                      <EyeOutlined className="preview-icon" />
                      <div>
                        <Title level={4} className="preview-title">
                          Vista Previa en Vivo
                        </Title>
                        <Text className="preview-subtitle">
                          Vea cómo verán los candidatos este trabajo
                        </Text>
                      </div>
                    </div>

                    <Divider />

                    <div className="preview-content">
                      {/* Job Header */}
                      <div className="job-preview-header">
                        <div className="company-section">
                          <Avatar size={48} className="company-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <div className="company-info">
                            <Text className="company-name">
                              {user?.name || "Su Empresa"}
                            </Text>
                            <Text className="job-location">
                              {previewData?.location || "Ubicación por definir"}
                            </Text>
                          </div>
                        </div>

                        <Tag color="green" className="job-status-tag">
                          {previewData?.isActive ? "Activo" : "Borrador"}
                        </Tag>
                      </div>

                      <Title level={3} className="job-preview-title">
                        {previewData?.jobTitle || "Título del Trabajo"}
                      </Title>

                      <div className="job-meta">
                        <div className="meta-item">
                          <TeamOutlined className="meta-icon" />
                          <span>
                            {EXPERIENCE_LEVELS.find(exp => exp.value === previewData?.experienceLevel)?.label || "Nivel de Experiencia"}
                          </span>
                        </div>
                        <div className="meta-item">
                          <GlobalOutlined className="meta-icon" />
                          <span>{WORK_MODES.find(mode => mode.value === previewData?.workMode)?.label || "Modo de Trabajo"}</span>
                        </div>
                        <div className="meta-item">
                          <BulbOutlined className="meta-icon" />
                          <span>{CATEGORIES.find(cat => cat.value === previewData?.category)?.label || "Categoría"}</span>
                        </div>
                      </div>

                      {(previewData?.salaryMin || previewData?.salaryMax) && (
                        <div className="salary-section">
                          <DollarOutlined className="salary-icon" />
                          <Text className="salary-text">
                            {previewData.salaryCurrency || 'USD'} ${previewData.salaryMin?.toLocaleString() || 0} - ${previewData.salaryMax?.toLocaleString() || 0}
                          </Text>
                        </div>
                      )}

                      {/* Description */}
                      <div className="preview-section">
                        <Title level={5}>Descripción del Trabajo</Title>
                        <Text className="preview-text">
                          {previewData?.jobDescription ||
                            "La descripción del trabajo aparecerá aquí..."}
                        </Text>
                      </div>

                      {/* Requirements */}
                      <div className="preview-section">
                        <Title level={5}>Requisitos</Title>
                        <Text className="preview-text">
                          {previewData?.technicalRequirements ||
                            "Los requisitos técnicos aparecerán aquí..."}
                        </Text>
                      </div>

                      {/* Benefits */}
                      {previewData?.benefitsPerks && (
                          <div className="preview-section">
                            <Title level={5}>Beneficios y Ventajas</Title>
                            <Text className="preview-text">
                              {previewData.benefitsPerks}
                            </Text>
                          </div>
                      )}

                      {/* AI Interview Info */}
                      <div className="ai-interview-preview">
                        <div className="ai-preview-header">
                          <RobotOutlined className="ai-preview-icon" />
                          <Title level={5} className="ai-preview-title">
                            Entrevista Impulsada por IA
                          </Title>
                        </div>
                        <Text className="ai-preview-description">
                          Los candidatos participarán en una entrevista inteligente
                          con preguntas personalizadas y evaluación en tiempo real
                          en el nivel de dificultad{" "}
                          {previewData?.dificultad || 5}/10.
                        </Text>
                        <div className="difficulty-preview">
                          <Tag
                            color={getDifficultyColor(
                              previewData?.dificultad || 5,
                            )}
                            className="difficulty-tag"
                          >
                            {getDifficultyLabel(previewData?.dificultad || 5)}{" "}
                            Level
                          </Tag>
                        </div>
                      </div>

                      {/* Timeline */}
                      {previewData?.fechaPublicacion &&
                        previewData?.fechaCierre && (
                          <div className="timeline-preview">
                            <Title level={5}>Cronograma de Aplicación</Title>
                            <div className="timeline-item">
                              <CalendarOutlined className="timeline-icon" />
                              <span>
                                Abre:{" "}
                                {previewData.fechaPublicacion.format(
                                  "MMM DD, YYYY",
                                )}
                              </span>
                            </div>
                            <div className="timeline-item">
                              <ClockCircleOutlined className="timeline-icon" />
                              <span>
                                Cierra:{" "}
                                {previewData.fechaCierre.format("MMM DD, YYYY")}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  </Card>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CreateConvocatoria;
