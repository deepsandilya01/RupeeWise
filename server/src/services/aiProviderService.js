import aiService from './aiService.js';
import rulesEngineProvider from './ai/rulesEngineProvider.js';

export const aiProviderService = {
  /**
   * Process a question to the AI Money Coach (delegates to multi-provider aiService)
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.message
   * @param {string} [params.preferredProvider]
   * @returns {Promise<Object>}
   */
  async askCoach({ userId, message, preferredProvider }) {
    return aiService.askCoach({ userId, message, preferredProvider });
  },

  /**
   * Safe status check
   */
  getAiStatus() {
    return aiService.getAiStatus();
  },

  /**
   * Deterministic RupeeWise Financial Rules Engine
   */
  generateRulesBasedResponse(params) {
    return rulesEngineProvider.generateResponse(params);
  },
};

export default aiProviderService;
