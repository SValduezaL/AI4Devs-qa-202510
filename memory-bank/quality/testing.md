# Testing Strategy

## Estado actual

### Backend (Tests Unitarios)
- **Framework**: Jest + ts-jest
- **Archivos test**: 4 encontrados
  - `candidateService.test.ts` ✅
  - `candidateController.test.ts` ⚠️
  - `positionService.test.ts` ⚠️
  - `positionController.test.ts` ⚠️
- **Cobertura**: <30% estimado
- **Comando**: `pnpm test`

### Frontend (Tests Unitarios)
- **Framework**: Jest + React Testing Library
- **Archivos test**: 0 encontrados ❌
- **Comando**: `pnpm test`

### E2E Tests ✅ **NUEVO**
- **Framework**: Cypress 15.9.0
- **Archivos test**: 1 suite implementada
  - `cypress/e2e/position-kanban.cy.js` ✅ (14 tests)
- **Cobertura**: Position Kanban Board completo
- **Comandos**:
  - `pnpm run cypress:open` - Modo interactivo
  - `pnpm run cypress:run` - Modo headless
  - `pnpm run test:e2e` - Ejecutar suite específica

## Ejecutar tests

### Backend (Unitarios)
```bash
cd backend
pnpm test                    # Todos los tests
pnpm test -- candidateService  # Test específico
pnpm test -- --coverage      # Con cobertura
```

### Frontend (Unitarios)
```bash
cd frontend
pnpm test
```

### E2E Tests (Cypress)

**Prerrequisitos**:
1. Base de datos con seed ejecutado
2. Backend corriendo en `http://localhost:3010`
3. Frontend corriendo en `http://localhost:3000`

**Comandos**:
```bash
# Desde directorio frontend/

# Modo interactivo (con UI de Cypress)
pnpm run cypress:open

# Modo headless (para CI/CD)
pnpm run cypress:run

# Ejecutar solo tests de Position Kanban
pnpm run test:e2e

# Modo headed con Chrome (ver el navegador)
pnpm run test:e2e:headed
```

## Tests E2E Implementados

### Suite: Position Kanban Board
**Archivo**: `frontend/cypress/e2e/position-kanban.cy.js`

**Escenarios cubiertos**:

#### 1. Carga de la página (5 tests)
- ✅ Verifica título de la posición ("Senior Full-Stack Engineer")
- ✅ Verifica 3 columnas de fases (Initial Screening, Technical Interview, Manager Interview)
- ✅ Verifica candidatos en columna correcta según su fase actual
- ✅ Verifica visualización de ratings de candidatos
- ✅ Verifica elementos draggables renderizados

#### 2. Cambio de fase mediante Drag & Drop (2 tests)
- ✅ Verifica actualización en backend mediante `PUT /candidates/:id`
- ✅ Verifica movimiento visual del candidato entre columnas
- ✅ Valida estructura del request body (applicationId, currentInterviewStep)
- ✅ Valida respuesta 200 del backend

#### 3. Manejo de errores (5 tests)
- ✅ Candidatos vacíos (mock de lista vacía)
- ✅ Error 400 al actualizar fase
- ✅ Posición inexistente (404)
- ✅ Error 500 en carga de flujo de entrevista
- ✅ Error 500 en carga de candidatos

#### 4. Navegación (2 tests)
- ✅ Botón "Volver a Posiciones" visible
- ✅ Navegación correcta a lista de posiciones

#### 5. Interacción con detalles (1 test)
- ✅ Apertura del panel lateral (offcanvas) al click en tarjeta

**Total**: 14 tests E2E

### Datos de test utilizados
- **Position ID 1**: "Senior Full-Stack Engineer" (del seed)
- **Candidatos**: John Doe, Jane Smith, Carlos García
- **Etapas**: Initial Screening, Technical Interview, Manager Interview

### Comandos personalizados (Cypress)
Definidos en `frontend/cypress/support/commands.js`:

