import { Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatSale(sale: any) {
  return {
    id: sale.id,
    cropName: sale.cropName,
    cropId: sale.cropId,
    quantity: Number(sale.quantity),
    unit: sale.unit,
    pricePerUnit: Number(sale.pricePerUnit),
    totalAmount: Number(sale.totalAmount),
    marketName: sale.marketName,
    buyerName: sale.buyerName,
    paymentStatus: sale.paymentStatus,
    date: formatDate(sale.date),
    dateISO: sale.date.toISOString(),
    notes: sale.notes,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

export class SaleController {
  /**
   * GET /api/v1/sales
   * List all sales for the authenticated farmer, newest first.
   * Optional query: ?crop=CropName, ?year=2026, ?paymentStatus=PAID
   */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { crop, year, paymentStatus } = req.query as Record<string, string>;

      const where: any = { userId };
      if (crop) where.cropName = { contains: crop, mode: 'insensitive' };
      if (paymentStatus) where.paymentStatus = paymentStatus.toUpperCase();
      if (year) {
        const y = parseInt(year, 10);
        where.date = {
          gte: new Date(`${y}-01-01`),
          lte: new Date(`${y}-12-31`),
        };
      }

      const sales = await prisma.sale.findMany({
        where,
        orderBy: { date: 'desc' },
      });

      const items = sales.map(formatSale);
      const totalAmount = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

      return AppResponse.success(
        req,
        res,
        { items, totalAmount, count: sales.length },
        'Sales retrieved successfully'
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch sales', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/sales/summary
   * Yearly + monthly + crop-wise breakdown for Analytics & Reports.
   */
  static async summary(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const currentYear = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();

      const sales = await prisma.sale.findMany({
        where: {
          userId,
          date: {
            gte: new Date(`${currentYear}-01-01`),
            lte: new Date(`${currentYear}-12-31`),
          },
        },
        orderBy: { date: 'asc' },
      });

      const totalYearlySales = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
      const cropTotals: Record<string, number> = {};
      const monthlyTotals = Array(12).fill(0);
      const unitTotals: Record<string, number> = {};

      sales.forEach((sale) => {
        const amount = Number(sale.totalAmount);

        // Crop breakdown
        const crop = sale.cropName || 'General';
        cropTotals[crop] = (cropTotals[crop] || 0) + amount;

        // Monthly breakdown
        const monthIndex = sale.date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          (monthlyTotals as number[])[monthIndex] =
            ((monthlyTotals as number[])[monthIndex] ?? 0) + amount;
        }

        // Unit/weight type breakdown
        const unit = sale.unit || 'Quintal';
        unitTotals[unit] = (unitTotals[unit] || 0) + Number(sale.quantity);
      });

      const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return AppResponse.success(
        req,
        res,
        {
          year: currentYear,
          totalYearlySales,
          cropBreakdown: cropTotals,
          unitBreakdown: unitTotals,
          monthlyBreakdown: monthlyTotals.map((amount, idx) => ({
            month: MONTH_NAMES[idx],
            amount,
          })),
          count: sales.length,
        },
        'Sales summary retrieved successfully'
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch sales summary', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/sales/:id
   */
  static async getById(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const sale = await prisma.sale.findFirst({ where: { id, userId } });
      if (!sale) {
        return AppResponse.error(req, res, 'Sale not found', 404);
      }

      return AppResponse.success(req, res, formatSale(sale), 'Sale details retrieved');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch sale details', 500, error?.message);
    }
  }

  /**
   * POST /api/v1/sales
   * totalAmount is auto-calculated as quantity × pricePerUnit.
   */
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const {
        cropName, cropId, quantity, unit,
        pricePerUnit, marketName, buyerName,
        paymentStatus, date, notes,
      } = req.body;

      // Auto-resolve cropId if cropName provided but cropId missing
      let linkedCropId = cropId || null;
      if (!linkedCropId && cropName) {
        const foundCrop = await prisma.crop.findFirst({
          where: { userId, name: { equals: cropName.trim(), mode: 'insensitive' } },
        });
        if (foundCrop) linkedCropId = foundCrop.id;
      }

      // Auto-calculate total amount
      const qty = Number(quantity);
      const price = Number(pricePerUnit);
      const totalAmount = parseFloat((qty * price).toFixed(2));

      const parsedDate = new Date(date);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const sale = await prisma.sale.create({
        data: {
          userId,
          cropId: linkedCropId,
          cropName: cropName.trim(),
          quantity: qty,
          unit: unit || 'Quintal',
          pricePerUnit: price,
          totalAmount,
          marketName: marketName.trim(),
          buyerName: buyerName?.trim() || null,
          paymentStatus: (paymentStatus || 'PAID') as any,
          date: validDate,
          notes: notes?.trim() || null,
        },
      });

      return AppResponse.created(req, res, formatSale(sale), 'Sale recorded successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to record sale', 500, error?.message);
    }
  }

  /**
   * PUT /api/v1/sales/:id
   * Recalculates totalAmount automatically when quantity or pricePerUnit changes.
   */
  static async update(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.sale.findFirst({ where: { id, userId } });
      if (!existing) {
        return AppResponse.error(req, res, 'Sale not found', 404);
      }

      const {
        cropName, cropId, quantity, unit,
        pricePerUnit, marketName, buyerName,
        paymentStatus, date, notes,
      } = req.body;

      // Resolve new values (fall back to existing)
      const newQty = quantity !== undefined ? Number(quantity) : Number(existing.quantity);
      const newPrice = pricePerUnit !== undefined ? Number(pricePerUnit) : Number(existing.pricePerUnit);
      const newTotal = parseFloat((newQty * newPrice).toFixed(2));

      let linkedCropId = cropId !== undefined ? (cropId || null) : existing.cropId;
      if (!linkedCropId && cropName) {
        const foundCrop = await prisma.crop.findFirst({
          where: { userId, name: { equals: cropName.trim(), mode: 'insensitive' } },
        });
        if (foundCrop) linkedCropId = foundCrop.id;
      }

      const parsedDate = date ? new Date(date) : null;
      const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : existing.date;

      const updated = await prisma.sale.update({
        where: { id },
        data: {
          cropName: cropName ? cropName.trim() : existing.cropName,
          cropId: linkedCropId,
          quantity: newQty,
          unit: unit || existing.unit,
          pricePerUnit: newPrice,
          totalAmount: newTotal,
          marketName: marketName ? marketName.trim() : existing.marketName,
          buyerName: buyerName !== undefined ? (buyerName?.trim() || null) : existing.buyerName,
          paymentStatus: paymentStatus ? (paymentStatus as any) : existing.paymentStatus,
          date: validDate,
          notes: notes !== undefined ? (notes?.trim() || null) : existing.notes,
        },
      });

      return AppResponse.success(req, res, formatSale(updated), 'Sale updated successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to update sale', 500, error?.message);
    }
  }

  /**
   * DELETE /api/v1/sales/:id
   */
  static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.sale.findFirst({ where: { id, userId } });
      if (!existing) {
        return AppResponse.error(req, res, 'Sale not found', 404);
      }

      await prisma.sale.delete({ where: { id } });

      return AppResponse.success(req, res, { id }, 'Sale deleted successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to delete sale', 500, error?.message);
    }
  }
}
