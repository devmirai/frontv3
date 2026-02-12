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
  Space,
  Progress,
  Tooltip,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
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

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Step } = Steps;
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
      errors.push("Job Title is required");
    }
    
    if (!allValues.jobDescription || String(allValues.jobDescription).trim() === '') {
      errors.push("Job Description is required");
    }
    
    if (!allValues.technicalRequirements || String(allValues.technicalRequirements).trim() === '') {
      errors.push("Technical Requirements is required");
    }
    
    if (!allValues.category || Number(allValues.category) < 1) {
      errors.push("Category is required");
    }
    
    if (!allValues.experienceLevel || Number(allValues.experienceLevel) < 1) {
      errors.push("Experience Level is required");
    }
    
    if (!allValues.workMode || Number(allValues.workMode) < 1) {
      errors.push("Work Mode is required");
    }
    
    if (!allValues.fechaPublicacion) {
      errors.push("Publication Date is required");
    }
    
    if (!allValues.fechaCierre) {
      errors.push("Closing Date is required");
    }
    
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      message.error(`Missing required fields: ${errors.join(", ")}`);
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
      title: "Basic Info",
      description: "Job title and description",
      icon: <FormOutlined />,
    },
    {
      title: "Requirements",
      description: "Skills and experience",
      icon: <FileTextOutlined />,
    },
    {
      title: "Details",
      description: "Location and benefits",
      icon: <SettingOutlined />,
    },
    {
      title: "AI Configuration",
      description: "Interview settings",
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
          message.error('Please fill in all required fields before continuing');
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
              Back to Dashboard
            </Button>
            <div className="header-info">
              <Title level={3} className="header-title">
                Create New Job Posting
              </Title>
              <Text className="header-subtitle">
                Set up an AI-powered interview for your position
              </Text>
            </div>
          </div>

          <div className="header-right">
            <div className="progress-indicator">
              <Text className="progress-text">Form Progress</Text>
              <Progress
                percent={getFormProgress()}
                size="small"
                strokeColor="#10b981"
                className="progress-bar"
              />
            </div>
            <Tooltip title="Toggle Preview">
              <Button
                type={showPreview ? "primary" : "default"}
                icon={<EyeOutlined />}
                onClick={() => setShowPreview(!showPreview)}
                className="preview-toggle"
              >
                Preview
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
                              Basic Information
                            </Title>
                            <Text className="step-description">
                              Start with the essential details about your job
                              posting
                            </Text>
                          </div>
                        </div>

                        <div className="form-section">
                          <Form.Item
                            name="jobTitle"
                            label={
                              <span className="form-label">
                                <UserOutlined /> Job Title
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter the job title",
                              },
                              {
                                min: 5,
                                message: "Title must be at least 5 characters",
                              },
                              {
                                max: 100,
                                message: "Title cannot exceed 100 characters",
                              },
                            ]}
                          >
                            <Input
                              placeholder="e.g., Senior Full Stack Developer"
                              size="large"
                              className="modern-input"
                            />
                          </Form.Item>

                          <Form.Item
                            name="category"
                            label={
                              <span className="form-label">
                                <BulbOutlined /> Category
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please select a category",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Select job category"
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
                                <FileTextOutlined /> Job Description
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter the job description",
                              },
                              {
                                min: 50,
                                message:
                                  "Description must be at least 50 characters",
                              },
                              {
                                max: 1000,
                                message:
                                  "Description cannot exceed 1000 characters",
                              },
                            ]}
                          >
                            <TextArea
                              rows={6}
                              placeholder="Describe the main responsibilities, work environment, and what makes this position attractive..."
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
                              Requirements & Skills
                            </Title>
                            <Text className="step-description">
                              Define the technical skills and experience needed
                            </Text>
                          </div>
                        </div>

                        <div className="form-section">
                          <Form.Item
                            name="technicalRequirements"
                            label={
                              <span className="form-label">
                                <ThunderboltOutlined /> Technical Requirements
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter the requirements",
                              },
                              {
                                min: 100,
                                message:
                                  "Requirements must be at least 100 characters",
                              },
                              {
                                max: 2000,
                                message:
                                  "Requirements cannot exceed 2000 characters",
                              },
                            ]}
                          >
                            <TextArea
                              rows={8}
                              placeholder="Detail the technologies, required experience, technical skills, specific knowledge, years of experience, methodologies, tools, etc..."
                              className="modern-textarea"
                              showCount
                              maxLength={2000}
                            />
                          </Form.Item>

                          <Form.Item
                            name="experienceLevel"
                            label={
                              <span className="form-label">
                                <StarOutlined /> Experience Level
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please select experience level",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Select required experience"
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
                              Job Details
                            </Title>
                            <Text className="step-description">
                              Configure work mode, location, and compensation
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
                                    <GlobalOutlined /> Work Mode
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select work mode",
                                  },
                                ]}
                              >
                                <Select
                                  size="large"
                                  className="modern-select"
                                  placeholder="Select work mode"
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
                                    <EnvironmentOutlined /> Location
                                  </span>
                                }
                              >
                                <Input
                                  placeholder="e.g., San Francisco, CA or Remote"
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
                                    <DollarOutlined /> Salary Min
                                  </span>
                                }
                              >
                                <Input
                                  type="number"
                                  placeholder="e.g., 80000"
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
                                    <DollarOutlined /> Salary Max
                                  </span>
                                }
                              >
                                <Input
                                  type="number"
                                  placeholder="e.g., 120000"
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
                                <DollarOutlined /> Currency
                              </span>
                            }
                          >
                            <Select
                              size="large"
                              className="modern-select"
                              placeholder="Select currency"
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
                                <SafetyOutlined /> Benefits & Perks
                              </span>
                            }
                          >
                            <TextArea
                              rows={4}
                              placeholder="Describe benefits like health insurance, PTO, 401k, flexible hours, etc."
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
                                    <CalendarOutlined /> Publication Date
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Select publication date",
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
                                    <ClockCircleOutlined /> Closing Date
                                  </span>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Select closing date",
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
                              AI Interview Configuration
                            </Title>
                            <Text className="step-description">
                              Configure the AI-powered interview settings
                            </Text>
                          </div>
                        </div>

                        <div className="ai-config-section">
                          <Card className="ai-info-card">
                            <div className="ai-info-header">
                              <RobotOutlined className="ai-info-icon" />
                              <div>
                                <Title level={5} className="ai-info-title">
                                  AI-Powered Interview
                                </Title>
                                <Text className="ai-info-description">
                                  Candidates will participate in an intelligent
                                  interview powered by mirAI
                                </Text>
                              </div>
                            </div>
                          </Card>

                          <Form.Item
                            name="dificultad"
                            label={
                              <span className="form-label">
                                <StarOutlined /> Interview Difficulty Level
                              </span>
                            }
                          >
                            <div className="difficulty-container">
                              <div className="difficulty-slider">
                                <Slider
                                  min={1}
                                  max={10}
                                  marks={{
                                    1: "Beginner",
                                    3: "Junior",
                                    5: "Mid",
                                    7: "Senior",
                                    10: "Expert",
                                  }}
                                  tooltip={{
                                    formatter: (value) =>
                                      `Level ${value}/10 - ${getDifficultyLabel(value || 5)}`,
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
                                    Level
                                  </Text>
                                  <Text
                                    className="difficulty-desc"
                                    type="secondary"
                                  >
                                    {previewData?.dificultad <= 3
                                      ? "Basic concepts and fundamentals"
                                      : previewData?.dificultad <= 6
                                        ? "Intermediate questions with practical cases"
                                        : previewData?.dificultad <= 8
                                          ? "Advanced questions and architecture"
                                          : "Expert-level optimization and complex scenarios"}
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
                                <CheckCircleOutlined /> Publish Immediately
                              </span>
                            }
                          >
                            <Switch
                              checkedChildren="Active"
                              unCheckedChildren="Draft"
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
                            Previous
                          </Button>
                        )}
                      </div>

                      <div className="nav-right">
                        <Button
                          size="large"
                          onClick={() => navigate("/empresa/dashboard")}
                          className="nav-button cancel"
                        >
                          Cancel
                        </Button>

                        {currentStep < steps.length - 1 ? (
                          <Button
                            type="primary"
                            size="large"
                            onClick={nextStep}
                            className="nav-button primary"
                          >
                            Next Step
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
                                message.info("Check console for current form values");
                              }}
                              className="nav-button debug"
                              style={{ marginRight: 8 }}
                            >
                              Debug Values
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
                              Create Job Posting
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
                          Live Preview
                        </Title>
                        <Text className="preview-subtitle">
                          See how candidates will view this job
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
                              {user?.name || "Your Company"}
                            </Text>
                            <Text className="job-location">
                              {previewData?.location || "Location TBD"}
                            </Text>
                          </div>
                        </div>

                        <Tag color="green" className="job-status-tag">
                          {previewData?.isActive ? "Active" : "Draft"}
                        </Tag>
                      </div>

                      <Title level={3} className="job-preview-title">
                        {previewData?.jobTitle || "Job Title"}
                      </Title>

                      <div className="job-meta">
                        <div className="meta-item">
                          <TeamOutlined className="meta-icon" />
                          <span>
                            {EXPERIENCE_LEVELS.find(exp => exp.value === previewData?.experienceLevel)?.label || "Experience Level"}
                          </span>
                        </div>
                        <div className="meta-item">
                          <GlobalOutlined className="meta-icon" />
                          <span>{WORK_MODES.find(mode => mode.value === previewData?.workMode)?.label || "Work Mode"}</span>
                        </div>
                        <div className="meta-item">
                          <BulbOutlined className="meta-icon" />
                          <span>{CATEGORIES.find(cat => cat.value === previewData?.category)?.label || "Category"}</span>
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
                        <Title level={5}>Job Description</Title>
                        <Text className="preview-text">
                          {previewData?.jobDescription ||
                            "Job description will appear here..."}
                        </Text>
                      </div>

                      {/* Requirements */}
                      <div className="preview-section">
                        <Title level={5}>Requirements</Title>
                        <Text className="preview-text">
                          {previewData?.technicalRequirements ||
                            "Technical requirements will appear here..."}
                        </Text>
                      </div>

                      {/* Benefits */}
                      {previewData?.benefitsPerks && (
                          <div className="preview-section">
                            <Title level={5}>Benefits & Perks</Title>
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
                            AI-Powered Interview
                          </Title>
                        </div>
                        <Text className="ai-preview-description">
                          Candidates will participate in an intelligent
                          interview with personalized questions and real-time
                          evaluation at difficulty level{" "}
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
                            <Title level={5}>Application Timeline</Title>
                            <div className="timeline-item">
                              <CalendarOutlined className="timeline-icon" />
                              <span>
                                Opens:{" "}
                                {previewData.fechaPublicacion.format(
                                  "MMM DD, YYYY",
                                )}
                              </span>
                            </div>
                            <div className="timeline-item">
                              <ClockCircleOutlined className="timeline-icon" />
                              <span>
                                Closes:{" "}
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
