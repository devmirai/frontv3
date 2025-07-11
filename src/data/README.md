# 📊 Datos de Prueba - mirAI Platform

Este directorio contiene todos los datos de prueba necesarios para desarrollar y probar la plataforma mirAI.

## 🎯 Propósito

Los datos de prueba están diseñados para:
- Facilitar el desarrollo y testing de la UI
- Simular escenarios reales de uso
- Permitir pruebas de funcionalidad completas
- Demostrar diferentes estados de la aplicación

## 📁 Archivos

### `mockData.ts`
Contiene los datos principales de prueba:
- **Usuarios**: 5 usuarios de prueba con diferentes perfiles
- **Empresas**: 4 empresas con diversos sectores y tamaños
- **Trabajos**: 3 convocatorias en diferentes estados
- **Postulaciones**: Aplicaciones que conectan usuarios con trabajos
- **Admin**: Usuario administrador del sistema

### `mockDataUtils.ts`
Funciones utilitarias para manejo de datos:
- Generadores de datos adicionales
- Funciones de búsqueda y filtrado
- Simulación de procesos (login, dashboards)
- Generación de preguntas de entrevista

## 🔐 Credenciales de Prueba

### 👥 Usuarios (Candidatos)
```
Email: juan@test.com | Password: password123
Email: maria@test.com | Password: password123
Email: carlos@test.com | Password: password123
Email: ana@test.com | Password: password123
Email: david@test.com | Password: password123
```

### 🏢 Empresas
```
Email: hr@techcorp.com | Password: company123
Email: rh@digitalsolutions.com | Password: company123
Email: jobs@startupxyz.com | Password: company123
Email: careers@globaltech.com | Password: company123
```

### 👑 Administrador
```
Email: admin@mirai.com | Password: admin123
```

## 💼 Trabajos de Prueba

### 1. **Senior Frontend Developer** (TechCorp Innovation)
- **Estado**: Activo ✅
- **Aplicaciones**: 2 candidatos aplicados
- **Escenario**: Trabajo popular con múltiples candidatos

### 2. **Data Scientist - Machine Learning** (Digital Solutions SA)
- **Estado**: Activo ✅
- **Aplicaciones**: 2 candidatos aplicados
- **Escenario**: Posición especializada

### 3. **DevOps Engineer - Cloud Infrastructure** (StartupXYZ)
- **Estado**: Activo ✅
- **Aplicaciones**: 1 candidato aplicado
- **Escenario**: Trabajo nuevo con pocas aplicaciones

## 📊 Estados de Postulaciones

Los datos incluyen diferentes estados para probar todos los flujos:

- **COMPLETADA**: Entrevista finalizada (Juan → Frontend Developer)
- **EN_EVALUACION**: En proceso de entrevista (María → Data Scientist, Ana → DevOps)
- **PENDIENTE**: Esperando revisión (Carlos → Frontend Developer)
- **RECHAZADA**: Candidato rechazado (David → Data Scientist)

## 🎨 Casos de Uso para UI

### Para Usuarios (Candidatos):
1. **Dashboard vacío**: Usuario sin aplicaciones (usar usuario adicional)
2. **Dashboard con aplicaciones**: Juan, María, Carlos, Ana, David
3. **Diferentes estados**: Cada usuario muestra un estado diferente
4. **Trabajos disponibles**: 3 trabajos activos para aplicar

### Para Empresas:
1. **TechCorp**: Empresa establecida con múltiples aplicaciones
2. **Digital Solutions**: Empresa mediana con candidatos diversos
3. **StartupXYZ**: Startup nueva con pocas aplicaciones
4. **GlobalTech**: Empresa grande sin aplicaciones (ejemplo de inicio)

### Para Administradores:
- Vista completa del sistema
- Estadísticas consolidadas
- Gestión de usuarios y empresas
- Reportes y analíticas

## 🔧 Funciones Utilitarias

```typescript
// Obtener usuario por email
const user = getUserByEmail('juan@test.com');

// Simular login
const loginResult = simulateLogin('juan@test.com', 'password123');

// Obtener datos de dashboard
const dashboardData = getInitialDashboardData(userId, userRole);

// Generar preguntas de entrevista
const questions = generateMockInterviewQuestions('Frontend Developer', 'Senior');
```

## 🎭 Escenarios de Testing

### Flujo Completo de Candidato:
1. Login como Juan (juan@test.com)
2. Ver aplicación completada
3. Ver trabajos disponibles
4. Aplicar a nuevo trabajo

### Flujo Completo de Empresa:
1. Login como TechCorp (hr@techcorp.com)
2. Ver aplicaciones pendientes
3. Revisar candidatos
4. Crear nueva convocatoria

### Flujo de Administrador:
1. Login como admin (admin@mirai.com)
2. Ver estadísticas del sistema
3. Gestionar usuarios y empresas
4. Generar reportes

## 🚀 Integración

Para usar estos datos en componentes:

```typescript
import { mockUsers, mockJobs, testCredentials } from '../data/mockData';
import { simulateLogin, getApplicationsByUser } from '../data/mockDataUtils';

// En desarrollo, usar datos mock
const userData = simulateLogin(email, password);
if (userData.success) {
  // Usar userData.user y userData.token
}
```

## 📈 Datos Dinámicos

Los utils incluyen generadores para crear datos adicionales:
- `generateAdditionalUsers(count)`: Más usuarios de prueba
- `generateAdditionalCompanies(count)`: Más empresas
- `generateAdditionalJobs(count)`: Más trabajos
- `getMockChartData()`: Datos para gráficos y analíticas

## 🎯 Beneficios para el Desarrollo

1. **Desarrollo Rápido**: No depender del backend para UI
2. **Testing Completo**: Cubrir todos los casos de uso
3. **Demos Efectivos**: Datos realistas para presentaciones
4. **Debugging**: Estados conocidos para reproducir bugs
5. **Diseño Iterativo**: Probar diferentes layouts y flujos

---

**Nota**: Estos datos son solo para desarrollo y testing. En producción, siempre usar datos reales del backend.
