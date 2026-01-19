# Cypress (DEPRECATED)

## ⚠️ Esta carpeta está deprecada

Los tests E2E han sido **migrados completamente a Playwright** (2026-01-19).

## ¿Por qué se migró a Playwright?

Cypress no podía automatizar tests de drag & drop con `react-beautiful-dnd` debido a limitaciones con eventos sintéticos de mouse. Los 3 tests de drag & drop estaban en `.skip()`.

Playwright resuelve este problema con control de bajo nivel del mouse, permitiendo simular drag & drop real que react-beautiful-dnd reconoce.

## Estado de la migración

✅ **Completado**:
- 14 tests migrados de Cypress a Playwright
- 3 tests de drag & drop implementados (antes en skip)
- Utilidades reutilizables creadas (`PositionKanbanHelpers`)
- Documentación completa en `frontend/playwright/README.md`
- Scripts de package.json actualizados

## Nueva ubicación de tests

Los tests ahora están en:
```
frontend/
├── playwright/
│   ├── tests/
│   │   └── position-kanban.spec.ts  # 15 tests (antes 14 en Cypress)
│   ├── utils/
│   │   └── helpers.ts                # Utilidades
│   └── fixtures/
│       └── test-data.ts              # Datos mock
└── playwright.config.ts              # Configuración
```

## Comandos equivalentes

| Cypress (OLD) | Playwright (NEW) |
|---------------|------------------|
| `pnpm run cypress:open` | `pnpm run test:e2e:pw:ui` |
| `pnpm run cypress:run` | `pnpm run test:e2e:pw` |
| `pnpm run test:e2e` | `pnpm run test:e2e:pw` |
| `pnpm run test:e2e:headed` | `pnpm run test:e2e:pw:headed` |

## Cómo eliminar Cypress completamente

Si estás satisfecho con Playwright y quieres limpiar el proyecto:

```bash
cd frontend

# 1. Desinstalar dependencias de Cypress
pnpm remove cypress @4tw/cypress-drag-drop

# 2. Eliminar carpetas deprecadas
Remove-Item -Recurse -Force cypress.deprecated/
Remove-Item -Force cypress.config.js.deprecated

# 3. Limpiar scripts de package.json
# Eliminar manualmente las líneas de scripts de Cypress deprecados
```

## Mantener Cypress temporalmente

Esta carpeta se mantiene temporalmente renombrada a `cypress.deprecated/` para:
1. Permitir validación completa de Playwright
2. Servir como referencia durante transición
3. Evitar cambios irreversibles prematuros

**Recomendación**: Eliminar después de 1-2 semanas de usar Playwright sin problemas.

## Soporte

Si tienes dudas sobre la migración, consulta:
- `frontend/playwright/README.md` - Documentación completa de Playwright
- `memory-bank/quality/testing.md` - Estrategia de testing actualizada
- Plan de migración en `.cursor/plans/`

---

**Fecha de deprecación**: 2026-01-19  
**Migrado a**: Playwright 1.57.0  
**Tests migrados**: 15 (14 originales + 1 adicional)  
**Tests de drag & drop**: 3 (antes en skip, ahora 100% funcionales)
