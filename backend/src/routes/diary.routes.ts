import { Router } from 'express';
import { DiaryController } from '../controllers/diary.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createDiarySchema, updateDiarySchema } from '../validators/diary.validator';

const router = Router();
router.use(requireAuth);

router.get('/', DiaryController.list);
router.get('/:id', DiaryController.getById);
router.post('/', validateRequest(createDiarySchema), DiaryController.create);
router.put('/:id', validateRequest(updateDiarySchema), DiaryController.update);
router.delete('/:id', DiaryController.delete);

export const diaryRoutes = router;
