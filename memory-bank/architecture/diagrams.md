# Architecture Diagrams - LTI Talent Tracking System

## Diagrama C4 - Nivel 1: Contexto del Sistema

```mermaid
C4Context
    title Diagrama de Contexto - LTI Talent Tracking System
    
    Person(recruiter, "Reclutador", "Gestiona candidatos y procesos de selección")
    Person(interviewer, "Entrevistador", "Evalúa candidatos en diferentes etapas")
    Person(candidate, "Candidato", "Aplica a posiciones (futuro: portal)")
    
    System(lti, "LTI System", "Sistema de seguimiento de talento y gestión de procesos de reclutamiento")
    
    System_Ext(email, "Sistema de Email", "Gmail, Outlook (futuro)")
    System_Ext(storage, "Cloud Storage", "AWS S3 (futuro)")
    System_Ext(linkedin, "LinkedIn API", "Importar perfiles (futuro)")
    
    Rel(recruiter, lti, "Gestiona candidatos y posiciones", "HTTPS")
    Rel(interviewer, lti, "Evalúa candidatos", "HTTPS")
    Rel(candidate, lti, "Aplica a posiciones (futuro)", "HTTPS")
    
    Rel_Neighbor(lti, email, "Envía notificaciones (futuro)", "SMTP")
    Rel(lti, storage, "Almacena CVs (futuro)", "S3 API")
    Rel(lti, linkedin, "Importa perfiles (futuro)", "REST")
    
    UpdateRelStyle(lti, email, $offsetY="-40", $offsetX="-90")
    UpdateRelStyle(lti, storage, $offsetY="-10")
    UpdateRelStyle(lti, linkedin, $offsetY="20")
```

## Diagrama C4 - Nivel 2: Contenedores (ya incluido en overview.md)

Ver `architecture/overview.md` para diagrama de contenedores completo.

## Diagrama de componentes - Backend

```mermaid
graph TB
    subgraph "Backend Container"
        subgraph "Presentation Layer"
            Routes[Routes<br/>candidateRoutes<br/>positionRoutes]
            Controllers[Controllers<br/>candidateController<br/>positionController]
        end
        
        subgraph "Application Layer"
            Services[Services<br/>candidateService<br/>positionService<br/>fileUploadService]
            Validators[Validators<br/>validator.ts]
        end
        
        subgraph "Domain Layer"
            Models[Domain Models<br/>Candidate, Position<br/>Application, etc.]
        end
        
        subgraph "Infrastructure (mezclado con Domain)"
            Prisma[Prisma Client<br/>Database Access]
            FileSystem[File System<br/>Multer + uploads/]
        end
    end
    
    Routes --> Controllers
    Controllers --> Services
    Services --> Validators
    Services --> Models
    Models --> Prisma
    Services --> FileSystem
    
    Prisma --> DB[(PostgreSQL)]
    FileSystem --> Files[/uploads/]
    
    style Prisma fill:#f9f,stroke:#333
    style Models fill:#ff9,stroke:#333
```

## Diagrama de componentes - Frontend

```mermaid
graph TB
    subgraph "Frontend Container"
        App[App.js<br/>Root Component]
        
        subgraph "Dashboard Views"
            Dashboard[RecruiterDashboard]
            Positions[Positions List]
            PositionDetails[Position Details<br/>Kanban View]
        end
        
        subgraph "Candidate Components"
            AddForm[AddCandidateForm]
            CandidateCard[CandidateCard]
            CandidateDetails[CandidateDetails]
            StageColumn[StageColumn]
        end
        
        subgraph "Utility Components"
            FileUploader[FileUploader]
        end
        
        subgraph "Services Layer"
            CandidateService[candidateService.js]
            APIConfig[api.ts]
        end
    end
    
    App --> Dashboard
    Dashboard --> Positions
    Positions --> PositionDetails
    PositionDetails --> StageColumn
    StageColumn --> CandidateCard
    CandidateCard --> CandidateDetails
    
    Dashboard --> AddForm
    AddForm --> FileUploader
    
    AddForm --> CandidateService
    CandidateDetails --> CandidateService
    PositionDetails --> CandidateService
    CandidateService --> APIConfig
    
    APIConfig -->|HTTP| Backend[Backend API]
```

## Modelo de dominio (DDD)

