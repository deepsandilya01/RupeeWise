import React, { useState } from 'react';
import {
  HelpCircle,
  Calculator,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
  BookOpen,
  MessageCircleQuestion,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';

export const HelpSupportPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does the RupeeWise Financial Rules Engine calculate insights?',
      a: 'RupeeWise analyzes your live recorded transactions for the current month against the previous month. It evaluates category shifts, frequent micro-expenses (<₹500), recurring debits, and budget adherence deterministically. All suggestions are grounded in your actual ledger without inventing statistics.',
    },
    {
      q: 'How is the Financial Wellness Score (0–100) calculated?',
      a: 'The Wellness Score is composed of 4 documented metrics: Savings Rate (up to 35 pts), Budget Adherence (up to 25 pts), Expense Volatility (up to 20 pts), and Goal Progress (up to 20 pts). It is an educational health indicator and not a regulated credit score.',
    },
    {
      q: 'Is my financial data shared with third-party AI models?',
      a: 'No. When no external AI provider is configured, all insights are computed 100% on the server using deterministic financial rules. If an external AI provider (like Google Gemini) is configured by your server administrator, only aggregated category summaries are supplied, never raw personal identifying details.',
    },
    {
      q: 'What is the formula behind the What-If Simulator?',
      a: 'The What-If Simulator uses transparent arithmetic: Total Projected Contributions = (Monthly Reduction × Time Horizon in Months) + One-Time Contribution. It displays how small habit shifts accelerate your target savings goals.',
    },
    {
      q: 'How do I export my transaction history?',
      a: 'Navigate to the Transactions tab and view your ledger. You can filter by date or category and click "Import CSV" to upload bank statements or view your full history.',
    },
  ];

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-extrabold text-[#0B1D33] tracking-tight">
            Help, Documentation &amp; Support
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF6EE] text-[#0C2B35] border border-gray-200">
            <BookOpen className="w-3.5 h-3.5 text-coral-500" />
            Knowledge Base
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Learn how RupeeWise computes financial intelligence, transparent formulas, and privacy protections.
        </p>
      </div>

      {/* 3 Core Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-[#0B1D33]">Transparent Formulas</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Net Cash Flow = Income &minus; Expenses.<br />
            Savings Rate = (Net Cash Flow / Income) &times; 100.<br />
            Simulated Total = (Reduction &times; Months) + Lump Sum.
          </p>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-peach-100 text-coral-600 flex items-center justify-center border border-peach-200 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-[#0B1D33]">Deterministic AI Engine</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Identifies month-over-month spikes, detects micro-expense leakage (&lt;₹500), and flags suspected duplicate transactions within 24 hours.
          </p>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#0C2B35] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-sm font-bold text-[#0B1D33]">Privacy &amp; Data Isolation</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Strict multi-tenant scoping where queries require your authenticated user ID. Sessions secured via HttpOnly, SameSite cookies.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-[#0C2B35]" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-[#0B1D33] hover:text-[#0C2B35] transition-colors py-1"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 leading-relaxed mt-2 pt-1 pr-4 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Contact Box */}
      <div className="p-6 rounded-[22px] bg-gradient-to-br from-[#0C2B35] to-[#154352] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="space-y-1">
          <h3 className="text-base font-bold">Need Help or Found an Issue?</h3>
          <p className="text-xs text-white/70">
            Our engineering team is actively supporting the RupeeWise hackathon deployment.
          </p>
        </div>
        <a
          href="mailto:support@rupeewise.ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE5D4] text-[#0C2B35] text-xs font-bold hover:bg-white transition-colors self-start sm:self-auto shadow-sm"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Support</span>
        </a>
      </div>
    </div>
  );
};

export default HelpSupportPage;
