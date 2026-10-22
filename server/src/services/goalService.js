import goalRepository from '../repositories/goalRepository.js';

export const goalService = {
  /**
   * Create a new savings goal
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createGoal(userId, data) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      userId,
      name: data.name.trim(),
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      monthlyContribution: Number(data.monthlyContribution || 0),
      category: data.category || 'Other',
      imageUrl: data.imageUrl || '',
      status: data.status || 'in_progress',
    };

    const created = await goalRepository.create(payload);
    return created.toSafeObject();
  },

  /**
   * List all goals for user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async listGoals(userId) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const goals = await goalRepository.findAllByUser(userId);
    return goals.map((g) => g.toSafeObject());
  },

  /**
   * Get single goal by ID
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getGoalById(id, userId) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const goal = await goalRepository.findById(id, userId);
    if (!goal) {
      const err = new Error('Goal not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return goal.toSafeObject();
  },

  /**
   * Update goal by ID
   * @param {string} id
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateGoal(id, userId, data) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const sanitized = { ...data };
    delete sanitized.userId;
    delete sanitized._id;

    if (sanitized.name) sanitized.name = sanitized.name.trim();
    if (sanitized.targetAmount !== undefined) sanitized.targetAmount = Number(sanitized.targetAmount);
    if (sanitized.currentAmount !== undefined) sanitized.currentAmount = Number(sanitized.currentAmount);
    if (sanitized.monthlyContribution !== undefined) sanitized.monthlyContribution = Number(sanitized.monthlyContribution);

    const updated = await goalRepository.updateById(id, userId, sanitized);
    if (!updated) {
      const err = new Error('Goal not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return updated.toSafeObject();
  },

  /**
   * Add contribution to goal
   * @param {string} id
   * @param {string} userId
   * @param {number} amount
   * @returns {Promise<Object>}
   */
  async addContribution(id, userId, amount) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      const err = new Error('Contribution amount must be greater than zero');
      err.statusCode = 400;
      throw err;
    }
    const updated = await goalRepository.addContribution(id, userId, numAmount);
    if (!updated) {
      const err = new Error('Goal not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return updated.toSafeObject();
  },

  /**
   * Delete goal by ID
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteGoal(id, userId) {
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    const deleted = await goalRepository.deleteById(id, userId);
    if (!deleted) {
      const err = new Error('Goal not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return { id: deleted._id.toString(), deleted: true };
  },
};

export default goalService;
