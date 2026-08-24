import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { cropRoutes } from './crop.routes';
import { expenseRoutes } from './expense.routes';
import { saleRoutes } from './sale.routes';
import { diaryRoutes } from './diary.routes';
import { billRoutes } from './bill.routes';
import { locationRoutes } from './location.routes';

const router = Router();

// Route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/crops', cropRoutes);
router.use('/expenses', expenseRoutes);
router.use('/sales', saleRoutes);
router.use('/diary', diaryRoutes);
router.use('/bills', billRoutes);
router.use('/locations', locationRoutes);

export const apiRouter = router;


