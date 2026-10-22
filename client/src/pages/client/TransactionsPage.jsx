import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import {
  fetchTransactions,
  fetchTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
} from '../../features/transactions/transactionThunks.js';
import {
  setFilters,
  resetFilters,
  setPage,
  clearMutationStatus,
} from '../../features/transactions/transactionSlice.js';
import TransactionModal from '../../components/transactions/TransactionModal.jsx';
import CsvImportModal from '../../components/transactions/CsvImportModal.jsx';
import DeleteConfirmModal from '../../components/transactions/DeleteConfirmModal.jsx';
import {
  Search,
  Plus,
  Upload,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Receipt,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Food & Dining',
  'Shopping',
  'Housing & Rent',
  'Transport & Fuel',
  'Utilities',
  'Subscriptions & Entertainment',
  'Salary & Income',
  'Investments & Savings',
  'Health & Medical',
  'Education',
  'Travel',
  'Other',
];

export const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const { items, pagination, filters, summary, loading, mutationLoading, error } =
    useAppSelector((state) => state.transactions);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // Initial load
  useEffect(() => {
    dispatch(fetchTransactionSummary());
    dispatch(fetchTransactions(filters));
  }, [dispatch]);

  // Refetch when filters or pagination change
  const handleFilterChange = (updates) => {
    dispatch(setFilters(updates));
    dispatch(fetchTransactions({ ...filters, ...updates, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchTransactions({ ...filters, page: newPage }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(fetchTransactions({ page: 1, limit: 10 }));
  };

  // Handlers for mutations
  const handleSaveTransaction = async (formData) => {
    if (editingTransaction) {
      await dispatch(updateTransaction({ id: editingTransaction.id, data: formData }));
    } else {
      await dispatch(createTransaction(formData));
    }
    setModalOpen(false);
    setEditingTransaction(null);
    dispatch(fetchTransactions(filters));
  };

  const handleDeleteTransaction = async (id) => {
    await dispatch(deleteTransaction(id));
    setDeletingTransaction(null);
    dispatch(fetchTransactions(filters));
  };

  const handleImportCsv = async (transactions) => {
    await dispatch(importTransactions(transactions));
    setCsvModalOpen(false);
    dispatch(fetchTransactions(filters));
  };

  // Format currency in INR
  const formatINR = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 select-none text-left">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0B1D33] tracking-tight">
              Transactions Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
              Live MongoDB
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time multi-tenant income and expense records with instant cashflow calculations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C3846] hover:bg-[#134b5c] text-xs font-bold text-white transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <div className="bg-[#0C3846] text-white rounded-[22px] p-5 shadow-[0_6px_20px_rgba(12,56,70,0.18)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/80">Monthly Income</span>
            <div className="w-7 h-7 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight">
              {formatINR(summary.monthlyIncome)}
            </div>
            <p className="text-[10px] text-white/70 mt-0.5">Sum of credits this month</p>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-[#F35C48] text-white rounded-[22px] p-5 shadow-[0_6px_20px_rgba(243,92,72,0.2)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/90">Monthly Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight">
              {formatINR(summary.monthlyExpenses)}
            </div>
            <p className="text-[10px] text-white/80 mt-0.5">Sum of debits this month</p>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Net Cash Flow</span>
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                summary.netCashFlow >= 0 ? 'text-[#0B1D33]' : 'text-red-600'
              }`}
            >
              {summary.netCashFlow >= 0 ? '+' : ''}
              {formatINR(summary.netCashFlow)}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Income minus expenses</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Savings Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#0B1D33] tracking-tight">
              {summary.savingsRate}%
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {summary.savingsRate >= 30 ? 'High savings efficiency' : 'Track spends to optimize'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by merchant, title, or note..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 text-[#0B1D33]"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange({ type: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 text-gray-700 font-medium"
            >
              <option value="">All Types (Income &amp; Expense)</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value === 'All' ? '' : e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 text-gray-700 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Transactions List Table */}
      <div className="bg-white rounded-[22px] border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <div className="w-6 h-6 border-2 border-[#0C3846] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading transactions from MongoDB...</span>
          </div>
        ) : items.length === 0 ? (
          /* Clean Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-peach-100 text-coral-500 flex items-center justify-center mx-auto">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-[#0B1D33]">No transactions found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              {filters.search || filters.type || filters.category
                ? 'Try adjusting your search criteria or resetting filters to see your records.'
                : 'Start tracking your financial journey by adding your first transaction or importing a CSV file.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setModalOpen(true);
                }}
                className="px-4 py-2 bg-[#0C3846] text-white text-xs font-bold rounded-xl hover:bg-[#134b5c] transition-colors"
              >
                + Add Transaction
              </button>
              <button
                onClick={() => setCsvModalOpen(true)}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Import CSV
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-gray-600 font-bold border-b border-gray-200 select-none">
                <tr>
                  <th className="py-3.5 px-4">Merchant / Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Merchant & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 text-white ${
                            tx.type === 'income' ? 'bg-[#0C3846]' : 'bg-[#F35C48]'
                          }`}
                        >
                          {tx.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#0B1D33]">{tx.title}</div>
                          {tx.description && (
                            <div className="text-[10px] text-gray-400 truncate max-w-xs">
                              {tx.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Pill */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {tx.category}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span>{tx.paymentMethod || 'UPI'}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-gray-500 font-medium">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right">
                      <div
                        className={`font-extrabold text-xs ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-[#0B1D33]'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0C3846] hover:bg-gray-100"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(tx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-[#FAF7F2] flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        initialData={editingTransaction}
        loading={mutationLoading}
      />

      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImportCsv}
        loading={mutationLoading}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteTransaction}
        transaction={deletingTransaction}
        loading={mutationLoading}
      />
    </div>
  );
};

export default TransactionsPage;
