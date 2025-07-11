import { Usuario, Empresa, Convocatoria, Postulacion, Rol, EstadoPostulacion } from '../types/api';

// DATOS DE USUARIOS DE PRUEBA
export const mockUsers: Usuario[] = [
  {
    id: 1,
    nombre: "Juan Carlos",
    apellidoPaterno: "González",
    apellidoMaterno: "Rodríguez",
    email: "juan@test.com",
    password: "password123",
    nacimiento: "1995-03-15",
    telefono: 5551234567,
    rol: Rol.USUARIO,
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100"
  },
  {
    id: 2,
    nombre: "María Elena",
    apellidoPaterno: "López",
    apellidoMaterno: "Martínez",
    email: "maria@test.com",
    password: "password123",
    nacimiento: "1992-07-22",
    telefono: 5559876543,
    rol: Rol.USUARIO,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100"
  },
  {
    id: 3,
    nombre: "Carlos Alberto",
    apellidoPaterno: "Hernández",
    apellidoMaterno: "Vázquez",
    email: "carlos@test.com",
    password: "password123",
    nacimiento: "1988-11-08",
    telefono: 5555555555,
    rol: Rol.USUARIO,
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100"
  },
  {
    id: 4,
    nombre: "Ana Sofía",
    apellidoPaterno: "Ramírez",
    apellidoMaterno: "Torres",
    email: "ana@test.com",
    password: "password123",
    nacimiento: "1996-05-12",
    telefono: 5552468135,
    rol: Rol.USUARIO,
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100"
  },
  {
    id: 5,
    nombre: "David",
    apellidoPaterno: "Morales",
    apellidoMaterno: "Sánchez",
    email: "david@test.com",
    password: "password123",
    nacimiento: "1990-09-30",
    telefono: 5553691472,
    rol: Rol.USUARIO,
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100"
  }
];

// DATOS DE EMPRESAS DE PRUEBA
export const mockCompanies: Empresa[] = [
  {
    id: 1,
    nombre: "TechCorp Innovation",
    email: "hr@techcorp.com",
    password: "company123",
    telefono: "5551112233",
    direccion: "Av. Revolución 1234, Col. San Ángel, CDMX",
    descripcion: "Empresa líder en desarrollo de software y soluciones tecnológicas innovadoras. Especializada en inteligencia artificial, desarrollo web y aplicaciones móviles.",
    rol: Rol.EMPRESA,
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=100"
  },
  {
    id: 2,
    nombre: "Digital Solutions SA",
    email: "rh@digitalsolutions.com",
    password: "company123",
    telefono: "5554445566",
    direccion: "Paseo de la Reforma 456, Col. Juárez, CDMX",
    descripcion: "Consultora especializada en transformación digital, desarrollo de sistemas empresariales y automatización de procesos.",
    rol: Rol.EMPRESA,
    logo: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=100"
  },
  {
    id: 3,
    nombre: "StartupXYZ",
    email: "jobs@startupxyz.com",
    password: "company123",
    telefono: "5557778899",
    direccion: "Polanco Innovation Hub, Miguel Hidalgo, CDMX",
    descripcion: "Startup fintech enfocada en soluciones de pago digital y blockchain. Ambiente dinámico y oportunidades de crecimiento acelerado.",
    rol: Rol.EMPRESA,
    logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=100"
  },
  {
    id: 4,
    nombre: "GlobalTech Enterprises",
    email: "careers@globaltech.com",
    password: "company123",
    telefono: "5559990011",
    direccion: "Santa Fe Corporate District, Álvaro Obregón, CDMX",
    descripcion: "Multinacional con presencia en 25 países. Líder en cloud computing, ciberseguridad y soluciones empresariales.",
    rol: Rol.EMPRESA,
    logo: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=100"
  }
];

