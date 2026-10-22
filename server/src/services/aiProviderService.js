import config from '../config/env.js';
import financialAnalysisService from './financialAnalysisService.js';
import goalRepository from '../repositories/goalRepository.js';

export const aiProviderService = {
  /**
   * Process a question to the AI Money Coach
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.message
   * @returns {Promise<Object>}
   */
  async askCoach({ userId, message }) {
    if (!message || !message.trim()) {
      const err = new Error('Message cannot be empty');
      err.statusCode = 400;
      throw err;
    }

    const cleanQuery = message.trim();

    // 1. Fetch live financial context for authenticated user
    const [analysis, goals] = await Promise.all([
      financialAnalysisService.analyzeFinances(userId),
      goalRepository.findAllByUser(userId),
    ]);

    const { currentSummary, momComparisons, smallExpenses, potentialRecurring, budgetAdherence, wellnessScore } =
      analysis;

    // 2. Check if external AI provider is configured
    if (config.GEMINI_API_KEY) {
      try {
        return await this.queryGemini({
          query: cleanQuery,
          currentSummary,
          momComparisons,
          goals,
          budgetAdherence,
        });
      } catch (err) {
        console.warn('[AI Provider] Gemini query failed, falling back to deterministic rules engine:', err.message);
      }
    }

    // 3. Deterministic RupeeWise Rules Engine (Grounded in real transaction records)
    return this.generateRulesBasedResponse({
      query: cleanQuery,
      currentSummary,
      momComparisons,
      smallExpenses,
      potentialRecurring,
      budgetAdherence,
      wellnessScore,
      goals,
    });
  },

  /**
   * Query Gemini LLM with anonymized context (if key configured)
   */
  async queryGemini({ query, currentSummary, momComparisons, goals, budgetAdherence }) {
    const anonymizedContext = {
      monthlyIncome: currentSummary.monthlyIncome,
      monthlyExpenses: currentSummary.monthlyExpenses,
      netCashFlow: currentSummary.netCashFlow,
      savingsRate: currentSummary.savingsRate + '%',
      topCategories: (currentSummary.categories || []).slice(0, 4),
      momTrends: momComparisons.slice(0, 3),
      goals: goals.map((g) => ({ name: g.name, target: g.targetAmount, current: g.currentAmount })),
    };

    const systemPrompt = `You are the RupeeWise AI Money Coach. Answer the user's question clearly, politely, and concisely using the provided financial context. Use Indian Rupee (₹) formatting. Never give guaranteed investment returns or specific stock advice.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\nUser Financial Context: ${JSON.stringify(anonymizedContext)}\nUser Question: ${query}` },
              ],
            },
          ],
        }),
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Gemini HTTP error ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('Empty response from Gemini');
    }

    return {
      reply: replyText,
      source: 'gemini',
      suggestions: ['Tell me more', 'How to save ₹2,000?', 'Analyze top spending'],
    };
  },

  /**
   * Deterministic RupeeWise Financial Rules Engine
   */
  generateRulesBasedResponse({
    query,
    currentSummary,
    momComparisons,
    smallExpenses,
    potentialRecurring,
    budgetAdherence,
    wellnessScore,
    goals,
  }) {
    const q = query.toLowerCase();

    // 1. "Where is most of my money going?" / "Analyze spending"
    if (q.includes('where') || q.includes('spending') || q.includes('going') || q.includes('breakdown')) {
      const topCat = (currentSummary.categories || [])[0];
      if (!topCat || currentSummary.monthlyExpenses === 0) {
        return {
          reply: `You haven't recorded any expenses for this month yet. Once you log transactions or import your bank statement, I will break down your exact spending patterns!`,
          source: 'rules-based',
          suggestions: ['Add a transaction', 'Help me create a budget', 'Set a savings goal'],
        };
      }

      const top3 = (currentSummary.categories || [])
        .slice(0, 3)
        .map((c) => `• **${c.category}**: ₹${c.total.toLocaleString('en-IN')} (${c.percentage}%)`)
        .join('\n');

      return {
        reply: `Here is where your money went this month:\n\n${top3}\n\nYour highest outflow was in **${topCat.category}** accounting for **${topCat.percentage}%** of total expenses (₹${topCat.total.toLocaleString('en-IN')}). Consider setting a monthly spending limit in your Budget tab to cap non-essential spikes.`,
        source: 'rules-based',
        suggestions: ['How can I save ₹2,000?', 'Which expenses increased?', 'Create a budget'],
      };
    }

    // 2. "How can I save ₹2,000 every month?" / "Saving tips"
    if (q.includes('save') || q.includes('saving') || q.includes('2,000') || q.includes('2000')) {
      const dining = (currentSummary.categories || []).find((c) =>
        c.category.toLowerCase().includes('dining') || c.category.toLowerCase().includes('food')
      );

      const targetCut = dining && dining.total >= 3000 ? Math.round(dining.total * 0.25) : 2000;
      const weeklyCut = Math.round(targetCut / 4);

      return {
        reply: `Based on your recorded transactions, here is a practical plan to save ~₹2,000/month:\n\n1. **Dining & Takeout**: Trimming ₹${weeklyCut.toLocaleString('en-IN')}/week (about 1-2 restaurant meals or deliveries) will free up ~₹${targetCut.toLocaleString('en-IN')}/month.\n2. **Micro-transactions**: Consolidating quick discretionary purchases could recover ~₹${Math.round(smallExpenses.total * 0.3 || 600).toLocaleString('en-IN')}/month.\n\nOver 12 months, this would accumulate **₹24,000** in your cash buffer!`,
        source: 'rules-based',
        suggestions: ['Simulate this in What-If', 'Set up a dining budget', 'Track savings goal'],
      };
    }

    // 3. "Which expenses increased this month?" / "MoM comparisons"
    if (q.includes('increased') || q.includes('increase') || q.includes('spiked') || q.includes('more than last month')) {
      const increases = momComparisons.filter((m) => m.isIncrease && m.difference > 0);
      if (increases.length === 0) {
        return {
          reply: `Great news! None of your major expense categories showed a noticeable increase compared to last month. Your spending discipline is holding steady.`,
          source: 'rules-based',
          suggestions: ['Where is most money going?', 'How much can I save in 12 months?'],
        };
      }

      const list = increases
        .slice(0, 3)
        .map((m) => `• **${m.category}**: +₹${m.difference.toLocaleString('en-IN')} (+${m.percentageChange}% vs last month)`)
        .join('\n');

      return {
        reply: `The following categories increased in spending compared to last month:\n\n${list}\n\nReviewing these categories can help you spot recurring seasonal costs or lifestyle creep before they become habits.`,
        source: 'rules-based',
        suggestions: ['Set category budget', 'Simulate reduction', 'Ask anything'],
      };
    }

    // 4. "Can I afford a major purchase?" / "Big purchase"
    if (q.includes('afford') || q.includes('major purchase') || q.includes('big purchase') || q.includes('laptop') || q.includes('car')) {
      const net = currentSummary.netCashFlow;
      const rate = currentSummary.savingsRate;

      if (net > 15000) {
        return {
          reply: `With your current monthly net surplus of **₹${net.toLocaleString('en-IN')}** (savings rate **${rate}%**), you have solid discretionary capacity!\n\n**Recommendation**: Rather than using emergency funds, allocate **₹${Math.round(net * 0.4).toLocaleString('en-IN')}/month** toward a dedicated savings goal. You can fully fund a ₹50,000 purchase in ~${Math.ceil(50000 / (net * 0.4))} months without dipping into debt.`,
          source: 'rules-based',
          suggestions: ['Create a goal for this purchase', 'Simulate timeline in What-If'],
        };
      }

      return {
        reply: `Your current monthly net surplus is **₹${Math.max(0, net).toLocaleString('en-IN')}**. A major purchase right now may strain your cashflow buffer.\n\n**Recommendation**: Consider delaying discretionary big-ticket purchases by 2-3 months while setting aside ₹2,000–₹3,000 monthly in a target goal.`,
        source: 'rules-based',
        suggestions: ['How can I save ₹2,000?', 'Where is money going?'],
      };
    }

    // 5. "How much could I save in 12 months?" / "12 months"
    if (q.includes('12 months') || q.includes('year') || q.includes('future') || q.includes('accumulate')) {
      const net = Math.max(2000, currentSummary.netCashFlow);
      const annualCurrent = net * 12;
      const annualOptimized = (net + 2500) * 12;

      return {
        reply: `Based on your average monthly net cashflow (₹${net.toLocaleString('en-IN')}/mo):\n\n• **At Current Pace**: You will accumulate **₹${annualCurrent.toLocaleString('en-IN')}** in 12 months.\n• **With ₹2,500/mo Optimization**: You could accumulate **₹${annualOptimized.toLocaleString('en-IN')}** (+₹30,000 extra)!\n\nCheck out the **What-If Simulator** below to visualize how small changes compound over time.`,
        source: 'rules-based',
        suggestions: ['Open What-If Simulator', 'Plan for a big purchase', 'Create a budget'],
      };
    }

    // 6. "Help me create a monthly budget" / "Budget"
    if (q.includes('budget') || q.includes('create a budget') || q.includes('limits')) {
      const income = currentSummary.monthlyIncome > 0 ? currentSummary.monthlyIncome : 45000;
      const needs = Math.round(income * 0.5);
      const wants = Math.round(income * 0.3);
      const savings = Math.round(income * 0.2);

      return {
        reply: `Using the proven **50/30/20 Framework** tailored to your monthly income of **₹${income.toLocaleString('en-IN')}**:\n\n1. **Essential Needs (50%)**: ~₹${needs.toLocaleString('en-IN')} (Rent, Groceries, Utilities, Transport)\n2. **Discretionary Wants (30%)**: ~₹${wants.toLocaleString('en-IN')} (Dining, Shopping, Entertainment)\n3. **Savings & Goals (20%)**: ~₹${savings.toLocaleString('en-IN')} (Emergency Fund, SIP, Debt payoff)\n\nYou can set hard category caps in your Budget tab to get alerts when you approach these limits.`,
        source: 'rules-based',
        suggestions: ['Set category budgets', 'Review dining expenses', 'Simulate savings'],
      };
    }

    // Default response summarizing user state
    return {
      reply: `I analyzed your October cashflow snapshot:\n\n• **Monthly Income**: ₹${currentSummary.monthlyIncome.toLocaleString('en-IN')}\n• **Monthly Expenses**: ₹${currentSummary.monthlyExpenses.toLocaleString('en-IN')}\n• **Net Surplus**: ₹${currentSummary.netCashFlow.toLocaleString('en-IN')} (${currentSummary.savingsRate}% savings rate)\n• **Financial Wellness Score**: ${wellnessScore.score}/100\n\nHow can I help you today? Ask about reducing dining costs, planning a goal, or simulating future wealth!`,
      source: 'rules-based',
      suggestions: [
        'Analyze my spending',
        'How can I save ₹2,000?',
        'Can I afford a major purchase?',
        'Help me create a budget',
      ],
    };
  },
};

export default aiProviderService;
