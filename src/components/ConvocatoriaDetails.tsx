import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  Button, 
  Space,
  Tag,
  Avatar,
  Divider,
  message,
  Row,
  Col,
  Spin,
  Descriptions,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { convocatoriaAPI, postulacionAPI } from '../services/api';
import { Convocatoria, Postulacion, Rol } from '../types/api';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const ConvocatoriaDetails: React.FC = () => {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    loadConvocatoriaDetails();
  }, [id]);

  const loadConvocatoriaDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Load convocatoria details
      const convocatoriaResponse = await convocatoriaAPI.getById(parseInt(id));
      setConvocatoria(convocatoriaResponse.data);

      // Load postulaciones for this convocatoria
      const postulacionesResponse = await postulacionAPI.getByConvocatoria(parseInt(id));
      setPostulaciones(postulacionesResponse.data);
      
    } catch (error: any) {
      console.error('Error loading convocatoria details:', error);
      message.error('Failed to load job posting details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidates = () => {
    navigate(`/empresa/convocatoria/${id}/candidates`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Job Posting Not Found"
          description="The requested job posting could not be found."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const isActive = convocatoria.activo && dayjs(convocatoria.fechaCierre).isAfter(dayjs());
  const isCompanyOwner = user?.role === Rol.EMPRESA && user?.id === convocatoria.empresa?.id;

  return (
    <Layout className="main-layout">
      <Header className="header-layout">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              Back
            </Button>
            <div>
              <Title level={4} className="mb-0 text-gray-800">
                Job Posting Details
              </Title>
              <Paragraph className="text-gray-500 text-sm mb-0">
                {convocatoria.empresa?.nombre}
              </Paragraph>
            </div>
          </div>
          
          <Avatar 
            src={user?.avatar} 
            size="large"
            className="border-2 border-indigo-200"
          />
        </div>
      </Header>

      <Content className="content-layout">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Details Card */}
            <Card className="border-0 shadow-sm">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <Title level={2} className="mb-0">
                        {convocatoria.titulo}
                      </Title>
                      <Tag color={isActive ? 'success' : 'default'} className="text-sm px-3 py-1">
                        {isActive ? 'Active' : 'Closed'}
                      </Tag>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <EnvironmentOutlined />
                        <span>{convocatoria.empresa?.nombre}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserOutlined />
                        <span>{convocatoria.puesto}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TeamOutlined />
                        <span>{postulaciones.length} Applications</span>
                      </div>
                    </div>
                  </div>
                  
                  {isCompanyOwner && (
                    <Space>
                      <Button 
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={handleViewCandidates}
                        className="btn-gradient"
                      >
                        Evaluate Candidates
                      </Button>
                    </Space>
                  )}
                </div>

                <Divider />

                {/* Job Description */}
                <div>
                  <Title level={4} className="mb-4">Job Description</Title>
                  <Paragraph className="text-base leading-relaxed text-gray-700">
                    {convocatoria.descripcion}
                  </Paragraph>
                </div>

                <Divider />

                {/* Job Details */}
                <div>
                  <Title level={4} className="mb-4">Job Details</Title>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Position" span={1}>
                      <Tag color="blue" className="text-sm">
                        {convocatoria.puesto}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={1}>
                      <Tag color={isActive ? 'success' : 'default'}>
                        {isActive ? 'Active' : 'Closed'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Published Date" span={1}>
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{dayjs(convocatoria.fechaPublicacion).format('MMMM DD, YYYY')}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Application Deadline" span={1}>
                      <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span>{dayjs(convocatoria.fechaCierre).format('MMMM DD, YYYY')}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Applications" span={1}>
                      <div className="flex items-center space-x-2">
                        <TeamOutlined className="text-gray-500" />
                        <span>{postulaciones.length}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Completed Interviews" span={1}>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>{postulaciones.filter(p => p.estado === 'COMPLETADA').length}</span>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* Company Information */}
                <div>
                  <Title level={4} className="mb-4">About the Company</Title>
                  <Card className="bg-gray-50 border-gray-200">
                    <div className="flex items-start space-x-4">
                      <Avatar size={64} className="bg-indigo-600">
                        {convocatoria.empresa?.nombre?.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <Title level={5} className="mb-2">
                          {convocatoria.empresa?.nombre}
                        </Title>
                        <Paragraph className="text-gray-600 mb-2">
                          {convocatoria.empresa?.descripcion}
                        </Paragraph>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📧 {convocatoria.empresa?.email}</span>
                          <span>📞 {convocatoria.empresa?.telefono}</span>
                          <span>📍 {convocatoria.empresa?.direccion}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Application Statistics */}
                {isCompanyOwner && postulaciones.length > 0 && (
                  <div>
                    <Title level={4} className="mb-4">Application Statistics</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Total Applications"
                            value={postulaciones.length}
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Pending"
                            value={postulaciones.filter(p => p.estado === 'PENDIENTE').length}
                            valueStyle={{ color: '#faad14' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="In Progress"
                            value={postulaciones.filter(p => p.estado === 'EN_EVALUACION').length}
                            valueStyle={{ color: '#722ed1' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Completed"
                            value={postulaciones.filter(p => p.estado === 'COMPLETADA').length}
                            valueStyle={{ color: '#52c41a' }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default ConvocatoriaDetails;
