import { Router } from 'express';
import aiController from '../controllers/aiController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// All AI features require an authenticated session
router.use(authenticate);

// Financial Insights (highest-spending, MoM changes, frequent small expenses)
router.get('/insights', aiController.getInsights);

// Action Engine Recommendations
router.get('/recommendations', aiController.getRecommendations);
router.patch('/recommendations/:id', aiController.updateRecommendationStatus);

// What-If Simulator
router.post('/simulate', aiController.simulate);

// AI Money Coach Chat Query
router.post('/coach', aiController.askCoach);

// Anomaly & Recurring Expense Alerts
router.get('/anomalies', aiController.getAnomalies);

// Financial Wellness Score
router.get('/wellness-score', aiController.getWellnessScore);

export default router;
