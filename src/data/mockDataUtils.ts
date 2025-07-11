import { mockUsers, mockCompanies, mockJobs, mockApplications, testCredentials } from './mockData';
import { Rol, EstadoPostulacion } from '../types/api';

/**
 * Archivo de utilidades para manejo de datos de prueba
 * Este archivo contiene funciones helper y datos adicionales para testing
 */

// DATOS ADICIONALES DE SKILLS Y TECNOLOGÍAS
export const mockSkills = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C#',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Spring Boot', 'Django',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Git', 'Jenkins', 'Terraform', 'GraphQL',
  'Machine Learning', 'Data Science', 'DevOps', 'Microservices'
];

// CATEGORÍAS DE TRABAJOS
export const jobCategories = [
  'Desarrollo de Software',
  'Ciencia de Datos',
  'Infrastructure & DevOps',
  'Mobile Development',
  'QA & Testing',
  'Product Management',
  'UI/UX Design',
  'Cybersecurity',
  'Data Engineering',
  'Machine Learning'
];

// NIVELES DE EXPERIENCIA
export const experienceLevels = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
  'Principal',
  'Staff'
];

// FUNCIÓN PARA GENERAR USUARIOS ADICIONALES
export const generateAdditionalUsers = (count: number = 10) => {
  const names = [
    { nombre: 'Luis', apellidoPaterno: 'García', apellidoMaterno: 'López' },
    { nombre: 'Carmen', apellidoPaterno: 'Díaz', apellidoMaterno: 'Ruiz' },
    { nombre: 'Roberto', apellidoPaterno: 'Moreno', apellidoMaterno: 'Castro' },
    { nombre: 'Patricia', apellidoPaterno: 'Jiménez', apellidoMaterno: 'Herrera' },
    { nombre: 'Fernando', apellidoPaterno: 'Torres', apellidoMaterno: 'Ramos' },
    { nombre: 'Alejandra', apellidoPaterno: 'Flores', apellidoMaterno: 'Medina' },
    { nombre: 'Miguel', apellidoPaterno: 'Romero', apellidoMaterno: 'Guerrero' },
    { nombre: 'Beatriz', apellidoPaterno: 'Vega', apellidoMaterno: 'Mendoza' },
    { nombre: 'Javier', apellidoPaterno: 'Muñoz', apellidoMaterno: 'Ortega' },
    { nombre: 'Daniela', apellidoPaterno: 'Silva', apellidoMaterno: 'Vargas' }
  ];

  return Array.from({ length: count }, (_, i) => {
    const nameData = names[i % names.length];
    const id = 1000 + i;
    
    return {
      id,
      ...nameData,
      email: `user${id}@test.com`,
      password: 'password123',
      nacimiento: `199${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      telefono: 5550000000 + Math.floor(Math.random() * 9999999),
      rol: Rol.USUARIO,
      avatar: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/photo.jpeg?w=100`
    };
  });
};

// FUNCIÓN PARA GENERAR EMPRESAS ADICIONALES
export const generateAdditionalCompanies = (count: number = 5) => {
  const companyNames = [
    'InnovaTech Solutions',
    'FutureCode Labs',
    'CloudFirst Technologies',
    'DataDriven Corp',
    'AgileMinds Consulting',
    'NextGen Software',
    'TechHub Innovations',
    'SmartSolutions Inc',
    'CodeCraft Studio',
    'DigitalEdge Partners'
  ];

  const descriptions = [
    'Empresa especializada en desarrollo de software a medida y consultoría tecnológica.',
    'Laboratorio de innovación enfocado en tecnologías emergentes y startups.',
    'Proveedor líder de soluciones cloud y servicios de migración.',
    'Consultoría especializada en analytics, big data y business intelligence.',
    'Firma de consultoría ágil para transformación digital empresarial.',
    'Desarrollo de software de próxima generación con tecnologías de vanguardia.',
    'Hub de innovación tecnológica con enfoque en AI y machine learning.',
    'Soluciones inteligentes para automatización y optimización de procesos.',
    'Estudio creativo especializado en desarrollo web y mobile premium.',
    'Alianza estratégica para proyectos de transformación digital.'
  ];

  return Array.from({ length: count }, (_, i) => {
    const id = 100 + i;
    const name = companyNames[i % companyNames.length];
    
    return {
      id,
      nombre: name,
      email: `contact${id}@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
      password: 'company123',
      telefono: `555${String(Math.floor(Math.random() * 9999999)).padStart(7, '0')}`,
      direccion: `Calle ${Math.floor(Math.random() * 999) + 1}, Col. ${['Roma Norte', 'Condesa', 'Polanco', 'Santa Fe', 'Del Valle'][Math.floor(Math.random() * 5)]}, CDMX`,
      descripcion: descriptions[i % descriptions.length],
      rol: Rol.EMPRESA,
      logo: `https://images.pexels.com/photos/${3000000 + Math.floor(Math.random() * 200000)}/photo.jpeg?w=100`
    };
  });
};

