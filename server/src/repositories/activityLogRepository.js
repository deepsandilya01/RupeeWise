import ActivityLog from '../models/ActivityLog.js';

export const activityLogRepository = {
  /**
   * Create an activity log record
   * @param {Object} data
   * @returns {Promise<ActivityLog>}
   */
  async create(data) {
    try {
      const log = new ActivityLog(data);
      return await log.save();
    } catch (err) {
      // Non-fatal logging error: log to console so main business logic does not fail
      console.error('[ActivityLog] Failed to record activity:', err.message);
      return null;
    }
  },

  /**
   * Get recent activity logs with pagination
   * @param {Object} params
   * @param {number} [params.limit=20]
   * @param {number} [params.skip=0]
   * @returns {Promise<Array<ActivityLog>>}
   */
  async getRecent({ limit = 20, skip = 0 } = {}) {
    return ActivityLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .exec();
  },

  /**
   * Count total activity records
   * @returns {Promise<number>}
   */
  async count() {
    return ActivityLog.countDocuments().exec();
  },
};

export default activityLogRepository;
