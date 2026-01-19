# Key Business Flows - LTI Talent Tracking System

## Flujo 1: Alta de candidato completo

**Trigger**: Reclutador recibe CV de candidato  
**Actor**: Reclutador  
**Resultado**: Candidato registrado en sistema listo para aplicar a posiciones

### Pasos

1. **Upload de CV** (opcional primero)
   - POST /upload con archivo PDF/DOCX
   - Sistema guarda en /uploads con timestamp
   - Retorna filePath y fileType

2. **Completar formulario**
   - Datos personales: firstName, lastName, email, phone, address
   - Educaciones (array): institution, title, startDate, endDate
   - Experiencias (array): company, position, description, startDate, endDate
   - CV: filePath y fileType (del paso 1)

3. **Validación**
   - Email formato válido y único
   - Nombres min 2 chars, solo letras
   - Teléfono formato válido
   - Fechas formato ISO

4. **Creación transaccional** (⚠️ sin transaction real)
   - Crear Candidate
   - Para cada education: Crear Education con candidateId
   - Para cada workExperience: Crear WorkExperience con candidateId
   - Si hay CV: Crear Resume con candidateId

5. **Respuesta**
   - 201 con candidato completo
   - Frontend muestra confirmación

### Variantes

- **Sin CV**: Omitir paso 1 y enviar cv vacío
- **Email duplicado**: Error 400 "Email already exists"
- **Validación falla**: Error 400 con mensaje descriptivo

### Archivos involucrados

- `frontend/src/components/AddCandidateForm.js`
- `frontend/src/components/FileUploader.js`
- `backend/src/routes/candidateRoutes.ts`
- `backend/src/presentation/controllers/candidateController.ts`
- `backend/src/application/services/candidateService.ts`
- `backend/src/application/validator.ts`
- `backend/src/domain/models/Candidate.ts`, `Education.ts`, `WorkExperience.ts`, `Resume.ts`

---

## Flujo 2: Visualizar pipeline de posición

**Trigger**: Reclutador selecciona posición desde lista  
**Actor**: Reclutador  
**Resultado**: Vista Kanban de candidatos agrupados por etapa

### Pasos

1. **Cargar posiciones**
   - GET /positions
   - Retorna posiciones con isVisible=true
   - Frontend muestra lista

2. **Seleccionar posición**
   - Usuario click en posición
   - Frontend guarda positionId seleccionado

3. **Cargar flujo de entrevista**
   - GET /positions/:id/interviewflow
   - Retorna InterviewFlow con InterviewSteps ordenados
   - Frontend crea columnas por cada step

4. **Cargar candidatos de posición**
   - GET /positions/:id/candidates
   - Retorna array de candidatos con:
     - fullName: firstName + lastName
     - currentInterviewStep: nombre del paso actual
     - averageScore: promedio de scores de interviews

5. **Renderizar Kanban**
   - Frontend agrupa candidatos por currentInterviewStep
   - Cada columna (StageColumn) contiene CandidateCards
   - Habilita drag & drop entre columnas

### Queries ejecutadas (backend)

```typescript
// positionService.getCandidatesByPosition()
const applications = await prisma.application.findMany({
  where: { positionId },
  include: {
    candidate: true,
    interviewStep: true,
    interviews: { select: { score: true } }
  }
});

// Procesamiento
applications.map(app => ({
  fullName: app.candidate.firstName + ' ' + app.candidate.lastName,
  currentInterviewStep: app.interviewStep.name,
  averageScore: calculateAverage(app.interviews.map(i => i.score))
}));
```

### Archivos involucrados

- `frontend/src/components/Positions.tsx`
- `frontend/src/components/PositionDetails.js`
- `frontend/src/components/StageColumn.js`
- `frontend/src/components/CandidateCard.js`
- `backend/src/routes/positionRoutes.ts`
- `backend/src/presentation/controllers/positionController.ts`
- `backend/src/application/services/positionService.ts`

---

## Flujo 3: Mover candidato a siguiente etapa

