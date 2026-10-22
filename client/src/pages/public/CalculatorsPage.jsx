import React, { useState } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';
import { Calculator, TrendingUp, PieChart, ShieldAlert, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CalculatorsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sip'); // 'sip' | 'budget' | 'emergency'

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // 50/30/20 Budget State
  const [monthlyIncome, setMonthlyIncome] = useState(50000);

  // Emergency Fund State
  const [monthlyOutflow, setMonthlyOutflow] = useState(25000);
  const [emergencyMonths, setEmergencyMonths] = useState(6);

  // --- Real-time SIP Compounding Calculation ---
  // Formula: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
  const monthlyRate = sipReturnRate / 12 / 100;
  const totalMonths = sipYears * 12;
  const totalInvested = sipMonthly * totalMonths;
  const maturityValue = Math.round(
    sipMonthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const wealthGained = Math.max(0, maturityValue - totalInvested);
  const investedPercent = Math.round((totalInvested / maturityValue) * 100) || 50;
  const returnPercent = 100 - investedPercent;

  // --- 50/30/20 Calculation ---
  const needsAmount = Math.round(monthlyIncome * 0.5);
  const wantsAmount = Math.round(monthlyIncome * 0.3);
  const savingsAmount = Math.round(monthlyIncome * 0.2);

  // --- Emergency Fund Calculation ---
  const emergencyCorpus = monthlyOutflow * emergencyMonths;

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased flex flex-col justify-between select-none">
      <div>
        <LandingNavbar />

        {/* Hero Header */}
        <div className="py-14 sm:py-18 bg-[#FAF7F0] border-b border-gray-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
              <Calculator className="w-3.5 h-3.5 text-coral-500" />
              <span>INTERACTIVE FINANCIAL CALCULATORS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1D33]">
              Simulate Wealth &amp; <br />
              <span className="text-[#FF624F]">Plan Every Rupee.</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Live mathematical models to calculate your SIP compounding potential, 50/30/20 budget allocations, and emergency reserve funds.
            </p>

            {/* Calculator Switcher Tabs */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1 bg-white rounded-2xl border border-gray-200/90 shadow-2xs">
                <button
                  onClick={() => setActiveTab('sip')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'sip'
                      ? 'bg-[#073746] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>SIP Calculator</span>
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'budget'
                      ? 'bg-[#073746] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>50/30/20 Budget</span>
                </button>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'emergency'
                      ? 'bg-[#073746] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency Fund</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
          {/* TAB 1: SIP CALCULATOR */}
          {activeTab === 'sip' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Input Area */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">Monthly Investment Amount</label>
                    <span className="text-sm font-extrabold text-[#073746] bg-peach-50 px-3 py-1 rounded-lg border border-[#FED2B8]">
                      ₹{Number(sipMonthly).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    className="w-full accent-[#073746] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹500</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">Expected Annual Return Rate (p.a)</label>
                    <span className="text-sm font-extrabold text-[#073746] bg-peach-50 px-3 py-1 rounded-lg border border-[#FED2B8]">
                      {sipReturnRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="25"
                    step="0.5"
                    value={sipReturnRate}
                    onChange={(e) => setSipReturnRate(Number(e.target.value))}
                    className="w-full accent-[#073746] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>6% (Conservative)</span>
                    <span>12% (Index Nifty 50)</span>
                    <span>25% (Aggressive)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">Time Horizon</label>
                    <span className="text-sm font-extrabold text-[#073746] bg-peach-50 px-3 py-1 rounded-lg border border-[#FED2B8]">
                      {sipYears} {sipYears === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    className="w-full accent-[#073746] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>1 Year</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              {/* Output Display Card */}
              <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 sm:p-7 border border-[#FED2B8] space-y-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  Compounded Maturity Projection
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Invested Amount:</span>
                    <span className="font-bold text-[#0B1D33]">₹{totalInvested.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Est. Wealth Returns:</span>
                    <span className="font-bold text-emerald-700">+₹{wealthGained.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#0B1D33]">Total Future Value:</span>
                    <span className="text-xl sm:text-2xl font-black text-[#073746]">
                      ₹{maturityValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proportional Ratio Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
                    <div style={{ width: `${investedPercent}%` }} className="bg-[#073746] h-full" title="Invested" />
                    <div style={{ width: `${returnPercent}%` }} className="bg-[#FF624F] h-full" title="Estimated Profit" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#073746]" />
                      Invested ({investedPercent}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF624F]" />
                      Returns ({returnPercent}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-xl bg-[#073746] hover:bg-[#0C2B35] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Track This in RupeeWise AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 50/30/20 BUDGET CALCULATOR */}
          {activeTab === 'budget' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h3 className="text-xl font-extrabold text-[#0B1D33] tracking-tight">
                  Enter Your Monthly Take-Home Pay
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The 50/30/20 framework automatically segments your net in-hand earnings into non-negotiable living needs, lifestyle discretionary wants, and automated wealth building.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Monthly In-Hand Salary (₹)</label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 font-black text-xl text-[#073746] bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#073746]/30"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                {/* 50% Needs */}
                <div className="bg-[#F4FAF6] p-4 rounded-2xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      50% Needs
                    </span>
                    <h4 className="text-sm font-bold text-emerald-950 mt-1">Rent, Bills, Food &amp; Transit</h4>
                  </div>
                  <span className="text-lg font-black text-emerald-900">
                    ₹{needsAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 30% Wants */}
                <div className="bg-[#FFF9F2] p-4 rounded-2xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      30% Wants
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 mt-1">Dining Out, Shopping &amp; OTT</h4>
                  </div>
                  <span className="text-lg font-black text-amber-900">
                    ₹{wantsAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 20% Savings */}
                <div className="bg-[#F0F6F8] p-4 rounded-2xl border border-teal-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#073746] bg-[#FFE5D4] px-2 py-0.5 rounded-full">
                      20% Wealth &amp; SIPs
                    </span>
                    <h4 className="text-sm font-bold text-[#073746] mt-1">Index Funds, Emergency Fund</h4>
                  </div>
                  <span className="text-lg font-black text-[#073746]">
                    ₹{savingsAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY FUND CALCULATOR */}
          {activeTab === 'emergency' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h3 className="text-xl font-extrabold text-[#0B1D33] tracking-tight">
                  Calculate Your Financial Safety Shield
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  An emergency fund protects you against sudden job market turbulence, medical copays, or urgent device replacements without touching your long-term investments.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Monthly Fixed Outflows (₹)</label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={monthlyOutflow}
                    onChange={(e) => setMonthlyOutflow(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 font-black text-xl text-[#073746] bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#073746]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Duration to Cover</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 6, 9].map((m) => (
                      <button
                        key={m}
                        onClick={() => setEmergencyMonths(m)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          emergencyMonths === m
                            ? 'bg-[#073746] text-white border-[#073746]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#FAF7F0] rounded-2xl p-7 border border-[#FED2B8] space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Recommended Buffer Corpus
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#073746]">
                  ₹{emergencyCorpus.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  To protect your lifestyle for {emergencyMonths} months without needing any active salary.
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                  <p className="font-bold text-[#0B1D33]">Where should you keep this money?</p>
                  <p>• 30% in high-yield savings account (instant UPI/ATM access)</p>
                  <p>• 70% in Overnight or Liquid Mutual Funds (T+1 business day liquidity)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default CalculatorsPage;
