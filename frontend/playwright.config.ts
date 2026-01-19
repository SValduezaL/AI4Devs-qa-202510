import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para tests E2E
 * 
 * Migrado desde Cypress - incluye configuración para:
 * - Tests de drag & drop con react-beautiful-dnd
 * - Servidor web auto-iniciado (opcional)
 * - Trace, screenshots y videos en fallos
 */
export default defineConfig({
  testDir: './playwright/tests',

  // Tests seriales para evitar race conditions con BD compartida
  fullyParallel: false,

  // No permitir .only en CI
  forbidOnly: !!process.env.CI,

  // Reintentos en CI para mitigar tests flaky
  retries: process.env.CI ? 2 : 0,

  // Un solo worker para tests E2E (evita race conditions)
  workers: 1,

  // Reporter HTML para visualizar resultados
  reporter: 'html',

  // Configuración global de tests
  use: {
    // URL base del frontend
    baseURL: 'http://localhost:3000',

    // Trace solo en reintentos para debugging
    trace: 'on-first-retry',

    // Screenshots solo en fallos
    screenshot: 'only-on-failure',

    // Videos solo en fallos
    video: 'retain-on-failure',

    // Aumentar timeouts para drag & drop complejo
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Navegador para tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // OPCIONAL: Playwright puede iniciar el servidor automáticamente
  // Si prefieres iniciar manualmente backend y frontend, comenta esta sección
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // Permite reusar servidor si ya está corriendo
    timeout: 120000,
  },
});
