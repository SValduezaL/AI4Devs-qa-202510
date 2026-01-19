/**
 * Fixtures de datos para tests E2E
 * 
 * Estos datos coinciden con el seed de Prisma del backend
 * y se usan para mockear respuestas de API en tests
 */

/**
 * Flujo de entrevistas de posición mock
 * Corresponde a Position ID 1: "Senior Full-Stack Engineer"
 */
export const mockPositionFlow = {
  interviewFlow: {
    positionName: "Senior Full-Stack Engineer",
    interviewFlow: {
      interviewSteps: [
        { id: 1, name: "Initial Screening" },
        { id: 2, name: "Technical Interview" },
        { id: 3, name: "Manager Interview" }
      ]
    }
  }
};

/**
 * Candidatos mock para Position ID 1
 * Estos datos coinciden con el seed del backend
 */
export const mockCandidates = [
  {
    candidateId: 1,
    fullName: "Carlos García",
    currentInterviewStep: "Initial Screening",
    averageScore: 4,
    applicationId: 1
  },
  {
    candidateId: 2,
    fullName: "John Doe",
    currentInterviewStep: "Technical Interview",
    averageScore: 5,
    applicationId: 2
  },
  {
    candidateId: 3,
    fullName: "Jane Smith",
    currentInterviewStep: "Technical Interview",
    averageScore: 4,
    applicationId: 3
  }
];

/**
 * Respuesta vacía de candidatos
 * Para tests de manejo de listas vacías
 */
export const mockEmptyCandidates: any[] = [];

/**
 * Respuesta de error genérica
 */
export const mockErrorResponse = {
  message: 'Internal server error',
  error: 'Something went wrong'
};

/**
 * Respuesta 404 para posición no encontrada
 */
export const mockNotFoundResponse = {
  message: 'Position not found'
};

/**
 * Respuesta de error 400 para actualización de candidato
 */
export const mockBadRequestResponse = {
  message: 'Error updating candidate stage',
  error: 'Invalid interview step'
};
