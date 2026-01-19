import { Page, Locator, expect } from '@playwright/test';

/**
 * Clase de utilidades para tests E2E del Position Kanban Board
 * 
 * Proporciona métodos reutilizables para:
 * - Navegación y espera de carga de datos
 * - Selección de elementos de la UI
 * - Drag & Drop avanzado para react-beautiful-dnd
 * - Mocking de respuestas de API
 */
export class PositionKanbanHelpers {
  constructor(private page: Page) { }

  /**
   * Navegar a una posición y esperar carga completa de datos
   * 
   * Espera a que tanto el flujo de entrevistas como los candidatos
   * se carguen correctamente antes de continuar
   * 
   * @param positionId - ID de la posición a visitar
   */
  async visitPosition(positionId: number) {
    const flowPromise = this.page.waitForResponse(
      resp => resp.url().includes(`/positions/${positionId}/interviewFlow`) && resp.status() === 200
    );
    const candidatesPromise = this.page.waitForResponse(
      resp => resp.url().includes(`/positions/${positionId}/candidates`) && resp.status() === 200
    );

    await this.page.goto(`/positions/${positionId}`);
    await Promise.all([flowPromise, candidatesPromise]);

    // Esperar un poco para que termine el render
    await this.page.waitForTimeout(500);
  }

  /**
   * Obtener columna de etapa por nombre
   * 
   * @param stageName - Nombre de la etapa (ej: "Initial Screening")
   * @returns Locator de la columna completa (card container)
   */
  getStageColumn(stageName: string): Locator {
    // Buscar el header con el texto, luego subir al contenedor padre (.card)
    return this.page.locator('.card-header', { hasText: stageName }).locator('..');
  }

  /**
   * Obtener tarjeta de candidato por nombre
   * 
   * @param candidateName - Nombre completo del candidato
   * @returns Locator de la tarjeta del candidato
   */
  getCandidateCard(candidateName: string): Locator {
    return this.page.locator('[data-rbd-draggable-context-id]', { hasText: candidateName }).first();
  }

  /**
   * Verificar que el backend está disponible
   * 
   * Útil para ejecutar en beforeEach para asegurar que el backend
   * está corriendo antes de iniciar tests
   */
  async waitForBackend() {
    const response = await this.page.request.get('http://localhost:3010/');
    expect(response.status()).toBe(200);
  }

  /**
   * Drag & Drop avanzado para react-beautiful-dnd
   * 
   * react-beautiful-dnd requiere una secuencia específica de eventos
   * de mouse para detectar el drag correctamente. Este método simula
   * un drag real moviendo el mouse en pasos incrementales.
   * 
   * Técnica:
   * 1. Obtener bounding boxes de origen y destino
   * 2. Mover mouse al centro del origen
   * 3. Mouse down (iniciar drag)
   * 4. Mover en pasos pequeños hacia destino (CRÍTICO para RBD)
   * 5. Mouse up (soltar)
   * 
   * @param source - Locator del elemento a arrastrar
   * @param destination - Locator del contenedor destino
   * @param options - Opciones de configuración
   * @param options.steps - Número de pasos intermedios (default: 10)
   * @param options.delayBetweenSteps - Delay en ms entre pasos (default: 50)
   * 
   * @throws Error si no se pueden obtener las bounding boxes
   */
  async dragAndDrop(
    source: Locator,
    destination: Locator,
    options: { steps?: number; delayBetweenSteps?: number } = {}
  ) {
    const { steps = 10, delayBetweenSteps = 50 } = options;

    // Obtener bounding boxes (posición y tamaño de elementos)
    const sourceBox = await source.boundingBox();
    const destBox = await destination.boundingBox();

    if (!sourceBox || !destBox) {
      throw new Error('No se pudieron obtener las bounding boxes de source o destination');
    }

    // Calcular centros de los elementos
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const destX = destBox.x + destBox.width / 2;
    const destY = destBox.y + destBox.height / 2;

    // 1. Mover mouse al origen
    await this.page.mouse.move(sourceX, sourceY);
    await this.page.waitForTimeout(100);

    // 2. Mouse down (iniciar drag)
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);

    // 3. Mover en pasos incrementales (CRÍTICO para react-beautiful-dnd)
    // RBD necesita ver el movimiento gradual para detectar el drag
    for (let i = 1; i <= steps; i++) {
      const x = sourceX + (destX - sourceX) * (i / steps);
      const y = sourceY + (destY - sourceY) * (i / steps);
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(delayBetweenSteps);
    }

    // 4. Esperar un momento antes de soltar
    await this.page.waitForTimeout(200);

    // 5. Mouse up (soltar)
    await this.page.mouse.up();

    // 6. Esperar a que se complete la animación y actualización
    await this.page.waitForTimeout(300);
  }

  /**
   * Mock de respuesta de API
   * 
   * Intercepta peticiones a una URL específica y devuelve
   * una respuesta mockeada en lugar de hacer la petición real
   * 
   * @param url - Patrón de URL a interceptar (puede usar wildcards doble-asterisco)
   * @param response - Objeto de respuesta a devolver
   * @param status - Código de estado HTTP (default: 200)
   */
  async mockApiResponse(url: string, response: any, status: number = 200) {
    await this.page.route(url, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }
}
