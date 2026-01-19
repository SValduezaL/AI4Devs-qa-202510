# Tests E2E con Playwright

## Descripción

Tests End-to-End del Position Kanban Board migrados desde Cypress a Playwright para poder automatizar los tests de drag & drop con react-beautiful-dnd.

**Mejora clave**: Playwright permite simular drag & drop real mediante control manual del mouse, lo que Cypress no podía hacer con react-beautiful-dnd.

## Ejecución

### Requisitos previos

**IMPORTANTE**: Antes de ejecutar los tests, asegúrate de tener:

1. **Backend corriendo** en `http://localhost:3010`
   ```bash
   cd backend
   pnpm run dev
   ```

2. **Base de datos reseteada con seed fresco**
   ```bash
   cd backend
   npx prisma migrate reset --force
   pnpm exec tsx prisma/seed.ts
   ```

3. **Navegadores de Playwright instalados** (solo primera vez)
   ```bash
   cd frontend
   pnpm exec playwright install chromium
   ```

### Comandos

```bash
# Desde el directorio frontend/

# Modo interactivo con UI (recomendado para desarrollo)
pnpm run test:e2e:pw:ui

# Modo headless (CI/CD)
pnpm run test:e2e:pw

# Ver navegador durante tests (headed mode)
pnpm run test:e2e:pw:headed

# Debug paso a paso con Playwright Inspector
pnpm run test:e2e:pw:debug

# Ver reporte HTML de última ejecución
pnpm run test:e2e:pw:report

# Ejecutar test específico por nombre
pnpm run test:e2e:pw -- -g "debe actualizar la fase"

# Ejecutar con mayor verbosidad
pnpm run test:e2e:pw -- --debug
```

### Auto-inicio de servidor (opcional)

Playwright puede iniciar automáticamente el frontend gracias a la configuración `webServer` en `playwright.config.ts`. Si prefieres controlar manualmente el servidor:

1. Comenta la sección `webServer` en `playwright.config.ts`
2. Inicia manualmente el frontend:
   ```bash
   cd frontend
   pnpm start
   ```

## Tests implementados

### Suite: Position Kanban Board (15 tests)

#### 1. Carga de página (5 tests) ✅
- Título de la posición se muestra correctamente
- Columnas de cada fase del proceso visibles
- Candidatos en la columna correcta según su fase
- Ratings de candidatos se muestran
- Elementos draggables están presentes

#### 2. Navegación (2 tests) ✅
- Botón "Volver a Posiciones" funciona
- Navegación entre vistas correcta

#### 3. Panel de detalles (1 test) ✅
- Apertura del offcanvas al hacer click

#### 4. Drag & Drop (3 tests) ✅ **NUEVO - Antes en skip en Cypress**
- Actualización en backend via PUT /candidates/:id
- Movimiento visual del candidato entre columnas
- Manejo de error 400 al actualizar fase

#### 5. Manejo de errores (4 tests) ✅
- Lista de candidatos vacía
- Posición inexistente (404)
- Error en carga de flujo de entrevista
- Error en carga de candidatos

## Datos de test

Los tests utilizan los **datos del seed de Prisma**:

- **Position ID 1**: "Senior Full-Stack Engineer"
- **Candidatos**:
  - John Doe (Technical Interview)
  - Jane Smith (Technical Interview)
  - Carlos García (Initial Screening)
- **Etapas del proceso**:
  1. Initial Screening
  2. Technical Interview
  3. Manager Interview

## Técnica de Drag & Drop

Playwright usa control manual del mouse para simular drag & drop real que react-beautiful-dnd puede reconocer:

```typescript
// Mover en pasos incrementales (crítico para react-beautiful-dnd)
for (let i = 1; i <= steps; i++) {
  const x = sourceX + (destX - sourceX) * (i / steps);
  const y = sourceY + (destY - sourceY) * (i / steps);
  await page.mouse.move(x, y);
  await page.waitForTimeout(50); // Delay entre pasos
}
```

**Por qué funciona en Playwright y no en Cypress**:
- Playwright tiene acceso a APIs de bajo nivel del navegador
- Puede generar eventos de puntero precisos con timing exacto
- react-beautiful-dnd reconoce estos eventos como interacción real

