import apiClient from './apiClient.js';

export const authService = {
  /**
   * Authenticate with Google ID credential
   * @param {string} credential - JWT ID credential from GIS
   * @returns {Promise<{ success: boolean, user: Object }>}
   */
  async loginWithGoogle(credential) {
    return apiClient.post('/auth/google', { credential });
  },

  /**
   * Restore current user session from HttpOnly cookie
   * @returns {Promise<{ success: boolean, user: Object }>}
   */
  async fetchCurrentUser() {
    return apiClient.get('/auth/me');
  },

  /**
   * Clear session cookie on backend
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async logout() {
    return apiClient.post('/auth/logout');
  },

  /**
   * Get admin dashboard overview metrics
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getAdminOverview() {
    return apiClient.get('/admin/overview');
  },

  /**
   * Fetch backend and database health status
   * @returns {Promise<{ success: boolean, status: string, database: Object }>}
   */
  async checkHealth() {
    return apiClient.get('/health');
  },
};

export default authService;
