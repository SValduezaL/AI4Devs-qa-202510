# API Interfaces - LTI Talent Tracking System

## Base URL

**Development**: `http://localhost:3010`  
**Production**: TBD (según deployment)

## Autenticación

❌ **NO implementada** - Todos los endpoints son públicos

## Endpoints

### POST /candidates

Crea un nuevo candidato con toda su información.

**Request**:
```json
{
  "firstName": "string (2-50 chars, solo letras)",
  "lastName": "string (2-50 chars, solo letras)",
  "email": "string (formato email, único)",
  "phone": "string (formato internacional, opcional)",
  "address": "string (max 100 chars, opcional)",
  "educations": [
    {
      "institution": "string (max 100 chars)",
      "title": "string (max 100 chars)",
      "startDate": "string (YYYY-MM-DD)",
      "endDate": "string (YYYY-MM-DD, opcional)"
    }
  ],
  "workExperiences": [
    {
      "company": "string (max 100 chars)",
      "position": "string (max 100 chars)",
      "description": "string (max 200 chars, opcional)",
      "startDate": "string (YYYY-MM-DD)",
      "endDate": "string (YYYY-MM-DD, opcional)"
    }
  ],
  "cv": {
    "filePath": "string (path devuelto por /upload)",
    "fileType": "string (MIME type)"
  }
}
```

**Response 201**:
```json
{
  "id": 123,
  "firstName": "Albert",
  "lastName": "Saelices",
  "email": "albert@example.com",
  ...
}
```

**Errores**:
- 400: Validación falla
- 400: Email duplicado ("Email already exists")
- 500: Error de servidor

---

### GET /candidates/:id

Obtiene candidato completo con todas sus relaciones.

**Response 200**:
```json
{
  "id": 123,
  "firstName": "Albert",
  "lastName": "Saelices",
  "email": "albert@example.com",
  "phone": "656874937",
  "address": "Calle...",
  "educations": [...],
  "workExperiences": [...],
  "resumes": [...],
  "applications": [
    {
      "id": 1,
      "position": {"id": 1, "title": "Senior Engineer"},
      "applicationDate": "2026-01-15T...",
      "currentInterviewStep": 2,
      "interviews": [
        {
          "interviewDate": "2026-01-16T...",
          "interviewStep": {"name": "Initial Screening"},
          "score": 5,
          "notes": "Excellent candidate"
        }
      ]
    }
  ]
}
```

**Errores**:
- 404: Candidato no encontrado
- 500: Error de servidor

---

### PUT /candidates/:id

Actualiza etapa de entrevista de candidato.

**Request**:
```json
{
  "applicationId": 1,
  "currentInterviewStep": 3
}
```

**Response 200**:
```json
{
  "message": "Candidate stage updated",
  "data": {
    "id": 1,
    "positionId": 1,
    "candidateId": 123,
    "applicationDate": "...",
    "currentInterviewStep": 3,
    "notes": null,
    "interviews": [...]
  }
}
```

**Errores**:
- 400: Validación falla
- 404: Application no encontrada
- 500: Error

---

### POST /upload

Sube archivo (CV).

**Request**: `multipart/form-data` con campo `file`

**Response 200**:
```json
{
  "filePath": "uploads/1737296400000-cv.pdf",
  "fileType": "application/pdf"
}
```

**Errores**:
- 400: Tipo de archivo inválido (solo PDF/DOCX)
- 500: Error al guardar archivo

---

### GET /positions

Lista todas las posiciones visibles.

**Response 200**:
```json
[
  {
    "id": 1,
    "title": "Senior Full-Stack Engineer",
    "isVisible": true,
    ...
  }
]
```

---

### GET /positions/:id/candidates

Obtiene candidatos de una posición agrupables por etapa.

**Response 200**:
```json
[
  {
    "fullName": "John Doe",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4.5
  }
]
```

---

### GET /positions/:id/interviewflow

Obtiene flujo de entrevista de posición.

**Response 200**:
```json
{
  "positionName": "Senior Full-Stack Engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development...",
    "interviewSteps": [
      {
        "id": 1,
        "name": "Initial Screening",
        "orderIndex": 1,
        "interviewTypeId": 1
      },
      {
        "id": 2,
        "name": "Technical Interview",
        "orderIndex": 2,
        "interviewTypeId": 2
      }
    ]
  }
}
```

---

**Ver api-spec.yaml completo en**: `backend/api-spec.yaml`
