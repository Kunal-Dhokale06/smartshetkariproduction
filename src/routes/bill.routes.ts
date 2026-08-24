import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { BillController } from '../controllers/bill.controller';

const router = Router();

// All bill routes require authentication
router.use(requireAuth);

// POST /api/v1/bills/ocr-scan — Run OCR on uploaded image, return extracted data
router.post('/ocr-scan', BillController.ocrScan);

// POST /api/v1/bills/save — Save parsed bill + create linked expense
router.post('/save', BillController.save);

// GET /api/v1/bills — List all bills for authenticated farmer
router.get('/', BillController.list);

// DELETE /api/v1/bills/:id — Delete bill and remove image file
router.delete('/:id', BillController.remove);

export const billRoutes = router;
