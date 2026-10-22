import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Target,
  PieChart,
  MessageSquare,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

export const PhoneMockup = () => {
  return (
    <div className="relative w-[210px] sm:w-[230px] rounded-[36px] p-2.5 bg-white border-[4px] border-white shadow-[0_20px_50px_rgba(11,29,51,0.25)] select-none text-[#0B1D33] overflow-hidden">
      {/* Smartphone Outer Shell Screen */}
      <div className="rounded-[28px] bg-[#FFFDFC] border border-gray-100 p-3 pt-2 flex flex-col justify-between min-h-[360px] text-left">
        {/* Notch / Speaker bar & Status */}
        <div>
          <div className="flex items-center justify-between px-2 pt-0.5 text-[9px] font-bold text-gray-800">
            <span>9:41</span>
            <div className="w-12 h-3.5 bg-gray-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 border border-gray-700 rounded-2xs inline-block" />
            </div>
          </div>

          {/* Phone Header */}
          <div className="flex items-center gap-2 mt-3 pb-2 border-b border-gray-100">
            <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
            <span className="font-bold text-xs text-[#0B1D33]">AI Coach</span>
          </div>

          {/* AI Chat Bubble */}
          <div className="mt-3 p-3 rounded-2xl bg-[#FFF6F0] border border-[#FFE5D4] space-y-2">
            <div className="flex items-start gap-1.5">
              <div className="w-5 h-5 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                ✨
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0B1D33]">Hey Deep! 👋</p>
                <p className="text-[9px] text-gray-600 leading-tight mt-0.5">
                  You spent <span className="font-bold text-coral-600">22% more</span> on dining out this month. Want some suggestions?
                </p>
              </div>
            </div>

            {/* Mini Spending Bars Illustration inside chat */}
            <div className="h-9 bg-white/80 rounded-xl p-1.5 flex items-end justify-between gap-1 border border-peach-200/60">
              <div className="flex-1 bg-coral-200 h-[45%] rounded-xs" />
              <div className="flex-1 bg-coral-300 h-[60%] rounded-xs" />
              <div className="flex-1 bg-coral-200 h-[40%] rounded-xs" />
              <div className="flex-1 bg-coral-500 h-[95%] rounded-xs" />
              <div className="flex-1 bg-coral-300 h-[50%] rounded-xs" />
            </div>
          </div>
        </div>

        {/* 4 Action Prompts */}
        <div className="space-y-1.5 mt-3 pt-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-[9px] font-medium text-gray-700 shadow-2xs">
            <Sparkles className="w-3 h-3 text-coral-500 flex-shrink-0" />
            <span className="truncate">Analyze my spending</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-[9px] font-medium text-gray-700 shadow-2xs">
            <Target className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Plan for a big purchase</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-[9px] font-medium text-gray-700 shadow-2xs">
            <PieChart className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span className="truncate">Create a budget</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-[9px] font-medium text-gray-700 shadow-2xs">
            <MessageSquare className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="truncate">Ask anything</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
