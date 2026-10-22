import { Router } from 'express';
import budgetController from '../controllers/budgetController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', budgetController.getBudgets);
router.post('/', budgetController.setBudget);
router.delete('/:id', budgetController.deleteBudget);

export default router;
