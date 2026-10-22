import transactionService from '../services/transactionService.js';

export const transactionController = {
  /**
   * List transactions for authenticated user
   * GET /api/transactions
   */
  async listTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await transactionService.listTransactions(userId, req.query);

      return res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Fetch single transaction by ID
   * GET /api/transactions/:id
   */
  async getTransactionById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const transaction = await transactionService.getTransactionById(id, userId);

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Create a new transaction
   * POST /api/transactions
   */
  async createTransaction(req, res, next) {
    try {
      const userId = req.user.id;
      const transaction = await transactionService.createTransaction(userId, req.body);

      return res.status(201).json({
        success: true,
        data: transaction,
        message: 'Transaction recorded successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Update transaction by ID
   * PATCH /api/transactions/:id
   */
  async updateTransaction(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const updated = await transactionService.updateTransaction(id, userId, req.body);

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Transaction updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Delete transaction by ID
   * DELETE /api/transactions/:id
   */
  async deleteTransaction(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await transactionService.deleteTransaction(id, userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get financial summary & analytics
   * GET /api/transactions/summary
   */
  async getTransactionSummary(req, res, next) {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;

      const summary = await transactionService.getSummary(userId, month, year);

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Bulk import transactions
   * POST /api/transactions/import
   */
  async importTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      const { transactions } = req.body;

      const result = await transactionService.importTransactions(userId, transactions);

      return res.status(201).json({
        success: true,
        data: result,
        message: `Successfully imported ${result.importedCount} transactions`,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default transactionController;
