import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading = false,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-200/90 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-extrabold text-[#0B1D33]">
          Delete Transaction?
        </h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-gray-800">"{transaction.title}"</span> ({transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')})? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(transaction.id)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
