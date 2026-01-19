# Domain Model - LTI Talent Tracking System

## Visión del dominio

Este sistema modela el **dominio de reclutamiento y gestión de talento**. Los conceptos centrales son:

1. **Candidatos** que aplican a **Posiciones**
2. **Posiciones** con **Flujos de Entrevista** estructurados
3. **Aplicaciones** que conectan candidatos con posiciones
4. **Entrevistas** realizadas por **Empleados** en **Pasos** específicos

## Contextos delimitados (Bounded Contexts)

### 1. Candidate Management Context

**Responsabilidad**: Gestión de información de candidatos

**Entidades**:
- `Candidate` (aggregate root)
  - `Education` (entidad asociada)
  - `WorkExperience` (entidad asociada)
  - `Resume` (entidad asociada)

**Lenguaje ubicuo**:
- **Candidato**: Persona que aplica a una o más posiciones
- **Educación**: Título académico obtenido por el candidato
- **Experiencia laboral**: Trabajo previo del candidato
- **CV/Resume**: Documento con información detallada del candidato

**Reglas de negocio**:
- Un candidato debe tener email único
- Un candidato puede tener múltiples educaciones
- Un candidato puede tener múltiples experiencias laborales
- Un candidato puede tener múltiples versiones de CV

### 2. Position Management Context

**Responsabilidad**: Gestión de posiciones laborales y su configuración

**Entidades**:
- `Company` (aggregate root)
  - `Employee` (entidad asociada)
  - `Position` (entidad asociada)
- `InterviewFlow` (aggregate root)
  - `InterviewStep` (entidad asociada)
- `InterviewType` (entidad de catálogo)

**Lenguaje ubicuo**:
- **Empresa**: Organización que ofrece posiciones
- **Posición**: Puesto laboral abierto para aplicaciones
- **Flujo de entrevista**: Secuencia de pasos que debe seguir un candidato
- **Paso de entrevista**: Etapa específica en el proceso (ej. screening, técnica)
- **Tipo de entrevista**: Categoría de entrevista (HR, técnica, gerencial)
- **Empleado**: Persona de la empresa que puede entrevistar

**Reglas de negocio**:
- Una posición debe tener un flujo de entrevista asociado
- Un flujo de entrevista tiene pasos ordenados (orderIndex)
- Solo posiciones visibles (isVisible=true) pueden recibir aplicaciones (no validado en código)
- Una posición pertenece a una empresa

### 3. Application & Interview Context

**Responsabilidad**: Gestión del proceso de aplicación y evaluación

**Entidades**:
- `Application` (aggregate root)
  - `Interview` (entidad asociada)

**Lenguaje ubicuo**:
- **Aplicación**: Intento de un candidato de ocupar una posición
- **Entrevista**: Evaluación realizada a un candidato en un paso específico
- **Etapa actual**: Paso en el que se encuentra actualmente la aplicación
- **Score**: Puntuación de 1-5 (o similar) de una entrevista
- **Resultado**: Pass/Fail de una entrevista
- **Notas**: Comentarios del entrevistador

**Reglas de negocio**:
- Una aplicación conecta exactamente un candidato con una posición
- Una aplicación tiene una etapa actual (currentInterviewStep)
- Una aplicación puede tener múltiples entrevistas (una por paso)
- Una entrevista es realizada por un empleado en un paso específico
- Una entrevista puede tener score y notas opcionales

## Agregados y relaciones

### Agregado: Candidate

**Root**: Candidate  
**Entidades contenidas**: Education, WorkExperience, Resume

**Invariantes**:
- Email debe ser único en todo el sistema
- Nombres no pueden estar vacíos

**Operaciones principales**:
```typescript
// Crear candidato con relaciones
async addCandidate(candidateData: {
  firstName, lastName, email, phone, address,
  educations: [],
  workExperiences: [],
  cv: {}
}): Promise<Candidate>

// Obtener candidato completo
async findCandidateById(id: number): Promise<Candidate>
```

**Ciclo de vida**:
1. Creado por reclutador con datos básicos
2. Educations/WorkExperiences añadidos en creación
3. Resume subido y asociado
4. No se modifica frecuentemente (no hay UPDATE implementado para datos básicos)
5. No se elimina (no hay DELETE implementado)

### Agregado: Position + InterviewFlow

**Root**: Position  
**Relaciones**: Company, InterviewFlow

**InterviewFlow contiene**: InterviewSteps