- `cy.dragAndDrop(draggable, droppable)` - Simula drag & drop con react-beautiful-dnd
- `cy.waitForBackend()` - Verifica disponibilidad del backend
- `cy.visitPosition(id)` - Visita posición y espera carga completa

## Estructura de archivos de testing

```
frontend/
├── cypress/
│   ├── e2e/
│   │   └── position-kanban.cy.js       # Tests E2E del Kanban
│   ├── support/
│   │   ├── commands.js                 # Comandos personalizados
│   │   └── e2e.js                      # Setup global
│   └── fixtures/                       # (vacío, usa seed data)
├── cypress.config.js                   # Configuración Cypress
└── src/
    └── (sin tests unitarios aún)

backend/
└── src/
    ├── application/services/
    │   ├── candidateService.test.ts    ✅
    │   └── positionService.test.ts     ⚠️
    └── presentation/controllers/
        ├── candidateController.test.ts ⚠️
        └── positionController.test.ts  ⚠️
```

## Configuración de Cypress

**Archivo**: `frontend/cypress.config.js`

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      apiUrl: 'http://localhost:3010'
    }
  }
}
```

## Qué falta

### Backend
- Tests de modelos de dominio
- Tests de validators
- Tests de fileUploadService
- Completar cobertura de controllers
- Tests con mocks de BD (actualmente usa BD real)

### Frontend
- Tests unitarios de componentes (React Testing Library)
- Tests de servicios (candidateService.js)
- Tests de hooks personalizados (si existen)

### E2E
- Tests de formulario "Añadir Candidato"
- Tests de lista de posiciones
- Tests de detalles de candidato completo
- Tests de upload de archivos
- Tests de flujo completo (añadir candidato → asignar a posición → mover entre fases)

## Métricas de cobertura

### Actual
- **Backend Unitarios**: ~20-30%
- **Frontend Unitarios**: 0%
- **E2E**: Position Kanban Board (100%), otros flujos (0%)

### Objetivo recomendado
- **Backend Unitarios**: >80%
- **Frontend Unitarios**: >70%
- **E2E**: Flujos críticos cubiertos (3-5 flujos principales)

## Integración con CI/CD

### Comandos para CI/CD
```bash
# En pipeline de CI/CD (GitHub Actions, GitLab CI, etc.)

# Tests unitarios backend
cd backend && pnpm test -- --coverage --watchAll=false

# Tests unitarios frontend
cd frontend && pnpm test -- --coverage --watchAll=false

# Tests E2E (requiere backend y frontend corriendo)
# 1. Iniciar servicios
docker-compose up -d
cd backend && pnpm run dev &
cd frontend && pnpm start &

# 2. Esperar a que estén listos
sleep 10

# 3. Ejecutar tests E2E
cd frontend && pnpm run cypress:run
```

### Artefactos generados
- `backend/coverage/` - Reportes de cobertura Jest
- `frontend/cypress/screenshots/` - Screenshots de fallos
- `frontend/cypress/videos/` - Videos de ejecución (si está habilitado)

**Nota**: Estos directorios están en `.gitignore`

## Mejoras futuras

### Corto plazo
1. Completar tests unitarios de backend (services y controllers)
2. Añadir tests unitarios de frontend (componentes críticos)
3. Configurar GitHub Actions para ejecutar tests en cada PR

### Medio plazo
4. Implementar Page Object Pattern en tests E2E
5. Añadir tests de accesibilidad (cypress-axe)
6. Configurar test coverage reporting (Codecov, Coveralls)
7. Añadir tests E2E para flujos completos

### Largo plazo
8. Visual regression testing (Percy, Applitools)
9. Performance testing con Lighthouse CI
10. Contract testing para API (Pact)

## Changelog

- **2026-01-19**: Implementados tests E2E con Cypress para Position Kanban Board (14 tests)
  - Suite completa de happy path y manejo de errores
  - Comandos personalizados para drag & drop con react-beautiful-dnd
  - Configuración de Cypress optimizada para CI/CD
  - Scripts añadidos a package.json

**Ver progress.md para backlog completo de testing**
