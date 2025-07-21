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
  Alert,
  Statistic
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
      message.error('Error al cargar los detalles de la convocatoria');
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
          message="Convocatoria No Encontrada"
          description="La convocatoria solicitada no pudo ser encontrada."
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
              Atrás
            </Button>
            <div>
              <Title level={4} className="mb-0 text-gray-800">
                Detalles de la Convocatoria
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
                        {isActive ? 'Activa' : 'Cerrada'}
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
                        <span>{postulaciones.length} Postulaciones</span>
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
                        Evaluar Candidatos
                      </Button>
                    </Space>
                  )}
                </div>

                <Divider />

                {/* Job Description */}
                <div>
                  <Title level={4} className="mb-4">Descripción del Trabajo</Title>
                  <Paragraph className="text-base leading-relaxed text-gray-700">
                    {convocatoria.descripcion}
                  </Paragraph>
                </div>

                <Divider />

                {/* Job Details */}
                <div>
                  <Title level={4} className="mb-4">Detalles del Trabajo</Title>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Puesto" span={1}>
                      <Tag color="blue" className="text-sm">
                        {convocatoria.puesto}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado" span={1}>
                      <Tag color={isActive ? 'success' : 'default'}>
                        {isActive ? 'Activa' : 'Cerrada'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Fecha de Publicación" span={1}>
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{dayjs(convocatoria.fechaPublicacion).format('DD [de] MMMM [de] YYYY')}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Fecha Límite de Postulación" span={1}>
                      <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span>{dayjs(convocatoria.fechaCierre).format('DD [de] MMMM [de] YYYY')}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total de Postulaciones" span={1}>
                      <div className="flex items-center space-x-2">
                        <TeamOutlined className="text-gray-500" />
                        <span>{postulaciones.length}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Entrevistas Completadas" span={1}>
                      <div className="flex items-center space-x-2">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>{postulaciones.filter(p => p.estado === 'COMPLETADA').length}</span>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* Company Information */}
                <div>
                  <Title level={4} className="mb-4">Acerca de la Empresa</Title>
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
                    <Title level={4} className="mb-4">Estadísticas de Postulaciones</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Total de Postulaciones"
                            value={postulaciones.length}
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Pendientes"
                            value={postulaciones.filter(p => p.estado === 'PENDIENTE').length}
                            valueStyle={{ color: '#faad14' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="En Progreso"
                            value={postulaciones.filter(p => p.estado === 'EN_EVALUACION').length}
                            valueStyle={{ color: '#722ed1' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Card className="text-center">
                          <Statistic
                            title="Completadas"
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
