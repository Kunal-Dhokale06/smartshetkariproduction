import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createExpenseSchema,
  updateExpenseSchema,
} from '../validators/expense.validator';

const router = Router();

// All expense routes require authentication
router.use(requireAuth);

router.get('/', ExpenseController.list);
router.get('/summary', ExpenseController.summary);
router.get('/:id', ExpenseController.getById);
router.post('/', validateRequest(createExpenseSchema), ExpenseController.create);
router.put('/:id', validateRequest(updateExpenseSchema), ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

export const expenseRoutes = router;
