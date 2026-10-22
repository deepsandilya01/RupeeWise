import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAIInsights,
  fetchRecommendations,
  updateRecommendationStatus,
  runSimulation,
  askAICoach,
  fetchGoals,
  fetchBudgets,
  fetchAiStatus,
} from './aiThunks.js';

const initialState = {
  insights: {
    currentSummary: { monthlyIncome: 0, monthlyExpenses: 0, netCashFlow: 0, savingsRate: 0, categories: [] },
    prevSummary: { monthlyExpenses: 0, categories: [] },
    momComparisons: [],
    smallExpenses: { count: 0, total: 0 },
    potentialRecurring: [],
    suspectedDuplicates: [],
    anomalies: [],
    wellnessScore: {
      score: 75,
      breakdown: {
        savingsRate: { points: 20, max: 30 },
        budgetAdherence: { points: 20, max: 25 },
        spendingStability: { points: 20, max: 25 },
        goalProgress: { points: 15, max: 20 },
      },
    },
  },
  recommendations: [],
  simulationResult: null,
  goals: [],
  budgets: [],
  aiStatus: null,
  selectedProvider: 'auto',
  chatMessages: [
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Hi Deep! 👋 I'm your RupeeWise AI Money Coach.\n\nI monitor your cashflow, analyze category trends, spot spending anomalies, and help you reach your financial goals faster.\n\nAsk me anything or choose a quick prompt below!",
      provider: 'rules-based',
      model: 'RupeeWise Deterministic Financial Rules Engine',
      suggestions: [
        'Where is most of my money going?',
        'How can I save ₹2,000 every month?',
        'Which expenses increased this month?',
        'Can I afford a major purchase?',
        'Help me create a monthly budget',
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  coachLoading: false,
  simulationLoading: false,
  error: null,
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setSelectedProvider(state, action) {
      state.selectedProvider = action.payload;
    },
    addLocalUserMessage(state, action) {
      state.chatMessages.push({
        id: 'user-' + Date.now(),
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearChat(state) {
      state.chatMessages = [initialState.chatMessages[0]];
    },
  },
  extraReducers: (builder) => {
    // 1. Insights
    builder
      .addCase(fetchAIInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload || state.insights;
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 2. Recommendations
    builder
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload || [];
      })
      .addCase(updateRecommendationStatus.fulfilled, (state, action) => {
        state.recommendations = state.recommendations.filter(
          (r) => r.id !== action.payload.id
        );
      });

    // 3. Simulation
    builder
      .addCase(runSimulation.pending, (state) => {
        state.simulationLoading = true;
      })
      .addCase(runSimulation.fulfilled, (state, action) => {
        state.simulationLoading = false;
        state.simulationResult = action.payload;
      })
      .addCase(runSimulation.rejected, (state) => {
        state.simulationLoading = false;
      });

    // 4. Coach Chat Query
    builder
      .addCase(askAICoach.pending, (state) => {
        state.coachLoading = true;
      })
      .addCase(askAICoach.fulfilled, (state, action) => {
        state.coachLoading = false;
        state.chatMessages.push({
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: action.payload.reply,
          provider: action.payload.provider || action.payload.source || 'rules-based',
          model: action.payload.model,
          fallbackReason: action.payload.fallbackReason,
          suggestions: action.payload.suggestions || [],
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askAICoach.rejected, (state, action) => {
        state.coachLoading = false;
        state.chatMessages.push({
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: action.payload || 'Sorry, I encountered an issue analyzing your financial records. Please try again.',
          provider: 'error',
          timestamp: new Date().toISOString(),
        });
      });

    // 5. Goals
    builder.addCase(fetchGoals.fulfilled, (state, action) => {
      state.goals = action.payload || [];
    });

    // 6. Budgets
    builder.addCase(fetchBudgets.fulfilled, (state, action) => {
      state.budgets = action.payload || [];
    });

    // 7. AI Status
    builder.addCase(fetchAiStatus.fulfilled, (state, action) => {
      state.aiStatus = action.payload;
    });
  },
});

export const { setSelectedProvider, addLocalUserMessage, clearChat } = aiSlice.actions;
export default aiSlice.reducer;
