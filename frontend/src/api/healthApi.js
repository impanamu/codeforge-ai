import api from './axios';

export const healthApi = {
  getHealth: async () => {
    // GET /api/v1/health
    const response = await api.get('/health');
    return response.data; // returns { status: "healthy", service: "CodeForge AI Backend", version: "0.1.0" }
  },
};
