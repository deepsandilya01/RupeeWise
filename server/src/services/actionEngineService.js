import recommendationRepository from '../repositories/recommendationRepository.js';
import financialAnalysisService from './financialAnalysisService.js';

export const actionEngineService = {
  /**
   * Generate and refresh data-grounded recommendations for user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async generateRecommendations(userId) {
    const analysis = await financialAnalysisService.analyzeFinances(userId);
    const { currentSummary, momComparisons, smallExpenses, potentialRecurring } = analysis;

    const newRecommendations = [];

    // 1. Dining Out & Food Optimization
    const diningMom = momComparisons.find(
      (m) =>
        m.category.toLowerCase().includes('dining') ||
        m.category.toLowerCase().includes('food')
    );
    const diningCategory = currentSummary.categories.find(
      (c) =>
        c.category.toLowerCase().includes('dining') ||
        c.category.toLowerCase().includes('food')
    );

    if (diningCategory && diningCategory.total > 2000) {
      const weeklyReduction = Math.round(diningCategory.total * 0.06); // ~24% monthly
      const monthlySavings = weeklyReduction * 4;
      const annualSavings = monthlySavings * 12;

      newRecommendations.push({
        userId,
        title: 'Optimize Food & Dining Expenses',
        category: diningCategory.category,
        observation: `You spent ₹${diningCategory.total.toLocaleString('en-IN')} on ${diningCategory.category} this month (${diningCategory.percentage}% of total expenses).${
          diningMom && diningMom.percentageChange > 0
            ? ` That's +${diningMom.percentageChange}% higher than last month.`
            : ''
        }`,
        action: `Preparing 2 additional meals at home weekly could reduce dining out spends by ~₹${weeklyReduction.toLocaleString('en-IN')}/week.`,
        estimatedMonthlySavings: monthlySavings,
        estimatedAnnualSavings: annualSavings,
        confidence: 'high',
        source: 'rules-based',
        metadata: {
          currentSpend: diningCategory.total,
          percentOfExpenses: diningCategory.percentage,
        },
      });
    }

    // 2. Micro-Transactions / Small Expense Clusters
    if (smallExpenses.count >= 4 && smallExpenses.total >= 1000) {
      const monthlySavings = Math.round(smallExpenses.total * 0.35);
      const annualSavings = monthlySavings * 12;

      newRecommendations.push({
        userId,
        title: 'Discretionary Micro-Spend Review',
        category: 'Discretionary',
        observation: `You recorded ${smallExpenses.count} frequent small transactions under ₹500 totaling ₹${smallExpenses.total.toLocaleString('en-IN')} this month.`,
        action: `Consolidating or setting a weekly cash allowance for casual spends could save an estimated ₹${monthlySavings.toLocaleString('en-IN')} each month.`,
        estimatedMonthlySavings: monthlySavings,
        estimatedAnnualSavings: annualSavings,
        confidence: 'medium',
        source: 'rules-based',
        metadata: {
          count: smallExpenses.count,
          total: smallExpenses.total,
        },
      });
    }

    // 3. Recurring Subscriptions Audit
    if (potentialRecurring.length >= 2) {
      const totalRecurring = potentialRecurring.reduce((sum, r) => sum + r.averageAmount, 0);
      const estSavings = Math.round(totalRecurring * 0.25);

      newRecommendations.push({
        userId,
        title: 'Subscription & Recurring Debits Audit',
        category: 'Subscriptions',
        observation: `We identified ${potentialRecurring.length} recurring debits (such as ${potentialRecurring.slice(0, 2).map((r) => r.merchant).join(', ')}) totaling ~₹${totalRecurring.toLocaleString('en-IN')}/month.`,
        action: 'Review recurring digital subscriptions to pause or downgrade services you are not actively using.',
        estimatedMonthlySavings: estSavings,
        estimatedAnnualSavings: estSavings * 12,
        confidence: 'medium',
        source: 'rules-based',
        metadata: { recurringCount: potentialRecurring.length },
      });
    }

    // 4. Surplus Cashflow Deployment
    if (currentSummary.savingsRate >= 30 && currentSummary.netCashFlow >= 10000) {
      const monthlySip = Math.round(currentSummary.netCashFlow * 0.5);

      newRecommendations.push({
        userId,
        title: 'Surplus Capital Deployment (Goal SIP)',
        category: 'Investments & Savings',
        observation: `Your savings rate is strong at ${currentSummary.savingsRate}% with net positive cashflow of ₹${currentSummary.netCashFlow.toLocaleString('en-IN')} this month.`,
        action: `Automating an ongoing transfer of ₹${monthlySip.toLocaleString('en-IN')}/month toward your priority savings goal will compound your financial freedom.`,
        estimatedMonthlySavings: monthlySip,
        estimatedAnnualSavings: monthlySip * 12,
        confidence: 'high',
        source: 'rules-based',
        metadata: { netCashFlow: currentSummary.netCashFlow, savingsRate: currentSummary.savingsRate },
      });
    }

    // If user has zero or very few transactions, provide an onboarding recommendation
    if (newRecommendations.length === 0) {
      newRecommendations.push({
        userId,
        title: 'Kickstart Your Financial Awareness',
        category: 'General',
        observation: 'You have fewer than 3 recorded transactions for this period.',
        action: 'Log your regular daily expenses and monthly salary credits to unlock tailored AI spending intelligence.',
        estimatedMonthlySavings: 2000,
        estimatedAnnualSavings: 24000,
        confidence: 'moderate',
        source: 'rules-based',
        metadata: { isInitial: true },
      });
    }

    // Sync to database
    await recommendationRepository.clearActive(userId);
    const created = await recommendationRepository.createMany(newRecommendations);

    return created.map((r) => (r.toSafeObject ? r.toSafeObject() : r));
  },

  /**
   * Get active recommendations for user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getActiveRecommendations(userId) {
    let recs = await recommendationRepository.findActiveByUser(userId);
    if (!recs || recs.length === 0) {
      recs = await this.generateRecommendations(userId);
    }
    return recs.map((r) => (r.toSafeObject ? r.toSafeObject() : r));
  },

  /**
   * Update recommendation status (accepted / dismissed)
   * @param {string} id
   * @param {string} userId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateStatus(id, userId, status) {
    if (!['accepted', 'dismissed'].includes(status)) {
      const err = new Error("Status must be either 'accepted' or 'dismissed'");
      err.statusCode = 400;
      throw err;
    }
    const updated = await recommendationRepository.updateStatus(id, userId, status);
    if (!updated) {
      const err = new Error('Recommendation not found or access denied');
      err.statusCode = 404;
      throw err;
    }
    return updated.toSafeObject();
  },
};

export default actionEngineService;