**Trigger**: Reclutador arrastra candidato a nueva columna (drag & drop)  
**Actor**: Reclutador  
**Resultado**: Application.currentInterviewStep actualizado

### Pasos

1. **Drag & Drop** (frontend)
   - Usuario arrastra CandidateCard de una StageColumn a otra
   - React Beautiful DnD captura evento
   - Obtiene: candidateId, applicationId, newStepId

2. **Actualización optimista** (opcional, no implementado)
   - Frontend mueve card inmediatamente
   - Si API falla, rollback

3. **Request a API**
   - PUT /candidates/:candidateId
   - Body: `{applicationId, currentInterviewStep: newStepId}`

4. **Backend procesamiento**
   ```typescript
   // candidateService.updateCandidateStage()
   const application = await Application.findOneByPositionCandidateId(applicationId, candidateId);
   if (!application) throw new Error('Application not found');
   
   application.currentInterviewStep = newStepId;
   await application.save();
   
   return application;
   ```

5. **Respuesta**
   - 200 con application actualizada
   - Frontend confirma movimiento

### Validaciones faltantes (⚠️)

- ❌ No valida que newStepId sea del flujo correcto
- ❌ No valida orden secuencial (puede saltar etapas)
- ❌ No valida que la etapa anterior tenga Interview completada
- ❌ No maneja concurrencia (dos users mueven simultáneamente)

### Archivos involucrados

- `frontend/src/components/PositionDetails.js` (drag & drop logic)
- `backend/src/routes/candidateRoutes.ts`
- `backend/src/presentation/controllers/candidateController.ts`
- `backend/src/application/services/candidateService.ts`
- `backend/src/domain/models/Application.ts`

---

## Flujo 4: Ver detalle de candidato

**Trigger**: Click en candidato desde cualquier vista  
**Actor**: Reclutador / Entrevistador  
**Resultado**: Vista completa de candidato con historial

### Pasos

1. **Request detalle**
   - GET /candidates/:id

2. **Backend query**
   ```typescript
   // Candidate.findOne()
   const candidate = await prisma.candidate.findUnique({
     where: { id },
     include: {
       educations: true,
       workExperiences: true,
       resumes: true,
       applications: {
         include: {
           position: { select: { id: true, title: true } },
           interviews: {
             select: {
               interviewDate: true,
               interviewStep: { select: { name: true } },
               notes: true,
               score: true
             }
           }
         }
       }
     }
   });
   ```

3. **Frontend renderizado**
   - Sección: Datos personales
   - Sección: Educación (lista)
   - Sección: Experiencia laboral (lista)
   - Sección: CVs (download links)
   - Sección: Aplicaciones
     - Para cada aplicación:
       - Posición
       - Etapa actual
       - Historial de entrevistas (fecha, etapa, score, notas)

4. **Interacción**: Cambiar etapa
   - Selector dropdown con etapas disponibles
   - Submit → PUT /candidates/:id (flujo 3)

### Archivos involucrados

- `frontend/src/components/CandidateDetails.js`
- `backend/src/routes/candidateRoutes.ts`
- `backend/src/presentation/controllers/candidateController.ts`
- `backend/src/application/services/candidateService.ts`
- `backend/src/domain/models/Candidate.ts`

---

## Flujo 5: Registrar entrevista (⚠️ NO implementado en UI)

**Trigger**: Entrevistador completa entrevista  
**Actor**: Entrevistador  
**Resultado**: Interview creada con score y notas

### Pasos esperados (diseñados pero no implementados)

1. **Seleccionar candidato en etapa actual**
2. **Completar formulario de entrevista**
   - interviewDate: Date
   - result: "Passed" | "Failed"
   - score: 1-5
   - notes: Texto libre
3. **POST /interviews** (endpoint NO existe)
   ```json
   {
     "applicationId": 123,
     "interviewStepId": 2,
     "employeeId": 5,
     "interviewDate": "2026-01-19T10:00:00Z",
     "result": "Passed",
     "score": 4,
     "notes": "Buenas habilidades técnicas..."
   }
   ```
