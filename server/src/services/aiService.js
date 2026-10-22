import config from '../config/env.js';
import financialAnalysisService from './financialAnalysisService.js';
import goalRepository from '../repositories/goalRepository.js';
import geminiProvider from './ai/geminiProvider.js';
import mistralProvider from './ai/mistralProvider.js';
import rulesEngineProvider from './ai/rulesEngineProvider.js';

export const aiService = {
  /**
   * Get safe, non-sensitive AI provider status metadata
   * @returns {Object}
   */
  getAiStatus() {
    return config.getSafeAiConfig();
  },

  /**
   * Resolve which provider adapter to use based on client preference, server config, and availability
   * @param {string} [preferredProvider] - 'gemini' | 'mistral' | 'auto' | 'rules-based'
   * @returns {{ primary: Object, secondary: Object|null, strategy: string }}
   */
  resolveProviders(preferredProvider) {
    const rawStrategy = (preferredProvider || config.AI_PROVIDER || 'auto').toLowerCase().trim();
    const strategy = ['gemini', 'mistral', 'auto', 'rules-based'].includes(rawStrategy) ? rawStrategy : 'auto';

    if (strategy === 'rules-based') {
      return { primary: rulesEngineProvider, secondary: null, strategy };
    }

    if (strategy === 'gemini') {
      return {
        primary: geminiProvider,
        secondary: mistralProvider.isConfigured() ? mistralProvider : null,
        strategy,
      };
    }

    if (strategy === 'mistral') {
      return {
        primary: mistralProvider,
        secondary: geminiProvider.isConfigured() ? geminiProvider : null,
        strategy,
      };
    }

    // 'auto' strategy: pick first configured provider, set other as transient secondary
    if (geminiProvider.isConfigured()) {
      return {
        primary: geminiProvider,
        secondary: mistralProvider.isConfigured() ? mistralProvider : null,
        strategy: 'auto',
      };
    }

    if (mistralProvider.isConfigured()) {
      return {
        primary: mistralProvider,
        secondary: null,
        strategy: 'auto',
      };
    }

    // Default when no external provider is configured
    return {
      primary: rulesEngineProvider,
      secondary: null,
      strategy: 'rules-based',
    };
  },

  /**
   * Ask a financial question to the AI Money Coach
   * Grounded strictly in the authenticated user's real transactions and goals.
   *
   * @param {Object} params
   * @param {string} params.userId - Authenticated user MongoDB ObjectId
   * @param {string} params.message - Question or prompt
   * @param {string} [params.preferredProvider] - 'gemini' | 'mistral' | 'auto' | 'rules-based'
   * @returns {Promise<{ reply: string, provider: string, model: string, suggestions: string[], fallbackReason?: string }>}
   */
  async askCoach({ userId, message, preferredProvider }) {
    if (!message || !message.trim()) {
      const err = new Error('Message cannot be empty');
      err.statusCode = 400;
      throw err;
    }

    const cleanQuery = message.trim();

    // 1. Fetch live financial summary & goals strictly scoped to userId
    const [analysis, goals] = await Promise.all([
      financialAnalysisService.analyzeFinances(userId),
      goalRepository.findAllByUser(userId),
    ]);

    const { currentSummary, momComparisons, smallExpenses, potentialRecurring, budgetAdherence, wellnessScore } =
      analysis;

    // 2. Prepare minimal, privacy-conscious financial context
    // Excludes any personal identifying data, database tokens, or account credentials
    const incomeNum = Number(currentSummary.monthlyIncome || 0);
    const expenseNum = Number(currentSummary.monthlyExpenses || 0);
    const netNum = Number(currentSummary.netCashFlow || 0);

    const anonymizedContext = {
      currency: 'INR (₹)',
      monthlyIncome: incomeNum,
      monthlyIncomeFormatted: `₹${incomeNum.toLocaleString('en-IN')}`,
      monthlyExpenses: expenseNum,
      monthlyExpensesFormatted: `₹${expenseNum.toLocaleString('en-IN')}`,
      netCashFlow: netNum,
      netCashFlowFormatted: `₹${netNum.toLocaleString('en-IN')}`,
      savingsRate: `${currentSummary.savingsRate || 0}%`,
      topSpendingCategories: (currentSummary.categories || []).slice(0, 5).map((c) => ({
        category: c.category,
        spentFormatted: `₹${Number(c.total || 0).toLocaleString('en-IN')}`,
        percentageOfExpenses: `${c.percentage}%`,
      })),
      monthOverMonthTrends: (momComparisons || []).slice(0, 3).map((m) => ({
        category: m.category,
        differenceFormatted: `₹${Number(Math.abs(m.difference || 0)).toLocaleString('en-IN')}`,
        change: `${m.percentageChange}%`,
        trend: m.isIncrease ? 'increased' : 'decreased',
      })),
      activeSavingsGoals: (goals || []).slice(0, 4).map((g) => ({
        goalName: g.name,
        targetAmount: `₹${Number(g.targetAmount || 0).toLocaleString('en-IN')}`,
        currentSaved: `₹${Number(g.currentAmount || 0).toLocaleString('en-IN')}`,
        progress: `${Math.round(((g.currentAmount || 0) / (g.targetAmount || 1)) * 100)}%`,
      })),
      wellnessScore: `${wellnessScore?.score || 70}/100`,
    };

    const systemPrompt = `You are RupeeWise AI Money Coach, an empathetic, highly knowledgeable personal finance expert for users in India.

Scope & Capabilities:
1. Answer ALL user questions thoroughly:
   - Account-specific questions regarding their recorded spending, category breakdowns, savings rate, or active goals.
   - General personal finance questions: budgeting frameworks (50/30/20), emergency funds, SIPs, mutual funds, gold, fixed deposits, credit cards, debt payoff (snowball/avalanche), tax saving (80C), inflation, and long-term wealth creation.
   - Casual conversation, greetings ("Hi", "Hello"), and general guidance.
2. Grounded Financial Context:
   - When the user asks about THEIR specific spending, savings, or goals, use the figures provided in [FINANCIAL CONTEXT]. Never invent unrecorded transactions.
   - When the user asks general financial or educational questions, provide rich, helpful advice using sound financial principles.
3. Indian Currency & Numbering:
   - Always format currency in Indian Rupees using the ₹ symbol.
   - Use the Indian numbering system: thousands (e.g. ₹2,500, ₹45,000), lakhs (e.g. ₹1,10,000, ₹5,50,000), crores (e.g. ₹1,00,00,000).
   - NEVER confuse lakhs with millions (e.g. ₹1,10,000 is 1.1 Lakh, NOT 1,100,000). Always use monthlyIncomeFormatted from the context.
4. Clean Formatting:
   - Structure answers with clear bullet points (* or -), bold labels (**Label:**), and short paragraphs.
   - Never output double nested asterisks or broken formatting.
   - Keep answers practical, encouraging, and easy to skim.`;

    // 3. Resolve provider strategy
    const { primary, secondary, strategy } = this.resolveProviders(preferredProvider);

    // If strategy resolves directly to rules engine (e.g. neither key is configured or explicitly requested)
    if (primary === rulesEngineProvider) {
      return rulesEngineProvider.generateResponse({
        query: cleanQuery,
        analysis,
        goals,
      });
    }

    let primaryError = null;

    // 4. Attempt Primary Provider
    try {
      return await primary.generateResponse({
        prompt: cleanQuery,
        systemPrompt,
        context: anonymizedContext,
      });
    } catch (err) {
      primaryError = err;
      console.warn(`[AI Service] Primary provider '${primary.name}' call failed:`, err.message);

      // Auth or invalid key errors should not blindly retry secondary unless explicitly auto
      if (err.isAuthError) {
        console.warn(`[AI Service] Authentication error on '${primary.name}'. Check server API key.`);
      }
    }

    // 5. Attempt Secondary Provider for eligible transient failures in 'auto' mode
    if (secondary && strategy === 'auto' && primaryError?.isTransient) {
      try {
        console.log(`[AI Service] Attempting secondary provider '${secondary.name}' fallback...`);
        const secondaryResponse = await secondary.generateResponse({
          prompt: cleanQuery,
          systemPrompt,
          context: anonymizedContext,
        });

        return {
          ...secondaryResponse,
          fallbackReason: `Primary provider (${primary.name}) unavailable (${primaryError.message}). Fallback to ${secondary.name} succeeded.`,
        };
      } catch (secondaryErr) {
        console.warn(`[AI Service] Secondary provider '${secondary.name}' also failed:`, secondaryErr.message);
      }
    }

    // 6. Final Safe Fallback: Deterministic RupeeWise Financial Rules Engine
    // Ensures the user always receives accurate, data-grounded insights even during network or provider outages
    const fallbackResponse = rulesEngineProvider.generateResponse({
      query: cleanQuery,
      analysis,
      goals,
    });

    return {
      ...fallbackResponse,
      fallbackReason: `External AI provider (${primary.name}) temporarily unavailable: Switched to RupeeWise Financial Rules Engine.`,
    };
  },
};

export default aiService;
