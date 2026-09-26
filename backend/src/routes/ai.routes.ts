import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';

const router = Router();

// POST /api/v1/ai/chat
router.post('/chat', AiController.chat);

export const aiRoutes = router;
