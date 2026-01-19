# Active Context - LTI Talent Tracking System

## Estado actual del proyecto

**Fecha de creación de Memory Bank**: 2026-01-19  
**Última actualización**: 2026-01-19 (sesión 3 - hallazgos sobre drag & drop testing)  
**Versión del proyecto**: 0.0.0.001 (según archivo `VERSION`)

## En qué estamos ahora

### Estado inicial: Proyecto académico funcional

Este proyecto se encuentra en un **estado funcional básico** como parte del programa AI4Devs. Es un sistema de seguimiento de candidatos (ATS) con:

✅ **Funcionalidad core implementada**:
- Backend API REST con endpoints para candidatos, posiciones y flujos de entrevista
- Frontend React con dashboard de reclutador
- Base de datos PostgreSQL con modelo completo (12 entidades)
- Upload de archivos (CVs)
- Visualización Kanban de candidatos por etapa

✅ **Arquitectura definida**:
- DDD (Domain-Driven Design) con capas domain/application/presentation
- Separación frontend/backend
- Prisma como ORM
- Docker para base de datos

⚠️ **Limitaciones conocidas**:
- Sin autenticación ni autorización
- Tests unitarios incompletos (backend ~30%, frontend 0%)
- Tests E2E solo para Position Kanban (otros flujos pendientes)
- Sin CI/CD real (mencionado en README pero no implementado)
- Documentación consolidada en Memory Bank pero aún en evolución

✅ **Mejoras recientes** (2026-01-19):
- **Sesión 1 (mañana)**: Setup y correcciones
  - Migrado a pnpm como gestor de paquetes (mejor performance y disk space)
  - Errores TypeScript corregidos (build exitoso)
  - Puerto Docker corregido (5433→5432 mapeado correctamente)
  - Base de datos con migraciones y seed ejecutados
  - Documentación (READMEs) actualizada con comandos correctos

- **Sesión 2 (tarde)**: Tests E2E con Cypress - Intento inicial
  - Implementados 14 tests E2E para Position Kanban Board
  - Configuración completa de Cypress 15.9.0
  - Comandos personalizados para drag & drop con react-beautiful-dnd
  - Scripts de ejecución (interactivo, headless, headed)
  - Documentación extensa en `cypress/README.md` y Memory Bank actualizado

- **Sesión 3 (tarde)**: Corrección de tests E2E y hallazgos importantes
  - ❌ Descubierto: react-beautiful-dnd incompatible con Cypress automático
  - Instalado plugin `@4tw/cypress-drag-drop` (no resuelve incompatibilidad)
  - 3 tests marcados como `.skip()` con explicaciones detalladas
  - 11 tests activos funcionando correctamente (78% cobertura)
  - README actualizado con limitaciones reales
  - Documentación de alternativas (Playwright, pruebas manuales)
  - Instrucciones añadidas para resetear BD antes de tests
  - Memory Bank actualizado con hallazgos y lecciones aprendidas

## Enfoque actual: Programa educativo AI4Devs

**Contexto detectado del README**:
- Este es un ejercicio dentro del programa **AI4Devs-qa-202510**
- Cada estudiante trabaja en un fork personal
- Workflow: Desarrollar en fork → Probar en AWS personal → Pull Request con evidencia
- Énfasis en aprendizaje de CI/CD y buenas prácticas

**No es**: Un producto en producción ni proyecto comercial activo (aún).

## Hipótesis de foco

Basado en el análisis del código y documentación existente, las prioridades actuales parecen ser:

### Hipótesis 1: Completar fundamentos antes de escalar
**Evidencia**:
- Archivo `ManifestoBuenasPracticas.md` muy detallado con recomendaciones de mejora
- Tests parcialmente implementados
- Arquitectura DDD iniciada pero no completada (sin repositorios reales)

**Implicación**: El foco está en consolidar lo básico antes de añadir features.

### Hipótesis 2: Aprendizaje sobre DDD y arquitectura limpia
**Evidencia**:
- Documentación extensa sobre SOLID, DDD, patrones
- Ejemplos de "antes/después" en buenas prácticas
- Uso de TypeScript con tipos

**Implicación**: El proyecto es educativo, priorizando calidad de código sobre features.

### Hipótesis 3: Preparación para despliegue en cloud
**Evidencia**:
- README tiene secciones extensas sobre EC2 y GitHub Actions
- Configuración de CORS para múltiples orígenes
- Instrucciones de deployment

**Implicación**: Siguiente fase es hacer deployable y CI/CD funcional.

## Next steps sugeridos

Basado en el estado actual, estos son los siguientes pasos lógicos (ordenados por prioridad):

### Prioridad ALTA (Critical Path)

#### ✅ 1. Corregir setup de desarrollo - **COMPLETADO**
~~**Por qué**: Build fallaba, Docker mal configurado~~  
**Completado**: 2026-01-19 (Sesión 1)
- Migrado a pnpm
- Errores TypeScript corregidos
- Puerto Docker corregido
- Base de datos operativa
- READMEs actualizados

