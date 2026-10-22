import apiClient from './apiClient.js';

export const authService = {
  /**
   * Register with email and password
   * @param {Object} data - { name, email, password }
   * @returns {Promise<{ success: boolean, user: Object }>}
   */
  async register({ name, email, password }) {
    return apiClient.post('/auth/register', { name, email, password });
  },

  /**
   * Sign in with email and password
   * @param {Object} data - { email, password }
   * @returns {Promise<{ success: boolean, user: Object }>}
   */
  async login({ email, password }) {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Authenticate into authorized demo account (client or admin)
   * @param {string} role - 'client' | 'admin'
   * @returns {Promise<{ success: boolean, user: Object }>}
   */
  async loginDemo(role) {
    return apiClient.post('/auth/demo', { role });
  },

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
