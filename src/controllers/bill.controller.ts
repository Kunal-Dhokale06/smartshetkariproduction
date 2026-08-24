import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';
import { analyzeBillWithGemini } from '../services/gemini-ocr.service';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function getServerBaseUrl(req: any): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';
  return `${protocol}://${host}`;
}

export class BillController {
  /**
   * POST /api/v1/bills/ocr-scan
   * Accept base64 image, run Gemini Vision OCR, return structured bill data.
   * Returns null for fields that cannot be identified — never invents data.
   */
  static async ocrScan(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { imageBase64, mimeType = 'image/jpeg' } = req.body;

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return AppResponse.error(req, res, 'imageBase64 image data is required', 400);
      }

      // Size guard: 15MB limit
      if (imageBase64.length > 20_000_000) {
        return AppResponse.error(req, res, 'Image is too large. Please upload an image under 15MB.', 400);
      }

      // Process image using Google Gemini Vision API
      const extracted = await analyzeBillWithGemini(imageBase64, mimeType);

      return AppResponse.success(
        req,
        res,
        {
          vendorName: extracted.vendorName,
          vendorPhone: extracted.vendorPhone,
          vendorAddress: extracted.vendorAddress,
          invoiceNumber: extracted.invoiceNumber,
          billDate: extracted.billDate,
          items: extracted.items,
          tax: extracted.tax,
          discount: extracted.discount,
          totalAmount: extracted.totalAmount,
          category: extracted.category,
          rawText: extracted.rawText,
        },
        'Bill scanned and extracted successfully via Gemini Vision'
      );
    } catch (error: any) {
      console.error('Gemini OCR Controller Error:', error);
      return AppResponse.error(req, res, 'Gemini OCR processing failed', 500, error?.message);
    }
  }

  /**
   * POST /api/v1/bills/save
   * Save the OCR result + expense fields to Neon PostgreSQL.
   * Also stores the image file locally in uploads/
   */
  static async save(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;

      const {
        // Image
        imageBase64,
        mimeType = 'image/jpeg',
        // Bill OCR data
        vendorName,
        vendorPhone,
        vendorAddress,
        invoiceNumber,
        billDate,
        totalAmount,
        rawOcrText,
        // Expense fields (farmer can override)
        expenseTitle,
        expenseCategory = 'OTHER',
        expenseCrop,
        expenseCropId,
        expensePaymentMode = 'CASH',
        expenseNotes,
      } = req.body;

      // Validate required fields
      if (!vendorName || !totalAmount || !billDate) {
        return AppResponse.error(req, res, 'vendorName, totalAmount, and billDate are required', 400);
      }
      const parsedTotal = parseFloat(String(totalAmount));
      if (isNaN(parsedTotal) || parsedTotal <= 0) {
        return AppResponse.error(req, res, 'totalAmount must be a positive number', 400);
      }

      // Parse and validate bill date
      const parsedDate = new Date(billDate);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      // ── Save image to uploads/ folder ──────────────────────────────────
      let imageUrl: string | null = null;
      if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.length > 100) {
        ensureUploadsDir();
        const ext = mimeType === 'image/png' ? 'png' : 'jpg';
        const filename = `bill_${userId}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        const buffer = Buffer.from(imageBase64, 'base64');
        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${filename}`;
      }

      // ── Create Bill record ─────────────────────────────────────────────
      const bill = await prisma.bill.create({
        data: {
          userId,
          vendorName: (vendorName as string).trim(),
          vendorPhone: vendorPhone || null,
          vendorAddress: vendorAddress || null,
          invoiceNumber: invoiceNumber || null,
          totalAmount: parsedTotal,
          billDate: validDate,
          imageUrl,
          rawOcrText: rawOcrText || null,
          status: 'VERIFIED',
        },
      });

      // ── Resolve crop link for expense ─────────────────────────────────
      let linkedCropId = expenseCropId || null;
      const cropName = expenseCrop || 'General';
      if (!linkedCropId && expenseCrop) {
        const foundCrop = await prisma.crop.findFirst({
          where: { userId, name: { equals: expenseCrop.trim(), mode: 'insensitive' } },
        });
        if (foundCrop) linkedCropId = foundCrop.id;
      }

      // ── Create linked Expense record ──────────────────────────────────
      const title = expenseTitle || `${(vendorName as string).trim()} - Bill #${invoiceNumber || bill.id.slice(0, 8).toUpperCase()}`;
      const categoryNorm = (expenseCategory as string).toUpperCase().replace(/[^A-Z]/g, '_');
      const validCategories = ['FERTILIZER', 'SEEDS', 'PESTICIDE', 'LABOR', 'IRRIGATION', 'MACHINERY', 'TRANSPORT', 'OTHER'];
      const finalCategory = validCategories.includes(categoryNorm) ? categoryNorm : 'OTHER';

      const expense = await prisma.expense.create({
        data: {
          userId,
          cropId: linkedCropId,
          cropName,
          billId: bill.id,
          title,
          amount: parsedTotal,
          category: finalCategory as any,
          paymentMode: (expensePaymentMode as any) || 'CASH',
          date: validDate,
          vendorName: (vendorName as string).trim(),
          receiptUrl: imageUrl,
          notes: expenseNotes || null,
        },
      });

      return AppResponse.created(req, res, {
        bill: {
          id: bill.id,
          vendorName: bill.vendorName,
          invoiceNumber: bill.invoiceNumber,
          totalAmount: Number(bill.totalAmount),
          billDate: bill.billDate.toISOString(),
          imageUrl: imageUrl
            ? `${getServerBaseUrl(req)}${imageUrl}`
            : null,
          status: bill.status,
          createdAt: bill.createdAt,
        },
        expense: {
          id: expense.id,
          title: expense.title,
          amount: Number(expense.amount),
          category: expense.category,
          crop: expense.cropName,
          date: expense.date.toISOString().split('T')[0],
          vendorName: expense.vendorName,
          receiptUrl: expense.receiptUrl ? `${getServerBaseUrl(req)}${expense.receiptUrl}` : null,
          createdAt: expense.createdAt,
        },
      }, 'Bill and expense saved successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to save bill and expense', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/bills
   * List all bills for the authenticated farmer
   */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;

      const bills = await prisma.bill.findMany({
        where: { userId },
        orderBy: { billDate: 'desc' },
        include: {
          expenses: {
            select: { id: true, title: true, amount: true, category: true },
          },
        },
      });

      const serverBase = getServerBaseUrl(req);

      const formatted = bills.map((b) => ({
        id: b.id,
        vendorName: b.vendorName,
        vendorPhone: b.vendorPhone,
        invoiceNumber: b.invoiceNumber,
        totalAmount: Number(b.totalAmount),
        billDate: b.billDate.toISOString(),
        imageUrl: b.imageUrl ? `${serverBase}${b.imageUrl}` : null,
        status: b.status,
        expenses: b.expenses.map((e) => ({
          ...e,
          amount: Number(e.amount),
        })),
        createdAt: b.createdAt,
      }));

      return AppResponse.success(req, res, { items: formatted, count: formatted.length }, 'Bills retrieved successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch bills', 500, error?.message);
    }
  }

  /**
   * DELETE /api/v1/bills/:id
   * Delete a bill (also removes associated image file)
   */
  static async remove(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.bill.findFirst({ where: { id, userId } });
      if (!existing) {
        return AppResponse.error(req, res, 'Bill not found or unauthorized', 404);
      }

      // Remove image file if it exists
      if (existing.imageUrl) {
        const localPath = path.join(process.cwd(), existing.imageUrl);
        try { if (fs.existsSync(localPath)) fs.unlinkSync(localPath); } catch { /* ignore */ }
      }

      // Unlink expense billId references before deleting
      await prisma.expense.updateMany({
        where: { billId: id, userId },
        data: { billId: null },
      });

      await prisma.bill.delete({ where: { id } });

      return AppResponse.success(req, res, { id }, 'Bill deleted successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to delete bill', 500, error?.message);
    }
  }
}
