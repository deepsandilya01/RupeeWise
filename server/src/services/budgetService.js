import budgetRepository from '../repositories/budgetRepository.js';
import financialAnalysisService from './financialAnalysisService.js';

export const budgetService = {
  /**
   * Set or update monthly budget for a category
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async setBudget(userId, data) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const { category, monthlyLimit, alertThreshold } = data;
    if (!category || !category.trim()) {
      const err = new Error('Category is required');
      err.statusCode = 400;
      throw err;
    }

    const limit = Number(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      const err = new Error('Monthly limit must be greater than zero');
      err.statusCode = 400;
      throw err;
    }

    const threshold = alertThreshold ? Number(alertThreshold) : 80;

    const budget = await budgetRepository.upsert(
      userId,
      category.trim(),
      limit,
      threshold
    );
    return budget.toSafeObject();
  },

  /**
   * Get all budgets with real-time actual spending adherence
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getBudgetsWithAdherence(userId) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const analysis = await financialAnalysisService.analyzeFinances(userId);
    return analysis.budgetAdherence;
  },

  /**
   * Delete budget by ID
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteBudget(id, userId) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const deleted = await budgetRepository.deleteById(id, userId);
    if (!deleted) {
      const err = new Error('Budget not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return { id: deleted._id.toString(), deleted: true };
  },
};

export default budgetService;
