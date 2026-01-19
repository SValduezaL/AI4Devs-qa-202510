# Project Brief - LTI Talent Tracking System

## ¿Qué es el producto?

LTI (Leading Talent Intelligence) es un **sistema full-stack de seguimiento y gestión de candidatos** (ATS - Applicant Tracking System) diseñado para optimizar procesos de reclutamiento. Permite gestionar candidatos, posiciones laborales, flujos de entrevistas y colaboración entre reclutadores.

## Objetivo de negocio

**Resolver**: La complejidad y desorganización en la gestión de procesos de selección de personal, facilitando el seguimiento de candidatos desde la aplicación inicial hasta la contratación.

**Beneficios**:
- Centralización de información de candidatos (CV, experiencia, educación)
- Trazabilidad completa del proceso de entrevistas
- Colaboración entre múltiples entrevistadores y reclutadores
- Visibilidad del estado de cada candidato en el pipeline

## Alcance dentro del repo

**Incluye**:
- **Backend API REST** (Node.js + Express + TypeScript) con arquitectura DDD
- **Frontend SPA** (React + TypeScript) para reclutadores
- **Base de datos PostgreSQL** con Prisma ORM
- Gestión de candidatos con educación, experiencia laboral y CVs
- Gestión de posiciones con flujos de entrevista configurables
- Sistema de aplicaciones y seguimiento de etapas de entrevista
- Upload de archivos (CVs en PDF/DOCX)
- Dashboard de reclutador con visualización Kanban

**Excluye**:
- Autenticación y autorización de usuarios (no implementada)
- Portal público para candidatos
- Notificaciones por email/SMS
- Integración con servicios externos (LinkedIn, job boards)
- Reportes y analytics avanzados
- Sistema de permisos granulares

## Stakeholders / Tipos de usuarios

**Identificados del contexto**:
1. **Reclutadores/HR**: Usuarios principales que gestionan candidatos y posiciones
2. **Entrevistadores** (Employee): Realizan entrevistas y registran evaluaciones
3. **Hiring Managers**: Toman decisiones finales de contratación
4. **Candidatos**: Entidad del dominio (no usuarios activos del sistema actualmente)

**Nota**: No se detecta sistema de roles/permisos implementado.

## Requisitos no funcionales detectados

### Seguridad
- Validación de inputs en backend (validator.ts)
- Validación de tipos de archivo en uploads (solo PDF/DOCX)
- CORS configurado con orígenes permitidos
- ⚠️ **FALTA**: Autenticación, autorización, encriptación de datos sensibles

### Rendimiento
- Uso de Prisma con queries optimizadas con `include`
- ⚠️ **LIMITACIÓN**: No se detectan índices adicionales en BD, caching, paginación

### Compatibilidad
- Backend: Node.js (versión no especificada explícitamente)
- Frontend: Navegadores modernos (ES5+, React 18)
- BD: PostgreSQL (versión no especificada)
- Docker: Compatible con docker-compose

### Observabilidad
- Logging básico con `console.log`/`console.error`
- ⚠️ **FALTA**: Sistema de logging estructurado, métricas, tracing

### Escalabilidad
- Arquitectura preparada para separación backend/frontend
- ⚠️ **LIMITACIÓN**: Monolito con Prisma Client acoplado, sin arquitectura de microservicios

## Definition of Done para cambios típicos

Para considerar una funcionalidad completa en este proyecto:

### Código
- ✅ Implementación en capa de dominio (models), aplicación (services), y presentación (controllers)
- ✅ Validación de datos implementada
- ✅ Manejo de errores con try-catch y mensajes descriptivos
- ✅ TypeScript sin errores de compilación

### Testing
- ✅ Tests unitarios escritos (Jest) para services y controllers
- ✅ Tests pasan exitosamente (`npm test`)
- ⚠️ **NOTA**: Cobertura de tests es parcial (solo candidateService y positionService)

### Documentación
- ✅ Endpoint documentado en `api-spec.yaml` (OpenAPI 3.0)
- ✅ Actualización de README si aplica
- ✅ Comentarios en código complejo

### Integración
- ✅ Ruta registrada en backend/src/index.ts
- ✅ Frontend actualizado si hay cambios en API
- ✅ Migraciones de Prisma ejecutadas si hay cambios en BD
- ✅ Build exitoso (backend: `npm run build`, frontend: `npm run build`)

### Deployment (según flujo del proyecto)
- ✅ Cambios probados en fork personal
- ✅ GitHub Actions ejecutado exitosamente
- ✅ Evidencia de funcionamiento incluida en PR

## Estado actual del proyecto

**Versión**: 0.0.0.001 (según archivo VERSION)

**Funcionalidad core implementada**:
- ✅ CRUD básico de candidatos
- ✅ Consulta de posiciones y flujos de entrevista
- ✅ Actualización de etapa de candidato en proceso
- ✅ Upload de archivos

**Deuda técnica conocida**:
- Sin sistema de autenticación/autorización
- Tests incompletos
- Sin CI/CD configurado (mencionado en README pero no presente en repo)
- Dependencia directa de PrismaClient en modelos de dominio (violación DIP)
- Sin manejo de migraciones en producción

## Preguntas al humano

1. ¿Cuál es la versión mínima de Node.js requerida?
2. ¿Se planea implementar autenticación próximamente?
3. ¿Cuál es el enfoque de deployment target (AWS EC2 mencionado en README)?
4. ¿Hay requisitos de compliance (GDPR, protección de datos personales)?
5. ¿Cuál es el volumen esperado de candidatos/posiciones?
6. ¿Se necesita soporte multi-tenant (múltiples empresas)?
