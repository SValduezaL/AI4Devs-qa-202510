// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configuración global para los tests E2E
beforeEach(() => {
  // Ignorar errores de aplicación no capturados que no afectan los tests
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    // Solo en casos específicos donde sabemos que el error no es crítico
    if (err.message.includes('ResizeObserver loop')) {
      return false;
    }
    // Let other errors fail the test
    return true;
  });
});
