import React from 'react';
import { ChevronDown } from 'lucide-react';

export const IncomeExpensesCard = ({ summary }) => {
  const history = summary?.monthlyHistory || [];

  // Default fallback months if no history exists yet
  const defaultMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const chartData =
    history.length > 0
      ? history
      : defaultMonths.map((m) => ({ month: m, income: 0, expense: 0 }));

  // Find max value to calibrate y-axis scale dynamically
  const maxVal = Math.max(
    50000,
    ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
  );

  const formatK = (val) => {
    if (val >= 100000) return (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return Math.round(val / 1000) + 'K';
    return String(val);
  };

  return (
    <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left select-none">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[#0B1D33]">Income vs Expenses</h3>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0C3846]" /> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#F35C48]" /> Expenses
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-full">
            <span>Last 6 Months</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-4 flex items-end justify-between gap-3 h-44">
        {/* Y Axis Guide */}
        <div className="h-full flex flex-col justify-between text-[9px] font-semibold text-gray-400 pr-1 select-none">
          <span>{formatK(maxVal)}</span>
          <span>{formatK(maxVal * 0.75)}</span>
          <span>{formatK(maxVal * 0.5)}</span>
          <span>{formatK(maxVal * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Clustered Bars Container */}
        <div className="flex-1 h-full flex items-end justify-around gap-2 border-b border-gray-100 pb-1">
          {chartData.map((item, idx) => {
            const incomeHeight = maxVal > 0 ? (item.income / maxVal) * 100 : 0;
            const expenseHeight = maxVal > 0 ? (item.expense / maxVal) * 100 : 0;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
              >
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Income Bar (Navy / Dark Teal) */}
                  <div
                    className="w-3 sm:w-3.5 bg-[#0C3846] rounded-t-xs hover:opacity-90 transition-all duration-300"
                    style={{ height: `${Math.max(4, incomeHeight)}%` }}
                    title={`${item.month} Income: ₹${(item.income || 0).toLocaleString('en-IN')}`}
                  />
                  {/* Expense Bar (Coral) */}
                  <div
                    className="w-3 sm:w-3.5 bg-[#F35C48] rounded-t-xs hover:opacity-90 transition-all duration-300"
                    style={{ height: `${Math.max(4, expenseHeight)}%` }}
                    title={`${item.month} Expenses: ₹${(item.expense || 0).toLocaleString('en-IN')}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IncomeExpensesCard;
