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

### E2E Tests ⚠️ **PARCIAL**
- **Framework**: Cypress 15.9.0
- **Archivos test**: 1 suite implementada
  - `cypress/e2e/position-kanban.cy.js` ⚠️ (14 tests: 11 activos ✅, 3 skip ⏭️)
- **Cobertura activa**: Position Kanban Board (78% - 11/14 tests)
- **Plugin instalado**: `@4tw/cypress-drag-drop` ⚠️ (no resuelve incompatibilidad)
- **Comandos**:
  - `pnpm run cypress:open` - Modo interactivo
  - `pnpm run cypress:run` - Modo headless
  - `pnpm run test:e2e` - Ejecutar suite específica
- **Limitación conocida**: react-beautiful-dnd incompatible con Cypress automático

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

### Drag & Drop con react-beautiful-dnd ❌

**Problema descubierto** (2026-01-19):
- react-beautiful-dnd **no puede automatizarse** en Cypress
- La librería requiere interacción humana real para funcionar correctamente
- Los eventos sintéticos de mouse/drag no son reconocidos por la librería

**Plugins probados sin éxito**:
1. `@4tw/cypress-drag-drop` (v2.3.1) ❌
   - Instalado y configurado correctamente
   - Genera eventos de mouse/drag pero react-beautiful-dnd los ignora
   - Es una limitación de la librería, no del plugin

2. Eventos nativos de Cypress ❌
   - `trigger('mousedown')`, `trigger('dragstart')`, etc.
   - Mismos resultados negativos

**Impacto**:
- 3 tests marcados como `.skip()`:
  1. Test de actualización en backend mediante PUT
  2. Test de movimiento visual del candidato
  3. Test de manejo de error 400 al actualizar fase
- Cobertura E2E efectiva: 78% (11/14 tests)

**Alternativas evaluadas**:

| Alternativa | Estado | Pros | Contras |
|------------|--------|------|---------|
| Pruebas manuales | ✅ Funciona | Simple, verifica comportamiento real | No automatizable, requiere tiempo QA |
| Playwright | 🔶 No implementado | Mejor soporte para drag & drop | Requiere migración de tests |
| Tests de API | 🔶 No implementado | Valida lógica sin UI | No verifica interacción UI |
| Puppeteer | 🔶 No evaluado | Posible mejor soporte | Similar a Cypress en limitaciones |

**Decisión tomada**:
- Mantener tests en `.skip()` con comentarios explicativos
- Documentar limitación en README y Memory Bank
- Continuar con pruebas manuales de drag & drop
- Evaluar migración a Playwright si drag & drop testing se vuelve crítico

**Referencia**:
- [react-beautiful-dnd issue #2350](https://github.com/atlassian/react-beautiful-dnd/issues/2350)

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

- **2026-01-19 (sesión 3)**: Hallazgos sobre incompatibilidad de react-beautiful-dnd
  - ❌ Descubierto que react-beautiful-dnd no puede automatizarse en Cypress
  - Probado plugin `@4tw/cypress-drag-drop` (no efectivo)
  - 3 tests marcados como `.skip()` con explicaciones
  - Documentadas alternativas y limitaciones
  - Añadidas instrucciones para resetear BD antes de tests

- **2026-01-19 (sesión 2)**: Implementados tests E2E con Cypress para Position Kanban Board
  - Suite completa de happy path y manejo de errores (14 tests)
  - Comandos personalizados para drag & drop con react-beautiful-dnd
  - Configuración de Cypress optimizada para CI/CD
  - Scripts añadidos a package.json

**Ver progress.md para backlog completo de testing**
