import apiClient from './apiClient.js';

export const transactionService = {
  /**
   * List paginated transactions with optional filters and sorting
   * @param {Object} params - { page, limit, type, category, startDate, endDate, search, sortBy, sortOrder }
   * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
   */
  async getTransactions(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    return apiClient.get(url);
  },

  /**
   * Fetch single transaction by ID
   * @param {string} id
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getTransactionById(id) {
    return apiClient.get(`/transactions/${id}`);
  },

  /**
   * Create a new transaction
   * @param {Object} data - { title, amount, type, category, date, paymentMethod, description }
   * @returns {Promise<{ success: boolean, data: Object, message: string }>}
   */
  async createTransaction(data) {
    return apiClient.post('/transactions', data);
  },

  /**
   * Update an existing transaction
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<{ success: boolean, data: Object, message: string }>}
   */
  async updateTransaction(id, data) {
    return apiClient.patch(`/transactions/${id}`, data);
  },

  /**
   * Delete transaction by ID
   * @param {string} id
   * @returns {Promise<{ success: boolean, data: Object, message: string }>}
   */
  async deleteTransaction(id) {
    return apiClient.delete(`/transactions/${id}`);
  },

  /**
   * Get financial summary, category breakdowns, and historical trends
   * @param {Object} [params] - { month, year }
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  async getSummary(params = {}) {
    const query = new URLSearchParams();
    if (params.month) query.append('month', params.month);
    if (params.year) query.append('year', params.year);
    const queryString = query.toString();
    const url = queryString ? `/transactions/summary?${queryString}` : '/transactions/summary';
    return apiClient.get(url);
  },

  /**
   * Bulk import transactions
   * @param {Array<Object>} transactions
   * @returns {Promise<{ success: boolean, data: Object, message: string }>}
   */
  async importTransactions(transactions) {
    return apiClient.post('/transactions/import', { transactions });
  },
};

export default transactionService;
