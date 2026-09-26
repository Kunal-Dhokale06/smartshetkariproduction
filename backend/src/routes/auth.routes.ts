import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

// Public Authentication Endpoints
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

// Protected Authenticated Farmer Endpoints
router.get('/me', requireAuth, AuthController.getMe);
router.put('/profile', requireAuth, validateRequest(updateProfileSchema), AuthController.updateProfile);

export const authRoutes = router;
