import mongoose from 'mongoose';
import ActionRecommendation from '../models/ActionRecommendation.js';

export const recommendationRepository = {
  /**
   * Bulk insert or sync recommendations for user
   * @param {Array<Object>} recs
   * @returns {Promise<Array>}
   */
  async createMany(recs) {
    if (!recs || recs.length === 0) return [];
    return ActionRecommendation.insertMany(recs);
  },

  /**
   * Find active recommendations for user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findActiveByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return ActionRecommendation.find({ userId, status: 'active' })
      .sort({ createdAt: -1 })
      .exec();
  },

  /**
   * Update recommendation status (accepted or dismissed)
   * @param {string} id
   * @param {string} userId
   * @param {string} status
   * @returns {Promise<ActionRecommendation|null>}
   */
  async updateStatus(id, userId, status) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return ActionRecommendation.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status } },
      { new: true }
    ).exec();
  },

  /**
   * Clear active recommendations for user (prior to refreshing)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async clearActive(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return { deletedCount: 0 };
    return ActionRecommendation.deleteMany({ userId, status: 'active' }).exec();
  },
};

export default recommendationRepository;
