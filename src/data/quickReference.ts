/**
 * 🎯 GUÍA RÁPIDA - DATOS DE PRUEBA MIRAI
 * 
 * Esta guía te ayuda a usar los datos de prueba para desarrollar y testear la UI
 * de la plataforma mirAI de manera eficiente.
 */

// =====================================================
// 🔐 CREDENCIALES DE ACCESO RÁPIDO
// =====================================================

export const QUICK_LOGIN = {
  // Usuarios (Candidatos)
  JUAN: { email: 'juan@test.com', password: 'password123' },         // ✅ Entrevista completada
  MARIA: { email: 'maria@test.com', password: 'password123' },       // 🔄 En evaluación  
  CARLOS: { email: 'carlos@test.com', password: 'password123' },     // ⏳ Pendiente
  ANA: { email: 'ana@test.com', password: 'password123' },           // 🔄 En evaluación
  DAVID: { email: 'david@test.com', password: 'password123' },       // ❌ Rechazado

  // Empresas
  TECHCORP: { email: 'hr@techcorp.com', password: 'company123' },              // 2 aplicaciones
  DIGITAL_SOLUTIONS: { email: 'rh@digitalsolutions.com', password: 'company123' }, // 2 aplicaciones
  STARTUPXYZ: { email: 'jobs@startupxyz.com', password: 'company123' },        // 1 aplicación
  GLOBALTECH: { email: 'careers@globaltech.com', password: 'company123' },     // 0 aplicaciones

  // Administrador
  ADMIN: { email: 'admin@mirai.com', password: 'admin123' }
};

// =====================================================
// 💼 TRABAJOS Y SUS ESTADOS
// =====================================================

export const JOB_SCENARIOS = {
  FRONTEND_DEVELOPER: {
    id: 1,
    titulo: 'Senior Frontend Developer',
    empresa: 'TechCorp Innovation',
    estado: 'Activo ✅',
    aplicaciones: 2,
    descripcion: 'Trabajo popular con múltiples candidatos',
    candidatos: [
      { nombre: 'Juan Carlos', estado: 'COMPLETADA' },
      { nombre: 'Carlos Alberto', estado: 'PENDIENTE' }
    ]
  },
  
  DATA_SCIENTIST: {
    id: 2,
    titulo: 'Data Scientist - Machine Learning',
    empresa: 'Digital Solutions SA',
    estado: 'Activo ✅',
    aplicaciones: 2,
    descripcion: 'Posición especializada en ML',
    candidatos: [
      { nombre: 'María Elena', estado: 'EN_EVALUACION' },
      { nombre: 'David', estado: 'RECHAZADA' }
    ]
  },
  
  DEVOPS_ENGINEER: {
    id: 3,
    titulo: 'DevOps Engineer - Cloud Infrastructure',
    empresa: 'StartupXYZ',
    estado: 'Activo ✅',
    aplicaciones: 1,
    descripcion: 'Trabajo nuevo con pocas aplicaciones',
    candidatos: [
      { nombre: 'Ana Sofía', estado: 'EN_EVALUACION' }
    ]
  }
};

// =====================================================
// 🎭 ESCENARIOS DE TESTING
// =====================================================

export const TEST_SCENARIOS = {
  // Para Candidatos
  EMPTY_DASHBOARD: {
    description: 'Usuario sin aplicaciones',
    login: 'Crear usuario adicional o usar usuario sin aplicaciones',
    expected: 'Dashboard vacío, trabajos disponibles para aplicar'
  },
  
  MULTIPLE_APPLICATIONS: {
    description: 'Usuario con varias aplicaciones en diferentes estados',
    login: QUICK_LOGIN.JUAN,
    expected: 'Dashboard con historial completo de aplicaciones'
  },
  
  INTERVIEW_READY: {
    description: 'Usuario con entrevista pendiente',
    login: QUICK_LOGIN.MARIA,
    expected: 'Botón para iniciar entrevista disponible'
  },

  // Para Empresas
  ESTABLISHED_COMPANY: {
    description: 'Empresa con múltiples trabajos y candidatos',
    login: QUICK_LOGIN.TECHCORP,
    expected: 'Dashboard con estadísticas completas'
  },
  
  NEW_COMPANY: {
    description: 'Empresa sin trabajos ni candidatos',
    login: QUICK_LOGIN.GLOBALTECH,
    expected: 'Dashboard de bienvenida, botón para crear primer trabajo'
  },
  
  ACTIVE_HIRING: {
    description: 'Empresa con proceso activo de contratación',
    login: QUICK_LOGIN.DIGITAL_SOLUTIONS,
    expected: 'Candidatos para revisar, entrevistas en proceso'
  },

  // Para Administradores
  SYSTEM_OVERVIEW: {
    description: 'Vista completa del sistema',
    login: QUICK_LOGIN.ADMIN,
    expected: 'Estadísticas globales, gestión de usuarios y empresas'
  }
};