**Invariantes**:
- Una posición debe tener flujo de entrevista válido
- Pasos de entrevista tienen orden (orderIndex)

**Operaciones principales**:
```typescript
// Listar posiciones
async getPositions(): Promise<Position[]>

// Obtener flujo de entrevista de posición
async getInterviewFlow(positionId: number): Promise<InterviewFlow>
```

**Ciclo de vida**:
1. Creada por administrador con flujo de entrevista asociado
2. Status: Draft → Open → Closed (no completamente implementado)
3. Visibilidad controlada con isVisible
4. No se modifica después de tener aplicaciones (debería validarse)

### Agregado: Application

**Root**: Application  
**Entidades contenidas**: Interviews  
**Referencias**: Position, Candidate, InterviewStep (current)

**Invariantes**:
- Debe referenciar posición y candidato existentes
- currentInterviewStep debe ser un paso válido del flujo

**Operaciones principales**:
```typescript
// Crear aplicación (implícito al crear candidato+posición)
async createApplication(positionId, candidateId, initialStepId): Promise<Application>

// Actualizar etapa
async updateCandidateStage(candidateId, applicationId, newStepId): Promise<Application>

// Crear entrevista (no implementado en API)
async createInterview(applicationId, stepId, employeeId, data): Promise<Interview>
```

**Ciclo de vida**:
1. Creada cuando candidato aplica a posición
2. currentInterviewStep avanza a través del flujo
3. Interviews se crean en cada paso
4. Finaliza con hired o rejected (no marcado explícitamente)

## Value Objects (potenciales)

**Actualmente NO implementados como Value Objects puros**, pero podrían serlo:

### Email (Value Object candidato)
```typescript
class Email {
  constructor(private value: string) {
    if (!this.isValid(value)) throw new Error('Invalid email');
  }
  
  private isValid(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  
  toString(): string { return this.value; }
}
```

### DateRange (Value Object para Education/WorkExperience)
```typescript
class DateRange {
  constructor(
    private startDate: Date,
    private endDate?: Date
  ) {
    if (endDate && startDate > endDate) {
      throw new Error('Start date must be before end date');
    }
  }
  
  durationInYears(): number { /*...*/ }
  isCurrent(): boolean { return !this.endDate; }
}
```

### Score (Value Object para Interview)
```typescript
class Score {
  constructor(private value: number) {
    if (value < 1 || value > 5) {
      throw new Error('Score must be between 1 and 5');
    }
  }
  
  toNumber(): number { return this.value; }
}
```

## Domain Services

### candidateService

**Responsabilidad**: Orquestación de operaciones complejas sobre candidatos

**Operaciones**:
- `addCandidate()`: Crear candidato con todas sus relaciones (transaction lógica)
- `findCandidateById()`: Obtener candidato completo con aplicaciones e historial
- `updateCandidateStage()`: Cambiar etapa de aplicación

**Por qué es Domain Service**:
- Lógica que no pertenece a una sola entidad
- Coordina múltiples agregados (Candidate + Education + WorkExperience + Resume)

### positionService

**Responsabilidad**: Operaciones sobre posiciones

**Operaciones**:
- `getPositions()`: Listar posiciones visibles
- `getCandidatesByPosition()`: Obtener candidatos de una posición con sus etapas
- `getInterviewFlow()`: Obtener flujo completo de una posición

**Por qué es Domain Service**:
- Queries complejas que cruzan agregados (Position + Application + Candidate)

## Repositorios (interfaces, NO implementados)

```typescript
interface ICandidateRepository {
  save(candidate: Candidate): Promise<Candidate>;
  findById(id: number): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  findAll(): Promise<Candidate[]>;
}

interface IPositionRepository {
  save(position: Position): Promise<Position>;
  findById(id: number): Promise<Position | null>;
  findVisible(): Promise<Position[]>;
  findByCompany(companyId: number): Promise<Position[]>;
}

interface IApplicationRepository {
  save(application: Application): Promise<Application>;
  findById(id: number): Promise<Application | null>;
  findByPositionAndCandidate(positionId: number, candidateId: number): Promise<Application | null>;
  findByPosition(positionId: number): Promise<Application[]>;
}
```

**Estado actual**: Estas interfaces NO existen. Los modelos llaman directamente a Prisma.

## Eventos de dominio (NO implementados, sugeridos)

