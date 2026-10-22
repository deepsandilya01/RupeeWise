import React from 'react';
import { ArrowRight, ArrowDownLeft, ArrowUpRight, Plus, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentTransactionsCard = ({ summary }) => {
  const transactions = summary?.recentTransactions || [];
  const hasTransactions = transactions.length > 0;

  const formatINR = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left select-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0B1D33]">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-[11px] font-bold text-[#0C3846] hover:text-coral-500 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {!hasTransactions ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs text-gray-500 font-medium">No recent transactions</p>
          <p className="text-[10px] text-gray-400 max-w-[180px]">
            Record your daily expenses or credits to track cashflow.
          </p>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C3846] hover:underline pt-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Transaction</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 4).map((tx) => {
            const isCredit = tx.type === 'income';
            return (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 text-white ${
                      isCredit ? 'bg-[#0C3846]' : 'bg-[#F35C48]'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B1D33] leading-none truncate max-w-[120px]">
                      {tx.title}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[120px]">
                      {tx.category}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      isCredit ? 'text-emerald-600' : 'text-[#0B1D33]'
                    }`}
                  >
                    {isCredit ? '+ ' : '- '}
                    {formatINR(tx.amount)}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsCard;
