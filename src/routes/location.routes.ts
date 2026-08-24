import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';

export const locationRoutes = Router();

// Public routes for registration and farmer onboarding
locationRoutes.get('/districts', LocationController.getDistricts);
locationRoutes.get('/districts/:districtId/talukas', LocationController.getTalukas);
locationRoutes.get('/talukas/:talukaId/villages', LocationController.getVillages);
locationRoutes.get('/search', LocationController.searchVillages);
