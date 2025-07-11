import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Row, Col, Space, Tag, Avatar, Divider, message } from 'antd';
import { UserOutlined, LoginOutlined, EyeOutlined } from '@ant-design/icons';
import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  testCredentials 
} from '../data/mockData';
import { 
  simulateLogin, 
  getApplicationsByUser, 
  getJobsByCompany, 
  getInitialDashboardData 
} from '../data/mockDataUtils';
import { Rol, EstadoPostulacion } from '../types/api';

const { Title, Text, Paragraph } = Typography;

/**
 * Componente de demostración para mostrar cómo usar los datos de prueba
 * Este componente debe ser usado solo en desarrollo para probar la UI
 */
const DemoDataViewer: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleQuickLogin = (email: string, password: string) => {
    const result = simulateLogin(email, password);
    setLoginResult(result);
    
    if (result.success && result.user) {
      message.success(`Login exitoso para: ${result.user.name}`);
    } else {
      message.error(result.error || 'Error en login');
    }
  };

  const getStatusColor = (estado: EstadoPostulacion) => {
    switch (estado) {
      case EstadoPostulacion.COMPLETADA: return 'green';
      case EstadoPostulacion.EN_EVALUACION: return 'blue';
      case EstadoPostulacion.PENDIENTE: return 'orange';
      case EstadoPostulacion.RECHAZADA: return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (estado: EstadoPostulacion) => {
    switch (estado) {
      case EstadoPostulacion.COMPLETADA: return 'Completada';
      case EstadoPostulacion.EN_EVALUACION: return 'En Evaluación';
      case EstadoPostulacion.PENDIENTE: return 'Pendiente';
      case EstadoPostulacion.RECHAZADA: return 'Rechazada';
      default: return estado;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🧪 Demo Data Viewer - mirAI Platform</Title>
      <Paragraph>
        Este componente muestra todos los datos de prueba disponibles para desarrollo y testing.
        Usa las credenciales mostradas para probar diferentes escenarios de login.
      </Paragraph>

      <Divider />

      {/* Credenciales de Prueba */}
      <Card title="🔐 Credenciales de Prueba" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card type="inner" title="👥 Usuarios (Candidatos)">
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(testCredentials).filter(([key]) => key.startsWith('user')).map(([key, creds]) => (
                  <div key={key} style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <Text strong>{creds.email}</Text><br />
                    <Text code>{creds.password}</Text>
                    <Button 
                      size="small" 
                      type="link" 
                      icon={<LoginOutlined />}
                      onClick={() => handleQuickLogin(creds.email, creds.password)}
                    >
                      Test Login
                    </Button>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card type="inner" title="🏢 Empresas">
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(testCredentials).filter(([key]) => key.startsWith('company')).map(([key, creds]) => (
                  <div key={key} style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <Text strong>{creds.email}</Text><br />
                    <Text code>{creds.password}</Text>
                    <Button 
                      size="small" 
                      type="link" 
                      icon={<LoginOutlined />}
                      onClick={() => handleQuickLogin(creds.email, creds.password)}
                    >
                      Test Login
                    </Button>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card type="inner" title="👑 Administrador">
              <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                <Text strong>{testCredentials.admin.email}</Text><br />
                <Text code>{testCredentials.admin.password}</Text>
                <Button 
                  size="small" 
                  type="link" 
                  icon={<LoginOutlined />}
                  onClick={() => handleQuickLogin(testCredentials.admin.email, testCredentials.admin.password)}
                >
                  Test Login
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {loginResult && (
          <Card 
            type="inner" 
            title="🔍 Resultado del Login" 
            style={{ marginTop: '16px', background: loginResult.success ? '#f6ffed' : '#fff2f0' }}
          >
            {loginResult.success ? (
              <Space direction="vertical">
                <Text strong>✅ Login exitoso</Text>
                <Text>Usuario: {loginResult.user.name}</Text>
                <Text>Email: {loginResult.user.email}</Text>
                <Text>Rol: {loginResult.user.role}</Text>
                <Text>Token: <Text code>{loginResult.token}</Text></Text>
              </Space>
            ) : (
              <Text type="danger">❌ {loginResult.error}</Text>
            )}
          </Card>
        )}
      </Card>

      {/* Trabajos Disponibles */}
      <Card title="💼 Trabajos de Prueba" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {mockJobs.map((job, index) => (
            <Col span={8} key={job.id}>
              <Card 
                type="inner" 
                title={job.titulo}
                extra={<Tag color={job.activo ? 'green' : 'red'}>{job.activo ? 'Activo' : 'Inactivo'}</Tag>}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text><strong>Empresa:</strong> {job.empresa?.nombre}</Text>
                  <Text><strong>Categoría:</strong> {job.categoria}</Text>
                  <Text><strong>Nivel:</strong> {job.dificultad}</Text>
                  <Text><strong>Cierre:</strong> {new Date(job.fechaCierre).toLocaleDateString()}</Text>
                  <Text><strong>Aplicaciones:</strong> {mockApplications.filter(app => app.convocatoria?.id === job.id).length}</Text>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <Text strong>Estados de aplicaciones:</Text>
                  {mockApplications.filter(app => app.convocatoria?.id === job.id).map(app => (
                    <div key={app.id} style={{ fontSize: '12px' }}>
                      <Tag color={getStatusColor(app.estado)}>
                        {app.usuario?.nombre} - {getStatusText(app.estado)}
                      </Tag>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Usuarios y sus Aplicaciones */}
      <Card title="👥 Usuarios y sus Aplicaciones" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {mockUsers.map(user => {
            const userApplications = getApplicationsByUser(user.id!);
            return (
              <Col span={12} key={user.id}>
                <Card 
                  type="inner" 
                  title={
                    <Space>
                      <Avatar src={user.avatar} icon={<UserOutlined />} />
                      {user.nombre} {user.apellidoPaterno}
                    </Space>
                  }
                  extra={
                    <Button 
                      size="small" 
                      icon={<EyeOutlined />}
                      onClick={() => setSelectedUser(user)}
                    >
                      Ver Detalle
                    </Button>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text><strong>Email:</strong> {user.email}</Text>
                    <Text><strong>Teléfono:</strong> {user.telefono}</Text>
                    <Text><strong>Aplicaciones:</strong> {userApplications.length}</Text>
                    
                    {userApplications.length > 0 && (
                      <>
                        <Divider style={{ margin: '8px 0' }} />
                        <Text strong>Sus aplicaciones:</Text>
                        {userApplications.map(app => (
                          <div key={app.id} style={{ fontSize: '12px' }}>
                            <Tag color={getStatusColor(app.estado)}>
                              {app.convocatoria?.titulo} - {getStatusText(app.estado)}
                            </Tag>
                          </div>
                        ))}
                      </>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Empresas y sus Trabajos */}
      <Card title="🏢 Empresas y sus Trabajos" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {mockCompanies.map(company => {
            const companyJobs = getJobsByCompany(company.id!);
            const allApplications = companyJobs.flatMap(job => 
              mockApplications.filter(app => app.convocatoria?.id === job.id)
            );
            
            return (
              <Col span={12} key={company.id}>
                <Card 
                  type="inner" 
                  title={
                    <Space>
                      <Avatar src={company.logo} icon={<UserOutlined />} />
                      {company.nombre}
                    </Space>
                  }
                  extra={
                    <Button 
                      size="small" 
                      icon={<EyeOutlined />}
                      onClick={() => setSelectedCompany(company)}
                    >
                      Ver Detalle
                    </Button>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text><strong>Email:</strong> {company.email}</Text>
                    <Text><strong>Trabajos activos:</strong> {companyJobs.filter(job => job.activo).length}</Text>
                    <Text><strong>Total aplicaciones:</strong> {allApplications.length}</Text>
                    
                    {companyJobs.length > 0 && (
                      <>
                        <Divider style={{ margin: '8px 0' }} />
                        <Text strong>Sus trabajos:</Text>
                        {companyJobs.map(job => (
                          <div key={job.id} style={{ fontSize: '12px' }}>
                            <Tag color={job.activo ? 'green' : 'red'}>
                              {job.titulo} ({mockApplications.filter(app => app.convocatoria?.id === job.id).length} aplicaciones)
                            </Tag>
                          </div>
                        ))}
                      </>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Estadísticas Generales */}
      <Card title="📊 Estadísticas del Sistema">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockUsers.length}</Text><br />
              <Text type="secondary">Usuarios</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockCompanies.length}</Text><br />
              <Text type="secondary">Empresas</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockJobs.length}</Text><br />
              <Text type="secondary">Trabajos</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockApplications.length}</Text><br />
              <Text type="secondary">Aplicaciones</Text>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockApplications.filter(app => app.estado === EstadoPostulacion.COMPLETADA).length}</Text><br />
              <Text type="secondary">Entrevistas Completadas</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockApplications.filter(app => app.estado === EstadoPostulacion.EN_EVALUACION).length}</Text><br />
              <Text type="secondary">En Evaluación</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockApplications.filter(app => app.estado === EstadoPostulacion.PENDIENTE).length}</Text><br />
              <Text type="secondary">Pendientes</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card type="inner">
              <Text strong>{mockJobs.filter(job => job.activo).length}</Text><br />
              <Text type="secondary">Trabajos Activos</Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DemoDataViewer;
