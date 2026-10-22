import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

const CATEGORIES = [
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

const PAYMENT_METHODS = [
  'UPI',
  'Net Banking',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Other',
];

export const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food & Dining',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title or merchant name is required';
    } else if (formData.title.length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid amount greater than ₹0';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    if (!formData.date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-gray-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
                formData.type === 'income' ? 'bg-[#3D8569]' : 'bg-[#F35C48]'
              }`}
            >
              {formData.type === 'income' ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B1D33]">
                {isEdit ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <p className="text-[11px] text-gray-500">
                {isEdit ? 'Update details of your existing record' : 'Add a new income or expense transaction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Type Toggle: Income vs Expense */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-[#F35C48] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  formData.type === 'income'
                    ? 'bg-[#0C3846] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Title & Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Merchant / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Zomato, Salary, Rent"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-gray-50/70 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 ${
                  errors.title ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                }`}
              />
              {errors.title && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-8 pr-3.5 py-2 text-xs rounded-xl border bg-gray-50/70 text-[#0B1D33] font-bold focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 ${
                    errors.amount ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Transaction Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-gray-50/70 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 ${
                errors.date ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            {errors.date && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows="2"
              placeholder="Add optional notes or tags..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/70 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm ${
                formData.type === 'income'
                  ? 'bg-[#0C3846] hover:bg-[#124d5f]'
                  : 'bg-[#F35C48] hover:bg-coral-600'
              }`}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