## Estructura de archivos

```
frontend/
├── playwright/
│   ├── tests/
│   │   └── position-kanban.spec.ts    # 15 tests E2E
│   ├── utils/
│   │   └── helpers.ts                 # PositionKanbanHelpers class
│   └── fixtures/
│       └── test-data.ts               # Datos mock para tests
├── playwright.config.ts               # Configuración Playwright
└── package.json                       # Scripts de test
```

## Troubleshooting

### Tests fallan intermitentemente

**Síntoma**: Tests pasan a veces y fallan otras veces

**Causas posibles**:
1. Base de datos modificada por ejecuciones anteriores
2. Backend no está corriendo
3. Frontend no está corriendo

**Solución**:
```bash
# 1. Resetear BD con seed fresco
cd backend
npx prisma migrate reset --force
pnpm exec tsx prisma/seed.ts

# 2. Reiniciar backend
pnpm run dev

# 3. Ejecutar tests
cd frontend
pnpm run test:e2e:pw
```

### Drag & drop no funciona

**Síntoma**: Tests de drag & drop fallan

**Soluciones**:
1. **Aumentar steps**: Editar `helpers.ts`, aumentar `steps` de 10 a 20
2. **Aumentar delays**: Aumentar `delayBetweenSteps` de 50ms a 100ms
3. **Verificar elementos visibles**: Asegúrate de que candidatos estén en pantalla
4. **Verificar bounding boxes**: Añade logs para debug

```typescript
// Para debugging en helpers.ts
const sourceBox = await source.boundingBox();
console.log('Source box:', sourceBox);
```

### Error "No se pudieron obtener las bounding boxes"

**Causa**: Elemento no está visible o no existe

**Solución**:
- Aumentar timeout antes del drag: `await page.waitForTimeout(1000)`
- Verificar que el selector es correcto
- Asegurar que el elemento está en viewport (scroll si necesario)

### Tests muy lentos

**Causa**: Playwright espera timeouts largos

**Solución**:
- Reducir `delayBetweenSteps` en drag & drop (mínimo 30ms)
- Comentar `webServer` en config y iniciar frontend manualmente
- Usar `--workers=2` para paralelizar (cuidado con race conditions)

### Backend no responde

**Síntoma**: `waitForBackend()` falla

**Solución**:
```bash
cd backend
pnpm run dev
```

Verifica que esté corriendo en `http://localhost:3010`

## Comparación con Cypress

| Aspecto | Cypress | Playwright |
|---------|---------|------------|
| Drag & drop con RBD | ❌ No funciona | ✅ Funciona |
| Velocidad | Rápido | Rápido |
| Debugging | Excelente UI | Trace viewer |
| Multi-navegador | Solo Chromium/Firefox | Chrome, Firefox, Safari |
| API | Más simple | Más potente |
| Tests pasando | 11/14 (3 skip) | 14/15 (1 requiere seed) |

## Integración CI/CD

### GitHub Actions (ejemplo)

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          pnpm install
      
      - name: Install Playwright browsers
        run: |
          cd frontend
          pnpm exec playwright install chromium
      
      - name: Setup database
        run: |
          docker-compose up -d
          cd backend
          npx prisma migrate deploy
          pnpm exec tsx prisma/seed.ts
      
      - name: Run backend
        run: |
          cd backend
          pnpm run dev &
      
      - name: Run E2E tests
        run: |
          cd frontend
          pnpm run test:e2e:pw
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Próximos pasos

- [ ] Añadir tests para formulario de añadir candidato
- [ ] Tests de upload de archivos
- [ ] Tests de flujo completo end-to-end
- [ ] Visual regression testing con Playwright
- [ ] Tests multi-navegador (Firefox, WebKit)
- [ ] Implementar Page Object Pattern

---

**Migrado desde Cypress**: 2026-01-19  
**Tests totales**: 15 (11 migrados + 3 drag & drop nuevos + 1 reordenado)  
**Tests con drag & drop**: 3 tests (100% funcionales con Playwright)  
**Cobertura**: Position Kanban Board (100%)
