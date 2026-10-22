import financialAnalysisService from '../services/financialAnalysisService.js';
import actionEngineService from '../services/actionEngineService.js';
import simulatorService from '../services/simulatorService.js';
import aiProviderService from '../services/aiProviderService.js';

export const aiController = {
  /**
   * Get personalized spending analysis & insights
   * GET /api/ai/insights
   */
  async getInsights(req, res, next) {
    try {
      const userId = req.user.id;
      const analysis = await financialAnalysisService.analyzeFinances(userId);

      return res.status(200).json({
        success: true,
        data: {
          currentSummary: analysis.currentSummary,
          prevSummary: analysis.prevSummary,
          momComparisons: analysis.momComparisons,
          smallExpenses: analysis.smallExpenses,
          potentialRecurring: analysis.potentialRecurring,
          suspectedDuplicates: analysis.suspectedDuplicates,
          anomalies: analysis.anomalies,
          wellnessScore: analysis.wellnessScore,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get active actionable recommendations
   * GET /api/ai/recommendations
   */
  async getRecommendations(req, res, next) {
    try {
      const userId = req.user.id;
      const recommendations = await actionEngineService.getActiveRecommendations(userId);

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Update recommendation status (accept or dismiss)
   * PATCH /api/ai/recommendations/:id
   */
  async updateRecommendationStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { status } = req.body;

      const updated = await actionEngineService.updateStatus(id, userId, status);

      return res.status(200).json({
        success: true,
        data: updated,
        message: `Recommendation ${status} successfully`,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Run What-If simulation
   * POST /api/ai/simulate
   */
  async simulate(req, res, next) {
    try {
      const userId = req.user.id;
      const projection = await simulatorService.simulate(userId, req.body);

      return res.status(200).json({
        success: true,
        data: projection,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Query the AI Money Coach
   * POST /api/ai/coach
   */
  async askCoach(req, res, next) {
    try {
      const userId = req.user.id;
      const { message } = req.body;

      const response = await aiProviderService.askCoach({ userId, message });

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get anomaly alerts (spikes, high-value, recurring, duplicates)
   * GET /api/ai/anomalies
   */
  async getAnomalies(req, res, next) {
    try {
      const userId = req.user.id;
      const analysis = await financialAnalysisService.analyzeFinances(userId);

      return res.status(200).json({
        success: true,
        data: {
          anomalies: analysis.anomalies,
          suspectedDuplicates: analysis.suspectedDuplicates,
          potentialRecurring: analysis.potentialRecurring,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get Financial Wellness Score
   * GET /api/ai/wellness-score
   */
  async getWellnessScore(req, res, next) {
    try {
      const userId = req.user.id;
      const analysis = await financialAnalysisService.analyzeFinances(userId);

      return res.status(200).json({
        success: true,
        data: analysis.wellnessScore,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default aiController;