4. **Backend crea Interview**
5. **Opcionalmente avanza etapa automáticamente** si result="Passed"

### ¿Por qué no está implementado?

- El modelo de datos Interview existe
- Seed data crea interviews de ejemplo
- Pero NO hay:
  - Endpoint POST /interviews
  - UI para registrar entrevista
  - Lógica de service para crear interview

### Workaround actual

Las interviews se crean directamente en BD (seed) o mediante scripts externos.

### Archivos que deberían crearse

- `backend/src/routes/interviewRoutes.ts` (NO existe)
- `backend/src/presentation/controllers/interviewController.ts` (NO existe)
- `backend/src/application/services/interviewService.ts` (NO existe)
- `frontend/src/components/InterviewForm.js` (NO existe)

---

## Flujo 6: Setup inicial del sistema

**Trigger**: Primera vez que se levanta el proyecto  
**Actor**: Desarrollador / Administrador  
**Resultado**: BD poblada con datos de ejemplo

### Pasos

1. **Clonar repo y configurar .env**
2. **Levantar PostgreSQL**
   ```bash
   docker-compose up -d
   ```
3. **Ejecutar migraciones**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```
4. **Ejecutar seed**
   ```bash
   npx ts-node prisma/seed.ts
   ```

### Datos creados por seed

- 1 Company: "LTI"
- 2 Employees: Alice Johnson (Interviewer), Bob Miller (Hiring Manager)
- 2 InterviewFlows: Standard development, Data science
- 3 InterviewTypes: HR Interview, Technical Interview, Hiring manager interview
- 6 InterviewSteps (3 por flow):
  - Initial Screening (orderIndex 1)
  - Technical Interview (orderIndex 2)
  - Manager Interview (orderIndex 2) ⚠️ duplicado orderIndex
- 2 Positions: Senior Full-Stack Engineer, Data Scientist
- 3 Candidates: John Doe, Jane Smith, Carlos García
  - Cada uno con educations, workExperiences, resumes
- 4 Applications:
  - John Doe → Senior Full-Stack (step 2)
  - John Doe → Data Scientist (step 2)
  - Jane Smith → Senior Full-Stack (step 2)
  - Carlos García → Senior Full-Stack (step 1)
- 3 Interviews (solo para applications de John y Jane en step 1)

### Archivos involucrados

- `docker-compose.yml`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/prisma/migrations/*`

---

## Flujo 7: Deploy a producción (⚠️ NO implementado)

**Trigger**: Merge a rama main  
**Actor**: CI/CD pipeline  
**Resultado**: Nueva versión desplegada

### Pasos esperados (según README pero NO implementado)

1. **Push a fork personal**
2. **GitHub Actions ejecuta**:
   - Lint
   - Tests
   - Build backend
   - Build frontend
3. **Deploy a AWS EC2**:
   - SSH a instancia
   - Pull código
   - npm install
   - Build
   - Restart con PM2
4. **Health check**
5. **Notificación de éxito/fallo**

### Archivos faltantes

- `.github/workflows/ci.yml` (NO existe)
- `.github/workflows/deploy.yml` (NO existe)
- Scripts de deployment (NO existen)

---

## Matriz de flujos vs features

| Flujo | Implementado | Testeado | Documentado | Prioridad |
|-------|--------------|----------|-------------|-----------|
| Alta candidato | ✅ | ⚠️ Parcial | ✅ | Alta |
| Visualizar pipeline | ✅ | ⚠️ Parcial | ✅ | Alta |
| Mover candidato | ✅ | ❌ | ✅ | Alta |
| Ver detalle | ✅ | ❌ | ✅ | Media |
| Registrar entrevista | ❌ | ❌ | ⚠️ Solo modelo | Alta |
| Setup inicial | ✅ | N/A | ✅ | Alta |
| Deploy | ❌ | ❌ | ⚠️ Solo README | Media |

---

**Ver también**:
- `memory-bank/productContext.md` - Casos de uso detallados
- `memory-bank/interfaces/api.md` - Contratos de API
- `backend/api-spec.yaml` - Especificación OpenAPI