```mermaid
classDiagram
    class Candidate {
        +id: number
        +firstName: string
        +lastName: string
        +email: string
        +phone: string
        +address: string
        +save()
        +findOne(id)
    }
    
    class Education {
        +id: number
        +institution: string
        +title: string
        +startDate: Date
        +endDate: Date
        +candidateId: number
        +save()
    }
    
    class WorkExperience {
        +id: number
        +company: string
        +position: string
        +description: string
        +startDate: Date
        +endDate: Date
        +candidateId: number
        +save()
    }
    
    class Resume {
        +id: number
        +filePath: string
        +fileType: string
        +uploadDate: Date
        +candidateId: number
        +save()
    }
    
    class Position {
        +id: number
        +title: string
        +description: string
        +status: string
        +isVisible: boolean
        +companyId: number
        +interviewFlowId: number
        +findAll()
    }
    
    class Application {
        +id: number
        +positionId: number
        +candidateId: number
        +applicationDate: Date
        +currentInterviewStep: number
        +notes: string
        +save()
        +findOneByPositionCandidateId()
    }
    
    class Interview {
        +id: number
        +applicationId: number
        +interviewStepId: number
        +employeeId: number
        +interviewDate: Date
        +result: string
        +score: number
        +notes: string
    }
    
    class InterviewFlow {
        +id: number
        +description: string
    }
    
    class InterviewStep {
        +id: number
        +interviewFlowId: number
        +interviewTypeId: number
        +name: string
        +orderIndex: number
    }
    
    Candidate "1" --> "*" Education : has
    Candidate "1" --> "*" WorkExperience : has
    Candidate "1" --> "*" Resume : has
    Candidate "1" --> "*" Application : applies
    
    Position "1" --> "*" Application : receives
    Position "*" --> "1" InterviewFlow : uses
    
    InterviewFlow "1" --> "*" InterviewStep : contains
    
    Application "*" --> "1" InterviewStep : current
    Application "1" --> "*" Interview : has
    
    Interview "*" --> "1" InterviewStep : for
```

## Diagrama de estados - Candidato en proceso

```mermaid
stateDiagram-v2
    [*] --> Applied: Candidato aplica a posición
    
    Applied --> InitialScreening: Reclutador avanza
    
    InitialScreening --> TechnicalInterview: Pasa screening
    InitialScreening --> Rejected: Falla screening
    
    TechnicalInterview --> ManagerInterview: Pasa técnica
    TechnicalInterview --> Rejected: Falla técnica
    
    ManagerInterview --> Offer: Pasa con manager
    ManagerInterview --> Rejected: Falla con manager
    
    Offer --> Hired: Acepta oferta
    Offer --> Rejected: Rechaza oferta
    
    Rejected --> [*]
    Hired --> [*]
    
    note right of Rejected
        Estados finales:
        - Rejected (múltiples caminos)
        - Hired
    end note
    
    note left of Applied
        Estado inicial:
        - Application creada
        - currentInterviewStep = 1
    end note
```

## Diagrama de secuencia - Actualizar etapa de candidato

```mermaid
sequenceDiagram
    actor R as Reclutador
    participant UI as Frontend
    participant API as Backend API
    participant S as candidateService
    participant M as Application Model
    participant DB as PostgreSQL
    
    R->>UI: Drag candidate to new stage
    UI->>UI: Obtiene IDs (candidateId, applicationId, newStepId)
    UI->>API: PUT /candidates/:id<br/>{applicationId, currentInterviewStep}
    
    API->>S: updateCandidateStage(id, appId, stepId)
    S->>M: Application.findOneByPositionCandidateId(appId, id)
    M->>DB: SELECT * FROM Application WHERE...
    DB-->>M: application data
    M-->>S: application instance
    
    alt Application found
        S->>M: application.currentInterviewStep = stepId
        S->>M: application.save()
        M->>DB: UPDATE Application SET currentInterviewStep...
        DB-->>M: success
        M-->>S: updated application
        S-->>API: application
        API-->>UI: 200 {message, data}
        UI-->>R: Candidato movido a nueva etapa
    else Application not found
        M-->>S: null
        S-->>API: throw Error("Application not found")
        API-->>UI: 404 {error}
        UI-->>R: Error: Aplicación no encontrada
    end
```

## Diagrama de deployment (actual)

```mermaid
graph TB
    subgraph "Developer Machine"
        subgraph "Frontend Dev"
            ReactDev[React Dev Server<br/>localhost:3000]
        end
        
        subgraph "Backend Dev"
            ExpressDev[Express Server<br/>localhost:3010<br/>ts-node-dev]
        end
        
        subgraph "Docker"
            Postgres[PostgreSQL<br/>localhost:5432]
        end
        
        subgraph "File System"
            Uploads[/uploads<br/>CVs storage]
        end
    end
    
    ReactDev -->|HTTP| ExpressDev
    ExpressDev -->|Prisma| Postgres
    ExpressDev -->|Multer| Uploads
    
    style ReactDev fill:#61dafb
    style ExpressDev fill:#90c53f
    style Postgres fill:#336791
```

