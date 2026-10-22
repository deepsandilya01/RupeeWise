import React from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.js';

export const AIInsightCard = () => {
  const navigate = useNavigate();
  const { insights } = useAppSelector((state) => state.ai);

  const momSpike = insights?.momComparisons?.find((m) => m.isIncrease && m.percentageChange > 10);
  const topCat = insights?.currentSummary?.categories?.[0];

  let insightText = (
    <>
      You spent <span className="font-bold text-[#0B1D33]">32% more</span> on dining out this month compared to last month. Consider setting a monthly limit of <span className="font-semibold text-[#0B1D33]">₹4,000</span> to stay on track.
    </>
  );

  if (momSpike) {
    insightText = (
      <>
        You spent <span className="font-bold text-[#0B1D33]">+{momSpike.percentageChange}% more</span> on {momSpike.category} this month (₹{momSpike.currentTotal.toLocaleString('en-IN')}). Consider setting a budget limit to stabilize your cashflow.
      </>
    );
  } else if (topCat) {
    insightText = (
      <>
        <span className="font-bold text-[#0B1D33]">{topCat.category}</span> is your highest outflow this month, taking <span className="font-bold text-[#0B1D33]">{topCat.percentage}%</span> (₹{topCat.total.toLocaleString('en-IN')}) of total expenses.
      </>
    );
  }

  return (
    <div className="bg-[#FFF5ED] rounded-[22px] p-5 border border-[#FED7AA]/60 shadow-[0_4px_16px_rgba(243,92,72,0.04)] flex flex-col justify-between text-left select-none relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center border border-[#FED7AA]">
              <Lightbulb className="w-4 h-4 fill-[#F97316] text-[#EA580C]" />
            </div>
            <h3 className="text-sm font-bold text-[#0B1D33]">AI Insight for You</h3>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]/50" />
        </div>

        {/* Text Insight */}
        <p className="text-xs text-gray-700 leading-relaxed max-w-[280px]">
          {insightText}
        </p>
      </div>

      <div className="flex items-end justify-between mt-4">
        {/* CTA Button */}
        <button
          onClick={() => navigate('/ai-coach')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C3846] text-white text-xs font-semibold rounded-xl hover:bg-[#134e60] transition-colors shadow-sm"
        >
          <span>Tell me more</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Delightful Person & Growth Vector Illustration */}
        <div className="w-28 h-20 relative flex items-end justify-end pointer-events-none">
          <svg viewBox="0 0 120 90" className="w-full h-full">
            <path
              d="M10,80 Q40,65 60,40 T100,20"
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              strokeDasharray="2,2"
            />
            <polygon points="100,16 106,20 100,24" fill="#F97316" />
            <path d="M12,85 C14,75 22,76 22,85" fill="#3D8569" opacity="0.8" />
            <path d="M18,85 C20,78 28,79 26,85" fill="#2DD4BF" opacity="0.8" />
            <path
              d="M60,65 C60,52 75,50 88,58 C96,63 94,76 94,85 L52,85 C52,78 55,70 60,65 Z"
              fill="#0C3846"
            />
            <path
              d="M45,72 C48,70 54,72 58,85 L40,85 C38,78 41,74 45,72 Z"
              fill="#FDBA74"
            />
            <circle cx="80" cy="42" r="8" fill="#FDBA74" />
            <path
              d="M72,40 C72,34 76,32 82,32 C88,32 90,36 88,40 C85,38 78,38 72,40 Z"
              fill="#0B1D33"
            />
            <circle cx="83" cy="41" r="1" fill="#0B1D33" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
