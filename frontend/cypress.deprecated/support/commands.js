// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Comando personalizado para drag & drop con react-beautiful-dnd
 * react-beautiful-dnd requiere simulación específica de eventos de mouse
 * 
 * @param {string} draggableSelector - Selector del elemento a arrastrar
 * @param {string} droppableSelector - Selector del contenedor destino
 */
Cypress.Commands.add('dragAndDrop', (draggableSelector, droppableSelector) => {
  cy.get(draggableSelector)
    .trigger('mousedown', { which: 1, button: 0 })
    .trigger('dragstart')
    .trigger('drag');

  cy.get(droppableSelector)
    .trigger('dragover')
    .trigger('drop')
    .trigger('dragend')
    .trigger('mouseup');
});

/**
 * Comando para verificar que el backend está disponible
 * Útil para ejecutar antes de los tests E2E
 */
Cypress.Commands.add('waitForBackend', () => {
  cy.request({
    url: `${Cypress.env('apiUrl')}/`,
    failOnStatusCode: false
  }).should((response) => {
    expect(response.status).to.eq(200);
  });
});

/**
 * Comando para visitar una posición y esperar a que cargue completamente
 * @param {number} positionId - ID de la posición
 */
Cypress.Commands.add('visitPosition', (positionId) => {
  cy.intercept('GET', `/positions/${positionId}/interviewFlow`).as('getFlow');
  cy.intercept('GET', `/positions/${positionId}/candidates`).as('getCandidates');
  
  cy.visit(`/positions/${positionId}`);
  
  cy.wait('@getFlow');
  cy.wait('@getCandidates');
});
