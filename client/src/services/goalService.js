import apiClient from './apiClient.js';

export const goalService = {
  /**
   * List all goals
   * @returns {Promise<{ success: boolean, data: Array }>}
   */
  async listGoals() {
    return apiClient.get('/goals');
  },

  /**
   * Create new savings goal
   * @param {Object} data
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async createGoal(data) {
    return apiClient.post('/goals', data);
  },

  /**
   * Update goal
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async updateGoal(id, data) {
    return apiClient.patch(`/goals/${id}`, data);
  },

  /**
   * Add contribution
   * @param {string} id
   * @param {number} amount
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async addContribution(id, amount) {
    return apiClient.post(`/goals/${id}/contribute`, { amount });
  },

  /**
   * Delete goal
   * @param {string} id
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async deleteGoal(id) {
    return apiClient.delete(`/goals/${id}`);
  },
};

export default goalService;
