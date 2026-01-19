# Testing Strategy

## Estado actual

### Backend
- **Framework**: Jest + ts-jest
- **Archivos test**: 4 encontrados
  - `candidateService.test.ts` ✅
  - `candidateController.test.ts` ⚠️
  - `positionService.test.ts` ⚠️
  - `positionController.test.ts` ⚠️
- **Cobertura**: <30% estimado
- **Comando**: `npm test`

### Frontend
- **Framework**: Jest + React Testing Library
- **Archivos test**: 0 encontrados ❌
- **Comando**: `npm test`

## Ejecutar tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Qué falta

- Tests de modelos
- Tests de validators
- Tests de fileUploadService
- Tests de frontend (todos)
- E2E tests (ninguno)
- Tests con mocks de BD

**Ver progress.md para backlog de testing**