// DATOS DE CONVOCATORIAS/TRABAJOS DE PRUEBA
export const mockJobs: Convocatoria[] = [
  {
    id: 1,
    titulo: "Senior Frontend Developer",
    descripcion: `Únete a nuestro equipo como Senior Frontend Developer y lidera el desarrollo de interfaces de usuario innovadoras.

**Responsabilidades:**
• Desarrollar aplicaciones web modernas usando React, TypeScript y Next.js
• Colaborar con equipos de diseño UX/UI para implementar interfaces intuitivas
• Optimizar rendimiento y experiencia de usuario
• Mentorear a desarrolladores junior
• Participar en arquitectura de frontend y decisiones técnicas

**Requisitos:**
• 5+ años de experiencia en desarrollo frontend
• Expertise en React, TypeScript, JavaScript ES6+
• Conocimiento profundo de CSS3, HTML5, y metodologías como BEM
• Experiencia con herramientas de build (Webpack, Vite)
• Conocimiento en testing (Jest, Cypress, React Testing Library)
• Familiaridad con Git, CI/CD, y metodologías ágiles

**Ofrecemos:**
• Salario competitivo $80,000 - $120,000 MXN
• Esquema híbrido (3 días oficina, 2 remotos)
• Seguro de gastos médicos mayores
• Vales de despensa
• Capacitación continua y certificaciones
• Ambiente de trabajo colaborativo e innovador`,
    puesto: "Senior Frontend Developer",
    categoria: "Desarrollo de Software",
    dificultad: "Senior",
    fechaPublicacion: "2024-12-01",
    fechaCierre: "2025-01-15",
    activo: true,
    empresa: mockCompanies[0]
  },
  {
    id: 2,
    titulo: "Data Scientist - Machine Learning",
    descripcion: `Buscamos un Data Scientist apasionado por el machine learning para revolucionar nuestros productos con IA.

**Responsabilidades:**
• Desarrollar modelos de machine learning para análisis predictivo
• Implementar algoritmos de NLP y computer vision
• Analizar grandes volúmenes de datos para obtener insights de negocio
• Crear pipelines de datos automatizados
• Colaborar con equipos de producto e ingeniería
• Comunicar resultados a stakeholders no técnicos

**Requisitos:**
• Maestría en Data Science, Matemáticas, Estadística o campo relacionado
• 3+ años de experiencia en machine learning
• Dominio de Python, R, SQL
• Experiencia con frameworks: TensorFlow, PyTorch, scikit-learn
• Conocimiento en cloud platforms (AWS, GCP, Azure)
• Experiencia con herramientas de visualización (Tableau, Power BI)

**Tecnologías que usarás:**
• Python, R, SQL, Spark
• TensorFlow, PyTorch, Hugging Face
• Docker, Kubernetes
• AWS SageMaker, MLflow
• Jupyter, Apache Airflow

**Beneficios:**
• Salario $70,000 - $100,000 MXN
• Bonos por proyectos exitosos
• Home office 100%
• Equipos de última generación
• Budget para conferencias y cursos`,
    puesto: "Data Scientist",
    categoria: "Ciencia de Datos",
    dificultad: "Mid-Senior",
    fechaPublicacion: "2024-11-20",
    fechaCierre: "2024-12-30",
    activo: true,
    empresa: mockCompanies[1]
  },
  {
    id: 3,
    titulo: "DevOps Engineer - Cloud Infrastructure",
    descripcion: `Únete como DevOps Engineer y ayuda a escalar nuestra infraestructura cloud a millones de usuarios.

**Responsabilidades:**
• Diseñar y mantener infraestructura cloud escalable
• Implementar CI/CD pipelines robustos
• Automatizar deployments y monitoreo
• Gestionar contenedores y orquestación con Kubernetes
• Implementar prácticas de seguridad en DevSecOps
• Optimizar costos de infraestructura cloud

**Requisitos:**
• 4+ años de experiencia en DevOps/SRE
• Expertise en AWS/GCP/Azure
• Dominio de Terraform, Ansible, CloudFormation
• Experiencia con Docker, Kubernetes, Helm
• Conocimiento en monitoreo (Prometheus, Grafana, ELK)
• Scripting en Bash, Python, Go

**Stack Tecnológico:**
• Cloud: AWS (EC2, EKS, RDS, S3, Lambda)
• IaC: Terraform, CloudFormation
• CI/CD: Jenkins, GitLab CI, GitHub Actions
• Containers: Docker, Kubernetes, Helm
• Monitoring: Prometheus, Grafana, DataDog
• Security: Vault, SAST/DAST tools

**Lo que ofrecemos:**
• Salario $90,000 - $130,000 MXN
• Stock options en startup en crecimiento
• Flexibilidad total de horarios
• Presupuesto para certificaciones cloud
• Participación en arquitectura de sistema
• Equipo internacional y multicultural`,
    puesto: "DevOps Engineer",
    categoria: "Infrastructure & DevOps",
    dificultad: "Senior",
    fechaPublicacion: "2024-12-10",
    fechaCierre: "2025-02-01",
    activo: true,
    empresa: mockCompanies[2]
  }
];

