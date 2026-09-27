import { Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';

// Category mapping helper
function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    FERTILIZER: 'Fertilizer',
    SEEDS: 'Seeds',
    PESTICIDE: 'Pesticide',
    LABOR: 'Labor',
    IRRIGATION: 'Irrigation',
    MACHINERY: 'Machinery',
    TRANSPORT: 'Transport',
    OTHER: 'Other',
  };
  return map[cat] || cat;
}

export class ExpenseController {
  /**
   * List all expenses for authenticated farmer
   * GET /api/v1/expenses
   */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { crop, cropId, category, startDate, endDate } = req.query;

      // Find all user crops in a single query
      const userCrops = await prisma.crop.findMany({
        where: { userId },
        select: { id: true, name: true, isDeleted: true },
      });
      const activeCropNames = new Set(
        userCrops.filter((c) => !c.isDeleted).map((c) => c.name.trim().toLowerCase())
      );
      const deletedCropIds = userCrops.filter((c) => c.isDeleted).map((c) => c.id);
      const deletedCropNames = userCrops
        .filter((c) => c.isDeleted)
        .map((c) => c.name.trim())
        .filter((n) => Boolean(n) && !activeCropNames.has(n.toLowerCase()));

      const andClauses: any[] = [];
      if (deletedCropIds.length > 0) {
        andClauses.push({
          OR: [
            { cropId: null },
            { cropId: { notIn: deletedCropIds } },
          ],
        });
      }
      if (deletedCropNames.length > 0) {
        andClauses.push({
          cropName: { notIn: deletedCropNames, mode: 'insensitive' },
        });
      }

      const where: any = {
        userId,
        ...(andClauses.length > 0 ? { AND: andClauses } : {}),
      };

