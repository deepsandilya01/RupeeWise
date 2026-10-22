import mongoose from 'mongoose';
import Goal from '../models/Goal.js';

export const goalRepository = {
  /**
   * Create a new goal for user
   * @param {Object} data
   * @returns {Promise<Goal>}
   */
  async create(data) {
    const goal = new Goal(data);
    return goal.save();
  },

  /**
   * Find goal by ID scoped to user
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Goal|null>}
   */
  async findById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Goal.findOne({ _id: id, userId }).exec();
  },

  /**
   * List all goals for a user
   * @param {string} userId
   * @param {Object} filter
   * @returns {Promise<Array<Goal>>}
   */
  async findAllByUser(userId, filter = {}) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return Goal.find({ userId, ...filter })
      .sort({ createdAt: -1 })
      .exec();
  },

  /**
   * Update goal by ID scoped to user
   * @param {string} id
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Goal|null>}
   */
  async updateById(id, userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Goal.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  },

  /**
   * Add contribution to goal
   * @param {string} id
   * @param {string} userId
   * @param {number} amount
   * @returns {Promise<Goal|null>}
   */
  async addContribution(id, userId, amount) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    const goal = await Goal.findOne({ _id: id, userId }).exec();
    if (!goal) return null;

    goal.currentAmount = (goal.currentAmount || 0) + Number(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    return goal.save();
  },

  /**
   * Delete goal by ID scoped to user
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Goal|null>}
   */
  async deleteById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Goal.findOneAndDelete({ _id: id, userId }).exec();
  },

  /**
   * Count goals by user
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return 0;
    return Goal.countDocuments({ userId }).exec();
  },
};

export default goalRepository;
