import goalService from '../services/goalService.js';

export const goalController = {
  /**
   * List all goals for user
   * GET /api/goals
   */
  async listGoals(req, res, next) {
    try {
      const userId = req.user.id;
      const goals = await goalService.listGoals(userId);

      return res.status(200).json({
        success: true,
        data: goals,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Create new goal
   * POST /api/goals
   */
  async createGoal(req, res, next) {
    try {
      const userId = req.user.id;
      const goal = await goalService.createGoal(userId, req.body);

      return res.status(201).json({
        success: true,
        data: goal,
        message: 'Savings goal created successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get goal by ID
   * GET /api/goals/:id
   */
  async getGoalById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const goal = await goalService.getGoalById(id, userId);

      return res.status(200).json({
        success: true,
        data: goal,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Update goal
   * PATCH /api/goals/:id
   */
  async updateGoal(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updated = await goalService.updateGoal(id, userId, req.body);

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Goal updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Add contribution to goal
   * POST /api/goals/:id/contribute
   */
  async addContribution(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { amount } = req.body;

      const updated = await goalService.addContribution(id, userId, amount);

      return res.status(200).json({
        success: true,
        data: updated,
        message: `Contributed ₹${Number(amount).toLocaleString('en-IN')} to ${updated.name}`,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Delete goal
   * DELETE /api/goals/:id
   */
  async deleteGoal(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await goalService.deleteGoal(id, userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Goal deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default goalController;
