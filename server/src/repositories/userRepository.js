import User from '../models/User.js';

export const userRepository = {
  /**
   * Find a user by MongoDB ObjectId
   * @param {string} id
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    return User.findById(id).exec();
  },

  /**
   * Find a user by email address (case-insensitive)
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    return User.findOne({ email: email.toLowerCase().trim() }).exec();
  },

  /**
   * Find a user by email address including their passwordHash
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmailWithPassword(email) {
    if (!email) return null;
    return User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').exec();
  },

  /**
   * Find a user by Google ID (subject)
   * @param {string} googleId
   * @returns {Promise<User|null>}
   */
  async findByGoogleId(googleId) {
    if (!googleId) return null;
    return User.findOne({ googleId }).exec();
  },

  /**
   * Create a new user
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async create(userData) {
    const user = new User({
      name: userData.name?.trim(),
      email: userData.email?.toLowerCase().trim(),
      googleId: userData.googleId || undefined,
      passwordHash: userData.passwordHash || undefined,
      picture: userData.picture || '',
      role: userData.role || 'client',
      isDemo: Boolean(userData.isDemo),
      authMethod: userData.authMethod || (userData.googleId ? 'google' : 'local'),
    });
    return user.save();
  },

  /**
   * Update user details by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<User|null>}
   */
  async updateById(id, updateData) {
    return User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  },

  /**
   * Count total users by role or total
   * @param {Object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return User.countDocuments(filter).exec();
  },

  /**
   * List users with pagination and projection
   * @param {Object} filter
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async find(filter = {}, options = { limit: 50, skip: 0 }) {
    return User.find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .select('-__v')
      .exec();
  },

  /**
   * Find paginated users with optional search and role filtering
   * @param {Object} params
   * @returns {Promise<{ users: Array, total: number, page: number, totalPages: number }>}
   */
  async findPaginated({ search, role, page = 1, limit = 10 } = {}) {
    const query = {};

    if (role && ['client', 'admin'].includes(role)) {
      query.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .exec(),
      User.countDocuments(query).exec(),
    ]);

    return {
      users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};

export default userRepository;