// =====================================================
// 🚀 CASOS DE USO COMUNES
// =====================================================

export const COMMON_USE_CASES = {
  // Flujo completo de candidato
  CANDIDATE_JOURNEY: [
    '1. Login como Juan (juan@test.com)',
    '2. Ver dashboard con aplicación completada',
    '3. Explorar trabajos disponibles',
    '4. Aplicar a nuevo trabajo',
    '5. Ver estatus actualizado'
  ],

  // Flujo completo de empresa
  COMPANY_JOURNEY: [
    '1. Login como TechCorp (hr@techcorp.com)',
    '2. Ver candidatos pendientes',
    '3. Revisar aplicaciones',
    '4. Evaluar candidatos',
    '5. Crear nueva convocatoria'
  ],

  // Flujo de administrador
  ADMIN_JOURNEY: [
    '1. Login como admin (admin@mirai.com)',
    '2. Ver estadísticas del sistema',
    '3. Gestionar usuarios y empresas',
    '4. Generar reportes',
    '5. Monitorear actividad'
  ]
};

// =====================================================
// 📊 DATOS PARA GRÁFICOS Y ANALYTICS
// =====================================================

export const MOCK_ANALYTICS = {
  // Datos para gráficos de líneas (últimos 7 días)
  DAILY_ACTIVITY: [
    { day: 'Lun', applications: 8, interviews: 3, completed: 1 },
    { day: 'Mar', applications: 12, interviews: 5, completed: 2 },
    { day: 'Mié', applications: 6, interviews: 4, completed: 3 },
    { day: 'Jue', applications: 15, interviews: 7, completed: 2 },
    { day: 'Vie', applications: 10, interviews: 6, completed: 4 },
    { day: 'Sáb', applications: 4, interviews: 2, completed: 1 },
    { day: 'Dom', applications: 2, interviews: 1, completed: 0 }
  ],

  // Estadísticas generales
  SYSTEM_STATS: {
    totalUsers: 5,
    totalCompanies: 4,
    totalJobs: 3,
    totalApplications: 5,
    completedInterviews: 1,
    pendingApplications: 1,
    activeJobs: 3,
    completionRate: 20 // 1 de 5 aplicaciones completadas
  },

  // Distribución por estado
  APPLICATION_STATUS: {
    COMPLETADA: 1,
    EN_EVALUACION: 2,
    PENDIENTE: 1,
    RECHAZADA: 1
  }
};

// =====================================================
// 🛠️ UTILIDADES PARA DESARROLLO
// =====================================================

export const DEV_HELPERS = {
  // URLs útiles para desarrollo
  DEMO_DATA_VIEWER: '/demo-data',
  LOGIN_PAGE: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  
  // Funciones helper para console
  logAllUsers: () => console.table(QUICK_LOGIN),
  logScenarios: () => console.table(JOB_SCENARIOS),
  
  // Quick login function para desarrollo
  quickLogin: (userType: keyof typeof QUICK_LOGIN) => {
    const credentials = QUICK_LOGIN[userType];
    console.log(`🔑 Quick login for ${userType}:`, credentials);
    return credentials;
  }
};

// =====================================================
// 📱 RESPONSIVE TESTING
// =====================================================

export const RESPONSIVE_SCENARIOS = {
  MOBILE: {
    viewport: '375x812',
    scenarios: ['Login', 'Dashboard móvil', 'Lista de trabajos']
  },
  TABLET: {
    viewport: '768x1024', 
    scenarios: ['Dashboard tablet', 'Navegación lateral']
  },
  DESKTOP: {
    viewport: '1920x1080',
    scenarios: ['Dashboard completo', 'Tablas de datos', 'Gráficos']
  }
};

// =====================================================
// 🎨 ESTADOS VISUALES PARA UI
// =====================================================

export const UI_STATES = {
  LOADING: 'Simulación de carga de datos',
  EMPTY: 'Estados vacíos (sin aplicaciones, trabajos, etc.)',
  ERROR: 'Estados de error (login fallido, conexión perdida)',
  SUCCESS: 'Estados exitosos (aplicación enviada, entrevista completada)',
  PENDING: 'Estados de espera (revisión pendiente, entrevista programada)'
};

// Exportar todo para fácil acceso
export default {
  QUICK_LOGIN,
  JOB_SCENARIOS,
  TEST_SCENARIOS,
  COMMON_USE_CASES,
  MOCK_ANALYTICS,
  DEV_HELPERS,
  RESPONSIVE_SCENARIOS,
  UI_STATES
};
