/**
 * Configuración centralizada de la API
 * Lee variables de entorno para configurar las URLs del backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export const apiConfig = {
    baseURL: API_URL,
    endpoints: {
        upload: `${API_URL}/upload`,
        candidates: `${API_URL}/candidates`,
        positions: `${API_URL}/positions`,
    }
};

export default apiConfig;
