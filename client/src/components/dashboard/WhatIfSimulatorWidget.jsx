import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, TrendingUp } from 'lucide-react';

export const WhatIfSimulatorWidget = ({ summary }) => {
  const diningCategory = summary?.categories?.find(
    (c) =>
      c.category.toLowerCase().includes('dining') ||
      c.category.toLowerCase().includes('food')
  );
  const baselineDiningSpend = diningCategory ? diningCategory.total : 4000;
  const initialReduction = Math.min(2000, Math.max(500, Math.round(baselineDiningSpend * 0.3)));

  const [reductionAmount, setReductionAmount] = useState(initialReduction);
  const [timePeriod, setTimePeriod] = useState(3); // in years

  // Calculate dynamic projected savings with compounding interest (~10% CAGR)
  const calculateSavings = (monthlyAdd, years) => {
    const monthlyRate = 0.10 / 12;
    const months = years * 12;
    const extraSavings = Math.round(
      monthlyAdd * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    );
    const baselineMonthlySavings = summary?.netCashFlow > 0 ? summary.netCashFlow : 15000;
    const baseline = baselineMonthlySavings * 12 * years;
    const total = baseline + extraSavings;
    return total;
  };

  const projectedTotal = calculateSavings(reductionAmount, timePeriod);
  const percentageIncrease =
    Math.round(((reductionAmount * 12 * timePeriod) / (15000 * 12 * timePeriod)) * 100) || 18;

  // Format currency in Indian numbering system
  const formatINR = (val) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left select-none">
      {/* Top Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center border border-[#FED7AA]">
          <SlidersHorizontal className="w-4 h-4 text-[#F97316]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0B1D33]">What-If Simulator</h3>
          <p className="text-[11px] text-gray-400">See how small changes can make a big difference</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Left Side: Interactive Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Reduce dining expenses by</span>
              <span className="text-xs font-extrabold text-[#0B1D33] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                {formatINR(reductionAmount)}/month
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max="5000"
              step="500"
              value={reductionAmount}
              onChange={(e) => setReductionAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F35C48]"
            />

            {/* Slider Ticks */}
            <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1">
              <span>0</span>
              <span>1K</span>
              <span>2K</span>
              <span>3K</span>
              <span>4K</span>
              <span>5K</span>
            </div>
          </div>

          {/* Time Period Selector */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Time Period</label>
            <div className="relative">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full appearance-none bg-gray-50 border border-gray-200/90 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-coral-400 cursor-pointer pr-8"
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Side: Projected Savings Output & Graph */}
        <div className="bg-[#FFF8F4] border border-[#FED7AA]/60 rounded-2xl p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Projected Savings</span>
            <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full border border-[#FED7AA]/80">
              +{percentageIncrease}% with this change
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1D33] tracking-tight">
            {formatINR(projectedTotal)}
          </div>

          {/* SVG Trend Line Graph */}
          <div className="h-16 w-full mt-2">
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="coralAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F35C48" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F35C48" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 10 50 Q 70 42, 130 25 T 190 10 L 190 55 L 10 55 Z"
                fill="url(#coralAreaGrad)"
              />

              {/* Curve Line */}
              <path
                d="M 10 50 Q 70 42, 130 25 T 190 10"
                fill="none"
                stroke="#F35C48"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="10" cy="50" r="3" fill="#F35C48" />
              <circle cx="70" cy="40" r="3" fill="#F35C48" />
              <circle cx="130" cy="25" r="3" fill="#F35C48" />
              <circle cx="190" cy="10" r="4" fill="#F35C48" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Labels below graph */}
            <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-0.5">
              <span>Now</span>
              <span>1Y</span>
              <span>2Y</span>
              <span>{timePeriod}Y</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulatorWidget;
