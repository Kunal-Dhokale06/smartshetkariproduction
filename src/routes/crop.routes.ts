import { Router } from 'express';
import { CropController } from '../controllers/crop.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createCropSchema, updateCropSchema } from '../validators/crop.validator';

const router = Router();

// All crop routes require authentication
router.use(requireAuth);

router.get('/', CropController.list);
router.get('/:id', CropController.getById);
router.post('/', validateRequest(createCropSchema), CropController.create);
router.put('/:id', validateRequest(updateCropSchema), CropController.update);
router.delete('/:id', CropController.delete);

export const cropRoutes = router;
