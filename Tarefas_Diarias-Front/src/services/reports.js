import { apiClient } from './api';

// Contrato provisório: se o backend não tiver endpoint ainda,
// o FE vai cair no fallback.
// Quando o endpoint existir, basta trocar esta implementação.
export const reportsService = {
  async getDashboardStats() {
    // Sugestão de endpoint (vai ser criado no backend neste task): GET /relatorios/dashboard
    return apiClient.get('/relatorios/dashboard');
  },
};

