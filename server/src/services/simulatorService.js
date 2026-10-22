import goalRepository from '../repositories/goalRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';

export const simulatorService = {
  /**
   * Calculate What-If simulation projection and goal impact
   * @param {string} userId
   * @param {Object} params - { category, monthlyReduction, timeHorizonMonths, oneTimeContribution }
   * @returns {Promise<Object>}
   */
  async simulate(userId, { category = 'All', monthlyReduction = 2000, timeHorizonMonths = 12, oneTimeContribution = 0 }) {
    const months = Number(timeHorizonMonths) || 12;
    const monthlySave = Math.max(0, Number(monthlyReduction) || 0);
    const oneTime = Math.max(0, Number(oneTimeContribution) || 0);

    // Transparent formula: monthly savings * months + one-time deposit
    const totalExtraContributions = (monthlySave * months) + oneTime;

    // Fetch user baseline net cash flow & active goals
    const [summary, goals] = await Promise.all([
      transactionRepository.getSummary({ userId }),
      goalRepository.findAllByUser(userId, { status: 'in_progress' }),
    ]);

    const baselineMonthly = summary.netCashFlow > 0 ? summary.netCashFlow : 10000;
    const baselineProjected = baselineMonthly * months;
    const newTotalProjected = baselineProjected + totalExtraContributions;
    const percentageIncrease =
      baselineProjected > 0
        ? Math.round((totalExtraContributions / baselineProjected) * 100)
        : 100;

    // Month-by-month timeline points
    const timeline = [];
    let currentExtra = oneTime;
    let currentBaseline = 0;

    for (let m = 1; m <= months; m++) {
      currentExtra += monthlySave;
      currentBaseline += baselineMonthly;
      timeline.push({
        month: m,
        extraSavings: currentExtra,
        baselineSavings: currentBaseline,
        totalSavings: currentBaseline + currentExtra,
      });
    }

    // Calculate impact on user's active savings goals
    const goalImpact = goals.map((g) => {
      const remaining = Math.max(0, g.targetAmount - (g.currentAmount || 0));
      const currentRate = g.monthlyContribution > 0 ? g.monthlyContribution : 2000;
      const originalMonths = Math.ceil(remaining / currentRate);
      const acceleratedMonths = Math.ceil(remaining / (currentRate + monthlySave));
      const monthsSaved = Math.max(0, originalMonths - acceleratedMonths);

      return {
        goalId: g._id.toString(),
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        remainingAmount: remaining,
        originalMonthsRemaining: originalMonths,
        acceleratedMonthsRemaining: acceleratedMonths,
        monthsSaved,
        explanation:
          monthsSaved > 0
            ? `Reach "${g.name}" ${monthsSaved} months sooner with this extra saving!`
            : `Reach "${g.name}" on schedule with extra financial cushion.`,
      };
    });

    return {
      category,
      monthlyReduction: monthlySave,
      timeHorizonMonths: months,
      oneTimeContribution: oneTime,
      totalExtraContributions,
      baselineProjectedSavings: baselineProjected,
      newTotalProjectedSavings: newTotalProjected,
      percentageIncrease,
      timeline,
      goalImpact,
      formulaExplanation:
        'Projected extra savings = (monthly reduction × months) + one-time contribution. Baseline assumes current monthly net cash flow without speculative investment yield.',
    };
  },
};

export default simulatorService;
