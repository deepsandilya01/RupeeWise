import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, ArrowRight, Percent, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MetricCardsRow = ({ summary }) => {
  const hasTransactions = summary && summary.totalTransactions > 0;

  const totalBalance = summary?.totalBalance ?? 0;
  const monthlyIncome = summary?.monthlyIncome ?? 0;
  const monthlyExpenses = summary?.monthlyExpenses ?? 0;
  const savingsRate = summary?.savingsRate ?? 0;

  const formatINR = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* 1. Total Balance Card (White Card) */}
      <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Total Net Balance</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-100">
            ₹
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl lg:text-[26px] font-extrabold text-[#0B1D33] tracking-tight">
            {formatINR(totalBalance)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>
              {hasTransactions
                ? 'All-time cumulative cashflow'
                : 'No transactions recorded yet'}
            </span>
          </div>
        </div>

        {/* Green Sparkline Waveform */}
        <div className="mt-3 h-7 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0,20 Q15,5 30,18 T60,8 T80,16 T100,5"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Monthly Income Card (Deep Teal Background) */}
      <div className="bg-[#0C3846] text-white rounded-[22px] p-5 shadow-[0_6px_20px_rgba(12,56,70,0.2)] flex flex-col justify-between text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/80">Monthly Income</span>
          <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/15">
            <Wallet className="w-4 h-4 text-emerald-300" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl lg:text-[26px] font-extrabold text-white tracking-tight">
            {formatINR(monthlyIncome)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>
              {hasTransactions
                ? 'Current month total credits'
                : 'Add salary or credits'}
            </span>
          </div>
        </div>

        {/* Vertical Waveform Bars */}
        <div className="mt-3 h-7 flex items-end justify-between gap-1">
          {[40, 65, 50, 75, 60, 90, 70, 85, 95, 75, 80, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-white/30 rounded-xs hover:bg-emerald-300 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* 3. Monthly Expenses Card (Coral Background) */}
      <div className="bg-[#F35C48] text-white rounded-[22px] p-5 shadow-[0_6px_20px_rgba(243,92,72,0.25)] flex flex-col justify-between text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/90">Monthly Expenses</span>
          <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center border border-white/20">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl lg:text-[26px] font-extrabold text-white tracking-tight">
            {formatINR(monthlyExpenses)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-white/90 mt-1">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>
              {hasTransactions
                ? 'Current month total debits'
                : 'No expenses recorded'}
            </span>
          </div>
        </div>

        {/* Coral Vertical Waveform Bars */}
        <div className="mt-3 h-7 flex items-end justify-between gap-1">
          {[55, 70, 45, 80, 65, 85, 50, 60, 90, 75, 70, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-white/35 rounded-xs hover:bg-white transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* 4. Savings Rate Card (White Card with Progress Ring) */}
      <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between text-left">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Percent className="w-3.5 h-3.5 text-gray-400" />
            <span>Savings Rate</span>
          </div>

          <div className="mt-2">
            <div className="text-2xl lg:text-[26px] font-extrabold text-[#0B1D33] tracking-tight">
              {savingsRate}%
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">
              {savingsRate >= 30
                ? 'Great progress!'
                : hasTransactions
                ? 'Room to optimize'
                : 'Ready to calculate'}
            </div>
          </div>
        </div>

        {/* Donut Progress Ring */}
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#F35C48"
              strokeWidth="4"
              strokeDasharray={`${Math.min(100, Math.max(0, savingsRate))}, 100`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCardsRow;
