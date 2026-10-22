import { Router } from 'express';
import goalController from '../controllers/goalController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', goalController.listGoals);
router.post('/', goalController.createGoal);
router.get('/:id', goalController.getGoalById);
router.patch('/:id', goalController.updateGoal);
router.post('/:id/contribute', goalController.addContribution);
router.delete('/:id', goalController.deleteGoal);

export default router;
