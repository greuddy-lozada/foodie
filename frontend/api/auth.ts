import { apiClient } from './client';

export const authApi = {
  login: async (email: string, password: string, tenantId: string = 'system') => {
    apiClient.setTenantId(tenantId);
    const response = await apiClient.post('/auth/super-admin/login', { email, password });
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
    }
    return response;
  }
};
