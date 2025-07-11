# 🎯 Guía de Pruebas - mirAI Platform

## ✅ Cambios Completados

### 1. **Datos Mock Completamente Funcionales**
- ✅ Dashboards siempre muestran datos de prueba
- ✅ Entrevistas generan preguntas automáticamente
- ✅ Sin dependencia de backend/tokens para desarrollo
- ✅ Fallbacks automáticos cuando la API falla

### 2. **UserDashboard Actualizado**
- ✅ Siempre carga trabajos disponibles desde mock
- ✅ Siempre muestra aplicaciones del usuario
- ✅ Funciona sin conexión al backend

### 3. **CompanyDashboard Actualizado**
- ✅ Siempre carga convocatorias de la empresa
- ✅ Siempre muestra candidatos aplicados
- ✅ Estadísticas funcionales sin API

### 4. **Interview Component Mejorado**
- ✅ Genera preguntas mock si la API falla
- ✅ Siempre hay preguntas disponibles
- ✅ Fallback automático para pruebas de diseño

---

## 🔐 Credenciales de Prueba

### **Usuarios (Candidatos)**
```
Juan Carlos (Aplicación completada)
Email: juan@test.com
Password: password123
Estado: Tiene 1 aplicación completada

María Elena (En evaluación)
Email: maria@test.com  
Password: password123
Estado: Tiene 1 aplicación en evaluación

Carlos Alberto (Pendiente)
Email: carlos@test.com
Password: password123
Estado: Tiene 1 aplicación pendiente

Ana Sofía (En evaluación)
Email: ana@test.com
Password: password123
Estado: Tiene 1 aplicación en evaluación

David (Rechazado)
Email: david@test.com
Password: password123
Estado: Tiene 1 aplicación rechazada
```

### **Empresas**
```
TechCorp Innovation (Empresa establecida)
Email: hr@techcorp.com
Password: company123
Estado: 1 trabajo, 2 aplicaciones

Digital Solutions SA (Empresa mediana)
Email: rh@digitalsolutions.com
Password: company123
Estado: 1 trabajo, 2 aplicaciones

StartupXYZ (Startup nueva)
Email: jobs@startupxyz.com
Password: company123
Estado: 1 trabajo, 1 aplicación

GlobalTech (Empresa grande sin aplicaciones)
Email: careers@globaltech.com
Password: company123
Estado: 0 trabajos, 0 aplicaciones
```

### **Administrador**
```
Admin Sistema
Email: admin@mirai.com
Password: admin123
Estado: Vista completa del sistema
```

---

## 🧪 Escenarios de Prueba

### **Para Candidatos**

#### 1. **Dashboard con Aplicaciones**
- Login: `juan@test.com` / `password123`
- **Resultado Esperado**: Dashboard muestra aplicación completada + trabajos disponibles

#### 2. **Dashboard con Entrevista Pendiente**
- Login: `maria@test.com` / `password123`
- **Resultado Esperado**: Botón "Continue Interview" activo

#### 3. **Aplicar a Nuevo Trabajo**
- Login con cualquier usuario
- **Resultado Esperado**: Ver trabajos disponibles y poder aplicar

#### 4. **Iniciar Entrevista**
- Aplicar a trabajo y hacer clic en "Start Interview"
- **Resultado Esperado**: Preguntas se cargan automáticamente (mock fallback)

### **Para Empresas**

#### 1. **Empresa con Candidatos**
- Login: `hr@techcorp.com` / `company123`
- **Resultado Esperado**: Dashboard con estadísticas y candidatos

#### 2. **Empresa Nueva (Sin Datos)**
- Login: `careers@globaltech.com` / `company123`
- **Resultado Esperado**: Dashboard de bienvenida, botón para crear trabajo

#### 3. **Crear Nueva Convocatoria**
- Login como cualquier empresa
- **Resultado Esperado**: Formulario funcional para crear trabajo

#### 4. **Ver Candidatos**
- Login: `hr@techcorp.com` / `company123`
- Ir a detalle de trabajo
- **Resultado Esperado**: Lista de candidatos aplicados

### **Para Administrador**

#### 1. **Vista Completa del Sistema**
- Login: `admin@mirai.com` / `admin123`
- **Resultado Esperado**: Estadísticas globales del sistema

---

## 🔧 URLs de Desarrollo

```
Servidor Local: http://localhost:5173/
Demo Data Viewer: http://localhost:5173/demo-data
Login: http://localhost:5173/login
```

---

## 📊 Trabajos Disponibles

### **1. Senior Frontend Developer** (TechCorp)
- Estado: Activo ✅
- Aplicaciones: 2 candidatos
- Descripción: Desarrollo con React/TypeScript

### **2. Data Scientist - Machine Learning** (Digital Solutions)
- Estado: Activo ✅  
- Aplicaciones: 2 candidatos
- Descripción: ML y análisis de datos

### **3. DevOps Engineer - Cloud Infrastructure** (StartupXYZ)
- Estado: Activo ✅
- Aplicaciones: 1 candidato
- Descripción: AWS/DevOps/Kubernetes

---

## 🎨 Estados de Aplicaciones

- **COMPLETADA**: ✅ Entrevista finalizada
- **EN_EVALUACION**: 🔄 En proceso de entrevista  
- **PENDIENTE**: ⏳ Esperando revisión
- **RECHAZADA**: ❌ Candidato rechazado

---

## ⚡ Features Destacadas

### **1. Datos Siempre Disponibles**
- ✅ Dashboards nunca aparecen vacíos
- ✅ Siempre hay trabajos para aplicar
- ✅ Siempre hay candidatos para revisar
- ✅ Entrevistas siempre tienen preguntas

### **2. Fallbacks Automáticos**
- ✅ Si falla la API → usa datos mock
- ✅ Si no hay preguntas → genera mock questions
- ✅ Login funciona sin backend

### **3. Experiencia de Diseño Completa**
- ✅ Todos los estados de UI son probables
- ✅ Componentes siempre tienen datos
- ✅ Flujos completos funcionales

---

## 🚀 Próximos Pasos Sugeridos

1. **Probar todos los flujos** con las credenciales proporcionadas
2. **Verificar responsive design** en diferentes tamaños de pantalla
3. **Testear componentes** en modo claro/oscuro
4. **Revisar animaciones** y transiciones
5. **Validar formularios** y mensajes de error

---

## 📝 Notas de Desarrollo

- Los datos mock están en `/src/data/`
- Las utilidades están en `/src/data/mockDataUtils.ts`
- Demo viewer disponible en `/demo-data`
- Todos los componentes principales tienen fallbacks mock
- El sistema funciona completamente offline para desarrollo