      if (crop && typeof crop === 'string') {
        where.cropName = { contains: crop, mode: 'insensitive' };
      }
      if (cropId && typeof cropId === 'string') {
        where.cropId = cropId;
      }
      if (category && typeof category === 'string') {
        where.category = category.toUpperCase();
      }
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const expenses = await prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
      });

      let totalAmount = 0;
      const categoryTotals: Record<string, number> = {};

      const formattedExpenses = expenses.map((item) => {
        const amt = Number(item.amount);
        totalAmount += amt;

        const catName = formatCategory(item.category);
        categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;

        return {
          id: item.id,
          title: item.title,
          amount: amt,
          category: catName,
          crop: item.cropName,
          cropName: item.cropName,
          cropId: item.cropId,
          date: item.date.toISOString().split('T')[0],
          paymentMode: item.paymentMode,
          vendorName: item.vendorName,
          receiptUrl: item.receiptUrl,
          notes: item.notes,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

      return AppResponse.success(
        req,
        res,
        {
          items: formattedExpenses,
          totalAmount,
          count: formattedExpenses.length,
          categoryBreakdown: categoryTotals,
        },
        `Retrieved ${formattedExpenses.length} expenses successfully`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch expenses', 500, error?.message);
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const expense = await prisma.expense.findFirst({
        where: { id, userId },
      });

      if (!expense) {
        return AppResponse.error(req, res, 'Expense not found', 404);
      }

      const formatted = {
        id: expense.id,
        title: expense.title,
        amount: Number(expense.amount),
        category: formatCategory(expense.category),
        crop: expense.cropName,
        cropId: expense.cropId,
        date: expense.date.toISOString().split('T')[0],
        paymentMode: expense.paymentMode,
        vendorName: expense.vendorName,
        receiptUrl: expense.receiptUrl,
        notes: expense.notes,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      };

      return AppResponse.success(req, res, formatted, 'Expense details retrieved successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch expense details', 500, error?.message);
    }
  }

  /**
   * Create a new expense
   * POST /api/v1/expenses
   */
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const {
        title,
        amount,
        category,
        crop,
        cropId,
        date,
        paymentMode,
        vendorName,
        receiptUrl,
        notes,
      } = req.body;

      // Safe UUID verification and auto-resolution of cropId
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let linkedCropId: string | null = null;
      if (cropId && typeof cropId === 'string' && UUID_REGEX.test(cropId)) {
        const foundCrop = await prisma.crop.findFirst({
          where: { id: cropId, userId, isDeleted: false },
        });
        if (foundCrop) linkedCropId = foundCrop.id;
      }
      if (!linkedCropId && crop && typeof crop === 'string' && crop.trim()) {
        const foundCrop = await prisma.crop.findFirst({
          where: {
            userId,
            name: { equals: crop.trim(), mode: 'insensitive' },
            isDeleted: false,
          },
        });
        if (foundCrop) linkedCropId = foundCrop.id;
      }

      const parsedDate = new Date(date);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      let resolvedCropName = crop && crop.trim() ? crop.trim() : 'General';
      if (linkedCropId && (!crop || !crop.trim())) {
        const found = await prisma.crop.findUnique({ where: { id: linkedCropId } });
        if (found) resolvedCropName = found.name;
      }

      const expense = await prisma.expense.create({
        data: {
          userId,
          cropId: linkedCropId,
          cropName: resolvedCropName,
          title: title.trim(),
          amount: Number(amount),
          category: category as any,
          paymentMode: (paymentMode || 'CASH') as any,
          date: validDate,
          vendorName: vendorName?.trim() || null,
          receiptUrl: receiptUrl || null,
          notes: notes?.trim() || null,
        },
      });

      const formatted = {
        id: expense.id,
        title: expense.title,
        amount: Number(expense.amount),
        category: formatCategory(expense.category),
        crop: expense.cropName,
        cropId: expense.cropId,
        date: expense.date.toISOString().split('T')[0],
        paymentMode: expense.paymentMode,
        vendorName: expense.vendorName,
        receiptUrl: expense.receiptUrl,
        notes: expense.notes,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      };

      return AppResponse.created(req, res, formatted, 'Expense recorded successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to record expense', 500, error?.message);
    }
  }

  /**
   * Update an existing expense
   * PUT /api/v1/expenses/:id
   */
  static async update(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.expense.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Expense not found or unauthorized', 404);
      }

      const updateData: any = {};
      const {
        title,
        amount,
        category,
        crop,
        cropId,
        date,
        paymentMode,
        vendorName,
        receiptUrl,
        notes,
      } = req.body;

      if (title !== undefined) updateData.title = title.trim();
      if (amount !== undefined) updateData.amount = Number(amount);
      if (category !== undefined) updateData.category = category;
      if (crop !== undefined) updateData.cropName = crop.trim();
      if (cropId !== undefined) updateData.cropId = cropId;
      if (date !== undefined) {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) updateData.date = parsed;
      }
      if (paymentMode !== undefined) updateData.paymentMode = paymentMode;
      if (vendorName !== undefined) updateData.vendorName = vendorName?.trim() || null;
      if (receiptUrl !== undefined) updateData.receiptUrl = receiptUrl;
      if (notes !== undefined) updateData.notes = notes?.trim() || null;

      const updated = await prisma.expense.update({
        where: { id },
        data: updateData,
      });

      const formatted = {
        id: updated.id,
        title: updated.title,
        amount: Number(updated.amount),
        category: formatCategory(updated.category),
        crop: updated.cropName,
        cropId: updated.cropId,
        date: updated.date.toISOString().split('T')[0],
        paymentMode: updated.paymentMode,
        vendorName: updated.vendorName,
        receiptUrl: updated.receiptUrl,
        notes: updated.notes,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };

      return AppResponse.success(req, res, formatted, 'Expense updated successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to update expense', 500, error?.message);
    }
  }

  /**
   * Delete an expense
   * DELETE /api/v1/expenses/:id
   */
  static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.expense.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Expense not found or unauthorized', 404);
      }

      await prisma.expense.delete({
        where: { id },
      });

      return AppResponse.success(
        req,
        res,
        { id },
        `Expense "${existing.title}" deleted successfully`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to delete expense', 500, error?.message);
    }
  }

  /**
   * Financial Summary & Analytics for Expenses
   * GET /api/v1/expenses/summary
   */
  static async summary(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { year } = req.query;

      const currentYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
      const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: startOfYear,
            lte: endOfYear,
          },
          // Exclude expenses belonging to soft-deleted crops
          // (cropId=null means general farm expense — always include)
          OR: [
            { cropId: null },
            { crop: { isDeleted: false } },
          ],
        },
      });

      let totalYearlyExpense = 0;
      const categoryTotals: Record<string, number> = {};
      const cropTotals: Record<string, number> = {};
      const monthlyTotals: number[] = new Array(12).fill(0);

      expenses.forEach((item) => {
        const amount = Number(item.amount);
        totalYearlyExpense += amount;

        const cat = formatCategory(item.category);
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;

        const crop = item.cropName || 'General';
        cropTotals[crop] = (cropTotals[crop] || 0) + amount;

        const monthIndex = item.date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          (monthlyTotals as number[])[monthIndex] = ((monthlyTotals as number[])[monthIndex] ?? 0) + amount;
        }
      });

      return AppResponse.success(
        req,
        res,
        {
          year: currentYear,
          totalYearlyExpense,
          categoryBreakdown: categoryTotals,
          cropBreakdown: cropTotals,
          monthlyBreakdown: monthlyTotals,
          count: expenses.length,
        },
        'Expense financial summary calculated successfully'
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to calculate expense summary', 500, error?.message);
    }
  }
}
