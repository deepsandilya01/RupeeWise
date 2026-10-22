import transactionRepository from '../repositories/transactionRepository.js';
import budgetRepository from '../repositories/budgetRepository.js';
import goalRepository from '../repositories/goalRepository.js';

export const financialAnalysisService = {
  /**
   * Run comprehensive spending analysis on user's real transactions
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async analyzeFinances(userId) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Previous month calculation
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Fetch summaries for current and previous month
    const [currentSummary, prevSummary, allTransactions, userBudgets, userGoals] =
      await Promise.all([
        transactionRepository.getSummary({ userId, month: currentMonth, year: currentYear }),
        transactionRepository.getSummary({ userId, month: prevMonth, year: prevYear }),
        transactionRepository.findPaginated({ userId, limit: 100 }),
        budgetRepository.findAllByUser(userId),
        goalRepository.findAllByUser(userId),
      ]);

    const txList = allTransactions.transactions || [];

    // 1. Month-over-Month Category Comparisons
    const momComparisons = [];
    const currentCategories = currentSummary.categories || [];
    const prevCategories = prevSummary.categories || [];

    currentCategories.forEach((curr) => {
      const prev = prevCategories.find((p) => p.category === curr.category);
      const prevTotal = prev ? prev.total : 0;
      const difference = curr.total - prevTotal;
      const percentageChange =
        prevTotal > 0
          ? Math.round(((curr.total - prevTotal) / prevTotal) * 100)
          : curr.total > 0
          ? 100
          : 0;

      momComparisons.push({
        category: curr.category,
        currentTotal: curr.total,
        prevTotal,
        difference,
        percentageChange,
        isIncrease: difference > 0,
      });
    });

    // 2. Frequent Small Expenses (< ₹500, count >= 3)
    const smallExpenses = txList.filter(
      (t) => t.type === 'expense' && t.amount <= 500
    );
    const smallExpenseCount = smallExpenses.length;
    const smallExpenseTotal = smallExpenses.reduce((sum, t) => sum + t.amount, 0);

    // 3. Potential Recurring Payments (similar merchant, consistent amounts)
    const merchantMap = {};
    txList
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const key = t.title.toLowerCase().trim();
        if (!merchantMap[key]) {
          merchantMap[key] = [];
        }
        merchantMap[key].push(t);
      });

    const potentialRecurring = [];
    Object.entries(merchantMap).forEach(([merchant, txs]) => {
      if (txs.length >= 2) {
        const amounts = txs.map((t) => t.amount);
        const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        // Check if amounts are within 10% of each other
        const isConsistent = amounts.every((a) => Math.abs(a - avg) / avg < 0.15);
        if (isConsistent) {
          potentialRecurring.push({
            merchant: txs[0].title,
            category: txs[0].category,
            frequency: txs.length,
            averageAmount: Math.round(avg),
            lastDate: txs[0].date,
            confidence: txs.length >= 3 ? 'high' : 'medium',
          });
        }
      }
    });

    // 4. Suspected Duplicates (same merchant, same amount within 24 hours)
    const suspectedDuplicates = [];
    for (let i = 0; i < txList.length; i++) {
      for (let j = i + 1; j < txList.length; j++) {
        const a = txList[i];
        const b = txList[j];
        if (
          a.type === 'expense' &&
          b.type === 'expense' &&
          a.title.toLowerCase() === b.title.toLowerCase() &&
          a.amount === b.amount
        ) {
          const timeDiff = Math.abs(new Date(a.date) - new Date(b.date));
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          if (hoursDiff <= 24) {
            suspectedDuplicates.push({
              merchant: a.title,
              amount: a.amount,
              dateA: a.date,
              dateB: b.date,
              idA: a._id.toString(),
              idB: b._id.toString(),
              reason: 'Identical amount and merchant within 24 hours',
            });
          }
        }
      }
    }

    // 5. High-Value Anomalies (> 2.5x category average)
    const anomalies = [];
    currentCategories.forEach((cat) => {
      const catTxs = txList.filter(
        (t) => t.type === 'expense' && t.category === cat.category
      );
      if (catTxs.length >= 2) {
        const catAvg = cat.total / cat.count;
        catTxs.forEach((t) => {
          if (t.amount > catAvg * 2.5 && t.amount > 1000) {
            anomalies.push({
              transactionId: t._id.toString(),
              title: t.title,
              category: t.category,
              amount: t.amount,
              categoryAverage: Math.round(catAvg),
              ratio: (t.amount / catAvg).toFixed(1) + 'x',
              date: t.date,
              reason: `Expense is ${(t.amount / catAvg).toFixed(1)}x higher than your average ${t.category} spend`,
            });
          }
        });
      }
    });

    // 6. Category Budget Adherence
    const budgetAdherence = userBudgets.map((b) => {
      const match = currentCategories.find((c) => c.category === b.category);
      const actualSpend = match ? match.total : 0;
      const remaining = b.monthlyLimit - actualSpend;
      const percentConsumed = Math.round((actualSpend / b.monthlyLimit) * 100);
      const isExceeded = percentConsumed > 100;
      const isWarning = percentConsumed >= b.alertThreshold && !isExceeded;

      return {
        id: b._id.toString(),
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        actualSpend,
        remaining,
        percentConsumed,
        alertThreshold: b.alertThreshold,
        status: isExceeded ? 'exceeded' : isWarning ? 'warning' : 'healthy',
      };
    });

    // 7. Explainable Financial Wellness Score (0 to 100)
    let savingsScore = 0;
    const rate = currentSummary.savingsRate || 0;
    if (rate >= 35) savingsScore = 30;
    else if (rate >= 20) savingsScore = 24;
    else if (rate >= 10) savingsScore = 16;
    else if (rate > 0) savingsScore = 8;
    else savingsScore = 0;

    let budgetScore = 18; // neutral baseline if no budgets
    if (budgetAdherence.length > 0) {
      const nonExceededCount = budgetAdherence.filter((b) => b.percentConsumed <= 100).length;
      budgetScore = Math.round((nonExceededCount / budgetAdherence.length) * 25);
    }

    let volatilityScore = 20;
    const totalMomDiff = Math.abs(currentSummary.monthlyExpenses - prevSummary.monthlyExpenses);
    if (prevSummary.monthlyExpenses > 0) {
      const expChangePercent = (totalMomDiff / prevSummary.monthlyExpenses) * 100;
      if (expChangePercent <= 15) volatilityScore = 25;
      else if (expChangePercent <= 30) volatilityScore = 18;
      else volatilityScore = 10;
    }

    let goalScore = 10;
    if (userGoals.length > 0) {
      const avgProgress =
        userGoals.reduce((sum, g) => sum + (g.currentAmount / (g.targetAmount || 1)), 0) /
        userGoals.length;
      goalScore = Math.min(20, Math.round(avgProgress * 20) + 5);
    }

    const totalWellnessScore = Math.min(100, savingsScore + budgetScore + volatilityScore + goalScore);

    return {
      currentSummary,
      prevSummary,
      momComparisons,
      smallExpenses: {
        count: smallExpenseCount,
        total: smallExpenseTotal,
      },
      potentialRecurring,
      suspectedDuplicates,
      anomalies,
      budgetAdherence,
      wellnessScore: {
        score: totalWellnessScore,
        breakdown: {
          savingsRate: { points: savingsScore, max: 30, value: `${rate}%` },
          budgetAdherence: { points: budgetScore, max: 25, value: `${budgetAdherence.length} categories` },
          spendingStability: { points: volatilityScore, max: 25 },
          goalProgress: { points: goalScore, max: 20, activeGoals: userGoals.length },
        },
        disclaimer:
          'This wellness score is an educational estimate derived from your recorded cashflow, not a regulated credit or professional financial rating.',
      },
    };
  },
};

export default financialAnalysisService;
