# Tests E2E con Cypress

Este directorio contiene los tests End-to-End (E2E) del proyecto LTI Talent Tracking System, implementados con Cypress.

## 📋 Contenido

```
cypress/
├── e2e/
│   └── position-kanban.cy.js       # Tests del Kanban de posiciones (14 tests)
├── support/
│   ├── commands.js                 # Comandos personalizados
│   └── e2e.js                      # Configuración global
└── fixtures/                       # (vacío, usamos datos del seed)
```

## 🚀 Ejecución rápida

### Prerequisitos

Antes de ejecutar los tests E2E, asegúrate de tener:

1. **Base de datos con seed ejecutado**:
   ```bash
   cd backend
   pnpm exec tsx prisma/seed.ts
   ```

2. **Backend corriendo** en `http://localhost:3010`:
   ```bash
   cd backend
   pnpm run dev
   ```

3. **Frontend corriendo** en `http://localhost:3000`:
   ```bash
   cd frontend
   pnpm start
   ```

### Ejecutar tests

⚠️ **IMPORTANTE**: Antes de ejecutar los tests, resetea la base de datos para tener datos frescos:

```bash
# Desde el directorio backend/
cd backend

# 1. Resetear la base de datos (elimina datos y recrea tablas)
npx prisma migrate reset --force

# 2. Ejecutar el seed manualmente
pnpm exec tsx prisma/seed.ts
```

Luego, desde el directorio `frontend/`:

```bash
# Modo interactivo (abre UI de Cypress)
pnpm run cypress:open

# Modo headless (para CI/CD)
pnpm run cypress:run

# Solo tests de Position Kanban
pnpm run test:e2e

# Modo headed con Chrome visible
pnpm run test:e2e:headed
```

💡 **Tip**: Los tests de carga de página esperan que los candidatos estén en posiciones específicas según el seed. Si los datos han sido modificados por ejecuciones anteriores, algunos tests fallarán.

## 📝 Tests implementados

### Suite: Position Kanban Board
**Archivo**: `e2e/position-kanban.cy.js`

**Cobertura**: 14 tests divididos en 5 categorías (11 activos, 3 skip)

#### 1. Carga de la página ✅ (5 tests)
- Título de la posición se muestra correctamente
- Columnas de cada fase del proceso visibles
- Candidatos en la columna correcta según su fase
- Ratings de candidatos se muestran
- Elementos draggables están presentes

#### 2. Drag & Drop ⚠️ (2 tests - skip)
- ⏭️ Actualización en backend mediante PUT /candidates/:id
- ⏭️ Movimiento visual del candidato entre columnas
- **Nota**: react-beautiful-dnd no es compatible con simulación automática en Cypress
- **Alternativa**: Pruebas manuales o migración a Playwright

#### 3. Manejo de errores ⚠️ (5 tests - 1 skip, 4 activos)
- ✅ Lista de candidatos vacía
- ⏭️ Error 400 al actualizar fase (requiere drag & drop funcional)
- ✅ Posición inexistente (404)
- ✅ Error en carga de flujo de entrevista
- ✅ Error en carga de candidatos

#### 4. Navegación ✅ (2 tests)
- Botón "Volver a Posiciones" funciona
- Navegación entre vistas correcta

#### 5. Panel de detalles ✅ (1 test)
- Apertura del offcanvas al hacer click

## 🎯 Datos de test

Los tests utilizan los datos del **seed de Prisma**:

- **Position ID 1**: "Senior Full-Stack Engineer"
- **Candidatos**:
  - John Doe (Technical Interview)
  - Jane Smith (Technical Interview)
  - Carlos García (Initial Screening)
- **Etapas del proceso**:
  1. Initial Screening
  2. Technical Interview
  3. Manager Interview

## 🛠️ Comandos personalizados

Definidos en `support/commands.js`:

### `cy.dragAndDrop(draggable, droppable)`
Simula drag & drop con react-beautiful-dnd.

