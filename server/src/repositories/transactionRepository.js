import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export const transactionRepository = {
  /**
   * Create a single transaction
   * @param {Object} data
   * @returns {Promise<Transaction>}
   */
  async create(data) {
    const transaction = new Transaction(data);
    return transaction.save();
  },

  /**
   * Bulk insert transactions (for CSV import)
   * @param {Array<Object>} transactionsArray
   * @returns {Promise<Array<Transaction>>}
   */
  async createMany(transactionsArray) {
    return Transaction.insertMany(transactionsArray, { ordered: false });
  },

  /**
   * Find a transaction by ID, strictly scoped to userId
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Transaction|null>}
   */
  async findById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Transaction.findOne({ _id: id, userId }).exec();
  },

  /**
   * Find paginated transactions with optional filters and sorting, strictly scoped to userId
   * @param {Object} params
   * @returns {Promise<{ transactions: Array, total: number, page: number, totalPages: number }>}
   */
  async findPaginated({
    userId,
    type,
    category,
    startDate,
    endDate,
    search,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  }) {
    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const validSortFields = ['date', 'amount', 'title', 'category', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    const skip = (Math.max(1, page) - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .exec(),
      Transaction.countDocuments(query).exec(),
    ]);

    return {
      transactions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  /**
   * Update transaction by ID, strictly scoped to userId
   * @param {string} id
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Transaction|null>}
   */
  async updateById(id, userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return Transaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  },

  /**
   * Delete transaction by ID, strictly scoped to userId
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Transaction|null>}
   */
  async deleteById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return Transaction.findOneAndDelete({ _id: id, userId }).exec();
  },

  /**
   * Get recent transactions for user dashboard
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecent(userId, limit = 5) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];

    return Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .exec();
  },

  /**
   * Calculate monthly financial summary, category breakdowns, and 6-month historical trend
   * @param {Object} params
   * @param {string} params.userId
   * @param {number} [params.month] 1-12
   * @param {number} [params.year] Full year, e.g. 2026
   * @returns {Promise<Object>}
   */
  async getSummary({ userId, month, year }) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Default to current month and year if not specified
    const now = new Date();
    const targetYear = year ? Number(year) : now.getFullYear();
    const targetMonth = month ? Number(month) : now.getMonth() + 1; // 1-12

    // Date range for the requested month
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    // 1. All-time balance aggregation
    const allTimeResult = await Transaction.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let lifetimeIncome = 0;
    let lifetimeExpenses = 0;
    allTimeResult.forEach((item) => {
      if (item._id === 'income') lifetimeIncome = item.total;
      if (item._id === 'expense') lifetimeExpenses = item.total;
    });
    const totalBalance = lifetimeIncome - lifetimeExpenses;

    // 2. Monthly Income vs Expenses for the selected month
    const monthlyResult = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let monthlyTransactionCount = 0;

    monthlyResult.forEach((item) => {
      monthlyTransactionCount += item.count;
      if (item._id === 'income') monthlyIncome = item.total;
      if (item._id === 'expense') monthlyExpenses = item.total;
    });

    const netCashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate =
      monthlyIncome > 0
        ? Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100))
        : 0;

    // 3. Category Breakdown for Expenses in the selected month
    const categoryResult = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const categories = categoryResult.map((cat) => {
      const percentage =
        monthlyExpenses > 0 ? Math.round((cat.total / monthlyExpenses) * 100) : 0;
      return {
        category: cat._id,
        total: cat.total,
        count: cat.count,
        percentage,
      };
    });

    // 4. Six-Month Historical Trend (Income vs Expenses by Month)
    const sixMonthsAgo = new Date(targetYear, targetMonth - 6, 1);
    const historicalResult = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: sixMonthsAgo, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Build chronological array of past 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyHistory = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const monthLabel = monthNames[m - 1];

      const incMatch = historicalResult.find(
        (r) => r._id.year === y && r._id.month === m && r._id.type === 'income'
      );
      const expMatch = historicalResult.find(
        (r) => r._id.year === y && r._id.month === m && r._id.type === 'expense'
      );

      monthlyHistory.push({
        month: monthLabel,
        year: y,
        monthIndex: m,
        income: incMatch ? incMatch.total : 0,
        expense: expMatch ? expMatch.total : 0,
      });
    }

    // 5. Total count of all user transactions
    const totalTransactions = await Transaction.countDocuments({ userId: userObjectId }).exec();

    return {
      month: targetMonth,
      year: targetYear,
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      netCashFlow,
      savingsRate,
      monthlyTransactionCount,
      totalTransactions,
      categories,
      monthlyHistory,
    };
  },
};

export default transactionRepository;