#### ✅ 2. Implementar tests E2E básicos - **COMPLETADO**
~~**Por qué**: Sin cobertura E2E, riesgo de regresiones~~  
**Completado**: 2026-01-19 (Sesión 2)
- 14 tests E2E para Position Kanban Board
- Cypress configurado y documentado
- Comandos personalizados para drag & drop
- Scripts de ejecución listos
- Documentación completa

#### 3. Implementar capa de repositorio real
**Por qué**: Viola principios DDD y dificulta testing  
**Archivos a crear**:
- `backend/src/infrastructure/repositories/ICandidateRepository.ts` (interface)
- `backend/src/infrastructure/repositories/CandidateRepository.ts` (implementación)
- Similar para Position, Application, etc.

**Esfuerzo**: ~3-5 horas  
**Riesgo**: Alto (refactor significativo)  
**Beneficio**: Desacoplar dominio de infraestructura, facilitar testing

#### 4. Completar tests unitarios
**Por qué**: Cobertura muy baja (solo 2 archivos)  
**Tests faltantes**:
- `positionService.test.ts` (existe pero UNKNOWN contenido)
- Controllers tests (existen pero UNKNOWN completitud)
- Modelos de dominio tests
- Frontend tests (0 encontrados)

**Esfuerzo**: ~8-10 horas  
**Riesgo**: Bajo  
**Beneficio**: Confianza en cambios, documentación viva

#### 4. Añadir variables de entorno documentadas
**Por qué**: Solo hay `.env.example` en root  
**Archivos a crear**:
- `backend/.env.example` ⚠️ FALTANTE
- `frontend/.env.example` ⚠️ FALTANTE

**Esfuerzo**: ~15 minutos  
**Riesgo**: Ninguno  
**Beneficio**: Onboarding más rápido, menos errores de setup

#### 6. Implementar autenticación básica
**Por qué**: Riesgo de seguridad crítico  
**Opciones**:
- JWT con Passport.js
- Auth0 / Clerk (terceros)
- NextAuth (si se migra a Next.js)

**Esfuerzo**: ~6-8 horas  
**Riesgo**: Medio (cambios en muchos puntos)  
**Beneficio**: Seguridad, separación de usuarios

