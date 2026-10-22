import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PALETTE = [
  '#0C3846', // Dark teal
  '#F35C48', // Coral
  '#FBBF24', // Amber
  '#3D8569', // Emerald
  '#60A5FA', // Sky Blue
  '#2DD4BF', // Teal
  '#9CA3AF', // Slate
  '#A855F7', // Purple
  '#EC4899', // Pink
];

export const ExpenseOverviewCard = ({ summary }) => {
  const categories = summary?.categories || [];
  const monthlyExpenses = summary?.monthlyExpenses || 0;
  const hasExpenses = categories.length > 0 && monthlyExpenses > 0;

  // Compute donut stroke offsets
  let accumulatedOffset = 0;
  const donutSlices = categories.slice(0, 7).map((cat, idx) => {
    const strokeDasharray = `${cat.percentage}, 100`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += cat.percentage;
    return {
      name: cat.category,
      percent: `${cat.percentage}%`,
      amount: cat.total,
      color: PALETTE[idx % PALETTE.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left select-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0B1D33]">Expense Overview</h3>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-full">
          <span>This Month</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      {!hasExpenses ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-200 flex flex-col items-center justify-center">
            <span className="text-xs font-extrabold text-[#0B1D33]">₹0</span>
            <span className="text-[9px] text-gray-400">Total Spent</span>
          </div>
          <p className="text-xs text-gray-400 max-w-[220px]">
            No expenses recorded for this month yet.
          </p>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#0C3846] text-white text-[11px] font-bold hover:bg-[#134b5c] transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Expense</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart with Center Text */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="5.5"
              />
              {donutSlices.map((slice, idx) => (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="5.5"
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                />
              ))}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-extrabold text-[#0B1D33] tracking-tight">
                ₹{Number(monthlyExpenses).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] font-medium text-gray-400">Total Spent</span>
            </div>
          </div>

          {/* Legend List */}
          <div className="flex-1 w-full space-y-1.5">
            {donutSlices.map((slice) => (
              <div key={slice.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate max-w-[150px]">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-gray-600 font-medium text-[11px] truncate">
                    {slice.name}
                  </span>
                </div>
                <span className="font-bold text-[#0B1D33] text-[11px] ml-2">
                  {slice.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseOverviewCard;
