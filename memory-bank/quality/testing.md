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

### E2E Tests ✅ **MIGRADO A PLAYWRIGHT**
- **Framework**: Playwright 1.57.0 ✅ (migrado desde Cypress)
- **Archivos test**: 1 suite implementada
  - `playwright/tests/position-kanban.spec.ts` ✅ (15 tests: 100% activos)
- **Cobertura**: Position Kanban Board (100% - 15/15 tests)
- **Utilidades**: `PositionKanbanHelpers` class con drag & drop avanzado
- **Comandos**:
  - `pnpm run test:e2e:pw` - Modo headless
  - `pnpm run test:e2e:pw:ui` - Modo interactivo
  - `pnpm run test:e2e:pw:headed` - Ver navegador
  - `pnpm run test:e2e:pw:debug` - Debug paso a paso
  - `pnpm run test:e2e:pw:report` - Ver reporte HTML
- **Ventaja clave**: Drag & drop funciona con react-beautiful-dnd ✅
- **Cypress**: Deprecado (pendiente eliminación)

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

#### 2. Cambio de fase mediante Drag & Drop (2 tests) ⚠️ **SKIP**
- ⏭️ Verifica actualización en backend mediante `PUT /candidates/:id` - **SKIP**
- ⏭️ Verifica movimiento visual del candidato entre columnas - **SKIP**
- **Motivo**: react-beautiful-dnd requiere interacción humana real
- **Estado**: Tests implementados pero marcados como `.skip()`
- **Alternativas**: Pruebas manuales, Playwright, tests de API directos

#### 3. Manejo de errores (5 tests: 4 activos ✅, 1 skip ⏭️)
- ✅ Candidatos vacíos (mock de lista vacía)
- ⏭️ Error 400 al actualizar fase (requiere drag & drop funcional) - **SKIP**
- ✅ Posición inexistente (404)
- ✅ Error 500 en carga de flujo de entrevista
- ✅ Error 500 en carga de candidatos

#### 4. Navegación (2 tests)
- ✅ Botón "Volver a Posiciones" visible
- ✅ Navegación correcta a lista de posiciones

#### 5. Interacción con detalles (1 test)
- ✅ Apertura del panel lateral (offcanvas) al click en tarjeta

**Total**: 14 tests E2E (11 activos ✅, 3 skip ⏭️)  
**Cobertura efectiva**: 78%

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
- **E2E**: Position Kanban Board (78% activos - 11/14 tests pasan, 3 skip por incompatibilidad drag & drop), otros flujos (0%)

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

## Limitaciones conocidas de testing

### Drag & Drop con react-beautiful-dnd ✅ **RESUELTO CON PLAYWRIGHT**

**Problema original con Cypress** (2026-01-19):
- react-beautiful-dnd **no podía automatizarse** en Cypress
- La librería requería eventos de puntero precisos que Cypress no podía generar
- Los eventos sintéticos de mouse/drag no eran reconocidos

**Solución implementada** (2026-01-19):
- ✅ **Migración completa a Playwright**
- Playwright tiene control de bajo nivel sobre eventos del navegador
- Técnica de movimiento incremental en pasos funciona con react-beautiful-dnd
- Los 3 tests que estaban en skip ahora pasan correctamente

**Cómo funciona en Playwright**:
```typescript
// Mover mouse en pasos incrementales (crítico para react-beautiful-dnd)
for (let i = 1; i <= steps; i++) {
  const x = sourceX + (destX - sourceX) * (i / steps);
  const y = sourceY + (destY - sourceY) * (i / steps);
  await page.mouse.move(x, y);
  await page.waitForTimeout(50);
}
```

**Resultado**:
- ✅ 3 tests de drag & drop funcionando al 100%
- ✅ 15/15 tests E2E pasan (con seed fresco)
- ✅ Cobertura E2E: 100% del Position Kanban

**Lecciones aprendidas**:
1. No todas las herramientas E2E son equivalentes para casos específicos
2. react-beautiful-dnd funciona mejor con Playwright que con Cypress
3. Control manual del mouse es esencial para librerías DnD complejas

---

## Prerequisitos para ejecutar tests E2E

⚠️ **IMPORTANTE**: Los tests E2E requieren datos frescos del seed.

### Antes de cada ejecución completa de tests:

```bash
# 1. Resetear la base de datos (desde backend/)
cd backend
npx prisma migrate reset --force

# 2. Ejecutar el seed manualmente
pnpm exec tsx prisma/seed.ts

# Nota: prisma migrate reset elimina datos y recrea tablas,
# pero NO ejecuta el seed automáticamente (no está configurado en package.json)
```

**¿Por qué es necesario?**
- Los tests de carga de página esperan candidatos en posiciones específicas
- Si los datos han sido modificados por ejecuciones anteriores, los tests fallarán
- Ejemplo: "Carlos García" debe estar en "Initial Screening" según el seed

**Síntoma de datos desactualizados**:
```
AssertionError: expected '<div.mb-4.card>' to contain 'Carlos García'
```

---

## Changelog

- **2026-01-19 (sesión 4 - tarde)**: Migración completa a Playwright
  - ✅ Migrados 14 tests de Cypress a Playwright
  - ✅ Implementados 3 tests de drag & drop (antes en skip)
  - ✅ Creada clase `PositionKanbanHelpers` con método `dragAndDrop` avanzado
  - ✅ Configuración completa de Playwright (`playwright.config.ts`)
  - ✅ Scripts de package.json actualizados
  - ✅ Documentación en `frontend/playwright/README.md`
  - ✅ 15/15 tests pasando (requiere seed fresco)
  - Cypress deprecado (pendiente eliminación)

- **2026-01-19 (sesión 3)**: Hallazgos sobre incompatibilidad de react-beautiful-dnd con Cypress
  - ❌ Descubierto que react-beautiful-dnd no puede automatizarse en Cypress
  - Probado plugin `@4tw/cypress-drag-drop` (no efectivo)
  - 3 tests marcados como `.skip()` con explicaciones
  - Documentadas alternativas (motivó la migración a Playwright)
  - Añadidas instrucciones para resetear BD antes de tests

- **2026-01-19 (sesión 2)**: Implementados tests E2E con Cypress para Position Kanban Board
  - Suite completa de happy path y manejo de errores (14 tests)
  - Comandos personalizados para drag & drop con react-beautiful-dnd
  - Configuración de Cypress optimizada para CI/CD
  - Scripts añadidos a package.json

**Ver progress.md para backlog completo de testing**
