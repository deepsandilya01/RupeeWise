import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTransactions,
  fetchTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
} from './transactionThunks.js';

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  },
  filters: {
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  summary: {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netCashFlow: 0,
    savingsRate: 0,
    monthlyTransactionCount: 0,
    totalTransactions: 0,
    categories: [],
    monthlyHistory: [],
    recentTransactions: [],
  },
  loading: false,
  summaryLoading: false,
  mutationLoading: false,
  error: null,
  mutationSuccess: false,
};

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset to first page on filter change
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    setLimit(state, action) {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearMutationStatus(state) {
      state.mutationSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 1. Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load transactions';
      });

    // 2. Fetch Summary
    builder
      .addCase(fetchTransactionSummary.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload || initialState.summary;
      })
      .addCase(fetchTransactionSummary.rejected, (state) => {
        state.summaryLoading = false;
      });

    // 3. Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.mutationSuccess = false;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        // Prepend to current items list
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });

    // 4. Update Transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.mutationSuccess = false;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });

    // 5. Delete Transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });

    // 6. Import Transactions
    builder
      .addCase(importTransactions.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.mutationSuccess = false;
      })
      .addCase(importTransactions.fulfilled, (state) => {
        state.mutationLoading = false;
        state.mutationSuccess = true;
      })
      .addCase(importTransactions.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPage, setLimit, clearMutationStatus } =
  transactionSlice.actions;

export default transactionSlice.reducer;
