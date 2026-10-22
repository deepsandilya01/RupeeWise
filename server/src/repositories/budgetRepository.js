import mongoose from 'mongoose';
import Budget from '../models/Budget.js';

export const budgetRepository = {
  /**
   * Create or update a budget for a category
   * @param {string} userId
   * @param {string} category
   * @param {number} monthlyLimit
   * @param {number} [alertThreshold]
   * @returns {Promise<Budget>}
   */
  async upsert(userId, category, monthlyLimit, alertThreshold = 80) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    return Budget.findOneAndUpdate(
      { userId, category },
      { $set: { monthlyLimit, alertThreshold } },
      { upsert: true, new: true, runValidators: true }
    ).exec();
  },

  /**
   * Find budget by category
   * @param {string} userId
   * @param {string} category
   * @returns {Promise<Budget|null>}
   */
  async findByCategory(userId, category) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;
    return Budget.findOne({ userId, category }).exec();
  },

  /**
   * Find all budgets for a user
   * @param {string} userId
   * @returns {Promise<Array<Budget>>}
   */
  async findAllByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return Budget.find({ userId }).sort({ category: 1 }).exec();
  },

  /**
   * Delete budget by ID
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Budget|null>}
   */
  async deleteById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Budget.findOneAndDelete({ _id: id, userId }).exec();
  },

  /**
   * Delete multiple budgets matching filter
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async deleteMany(filter) {
    return Budget.deleteMany(filter).exec();
  },
};

export default budgetRepository;
