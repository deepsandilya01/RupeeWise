import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Bot,
  PieChart,
  Target,
  Activity,
  LineChart,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

export const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-[720px] bg-[#FFFCF8] rounded-[24px] sm:rounded-[28px] border border-[#E8DFD3] shadow-[0_20px_60px_-15px_rgba(7,55,70,0.18)] overflow-hidden text-[#0B1D33] select-none">
      <div className="flex flex-col md:flex-row min-h-[460px]">
        {/* Left Dark Teal Sidebar */}
        <div className="w-full md:w-[155px] bg-[#0C2B35] text-white p-3.5 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-1.5 mb-5 px-1 pt-1">
              <svg viewBox="0 0 32 32" className="w-5 h-5 flex-shrink-0" fill="none">
                <path
                  d="M16 4C10 4 6 9 6 15C6 21 11 25 16 28C13 24 13 18 16 14C19 10 23 8 26 4C22 4 19 4 16 4Z"
                  fill="#FF624F"
                />
                <path
                  d="M16 28C22 28 26 23 26 17C26 11 21 7 16 4C19 8 19 14 16 18C13 22 9 24 6 28C10 28 13 28 16 28Z"
                  fill="#5EA286"
                />
              </svg>
              <span className="font-bold text-xs tracking-tight">RupeeWise AI</span>
            </div>

            {/* Nav Items */}
            <nav className="space-y-1 text-[11px] font-medium text-white/70">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#15414E] text-white font-semibold">
                <LayoutDashboard className="w-3.5 h-3.5 text-coral-400" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <Receipt className="w-3.5 h-3.5" />
                <span>Transactions</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Coach</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <PieChart className="w-3.5 h-3.5" />
                <span>Budget</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <Target className="w-3.5 h-3.5" />
                <span>Goals</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <Activity className="w-3.5 h-3.5" />
                <span>Simulator</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <LineChart className="w-3.5 h-3.5" />
                <span>Insights</span>
              </div>
            </nav>
          </div>

          {/* Bottom notifications indicator */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2 text-[10px] text-white/60">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-coral-400" />
              <span>Notifications</span>
            </div>
            <span className="w-4 h-4 rounded-full bg-coral-500 text-white font-bold text-[9px] flex items-center justify-center">
              2
            </span>
          </div>
        </div>

        {/* Right Dashboard Body */}
        <div className="flex-1 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden bg-[#FFFDF9]">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div className="relative flex-1 max-w-[240px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                readOnly
                placeholder="Search transactions, insights..."
                className="w-full pl-8 pr-2 py-1 text-[10px] bg-gray-50 border border-gray-200/80 rounded-full focus:outline-none placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-3.5 h-3.5 text-gray-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 absolute -top-0.5 -right-0.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[9px] flex items-center justify-center border border-amber-300">
                  D
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] font-bold text-[#0B1D33] leading-none">Deep Sandilya</div>
                  <div className="text-[8px] text-gray-400 leading-none mt-0.5">Free Plan</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-semibold text-gray-600 bg-gray-100/70 px-2 py-0.5 rounded-full border border-gray-200">
                <span>October 2026</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="py-2.5 text-left">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0B1D33] flex items-center gap-1.5">
              <span>Good Morning, Deep</span>
              <span>👋</span>
            </h3>
            <p className="text-[10px] text-gray-500">
              Here&apos;s your financial snapshot for October 2026
            </p>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {/* Card 1: Balance */}
            <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left">
              <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium">
                <span>Total Balance</span>
                <span className="w-4 h-4 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center text-[8px] font-bold">₹</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#0B1D33] mt-0.5">
                ₹1,24,530
              </div>
              <div className="text-[8px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span>+8.2% from last month</span>
              </div>
            </div>

            {/* Card 2: Income */}
            <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left">
              <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium">
                <span>Monthly Income</span>
                <span className="w-4 h-4 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-[8px] font-bold">↑</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#0B1D33] mt-0.5">
                ₹45,000
              </div>
              <div className="text-[8px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span>+5.1% from last month</span>
              </div>
            </div>

            {/* Card 3: Expenses */}
            <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-left">
              <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium">
                <span>Monthly Expenses</span>
                <span className="w-4 h-4 rounded-md bg-coral-50 text-coral-600 flex items-center justify-center text-[8px] font-bold">↓</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#0B1D33] mt-0.5">
                ₹28,340
              </div>
              <div className="text-[8px] text-coral-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowDownLeft className="w-2.5 h-2.5" />
                <span>-3.4% from last month</span>
              </div>
            </div>

            {/* Card 4: Savings Rate */}
            <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between text-left">
              <div>
                <div className="text-[9px] text-gray-400 font-medium">Savings Rate</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0B1D33] mt-0.5">37%</div>
                <div className="text-[8px] text-emerald-600 font-semibold mt-0.5">Great progress!</div>
              </div>
              <div className="relative w-8 h-8 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-coral-500"
                    strokeDasharray="37, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Row Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {/* Expense Overview Donut */}
            <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#0B1D33] mb-2">
                <span>Expense Overview</span>
                <span className="text-[8px] font-medium text-gray-400 flex items-center gap-0.5">
                  This Month <ChevronDown className="w-2 h-2" />
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* SVG Donut */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#073746" strokeWidth="5" strokeDasharray="32, 100" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#FF624F" strokeWidth="5" strokeDasharray="19, 100" strokeDashoffset="-32" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3D8569" strokeWidth="5" strokeDasharray="15, 100" strokeDashoffset="-51" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F8B693" strokeWidth="5" strokeDasharray="12, 100" strokeDashoffset="-66" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#CBD5E1" strokeWidth="5" strokeDasharray="22, 100" strokeDashoffset="-78" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[7px] font-bold text-[#0B1D33] text-center leading-tight">
                    <span>₹28,340</span>
                    <span className="text-[5px] text-gray-400">Total Spent</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] text-gray-500 flex-1">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#073746]" /> Food</span> <span className="font-bold text-[#0B1D33]">32%</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FF624F]" /> Shopping</span> <span className="font-bold text-[#0B1D33]">19%</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3D8569]" /> Rent</span> <span className="font-bold text-[#0B1D33]">15%</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F8B693]" /> Transport</span> <span className="font-bold text-[#0B1D33]">12%</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Subs</span> <span className="font-bold text-[#0B1D33]">8%</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Utilities</span> <span className="font-bold text-[#0B1D33]">7%</span></div>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Bar Chart */}
            <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#0B1D33] mb-1.5">
                <span>Income vs Expenses</span>
                <div className="flex items-center gap-2 text-[8px]">
                  <span className="flex items-center gap-1 text-gray-500"><span className="w-1.5 h-1.5 rounded-xs bg-[#073746]" /> Income</span>
                  <span className="flex items-center gap-1 text-gray-500"><span className="w-1.5 h-1.5 rounded-xs bg-[#FF624F]" /> Expenses</span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-16 flex items-end justify-between gap-1 pt-1 border-b border-gray-100">
                {[
                  { month: 'May', inc: 38, exp: 26 },
                  { month: 'Jun', inc: 42, exp: 31 },
                  { month: 'Jul', inc: 40, exp: 28 },
                  { month: 'Aug', inc: 48, exp: 33 },
                  { month: 'Sep', inc: 44, exp: 29 },
                  { month: 'Oct', inc: 45, exp: 28 },
                ].map((b) => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex items-end justify-center gap-0.5 h-12">
                      <div className="w-1.5 bg-[#073746] rounded-t-xs" style={{ height: `${b.inc}%` }} />
                      <div className="w-1.5 bg-[#FF624F] rounded-t-xs" style={{ height: `${b.exp}%` }} />
                    </div>
                    <span className="text-[7px] text-gray-400">{b.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
