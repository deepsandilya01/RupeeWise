import transactionRepository from '../repositories/transactionRepository.js';
import activityLogRepository from '../repositories/activityLogRepository.js';

export const transactionService = {
  /**
   * Create a new transaction owned by authenticated user
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createTransaction(userId, data) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      userId,
      title: data.title.trim(),
      amount: Number(data.amount),
      type: data.type.toLowerCase(),
      category: data.category.trim(),
      date: data.date ? new Date(data.date) : new Date(),
      paymentMethod: data.paymentMethod || 'UPI',
      description: data.description ? data.description.trim() : '',
    };

    const created = await transactionRepository.create(payload);

    // Non-blocking non-sensitive system activity log
    activityLogRepository.create({
      type: 'transaction_created',
      actorId: userId,
      summary: `New ${payload.type} transaction recorded in '${payload.category}'`,
      metadata: { category: payload.category, type: payload.type },
    }).catch(() => {});

    return created.toSafeObject();
  },

  /**
   * List transactions for authenticated user with pagination and filters
   * @param {string} userId
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async listTransactions(userId, queryParams = {}) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const result = await transactionRepository.findPaginated({
      userId,
      ...queryParams,
    });

    return {
      transactions: result.transactions.map((t) => t.toSafeObject()),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasPrev: result.page > 1,
        hasNext: result.page < result.totalPages,
      },
    };
  },

  /**
   * Fetch single transaction by ID owned by user
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getTransactionById(id, userId) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const transaction = await transactionRepository.findById(id, userId);
    if (!transaction) {
      const err = new Error('Transaction not found or access denied');
      err.statusCode = 404;
      throw err;
    }

    return transaction.toSafeObject();
  },

  /**
   * Update transaction by ID owned by user
   * @param {string} id
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateTransaction(id, userId, updateData) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    // Disallow overriding userId or _id through mass assignment
    const sanitized = { ...updateData };
    delete sanitized.userId;
    delete sanitized._id;
    delete sanitized.id;

    if (sanitized.title) sanitized.title = sanitized.title.trim();
    if (sanitized.category) sanitized.category = sanitized.category.trim();
    if (sanitized.type) sanitized.type = sanitized.type.toLowerCase();
    if (sanitized.amount !== undefined) sanitized.amount = Number(sanitized.amount);
    if (sanitized.date) sanitized.date = new Date(sanitized.date);

    const updated = await transactionRepository.updateById(id, userId, sanitized);
    if (!updated) {
      const err = new Error('Transaction not found or access denied');
      err.statusCode = 404;
      throw err;
    }

    return updated.toSafeObject();
  },

  /**
   * Delete transaction by ID owned by user
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteTransaction(id, userId) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const deleted = await transactionRepository.deleteById(id, userId);
    if (!deleted) {
      const err = new Error('Transaction not found or access denied');
      err.statusCode = 404;
      throw err;
    }

    return { id: deleted._id.toString(), deleted: true };
  },

  /**
   * Get financial summary, breakdowns, and 6-month trends
   * @param {string} userId
   * @param {number} [month]
   * @param {number} [year]
   * @returns {Promise<Object>}
   */
  async getSummary(userId, month, year) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const summary = await transactionRepository.getSummary({ userId, month, year });
    const recent = await transactionRepository.getRecent(userId, 5);

    return {
      ...summary,
      recentTransactions: recent.map((t) => t.toSafeObject()),
    };
  },

  /**
   * Bulk import transactions from CSV
   * @param {string} userId
   * @param {Array<Object>} transactions
   * @returns {Promise<Object>}
   */
  async importTransactions(userId, transactions) {
    if (!userId) {
      const err = new Error('Unauthorized: User ID is required');
      err.statusCode = 401;
      throw err;
    }

    const prepared = transactions.map((t) => ({
      userId,
      title: t.title.trim(),
      amount: Number(t.amount),
      type: t.type.toLowerCase(),
      category: t.category.trim(),
      date: t.date ? new Date(t.date) : new Date(),
      paymentMethod: t.paymentMethod || 'UPI',
      description: t.description ? t.description.trim() : '',
    }));

    const inserted = await transactionRepository.createMany(prepared);
    return {
      importedCount: inserted.length,
      success: true,
    };
  },
};

export default transactionService;
