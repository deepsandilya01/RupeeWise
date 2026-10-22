import React, { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('insights');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFCF8] rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF6EE]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
            <span className="font-extrabold text-[#073746] text-sm tracking-tight">
              PaisaPilot AI Interactive Demo Walkthrough
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'insights'
                  ? 'bg-[#073746] text-white shadow-sm'
                  : 'bg-peach-100/60 text-[#073746] hover:bg-peach-100'
              }`}
            >
              1. AI Spending Insights
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-[#073746] text-white shadow-sm'
                  : 'bg-peach-100/60 text-[#073746] hover:bg-peach-100'
              }`}
            >
              2. What-If Simulator
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'goals'
                  ? 'bg-[#073746] text-white shadow-sm'
                  : 'bg-peach-100/60 text-[#073746] hover:bg-peach-100'
              }`}
            >
              3. Automated Savings Goals
            </button>
          </div>

          {activeTab === 'insights' && (
            <div className="space-y-4">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-gray-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-coral-500 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B1D33]">Proactive Anomaly Detection</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    PaisaPilot automatically monitors your recurrent subscriptions and weekend discretionary spending. For example, if your dining out budget spikes by 22% mid-month, you receive an actionable recommendation to adjust non-essential spends.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Categorized Bank CSV Imports</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Real-time Indian Rupee (₹) Calculations</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-gray-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#073746] text-white flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B1D33]">What-If Future Simulation</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Test financial choices before committing. See how cutting your food delivery orders from 4 times a week to 2 times frees up an extra ₹4,800 monthly to invest into a high-yield SIP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-gray-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-peach-300 text-[#073746] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B1D33]">Milestone-Based Target Tracking</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Set customized goals like Emergency Fund (₹1,50,000) or Laptop Upgrade. PaisaPilot dynamically calculates the daily required saving and auto-adjusts based on your real cashflow.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-[#FAF6EE] border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Ready to take control of your money?</span>
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="inline-flex items-center gap-2 bg-[#073746] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#0C2B35] transition-colors"
          >
            <span>Get Started with Google</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