#### 7. Configurar CI/CD real
**Por qué**: Mencionado en README pero no existe  
**Archivos a crear**:
- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`
- `.github/workflows/deploy.yml` (opcional)

**Esfuerzo**: ~3-4 horas  
**Riesgo**: Bajo  
**Beneficio**: Automatización, calidad consistente

### Prioridad MEDIA (Mejoras importantes)

#### 7. Implementar manejo de transacciones
**Ejemplo**: Crear candidato + educations + workExperiences de forma atómica  
**Esfuerzo**: ~2-3 horas

#### 8. Añadir paginación en endpoints de lista
**Endpoints afectados**: `/positions`, `/positions/{id}/candidates`  
**Esfuerzo**: ~2 horas

#### 9. Implementar logging estructurado
**Librería sugerida**: Winston o Pino  
**Esfuerzo**: ~3 horas

#### 10. Añadir validación con librería
**Reemplazar**: `validator.ts` manual por Zod o Yup  
**Esfuerzo**: ~4 horas

#### 11. Crear documentación de API interactiva
**Herramienta**: Swagger UI (librerías ya instaladas)  
**Archivos**: Integrar `api-spec.yaml` con Express  
**Esfuerzo**: ~1-2 horas

### Prioridad BAJA (Quick wins)

#### 11. Especificar versiones en `engines`
**package.json** → Añadir campo engines con Node.js y npm  
**Esfuerzo**: 5 minutos

#### 12. Pin versión de PostgreSQL en Docker
**docker-compose.yml** → Cambiar `postgres` a `postgres:15-alpine`  
**Esfuerzo**: 2 minutos

#### 13. Añadir health check endpoint
**Backend** → `GET /health` que valide conexión a BD  
**Esfuerzo**: 15 minutos

#### 14. Configurar ESLint y Prettier
**Crear**: `.eslintrc.json`, `.prettierrc`  
**Esfuerzo**: 30 minutos

#### 15. Actualizar README con arquitectura
**Incluir**: Diagrama de carpetas, explicación de capas DDD  
**Esfuerzo**: 1 hora

## Incertidumbres que requieren confirmación

Estas decisiones no pueden inferirse del código y requieren input del humano:

### Roadmap del producto
1. ¿Cuál es el objetivo final? ¿Proyecto educativo o producto real?
2. ¿Hay timeline definido para próximas features?
3. ¿Qué features están en backlog priorizado?

### Decisiones técnicas pendientes
4. ¿Se va a implementar autenticación? ¿Con qué estrategia?
5. ¿Se necesita soporte multi-tenant?
6. ¿Hay planes de migrar a microservicios?
7. ¿Se contempla GraphQL en lugar/además de REST?

### Operaciones
8. ¿Cuál es el entorno de producción target? (AWS, Azure, GCP, on-premise)
9. ¿Qué estrategia de deployment? (Blue-green, canary, rolling)
10. ¿Hay presupuesto para herramientas de monitoreo? (DataDog, New Relic, etc.)

### Compliance y seguridad
11. ¿Hay requisitos de GDPR u otras regulaciones?
12. ¿Se necesita encriptación de datos en reposo?
13. ¿Hay requisitos de auditoría?

## Riesgos inmediatos

### 🔴 CRÍTICO
1. **Sin autenticación**: API pública accesible sin restricciones
2. **Datos sensibles expuestos**: Emails, teléfonos, direcciones sin protección
3. **Sin validación de tamaño de archivos**: Posible DoS con uploads grandes

### 🟠 ALTO
4. **Dependencias sin actualizar**: TypeScript 4.9.5 (actual 5.x)
5. **Tests insuficientes**: <30% cobertura estimada
6. **Sin transacciones**: Riesgo de datos inconsistentes
7. **Docker sin version pinning**: Builds no reproducibles

### 🟡 MEDIO
8. **Prisma Client acoplado**: Dificulta testing y cambio de BD
9. **Sin health checks**: Dificulta monitoreo
10. **Logging inadecuado**: Debug difícil en producción

## Estado de documentación

### ✅ Buena documentación
- README completo con setup detallado
- `api-spec.yaml` con OpenAPI 3.0
- `ModeloDatos.md` con ERD y descripciones
- `ManifestoBuenasPracticas.md` extensivo

### ⚠️ Documentación parcial
- Comentarios en código (presentes pero no consistentes)
- No hay JSDoc en funciones
- No hay ADRs (Architecture Decision Records)

### ❌ Documentación faltante
- Guía de contribución (CONTRIBUTING.md)
- Changelog (CHANGELOG.md)
- Guía de deployment (deployment.md)
- Troubleshooting (FAQ o wiki)

## Métricas actuales (estimadas)

**Líneas de código**:
- Backend: ~2000 LoC (estimado)
- Frontend: ~1500 LoC (estimado)

**Archivos**:
- Backend: 25+ archivos TS
- Frontend: 13+ archivos JS/TSX

**Cobertura de tests**: <30% (estimado, solo 2 archivos test en backend)

**Tiempo de build**:
- Backend: ~10-15s
- Frontend: ~30-45s (CRA)

**Endpoints**: 7 endpoints REST documentados

**Modelos de dominio**: 12 entidades

## Próximos pasos recomendados (acción inmediata)

Para que un agente pueda continuar trabajando efectivamente en este proyecto:

1. **Leer** este Memory Bank completo (todos los archivos en `memory-bank/`)
2. **Validar** incertidumbres con el equipo/instructor
3. **Priorizar** de la lista "Next steps" según feedback
4. **Ejecutar** quick wins (items 11-15) en primera sesión
5. **Planificar** spikes técnicos para items de riesgo alto
6. **Actualizar** `activeContext.md` y `progress.md` después de cada sesión

## Changelog del Memory Bank

- **2026-01-19 (sesión 3 - tarde)**: Hallazgos sobre incompatibilidad de react-beautiful-dnd con Cypress
  - ❌ Descubierto: react-beautiful-dnd no puede automatizarse en Cypress
  - Instalado y probado plugin `@4tw/cypress-drag-drop` (no efectivo)
  - 3 tests marcados como `.skip()` (drag & drop)
  - Actualizado progress.md con sección de "Hallazgos importantes"
  - Documentadas alternativas: Playwright, pruebas manuales, tests de API
  - README de Cypress actualizado con limitaciones reales
  - 11/14 tests E2E activos y funcionando (78% cobertura)
  
- **2026-01-19 (sesión 2 - tarde)**: Implementación de tests E2E con Cypress
  - Añadido item #2 "Implementar tests E2E básicos" como completado
  - Actualizada sección de limitaciones conocidas (tests E2E implementados)
  - Documentación completa de estrategia de testing E2E
  - Renumerados items de next steps (del 2 al 7)
  - Actualizado progress.md con nueva sección de Testing E2E
  
- **2026-01-19 (sesión 1 - mañana)**: Actualización tras migración a pnpm y correcciones
  - Marcado item #1 de prioridad alta como completado
  - Actualizado estado de infraestructura (ahora funcional)
  - Añadidas mejoras recientes en limitaciones conocidas
  - Renumerados items de next steps
  
- **2026-01-19 (inicio de sesiones)**: Creación inicial del Memory Bank
  - Análisis completo del codebase
  - Documentación de estado actual
  - Identificación de next steps y riesgos

---

**Última actualización**: 2026-01-19 (sesión 3 - hallazgos sobre drag & drop testing)  
**Próxima revisión sugerida**: Después de implementar autenticación o completar tests unitarios