## Diagrama de deployment (propuesto para producción)

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "CloudFront CDN"
            CDN[Static Assets<br/>React Build]
        end
        
        subgraph "Application Load Balancer"
            ALB[ALB<br/>SSL Termination]
        end
        
        subgraph "EC2 Auto Scaling Group"
            Backend1[Backend Instance 1<br/>Node.js + Express]
            Backend2[Backend Instance 2<br/>Node.js + Express]
            Backend3[Backend Instance N...]
        end
        
        subgraph "RDS"
            PG[PostgreSQL<br/>Multi-AZ]
            Replica[Read Replica]
        end
        
        subgraph "S3"
            S3Files[S3 Bucket<br/>CVs Storage]
        end
        
        subgraph "ElastiCache"
            Redis[Redis<br/>Session + Cache]
        end
    end
    
    Users[Users] -->|HTTPS| CDN
    CDN -->|API calls| ALB
    ALB --> Backend1
    ALB --> Backend2
    ALB --> Backend3
    
    Backend1 -->|Write| PG
    Backend1 -->|Read| Replica
    Backend2 -->|Write| PG
    Backend2 -->|Read| Replica
    Backend3 -->|Write| PG
    Backend3 -->|Read| Replica
    
    Backend1 --> S3Files
    Backend2 --> S3Files
    Backend3 --> S3Files
    
    Backend1 --> Redis
    Backend2 --> Redis
    Backend3 --> Redis
    
    style CDN fill:#FF9900
    style ALB fill:#FF9900
    style PG fill:#336791
    style S3Files fill:#FF9900
    style Redis fill:#DC382D
```

## Diagrama de base de datos (simplificado)

Ver `backend/ModeloDatos.md` para diagrama ERD completo.

Resumen de relaciones clave:

```
Candidate (1) ──< (N) Education
Candidate (1) ──< (N) WorkExperience
Candidate (1) ──< (N) Resume
Candidate (1) ──< (N) Application

Position (1) ──< (N) Application
Position (N) ──> (1) InterviewFlow
Position (N) ──> (1) Company

InterviewFlow (1) ──< (N) InterviewStep

Application (N) ──> (1) InterviewStep [current]
Application (1) ──< (N) Interview

Interview (N) ──> (1) InterviewStep
Interview (N) ──> (1) Employee

Company (1) ──< (N) Employee
```

## Diagrama de flujo - Proceso completo de reclutamiento

```mermaid
flowchart TD
    Start([Candidato aplica]) --> CheckCV{¿Tiene CV?}
    
    CheckCV -->|No| UploadCV[Reclutador sube CV]
    CheckCV -->|Sí| CreateCandidate[Crear Candidate en sistema]
    UploadCV --> CreateCandidate
    
    CreateCandidate --> CreateApplication[Crear Application<br/>asociada a Position]
    CreateApplication --> SetInitialStage[currentInterviewStep = 1]
    
    SetInitialStage --> Screening[Etapa: Initial Screening]
    
    Screening --> EvalScreening{¿Pasa?}
    EvalScreening -->|No| Reject[Marcar como rechazado]
    EvalScreening -->|Sí| Technical[Etapa: Technical Interview]
    
    Technical --> CreateInterview1[Crear Interview<br/>con score y notes]
    CreateInterview1 --> EvalTechnical{¿Pasa?}
    EvalTechnical -->|No| Reject
    EvalTechnical -->|Sí| Manager[Etapa: Manager Interview]
    
    Manager --> CreateInterview2[Crear Interview<br/>con score y notes]
    CreateInterview2 --> EvalManager{¿Pasa?}
    EvalManager -->|No| Reject
    EvalManager -->|Sí| Offer[Generar Offer]
    
    Offer --> AcceptOffer{¿Acepta?}
    AcceptOffer -->|No| Reject
    AcceptOffer -->|Sí| Hire[Marcar como Hired]
    
    Reject --> End1([Fin del proceso])
    Hire --> End2([Fin del proceso])
    
    style CreateCandidate fill:#90EE90
    style CreateApplication fill:#90EE90
    style CreateInterview1 fill:#FFD700
    style CreateInterview2 fill:#FFD700
    style Reject fill:#FF6B6B
    style Hire fill:#4CAF50
```

---

**Nota sobre diagramas**: Los diagramas usan sintaxis Mermaid. Para visualizarlos:
1. GitHub los renderiza automáticamente en Markdown
2. VSCode con extensión "Markdown Preview Mermaid Support"
3. [Mermaid Live Editor](https://mermaid.live/)

**Limitación**: Algunos diagramas C4 pueden no renderizarse correctamente en todas las herramientas. Para diagramas C4 completos, considerar usar [Structurizr](https://structurizr.com/) o [PlantUML](https://plantuml.com/).