```typescript
// Ejemplos de eventos que deberían dispararse

class CandidateAppliedEvent {
  constructor(
    public candidateId: number,
    public positionId: number,
    public applicationId: number,
    public timestamp: Date
  ) {}
}

class CandidateStageChangedEvent {
  constructor(
    public applicationId: number,
    public candidateId: number,
    public previousStep: number,
    public newStep: number,
    public timestamp: Date
  ) {}
}

class InterviewCompletedEvent {
  constructor(
    public interviewId: number,
    public applicationId: number,
    public score: number,
    public result: string,
    public timestamp: Date
  ) {}
}
```

**Casos de uso**:
- `CandidateAppliedEvent` → Enviar email de confirmación
- `CandidateStageChangedEvent` → Notificar a entrevistadores
- `InterviewCompletedEvent` → Actualizar métricas, decidir siguiente paso

## Reglas de negocio importantes

### Validadas en código

1. **Email único**: Validado por unique constraint en BD + manejo de error P2002
2. **Formato de email**: Validado por regex en validator.ts
3. **Nombres válidos**: Min 2 caracteres, solo letras (validator.ts)
4. **Tipos de archivo CV**: Solo PDF y DOCX (fileUploadService.ts)
5. **Fechas en formato ISO**: Pattern YYYY-MM-DD (api-spec.yaml)

### NO validadas pero deberían estarlo

6. **Orden secuencial de etapas**: orderIndex existe pero no se valida que se sigan en orden
7. **Rango de scores**: Interview.score puede ser cualquier número (debería ser 1-5)
8. **Application única por candidato-posición**: No se valida duplicados (debería)
9. **Posición visible para aplicar**: isVisible no se valida al crear Application
10. **Empleado activo para entrevistar**: isActive no se valida al crear Interview

## Anti-patterns detectados

### 1. Anemic Domain Model (parcial)

Algunos modelos solo tienen datos sin comportamiento:
- `Education`, `WorkExperience`, `Resume` solo tienen save()
- Lógica de negocio está en services en lugar de modelos

### 2. Transaction Script

`candidateService.addCandidate()` es un script procedural, no aproveha el modelo de dominio rico.

### 3. Smart UI (frontend)

Componentes React tienen lógica que debería estar en services o stores:
- `AddCandidateForm` maneja validación y formateo
- `PositionDetails` maneja lógica de drag & drop y actualización

## Mejoras propuestas al modelo de dominio

### 1. Introducir Value Objects

Reemplazar primitives por Value Objects:
- `Email`, `Phone`, `DateRange`, `Score`

### 2. Enriquecer entidades con comportamiento

```typescript
class Candidate {
  // ...existing
  
  canApplyTo(position: Position): boolean {
    if (!position.isVisible) return false;
    if (this.hasAppliedTo(position)) return false;
    return true;
  }
  
  private hasAppliedTo(position: Position): boolean {
    return this.applications.some(app => app.positionId === position.id);
  }
  
  addEducation(education: Education): void {
    this.educations.push(education);
  }
}
```

### 3. Implementar Factories

```typescript
class CandidateFactory {
  static create(data: CandidateDTO): Candidate {
    const candidate = new Candidate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: new Email(data.email),
      phone: data.phone ? new Phone(data.phone) : undefined,
      address: data.address
    });
    
    data.educations.forEach(edu => {
      candidate.addEducation(EducationFactory.create(edu));
    });
    
    return candidate;
  }
}
```

### 4. Implementar Domain Events

```typescript
class Application {
  changeStage(newStep: InterviewStep): void {
    const previousStep = this.currentInterviewStep;
    this.currentInterviewStep = newStep.id;
    
    this.addDomainEvent(new CandidateStageChangedEvent(
      this.id, this.candidateId, previousStep, newStep.id, new Date()
    ));
  }
}
```

### 5. Añadir especificaciones (Specification Pattern)

```typescript
class VisiblePositionSpecification {
  isSatisfiedBy(position: Position): boolean {
    return position.isVisible && position.status === 'Open';
  }
}

class QualifiedCandidateSpecification {
  constructor(private position: Position) {}
  
  isSatisfiedBy(candidate: Candidate): boolean {
    // Lógica compleja de matching
    return this.hasRequiredEducation(candidate) &&
           this.hasRequiredExperience(candidate);
  }
}
```

---

**Ver también**:
- `backend/ModeloDatos.md` - Diagrama ERD completo
- `backend/prisma/schema.prisma` - Definición de esquema
- `memory-bank/domains/key-flows.md` - Flujos de negocio detallados