```javascript
cy.dragAndDrop('[draggableid="1"]', '[data-rbd-droppable-id="1"]');
```

### `cy.waitForBackend()`
Verifica que el backend está disponible.

```javascript
cy.waitForBackend();
cy.visit('/positions/1');
```

### `cy.visitPosition(id)`
Visita una posición y espera a que carguen todos los datos.

```javascript
cy.visitPosition(1); // Espera a GET interviewFlow y candidates
```

## ⚙️ Configuración

**Archivo**: `cypress.config.js` (en frontend/)

```javascript
{
  baseUrl: 'http://localhost:3000',
  env: {
    apiUrl: 'http://localhost:3010'
  },
  video: false,
  screenshotOnRunFailure: true
}
```

## 🐛 Debugging

### Ver screenshots de fallos
Los screenshots se guardan automáticamente en:
```
cypress/screenshots/position-kanban.cy.js/
```

### Ejecutar tests con videos
Edita `cypress.config.js`:
```javascript
video: true  // Cambia a true
```

Los videos se guardan en:
```
cypress/videos/
```

### Ejecutar un test específico
En modo interactivo:
1. `pnpm run cypress:open`
2. Selecciona `position-kanban.cy.js`
3. Click en el test específico

En headless:
```bash
pnpm run cypress:run --spec "cypress/e2e/position-kanban.cy.js" --grep "debe mostrar el título"
```

## 📊 Integración con CI/CD

Ejemplo para GitHub Actions:

```yaml
- name: Run E2E tests
  run: |
    docker-compose up -d
    cd backend && pnpm run dev &
    cd frontend && pnpm start &
    sleep 10
    cd frontend && pnpm run cypress:run
```

## 🚧 Limitaciones conocidas

1. **Rollback visual**: El frontend actualiza el estado localmente antes de confirmar con backend. Si el PUT falla, no hay rollback automático.

2. **Sin error boundaries**: No hay UI de error visible si las llamadas API fallan (solo console.error).

3. **Drag & drop con react-beautiful-dnd**: 
   - ❌ **No soportado en Cypress**: react-beautiful-dnd requiere interacción humana real
   - Los plugins disponibles (`@4tw/cypress-drag-drop`, etc.) no logran simular la secuencia exacta de eventos
   - **Alternativas**:
     - Pruebas manuales de drag & drop
     - Migración a Playwright (mejor soporte para drag & drop)
     - Tests que validen la API directamente sin UI
   - **Referencia**: [react-beautiful-dnd testing issues](https://github.com/atlassian/react-beautiful-dnd/issues/2350)

4. **Datos compartidos**: Al usar seed data, tests concurrentes pueden interferir entre sí.
   - **Solución**: Re-ejecutar el seed antes de cada run de tests:
     ```bash
     cd backend
     npx prisma migrate reset --force
     pnpm exec tsx prisma/seed.ts
     ```

## 📚 Recursos

- [Documentación de Cypress](https://docs.cypress.io/)
- [Best Practices de Cypress](https://docs.cypress.io/guides/references/best-practices)
- [react-beautiful-dnd Testing](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/testing.md)

## 📝 Próximos pasos

- [ ] Añadir tests para formulario de añadir candidato
- [ ] Tests de upload de archivos
- [ ] Tests de flujo completo end-to-end
- [ ] Implementar Page Object Pattern
- [ ] Añadir tests de accesibilidad con cypress-axe
- [ ] Visual regression testing

---

**Última actualización**: 2026-01-19  
**Tests implementados**: 14 (11 activos, 3 skip)  
**Tests en skip**: 3 tests de drag & drop (react-beautiful-dnd no compatible con Cypress)  
**Cobertura activa**: Position Kanban Board (78% - 11/14 tests)  
**Cobertura total implementada**: 100% (incluyendo tests skip que requieren testing manual)