// FUNCIÓN PARA GENERAR TRABAJOS ADICIONALES
export const generateAdditionalJobs = (count: number = 7) => {
  const jobTitles = [
    'Full Stack Developer',
    'Mobile App Developer (React Native)',
    'QA Automation Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Backend Developer (Node.js)',
    'Software Architect',
    'Security Engineer',
    'Data Engineer',
    'Technical Lead'
  ];

  const jobDescriptions = [
    {
      title: 'Full Stack Developer',
      description: `Desarrollo completo de aplicaciones web modernas desde frontend hasta backend.

**Responsabilidades:**
• Desarrollar aplicaciones full stack con React y Node.js
• Diseñar APIs REST y GraphQL
• Implementar bases de datos relacionales y NoSQL
• Colaborar en arquitectura de aplicaciones escalables

**Requisitos:**
• 3+ años de experiencia en desarrollo full stack
• Dominio de JavaScript/TypeScript, React, Node.js
• Experiencia con bases de datos (MySQL, MongoDB)
• Conocimiento en Git, testing, y deployment`,
      category: 'Desarrollo de Software',
      level: 'Mid-Level'
    },
    {
      title: 'Mobile App Developer (React Native)',
      description: `Desarrollo de aplicaciones móviles nativas multiplataforma.

**Responsabilidades:**
• Crear apps móviles con React Native
• Integrar APIs y servicios backend
• Optimizar rendimiento para iOS y Android
• Publicar apps en App Store y Google Play

**Requisitos:**
• 2+ años en desarrollo móvil
• Experiencia sólida en React Native
• Conocimiento de iOS/Android native development
• Familiaridad con herramientas de CI/CD móvil`,
      category: 'Mobile Development',
      level: 'Mid-Level'
    },
    {
      title: 'QA Automation Engineer',
      description: `Automatización de testing y aseguramiento de calidad de software.

**Responsabilidades:**
• Diseñar y mantener frameworks de testing automatizado
• Crear test cases y scripts de automation
• Ejecutar testing de regresión y performance
• Colaborar con development para mejorar calidad

**Requisitos:**
• 3+ años en QA y test automation
• Experiencia con Selenium, Cypress, Jest
• Conocimiento en CI/CD pipelines
• Familiaridad con testing de APIs`,
      category: 'QA & Testing',
      level: 'Mid-Level'
    }
  ];

  return Array.from({ length: count }, (_, i) => {
    const id = 100 + i;
    const jobData = jobDescriptions[i % jobDescriptions.length];
    const companyIndex = i % mockCompanies.length;
    
    // Fechas realistas
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 30));
    
    const closeDate = new Date(publishDate);
    closeDate.setDate(closeDate.getDate() + Math.floor(Math.random() * 60) + 15);
    
    return {
      id,
      titulo: jobTitles[i % jobTitles.length],
      descripcion: jobData.description || `Descripción detallada para ${jobTitles[i % jobTitles.length]}`,
      puesto: jobTitles[i % jobTitles.length],
      categoria: jobData.category || jobCategories[Math.floor(Math.random() * jobCategories.length)],
      dificultad: jobData.level || experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
      fechaPublicacion: publishDate.toISOString().split('T')[0],
      fechaCierre: closeDate.toISOString().split('T')[0],
      activo: Math.random() > 0.2, // 80% activos
      empresa: mockCompanies[companyIndex]
    };
  });
};

// FUNCIÓN PARA OBTENER USUARIO POR EMAIL (ÚTIL PARA LOGIN)
export const getUserByEmail = (email: string) => {
  return mockUsers.find(user => user.email === email) || null;
};

// FUNCIÓN PARA OBTENER EMPRESA POR EMAIL
export const getCompanyByEmail = (email: string) => {
  return mockCompanies.find(company => company.email === email) || null;
};

// FUNCIÓN PARA OBTENER TRABAJOS POR EMPRESA
export const getJobsByCompany = (companyId: number) => {
  return mockJobs.filter(job => job.empresa?.id === companyId);
};

