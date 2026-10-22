import budgetService from '../services/budgetService.js';

export const budgetController = {
  /**
   * Get all budgets with real-time actual spending adherence
   * GET /api/budgets
   */
  async getBudgets(req, res, next) {
    try {
      const userId = req.user.id;
      const budgets = await budgetService.getBudgetsWithAdherence(userId);

      return res.status(200).json({
        success: true,
        data: budgets,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Set or update monthly budget for a category
   * POST /api/budgets
   */
  async setBudget(req, res, next) {
    try {
      const userId = req.user.id;
      const budget = await budgetService.setBudget(userId, req.body);

      return res.status(200).json({
        success: true,
        data: budget,
        message: 'Category budget updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Delete budget
   * DELETE /api/budgets/:id
   */
  async deleteBudget(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await budgetService.deleteBudget(id, userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Budget removed successfully',
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default budgetController;