// DATOS DE POSTULACIONES DE PRUEBA
export const mockApplications: Postulacion[] = [
  // Usuario 1 (Juan) - Ya aplicó al trabajo 1 y completó la entrevista
  {
    id: 1,
    fechaPostulacion: "2024-12-05",
    estado: EstadoPostulacion.COMPLETADA,
    usuario: mockUsers[0],
    convocatoria: mockJobs[0]
  },
  // Usuario 2 (María) - Aplicó al trabajo 2 y está en evaluación
  {
    id: 2,
    fechaPostulacion: "2024-12-03",
    estado: EstadoPostulacion.EN_EVALUACION,
    usuario: mockUsers[1],
    convocatoria: mockJobs[1]
  },
  // Usuario 3 (Carlos) - Aplicó al trabajo 1 pero está pendiente
  {
    id: 3,
    fechaPostulacion: "2024-12-08",
    estado: EstadoPostulacion.PENDIENTE,
    usuario: mockUsers[2],
    convocatoria: mockJobs[0]
  },
  // Usuario 4 (Ana) - Aplicó al trabajo 3 y está en evaluación
  {
    id: 4,
    fechaPostulacion: "2024-12-12",
    estado: EstadoPostulacion.EN_EVALUACION,
    usuario: mockUsers[3],
    convocatoria: mockJobs[2]
  },
  // Usuario 5 (David) - Aplicó al trabajo 2 pero fue rechazado
  {
    id: 5,
    fechaPostulacion: "2024-11-25",
    estado: EstadoPostulacion.RECHAZADA,
    usuario: mockUsers[4],
    convocatoria: mockJobs[1]
  }
];

// USUARIO ADMIN DE PRUEBA
export const mockAdmin: Usuario = {
  id: 100,
  nombre: "Admin",
  apellidoPaterno: "Sistema",
  apellidoMaterno: "mirAI",
  email: "admin@mirai.com",
  password: "admin123",
  nacimiento: "1990-01-01",
  telefono: 5550000000,
  rol: Rol.ADMIN,
  avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100"
};

// CREDENCIALES DE PRUEBA FÁCILES DE RECORDAR
export const testCredentials = {
  // Usuarios
  user1: { email: "juan@test.com", password: "password123" },
  user2: { email: "maria@test.com", password: "password123" },
  user3: { email: "carlos@test.com", password: "password123" },
  user4: { email: "ana@test.com", password: "password123" },
  user5: { email: "david@test.com", password: "password123" },
  
  // Empresas
  company1: { email: "hr@techcorp.com", password: "company123" },
  company2: { email: "rh@digitalsolutions.com", password: "company123" },
  company3: { email: "jobs@startupxyz.com", password: "company123" },
  company4: { email: "careers@globaltech.com", password: "company123" },
  
  // Admin
  admin: { email: "admin@mirai.com", password: "admin123" }
};

// FUNCIÓN PARA OBTENER ESTADÍSTICAS DE EJEMPLO
export const getMockStats = () => ({
  totalUsers: mockUsers.length,
  totalCompanies: mockCompanies.length,
  totalJobs: mockJobs.length,
  totalApplications: mockApplications.length,
  completedInterviews: mockApplications.filter(app => app.estado === EstadoPostulacion.COMPLETADA).length,
  pendingApplications: mockApplications.filter(app => app.estado === EstadoPostulacion.PENDIENTE).length,
  activeJobs: mockJobs.filter(job => job.activo).length
});

// FUNCIÓN PARA SIMULAR DATOS DE CHARTS/ANALÍTICAS
export const getMockChartData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      name: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      applications: Math.floor(Math.random() * 10) + 5,
      interviews: Math.floor(Math.random() * 8) + 2,
      completed: Math.floor(Math.random() * 5) + 1
    };
  });
  return last7Days;
};

export default {
  mockUsers,
  mockCompanies,
  mockJobs,
  mockApplications,
  mockAdmin,
  testCredentials,
  getMockStats,
  getMockChartData
};