// FUNCIÓN PARA OBTENER APLICACIONES POR USUARIO
export const getApplicationsByUser = (userId: number) => {
  return mockApplications.filter(app => app.usuario?.id === userId);
};

// FUNCIÓN PARA OBTENER APLICACIONES POR TRABAJO
export const getApplicationsByJob = (jobId: number) => {
  return mockApplications.filter(app => app.convocatoria?.id === jobId);
};

// FUNCIÓN PARA SIMULAR PROCESO DE LOGIN
export const simulateLogin = (email: string, password: string) => {
  // Buscar en usuarios
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      success: true,
      user: {
        id: user.id!,
        email: user.email,
        name: `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`,
        role: user.rol,
        avatar: user.avatar,
        telefono: user.telefono,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        nacimiento: user.nacimiento
      },
      token: `mock_token_user_${user.id}_${Date.now()}`
    };
  }

  // Buscar en empresas
  const company = mockCompanies.find(c => c.email === email && c.password === password);
  if (company) {
    return {
      success: true,
      user: {
        id: company.id!,
        email: company.email,
        name: company.nombre,
        role: company.rol,
        avatar: company.logo,
        telefono: company.telefono,
        direccion: company.direccion,
        descripcion: company.descripcion
      },
      token: `mock_token_company_${company.id}_${Date.now()}`
    };
  }

  return {
    success: false,
    error: 'Credenciales inválidas'
  };
};

// ESTADO INICIAL PARA DASHBOARDS
export const getInitialDashboardData = (userId: number, userRole: Rol) => {
  if (userRole === Rol.USUARIO) {
    return {
      availableJobs: mockJobs.filter(job => job.activo),
      myApplications: getApplicationsByUser(userId),
      stats: {
        totalApplications: getApplicationsByUser(userId).length,
        completedInterviews: getApplicationsByUser(userId).filter(app => app.estado === EstadoPostulacion.COMPLETADA).length,
        pendingApplications: getApplicationsByUser(userId).filter(app => app.estado === EstadoPostulacion.PENDIENTE).length,
        availableJobs: mockJobs.filter(job => job.activo).length
      }
    };
  } else if (userRole === Rol.EMPRESA) {
    const companyJobs = getJobsByCompany(userId);
    const allApplications = companyJobs.flatMap(job => getApplicationsByJob(job.id!));
    
    return {
      jobs: companyJobs,
      applications: allApplications,
      stats: {
        activeJobs: companyJobs.filter(job => job.activo).length,
        totalApplications: allApplications.length,
        pendingReviews: allApplications.filter(app => app.estado === EstadoPostulacion.PENDIENTE).length,
        completedInterviews: allApplications.filter(app => app.estado === EstadoPostulacion.COMPLETADA).length
      }
    };
  }

  return null;
};

// FUNCIÓN PARA GENERAR PREGUNTAS DE ENTREVISTA MOCK
export const generateMockInterviewQuestions = (jobTitle: string, difficulty: string) => {
  const questions = [
    {
      id: 1,
      question: `Cuéntame sobre tu experiencia más relevante para el puesto de ${jobTitle}`,
      type: 'behavioral',
      timeLimit: 300 // 5 minutos
    },
    {
      id: 2,
      question: '¿Cómo manejas los conflictos en un equipo de desarrollo?',
      type: 'behavioral',
      timeLimit: 240
    },
    {
      id: 3,
      question: `Explica un proyecto técnico desafiante que hayas completado recientemente`,
      type: 'technical',
      timeLimit: 360
    },
    {
      id: 4,
      question: '¿Cómo te mantienes actualizado con las nuevas tecnologías?',
      type: 'behavioral',
      timeLimit: 180
    },
    {
      id: 5,
      question: `¿Cuáles son tus fortalezas principales para ${jobTitle}?`,
      type: 'behavioral',
      timeLimit: 240
    }
  ];

  // Filtrar preguntas según dificultad
  if (difficulty === 'Junior') {
    return questions.slice(0, 3);
  } else if (difficulty === 'Senior') {
    return questions;
  }
  
  return questions.slice(0, 4);
};

export default {
  mockSkills,
  jobCategories,
  experienceLevels,
  generateAdditionalUsers,
  generateAdditionalCompanies,
  generateAdditionalJobs,
  getUserByEmail,
  getCompanyByEmail,
  getJobsByCompany,
  getApplicationsByUser,
  getApplicationsByJob,
  simulateLogin,
  getInitialDashboardData,
  generateMockInterviewQuestions
};
