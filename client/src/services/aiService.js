import apiClient from './apiClient.js';

export const aiService = {
  /**
   * Get personalized spending insights
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getInsights() {
    return apiClient.get('/ai/insights');
  },

  /**
   * Get active actionable recommendations
   * @returns {Promise<{ success: boolean, data: Array }>}
   */
  async getRecommendations() {
    return apiClient.get('/ai/recommendations');
  },

  /**
   * Update recommendation status (accept or dismiss)
   * @param {string} id
   * @param {string} status - 'accepted' | 'dismissed'
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async updateRecommendationStatus(id, status) {
    return apiClient.patch(`/ai/recommendations/${id}`, { status });
  },

  /**
   * Run What-If simulation
   * @param {Object} payload - { category, monthlyReduction, timeHorizonMonths, oneTimeContribution }
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async simulate(payload) {
    return apiClient.post('/ai/simulate', payload);
  },

  /**
   * Ask question to AI Money Coach
   * @param {string} message
   * @returns {Promise<{ success: boolean, data: { reply: string, source: string, suggestions: Array } }>}
   */
  async askCoach(message) {
    return apiClient.post('/ai/coach', { message });
  },

  /**
   * Get spending anomaly alerts
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getAnomalies() {
    return apiClient.get('/ai/anomalies');
  },

  /**
   * Get Financial Wellness Score
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getWellnessScore() {
    return apiClient.get('/ai/wellness-score');
  },
};

export default aiService;
