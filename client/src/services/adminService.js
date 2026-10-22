import apiClient from './apiClient.js';

export const adminService = {
  /**
   * Get platform aggregated overview metrics & system status
   * @returns {Promise<Object>}
   */
  async getOverview() {
    return apiClient.get('/admin/overview');
  },

  /**
   * Search and paginate user management directory
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async listUsers(params = {}) {
    return apiClient.get('/admin/users', { params });
  },

  /**
   * Update a user's role (client / admin) with safety validation
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async updateUserRole(userId, role) {
    return apiClient.patch(`/admin/users/${userId}/role`, { role });
  },

  /**
   * Get non-sensitive system activity audit logs
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getActivityLogs(params = {}) {
    return apiClient.get('/admin/activity', { params });
  },

  /**
   * Get detailed system diagnostics
   * @returns {Promise<Object>}
   */
  async getHealth() {
    return apiClient.get('/admin/health');
  },
};

export default adminService;
