import { Router } from 'express';
import transactionController from '../controllers/transactionController.js';
import authenticate from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validate.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  bulkImportSchema,
} from '../validations/transactionValidation.js';

const router = Router();

// All transaction operations require an active authenticated session
router.use(authenticate);

// Financial summary & analytics (must precede /:id route)
router.get('/summary', transactionController.getTransactionSummary);

// List paginated transactions with filters
router.get('/', transactionController.listTransactions);

// Fetch single transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Create new transaction
router.post(
  '/',
  validateBody(createTransactionSchema),
  transactionController.createTransaction
);

// Bulk import transactions
router.post(
  '/import',
  validateBody(bulkImportSchema),
  transactionController.importTransactions
);

// Update existing transaction
router.patch(
  '/:id',
  validateBody(updateTransactionSchema),
  transactionController.updateTransaction
);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

export default router;
