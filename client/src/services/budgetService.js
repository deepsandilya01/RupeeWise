import apiClient from './apiClient.js';

export const budgetService = {
  /**
   * Get all category budgets with real-time actual spending adherence
   * @returns {Promise<{ success: boolean, data: Array }>}
   */
  async getBudgets() {
    return apiClient.get('/budgets');
  },

  /**
   * Set or update category budget limit
   * @param {Object} data - { category, monthlyLimit, alertThreshold }
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async setBudget(data) {
    return apiClient.post('/budgets', data);
  },

  /**
   * Delete category budget
   * @param {string} id
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async deleteBudget(id) {
    return apiClient.delete(`/budgets/${id}`);
  },
};

export default budgetService;
