"use client";

import type React from "react";
import { useState } from "react";
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
  titulo: string;
  descripcion: string;
  puesto: string;
  fechaPublicacion: dayjs.Dayjs;
  fechaCierre: dayjs.Dayjs;
  dificultad: number;
  categoria: string;
  experiencia: string;
  modalidad: string;
  ubicacion: string;
  salario: string;
  beneficios: string[];
  estado: boolean;
}

const CreateConvocatoria: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const onFinish = async (values: ConvocatoriaFormData) => {
    if (!user?.id) {
      message.error("Error: No se pudo identificar el usuario");
      return;
    }

    setLoading(true);
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
      };

      console.log("Sending convocatoria data:", convocatoriaData);
      await convocatoriaAPI.create(convocatoriaData);
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

  const formValues = Form.useWatch([], form);

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
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFormProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = [
      "titulo",
      "descripcion",
      "puesto",
      "fechaPublicacion",
      "fechaCierre",
    ];
    const filledFields = requiredFields.filter((field) => values[field]);
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
                    initialValues={{
                      dificultad: 5,
                      fechaPublicacion: dayjs(),
                      fechaCierre: dayjs().add(30, "day"),
                      estado: true,
                      categoria: "technology",
                      experiencia: "mid-level",
                      modalidad: "remote",
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
                            name="titulo"
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
                            name="categoria"
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
                              <Option value="technology">Technology</Option>
                              <Option value="design">Design</Option>
                              <Option value="marketing">Marketing</Option>
                              <Option value="sales">Sales</Option>
                              <Option value="finance">Finance</Option>
                              <Option value="operations">Operations</Option>
                              <Option value="hr">Human Resources</Option>
                              <Option value="other">Other</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name="descripcion"
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
                            name="puesto"
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
                            name="experiencia"
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
                              <Option value="entry-level">
                                Entry Level (0-2 years)
                              </Option>
                              <Option value="mid-level">
                                Mid Level (3-5 years)
                              </Option>
                              <Option value="senior-level">
                                Senior Level (6-8 years)
                              </Option>
                              <Option value="lead-level">
                                Lead Level (9+ years)
                              </Option>
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
                                name="modalidad"
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
                                  <Option value="remote">Remote</Option>
                                  <Option value="on-site">On-site</Option>
                                  <Option value="hybrid">Hybrid</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name="ubicacion"
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

                          <Form.Item
                            name="salario"
                            label={
                              <span className="form-label">
                                <DollarOutlined /> Salary Range
                              </span>
                            }
                          >
                            <Input
                              placeholder="e.g., $80,000 - $120,000 per year"
                              size="large"
                              className="modern-input"
                            />
                          </Form.Item>

                          <Form.Item
                            name="beneficios"
                            label={
                              <span className="form-label">
                                <SafetyOutlined /> Benefits & Perks
                              </span>
                            }
                          >
                            <Select
                              mode="tags"
                              size="large"
                              className="modern-select"
                              placeholder="Add benefits (health insurance, 401k, etc.)"
                              tokenSeparators={[","]}
                            >
                              <Option value="health-insurance">
                                Health Insurance
                              </Option>
                              <Option value="dental-vision">
                                Dental & Vision
                              </Option>
                              <Option value="401k">401(k) Matching</Option>
                              <Option value="pto">Paid Time Off</Option>
                              <Option value="remote-work">Remote Work</Option>
                              <Option value="flexible-hours">
                                Flexible Hours
                              </Option>
                              <Option value="professional-development">
                                Professional Development
                              </Option>
                              <Option value="stock-options">
                                Stock Options
                              </Option>
                            </Select>
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
                                  count={`${formValues?.dificultad || 5}/10`}
                                  style={{
                                    backgroundColor:
                                      getDifficultyColor(
                                        formValues?.dificultad || 5,
                                      ) === "green"
                                        ? "#10b981"
                                        : getDifficultyColor(
                                              formValues?.dificultad || 5,
                                            ) === "blue"
                                          ? "#3b82f6"
                                          : getDifficultyColor(
                                                formValues?.dificultad || 5,
                                              ) === "orange"
                                            ? "#f59e0b"
                                            : "#ef4444",
                                  }}
                                  className="difficulty-badge"
                                />
                                <div className="difficulty-info">
                                  <Text className="difficulty-level">
                                    {getDifficultyLabel(
                                      formValues?.dificultad || 5,
                                    )}{" "}
                                    Level
                                  </Text>
                                  <Text
                                    className="difficulty-desc"
                                    type="secondary"
                                  >
                                    {formValues?.dificultad <= 3
                                      ? "Basic concepts and fundamentals"
                                      : formValues?.dificultad <= 6
                                        ? "Intermediate questions with practical cases"
                                        : formValues?.dificultad <= 8
                                          ? "Advanced questions and architecture"
                                          : "Expert-level optimization and complex scenarios"}
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </Form.Item>

                          <Form.Item
                            name="estado"
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
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            icon={<SendOutlined />}
                            className="nav-button submit"
                          >
                            Create Job Posting
                          </Button>
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
                              {formValues?.ubicacion || "Location TBD"}
                            </Text>
                          </div>
                        </div>

                        <Tag color="green" className="job-status-tag">
                          {formValues?.estado ? "Active" : "Draft"}
                        </Tag>
                      </div>

                      <Title level={3} className="job-preview-title">
                        {formValues?.titulo || "Job Title"}
                      </Title>

                      <div className="job-meta">
                        <div className="meta-item">
                          <TeamOutlined className="meta-icon" />
                          <span>
                            {formValues?.experiencia?.replace("-", " ") ||
                              "Experience Level"}
                          </span>
                        </div>
                        <div className="meta-item">
                          <GlobalOutlined className="meta-icon" />
                          <span>{formValues?.modalidad || "Work Mode"}</span>
                        </div>
                        <div className="meta-item">
                          <BulbOutlined className="meta-icon" />
                          <span>{formValues?.categoria || "Category"}</span>
                        </div>
                      </div>

                      {formValues?.salario && (
                        <div className="salary-section">
                          <DollarOutlined className="salary-icon" />
                          <Text className="salary-text">
                            {formValues.salario}
                          </Text>
                        </div>
                      )}

                      {/* Description */}
                      <div className="preview-section">
                        <Title level={5}>Job Description</Title>
                        <Text className="preview-text">
                          {formValues?.descripcion ||
                            "Job description will appear here..."}
                        </Text>
                      </div>

                      {/* Requirements */}
                      <div className="preview-section">
                        <Title level={5}>Requirements</Title>
                        <Text className="preview-text">
                          {formValues?.puesto ||
                            "Technical requirements will appear here..."}
                        </Text>
                      </div>

                      {/* Benefits */}
                      {formValues?.beneficios &&
                        formValues.beneficios.length > 0 && (
                          <div className="preview-section">
                            <Title level={5}>Benefits & Perks</Title>
                            <div className="benefits-tags">
                              {formValues.beneficios.map((benefit, index) => (
                                <Tag key={index} className="benefit-tag">
                                  {benefit.replace("-", " ")}
                                </Tag>
                              ))}
                            </div>
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
                          {formValues?.dificultad || 5}/10.
                        </Text>
                        <div className="difficulty-preview">
                          <Tag
                            color={getDifficultyColor(
                              formValues?.dificultad || 5,
                            )}
                            className="difficulty-tag"
                          >
                            {getDifficultyLabel(formValues?.dificultad || 5)}{" "}
                            Level
                          </Tag>
                        </div>
                      </div>

                      {/* Timeline */}
                      {formValues?.fechaPublicacion &&
                        formValues?.fechaCierre && (
                          <div className="timeline-preview">
                            <Title level={5}>Application Timeline</Title>
                            <div className="timeline-item">
                              <CalendarOutlined className="timeline-icon" />
                              <span>
                                Opens:{" "}
                                {formValues.fechaPublicacion.format(
                                  "MMM DD, YYYY",
                                )}
                              </span>
                            </div>
                            <div className="timeline-item">
                              <ClockCircleOutlined className="timeline-icon" />
                              <span>
                                Closes:{" "}
                                {formValues.fechaCierre.format("MMM DD, YYYY")}
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
