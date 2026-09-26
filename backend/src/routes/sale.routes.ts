import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createSaleSchema, updateSaleSchema } from '../validators/sale.validator';

const router = Router();

// All sale routes require authentication
router.use(requireAuth);

router.get('/', SaleController.list);
router.get('/summary', SaleController.summary);
router.get('/:id', SaleController.getById);
router.post('/', validateRequest(createSaleSchema), SaleController.create);
router.put('/:id', validateRequest(updateSaleSchema), SaleController.update);
router.delete('/:id', SaleController.delete);

export const saleRoutes = router;
