import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import {
  fetchAIInsights,
  fetchRecommendations,
  updateRecommendationStatus,
  runSimulation,
  askAICoach,
  fetchGoals,
  createGoal,
  addGoalContribution,
  deleteGoal,
  fetchBudgets,
  setBudget,
  fetchAiStatus,
} from '../../features/ai/aiThunks.js';
import { addLocalUserMessage, setSelectedProvider } from '../../features/ai/aiSlice.js';
import MarkdownMessage from '../../components/common/MarkdownMessage.jsx';
import useToast from '../../hooks/useToast.js';
import {
  Sparkles,
  Bot,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Target,
  PieChart,
  ArrowRight,
  TrendingUp,
  Send,
  Loader2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export const AICoachPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    insights,
    recommendations,
    simulationResult,
    goals,
    budgets,
    chatMessages,
    coachLoading,
    simulationLoading,
    loading,
    aiStatus,
    selectedProvider,
  } = useAppSelector((state) => state.ai);

  // Active view tab synced with URL query (?tab=coach|actions|simulator|budgets|goals)
  const urlTab = searchParams.get('tab');
  const validTabs = ['coach', 'actions', 'simulator', 'budgets', 'goals'];
  const initialTab = validTabs.includes(urlTab) ? urlTab : 'coach';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const [chatInput, setChatInput] = useState('');

  // Simulator local state
  const [simCategory, setSimCategory] = useState('Food & Dining');
  const [simMonthlyReduction, setSimMonthlyReduction] = useState(2000);
  const [simHorizon, setSimHorizon] = useState(12);
  const [simOneTime, setSimOneTime] = useState(0);

  // Modals
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    monthlyContribution: '',
    category: 'Technology',
  });

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food & Dining',
    monthlyLimit: '',
    alertThreshold: 80,
  });

  const [contribModalOpen, setContribModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState('');

  // Initial load
  useEffect(() => {
    dispatch(fetchAIInsights());
    dispatch(fetchRecommendations());
    dispatch(fetchGoals());
    dispatch(fetchBudgets());
    dispatch(fetchAiStatus());
    dispatch(
      runSimulation({
        category: simCategory,
        monthlyReduction: simMonthlyReduction,
        timeHorizonMonths: simHorizon,
        oneTimeContribution: simOneTime,
      })
    );
  }, [dispatch]);

  const handleSendChat = (messageToSend) => {
    const text = messageToSend || chatInput;
    if (!text.trim() || coachLoading) return;

    dispatch(addLocalUserMessage(text.trim()));
    dispatch(askAICoach({ message: text.trim(), provider: selectedProvider }));
    setChatInput('');
  };

  const handleSimulateChange = (updates) => {
    const nextCategory = updates.category !== undefined ? updates.category : simCategory;
    const nextReduction = updates.monthlyReduction !== undefined ? updates.monthlyReduction : simMonthlyReduction;
    const nextHorizon = updates.timeHorizonMonths !== undefined ? updates.timeHorizonMonths : simHorizon;
    const nextOneTime = updates.oneTimeContribution !== undefined ? updates.oneTimeContribution : simOneTime;

    if (updates.category !== undefined) setSimCategory(updates.category);
    if (updates.monthlyReduction !== undefined) setSimMonthlyReduction(updates.monthlyReduction);
    if (updates.timeHorizonMonths !== undefined) setSimHorizon(updates.timeHorizonMonths);
    if (updates.oneTimeContribution !== undefined) setSimOneTime(updates.oneTimeContribution);

    dispatch(
      runSimulation({
        category: nextCategory,
        monthlyReduction: nextReduction,
        timeHorizonMonths: nextHorizon,
        oneTimeContribution: nextOneTime,
      })
    );
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;
    try {
      await dispatch(
        createGoal({
          name: newGoal.name,
          targetAmount: Number(newGoal.targetAmount),
          currentAmount: Number(newGoal.currentAmount || 0),
          monthlyContribution: Number(newGoal.monthlyContribution || 0),
          category: newGoal.category,
        })
      ).unwrap();
      toast.success(`Savings goal "${newGoal.name}" created!`);
      setGoalModalOpen(false);
      setNewGoal({ name: '', targetAmount: '', currentAmount: '', monthlyContribution: '', category: 'Technology' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create goal');
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !contribAmount) return;
    try {
      await dispatch(addGoalContribution({ id: selectedGoal.id, amount: Number(contribAmount) })).unwrap();
      toast.success(`Contributed ₹${Number(contribAmount).toLocaleString('en-IN')} to ${selectedGoal.name}!`);
      setContribModalOpen(false);
      setSelectedGoal(null);
      setContribAmount('');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to record contribution');
    }
  };

  const handleDeleteGoal = async (id, name) => {
    try {
      await dispatch(deleteGoal(id)).unwrap();
      toast.success(`Goal "${name || 'item'}" removed`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to delete goal');
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.monthlyLimit) return;
    try {
      await dispatch(
        setBudget({
          category: newBudget.category,
          monthlyLimit: Number(newBudget.monthlyLimit),
          alertThreshold: Number(newBudget.alertThreshold || 80),
        })
      ).unwrap();
      toast.success(`Monthly budget for ${newBudget.category} set to ₹${Number(newBudget.monthlyLimit).toLocaleString('en-IN')}`);
      setBudgetModalOpen(false);
      setNewBudget({ category: 'Food & Dining', monthlyLimit: '', alertThreshold: 80 });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update budget limit');
    }
  };

  const wellnessScore = insights?.wellnessScore?.score || 78;
  const wellnessBreakdown = insights?.wellnessScore?.breakdown;

  const quickPrompts = [
    'Where is most of my money going?',
    'How can I save ₹2,000 every month?',
    'Which expenses increased this month?',
    'Can I afford a major purchase?',
    'How much could I save in 12 months?',
    'Help me create a monthly budget',
  ];

  return (
    <div className="space-y-6 select-none text-left">
      {/* 1. Header & Financial Wellness Banner */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D33] tracking-tight">
              AI Money Action Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-[#0C3846] font-bold text-[10px] uppercase border border-[#FED7AA]/60">
              Personalized Intelligence
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
            Following the closed loop: <strong>Analyze Spending → Identify Opportunity → Recommend Action → Simulate Savings → Track Progress</strong>. Grounded in your live transactions.
          </p>
        </div>

        {/* Financial Wellness Score Dial */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center gap-4 flex-shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#F3F4F6" strokeWidth="3.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={wellnessScore >= 75 ? '#3D8569' : wellnessScore >= 50 ? '#FBBF24' : '#F35C48'}
                strokeWidth="3.5"
                strokeDasharray={`${wellnessScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-extrabold text-[#0B1D33]">{wellnessScore}</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-[#0B1D33]">Financial Wellness</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">
              {wellnessScore >= 75 ? 'Strong Cashflow Buffer' : 'Moderate Resilience'}
            </div>
            <div className="text-[9px] text-gray-400 mt-1 max-w-[130px] leading-tight">
              Based on savings rate, budget discipline &amp; goal velocity
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'coach', label: 'AI Money Coach', icon: <Bot className="w-4 h-4" /> },
          { id: 'actions', label: `Action Engine (${recommendations.length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'simulator', label: 'What-If Simulator', icon: <SlidersHorizontal className="w-4 h-4" /> },
          { id: 'budgets', label: `Budgets & Radar (${budgets.length})`, icon: <PieChart className="w-4 h-4" /> },
          { id: 'goals', label: `Goals (${goals.length})`, icon: <Target className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0C3846] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: AI Money Coach Conversation */}
      {activeTab === 'coach' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Chat Stream (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-coral-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0B1D33]">Coach Thread</h3>
                    <p className="text-[10px] text-gray-400">Grounded in your authenticated financial records</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Engine:</span>
                  <select
                    value={selectedProvider}
                    onChange={(e) => dispatch(setSelectedProvider(e.target.value))}
                    className="text-xs font-semibold bg-[#FAF6EE] text-[#073746] border border-[#E7DFD0] rounded-xl px-2.5 py-1 outline-none cursor-pointer hover:border-[#073746] transition-colors"
                  >
                    <option value="auto">Auto (Smart Fallback)</option>
                    <option value="gemini">Google Gemini (Flash)</option>
                    <option value="mistral">Mistral AI (Small)</option>
                    <option value="rules-based">RupeeWise Rules Engine</option>
                  </select>
                </div>
              </div>

              {/* Message History */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      m.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-xl bg-[#0C3846] text-white flex items-center justify-center text-[10px] flex-shrink-0 font-bold shadow-2xs">
                        RW
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        m.sender === 'user'
                          ? 'bg-[#0C3846] text-white rounded-tr-none'
                          : 'bg-[#FFF8F4] border border-[#FFE5D4] text-[#0B1D33] rounded-tl-none'
                      }`}
                    >
                      {m.sender === 'user' ? (
                        <p className="whitespace-pre-line">{m.text}</p>
                      ) : (
                        <MarkdownMessage content={m.text} className="text-[#0B1D33]" />
                      )}
                      {m.sender === 'ai' && (
                        <div className="mt-2 pt-2 border-t border-[#FFE5D4]/70 text-[9px] font-semibold text-gray-400 flex flex-wrap items-center justify-between gap-1">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>
                              {m.provider === 'gemini'
                                ? 'Google Gemini'
                                : m.provider === 'mistral'
                                ? 'Mistral AI'
                                : m.provider === 'rules-based' || m.source === 'rules-based'
                                ? 'RupeeWise Financial Rules Engine'
                                : 'RupeeWise AI'}
                            </span>
                            {m.model && <span className="text-gray-400 font-normal">({m.model})</span>}
                          </span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      {m.fallbackReason && (
                        <div className="mt-1.5 text-[9px] font-medium text-amber-800 bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/80 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>{m.fallbackReason.includes('Switched to') ? 'Switched to RupeeWise Financial Rules Engine' : m.fallbackReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {coachLoading && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 italic py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-coral-500" />
                    <span>Crunching your category debits and cashflow math...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about your dining expenses, savings target, or monthly budget..."
                className="flex-1 bg-gray-50 border border-gray-200/90 rounded-full px-4 py-2.5 text-xs text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C3846]/30"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={coachLoading || !chatInput.trim()}
                className="w-9 h-9 rounded-full bg-[#0C3846] hover:bg-[#134b5c] text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(p)}
                  className="w-full p-2.5 rounded-xl border border-gray-200/80 bg-[#FFFDF9] hover:bg-peach-50 text-left text-xs font-semibold text-gray-700 hover:text-[#0C3846] transition-colors flex items-center justify-between group"
                >
                  <span>{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-coral-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200/70 text-[11px] text-gray-500 leading-relaxed">
                <span className="font-bold text-[#0B1D33] block mb-1">Privacy Guarantee</span>
                Your transactions never leave your secure account. All numbers in answers are computed strictly from your authenticated records.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Action Engine Recommendations */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1D33]">Recommended Financial Actions</h3>
              <p className="text-xs text-gray-500">
                Actionable opportunities discovered from your transaction history with projected monthly and annual savings
              </p>
            </div>
            <button
              onClick={() => dispatch(fetchRecommendations())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Insights</span>
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200/80 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-[#0B1D33]">All Caught Up!</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No active recommendations at the moment. As you log more transactions, the Action Engine will scan for new optimization opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-coral-50 text-coral-600 border border-coral-200/60">
                        {rec.category}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400">
                        Confidence: <span className="text-[#0B1D33] font-bold capitalize">{rec.confidence}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#0B1D33]">{rec.title}</h4>

                    {/* Observation */}
                    <div className="mt-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 leading-relaxed">
                      <strong className="text-gray-900 block text-[11px] mb-0.5">Evidence:</strong>
                      {rec.observation}
                    </div>

                    {/* Suggested Action */}
                    <p className="text-xs text-gray-700 font-medium mt-2.5 leading-relaxed">
                      💡 <span className="font-semibold">{rec.action}</span>
                    </p>
                  </div>

                  {/* Projected Savings & Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Est. Monthly Savings</div>
                      <div className="text-base font-extrabold text-emerald-600">
                        ₹{Number(rec.estimatedMonthlySavings).toLocaleString('en-IN')}
                        <span className="text-[10px] text-gray-400 font-normal"> (~₹{Number(rec.estimatedAnnualSavings).toLocaleString('en-IN')}/yr)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateRecommendationStatus({ id: rec.id, status: 'dismissed' }))}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          dispatch(updateRecommendationStatus({ id: rec.id, status: 'accepted' }));
                          setActiveTab('simulator');
                          handleSimulateChange({
                            category: rec.category,
                            monthlyReduction: rec.estimatedMonthlySavings,
                          });
                        }}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0C3846] hover:bg-[#134b5c] transition-colors shadow-2xs"
                      >
                        Simulate Action
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Interactive What-If Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] p-6 space-y-5 text-left">
            <div>
              <div className="flex items-center gap-2 text-coral-500 mb-1">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Interactive Simulator</span>
              </div>
              <h3 className="text-base font-extrabold text-[#0B1D33]">Simulate Wealth Acceleration</h3>
              <p className="text-xs text-gray-500 mt-1">
                See how a realistic monthly expense reduction compounds over time
              </p>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Category</label>
              <select
                value={simCategory}
                onChange={(e) => handleSimulateChange({ category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 text-[#0B1D33] font-semibold"
              >
                <option value="Food & Dining">Food &amp; Dining (Discretionary)</option>
                <option value="Shopping">Shopping &amp; Retail</option>
                <option value="Subscriptions & Entertainment">Subscriptions</option>
                <option value="All">All Expenses Combined</option>
              </select>
            </div>

            {/* Monthly Reduction Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-600 font-medium">Monthly Expense Reduction</span>
                <span className="text-xs font-extrabold text-[#0B1D33] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  ₹{Number(simMonthlyReduction).toLocaleString('en-IN')}/mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={simMonthlyReduction}
                onChange={(e) => handleSimulateChange({ monthlyReduction: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F35C48]"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1">
                <span>₹500</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Time Horizon</label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSimulateChange({ timeHorizonMonths: m })}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      simHorizon === m
                        ? 'bg-[#0C3846] text-white border-[#0C3846]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {m >= 12 ? `${m / 12}Y` : `${m}M`}
                  </button>
                ))}
              </div>
            </div>

            {/* One-Time Contribution (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                One-Time Deposit <span className="text-gray-400 font-normal">(Optional bonus/savings)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={simOneTime}
                  onChange={(e) => handleSimulateChange({ oneTimeContribution: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 text-[#0B1D33] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Projection & Goal Acceleration Output (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFF8F4] border border-[#FED7AA]/70 rounded-3xl p-6 flex flex-col justify-between text-left space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Projected Output</span>
                <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
                  +{simulationResult?.percentageIncrease || 28}% Net Cashflow Growth
                </span>
              </div>

              <div className="mt-2">
                <div className="text-xs text-gray-500">Total Additional Contributions ({simHorizon} Months)</div>
                <div className="text-3xl font-extrabold text-[#0B1D33] tracking-tight">
                  ₹{Number(simulationResult?.totalExtraContributions || 29000).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Combined wealth buffer with baseline savings: <strong className="text-gray-900">₹{Number(simulationResult?.newTotalProjectedSavings || 180000).toLocaleString('en-IN')}</strong>
                </p>
              </div>

              {/* Goal Impact List */}
              {simulationResult?.goalImpact && simulationResult.goalImpact.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#FED7AA]/60 space-y-2">
                  <h4 className="text-xs font-bold text-[#0B1D33]">Impact on Your Goals</h4>
                  {simulationResult.goalImpact.map((g) => (
                    <div key={g.goalId} className="bg-white/80 p-2.5 rounded-xl border border-[#FED7AA]/60 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-coral-500 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-[#0B1D33]">{g.name}</div>
                          <div className="text-[10px] text-gray-500">{g.explanation}</div>
                        </div>
                      </div>
                      {g.monthsSaved > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
                          {g.monthsSaved} mo faster
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[10px] text-gray-400 bg-white/60 p-3 rounded-xl border border-gray-200/60 leading-relaxed">
              <strong>Transparent Formula:</strong> {simulationResult?.formulaExplanation || 'Projected extra savings = (monthly reduction × months) + one-time contribution.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Category Budgets & Anomaly Radar */}
      {activeTab === 'budgets' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1D33]">Category Budgets &amp; Anomaly Watch</h3>
              <p className="text-xs text-gray-500">
                Track category limits and detect unusual spending spikes in real-time
              </p>
            </div>
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C3846] text-white text-xs font-bold rounded-xl hover:bg-[#134b5c]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Category Budget</span>
            </button>
          </div>

          {/* Budgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <div key={b.id || b.category} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0B1D33]">{b.category}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'exceeded'
                        ? 'bg-red-100 text-red-700'
                        : b.status === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#0B1D33]">₹{Number(b.actualSpend).toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 font-medium">Limit: ₹{Number(b.monthlyLimit).toLocaleString('en-IN')}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.status === 'exceeded'
                          ? 'bg-red-500'
                          : b.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-[#0C3846]'
                      }`}
                      style={{ width: `${Math.min(100, b.percentConsumed)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>{b.percentConsumed}% consumed</span>
                    <span>
                      {b.remaining >= 0 ? `₹${Number(b.remaining).toLocaleString('en-IN')} left` : `₹${Math.abs(b.remaining).toLocaleString('en-IN')} over limit`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Anomaly & Recurring Expense Radar */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Automated Anomaly &amp; Recurring Subscriptions Radar</span>
            </h4>

            {insights?.anomalies?.length === 0 && insights?.potentialRecurring?.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No anomalies or unusual duplicates detected in your recent transactions.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spikes */}
                {insights?.anomalies?.map((a, i) => (
                  <div key={i} className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unusual Spike in {a.category}</span>
                    </div>
                    <p className="text-gray-600">
                      <strong>{a.title}</strong> of ₹{Number(a.amount).toLocaleString('en-IN')} is {a.ratio} your average spend in {a.category}.
                    </p>
                  </div>
                ))}

                {/* Recurring Subscriptions */}
                {insights?.potentialRecurring?.map((r, i) => (
                  <div key={i} className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Potential Recurring Subscription: {r.merchant}</span>
                    </div>
                    <p className="text-gray-600">
                      Identified consistent payments of ~₹{Number(r.averageAmount).toLocaleString('en-IN')} in {r.category} across {r.frequency} cycles.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Savings Goals Manager */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1D33]">Savings Goals</h3>
              <p className="text-xs text-gray-500">
                Track your priority financial milestones with automated contribution schedules
              </p>
            </div>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C3846] text-white text-xs font-bold rounded-xl hover:bg-[#134b5c]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-peach-100 text-coral-500 flex items-center justify-center font-bold text-xs">
                      🎯
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0B1D33]">{g.name}</h4>
                      <span className="text-[10px] text-gray-400 capitalize">{g.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0C3846]">{g.progressPercentage}%</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-700">₹{Number(g.currentAmount).toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 font-medium">Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0C3846] rounded-full transition-all duration-500"
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹{Number(g.remainingAmount).toLocaleString('en-IN')} remaining</span>
                    {g.estimatedMonthsRemaining && <span>~{g.estimatedMonthsRemaining} months left</span>}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setContribModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3846] hover:text-coral-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Contribute</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGoal(g.id, g.name)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Create Goal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0B1D33]">New Savings Goal</h3>
              <button onClick={() => setGoalModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Goal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Fund, Europe Trip"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Already Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Monthly Plan (₹/mo)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                >
                  <option value="Technology">Technology</option>
                  <option value="Travel">Travel</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Home">Home</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0C3846] text-white font-bold">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Contribute to Goal */}
      {contribModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1D33]">Contribute to "{selectedGoal.name}"</h3>
            <form onSubmit={handleContribute} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deposit Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 5000"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setContribModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Set Category Budget */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1D33]">Set Category Budget</h3>
            <form onSubmit={handleSetBudget} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                >
                  <option value="Food & Dining">Food &amp; Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Housing & Rent">Housing &amp; Rent</option>
                  <option value="Transport & Fuel">Transport &amp; Fuel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Subscriptions & Entertainment">Subscriptions</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Monthly Spending Limit (₹) *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 8000"
                  value={newBudget.monthlyLimit}
                  onChange={(e) => setNewBudget({ ...newBudget, monthlyLimit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setBudgetModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0C3846] text-white font-bold">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoachPage;
