import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import { fetchTransactionSummary } from '../../features/transactions/transactionThunks.js';
import authService from '../../services/authService.js';
import MetricCardsRow from '../../components/dashboard/MetricCardsRow.jsx';
import ExpenseOverviewCard from '../../components/dashboard/ExpenseOverviewCard.jsx';
import IncomeExpensesCard from '../../components/dashboard/IncomeExpensesCard.jsx';
import AIMoneyCoachWidget from '../../components/dashboard/AIMoneyCoachWidget.jsx';
import RecentTransactionsCard from '../../components/dashboard/RecentTransactionsCard.jsx';
import AIInsightCard from '../../components/dashboard/AIInsightCard.jsx';
import YourGoalsCard from '../../components/dashboard/YourGoalsCard.jsx';
import WhatIfSimulatorWidget from '../../components/dashboard/WhatIfSimulatorWidget.jsx';
import FreedomBannerCard from '../../components/dashboard/FreedomBannerCard.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Deep';
  const [seeding, setSeeding] = useState(false);

  const dispatch = useAppDispatch();
  const { summary } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactionSummary());
  }, [dispatch]);

  const handleSeedDemoData = async () => {
    try {
      setSeeding(true);
      await authService.seedDemoData();
      toast.success('Sample dataset reloaded with 31 transactions!');
      dispatch(fetchTransactionSummary());
    } catch (err) {
      toast.error('Unable to populate demo dataset');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-5 select-none">
      {/* 1. Top Section: Greeting & AI Coach in a 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side (Greeting + Metrics + Charts) -> Spans 8 cols on desktop */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          {/* Greeting Row with Handwritten Flourish */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D33] tracking-tight">
                Good Morning, {firstName} <span className="inline-block animate-wave">👋</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <p className="text-xs text-gray-500 font-medium">
                  Here's your live financial snapshot for October 2026
                </p>
                {user?.isDemo && (
                  <button
                    type="button"
                    onClick={handleSeedDemoData}
                    disabled={seeding}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF624F]/10 hover:bg-[#FF624F]/20 text-[#D9381E] border border-[#FF624F]/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{seeding ? 'Populating...' : 'Reset Demo Dataset (31 Transactions)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* "Smarter Money Decisions for a Brighter You." Tagline with Peach Arc */}
            <div className="relative self-start sm:self-auto pr-2">
              <svg
                className="absolute -top-3 -right-2 w-28 h-12 text-[#FDBA74]/35 pointer-events-none"
                viewBox="0 0 100 40"
                fill="none"
              >
                <path
                  d="M10,35 Q60,-5 90,25"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>

              <span className="relative z-10 font-serif italic text-sm text-[#0C3846]/90 font-semibold tracking-wide block">
                Smarter Money Decisions <br className="hidden sm:inline" />
                for a Brighter You.
              </span>
            </div>
          </div>

          {/* 4 Metric Summary Cards Connected to Live Data */}
          <MetricCardsRow summary={summary} />

          {/* 2 Analytical Charts Side-by-Side Connected to Live Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExpenseOverviewCard summary={summary} />
            <IncomeExpensesCard summary={summary} />
          </div>
        </div>

        {/* Right Side: AI Money Coach Widget -> Spans 4 cols on desktop */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[460px]">
          <AIMoneyCoachWidget />
        </div>
      </div>

      {/* 2. Middle Row: 3 Cards Across (Recent Transactions, AI Insight, Your Goals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RecentTransactionsCard summary={summary} />
        <AIInsightCard />
        <YourGoalsCard />
      </div>

      {/* 3. Bottom Row: What-If Simulator (7 cols) + Freedom Banner (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <WhatIfSimulatorWidget summary={summary} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <FreedomBannerCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
