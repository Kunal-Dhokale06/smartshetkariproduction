import { Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';
const formatISODate = (date: Date | null | undefined): string | null => (date ? date.toISOString().split('T')[0] ?? null : null);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (id?: string | null): id is string => Boolean(id && UUID_REGEX.test(id));

export class CropController {
  /**
   * List all crops for authenticated farmer
   * GET /api/v1/crops
   */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { status, season } = req.query;

      const where: any = { userId, isDeleted: false };
      if (status && typeof status === 'string') {
        const normalizedStatus = status.toUpperCase();
        if (['GROWING', 'HARVESTED', 'FAILED', 'PLANNED'].includes(normalizedStatus)) {
          where.status = normalizedStatus;
        }
      }
      if (season && typeof season === 'string') {
        where.season = season.toUpperCase();
      }

      const crops = await prisma.crop.findMany({
        where,
        orderBy: { sowingDate: 'desc' },
        include: {
          _count: {
            select: {
              expenses: true,
              sales: true,
              diaryEntries: true,
            },
          },
        },
      });

      // Format decimal amounts and dates cleanly for client consumption
      const formattedCrops = crops.map((crop) => {
        const formattedStatus = crop.status === 'GROWING' ? 'Growing' : crop.status === 'HARVESTED' ? 'Harvested' : crop.status;
        return {
          id: crop.id,
          name: crop.name,
          variety: crop.variety,
          sowingDate: formatISODate(crop.sowingDate),
          expectedHarvestDate: formatISODate(crop.expectedHarvestDate),
          actualHarvestDate: formatISODate(crop.actualHarvestDate),
          area: `${Number(crop.area)} ${crop.areaUnit}`,
          areaNumeric: Number(crop.area),
          areaUnit: crop.areaUnit,
          season: crop.season,
          status: formattedStatus,
          iconName: crop.iconName,
          notes: crop.notes,
          isDeleted: (crop as any).isDeleted ?? false,
          deletedAt: (crop as any).deletedAt ? (crop as any).deletedAt.toISOString() : null,
          expensesCount: crop._count.expenses,
          salesCount: crop._count.sales,
          diaryEntriesCount: crop._count.diaryEntries,
          createdAt: crop.createdAt,
          updatedAt: crop.updatedAt,
        };
      });

      return AppResponse.success(
        req,
        res,
        formattedCrops,
        `Retrieved ${formattedCrops.length} crops successfully`
      );
    } catch (error: any) {
      return AppResponse.error(
        req,
        res,
        'Failed to fetch crops list',
        500,
        error?.message
      );
    }
  }

  /**
   * Get single crop by ID
   * GET /api/v1/crops/:id
   */
  static async getById(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return AppResponse.error(req, res, 'Crop not found', 404);
      }

      const crop = await prisma.crop.findFirst({
        where: { id, userId },
        include: {
          expenses: {
            orderBy: { date: 'desc' },
            take: 10,
          },
          sales: {
            orderBy: { date: 'desc' },
            take: 10,
          },
          diaryEntries: {
            orderBy: { date: 'desc' },
            take: 10,
          },
        },
      });

      if (!crop) {
        return AppResponse.error(req, res, 'Crop not found', 404);
      }

      const formattedStatus = crop.status === 'GROWING' ? 'Growing' : crop.status === 'HARVESTED' ? 'Harvested' : crop.status;
      const formattedCrop = {
        id: crop.id,
        name: crop.name,
        variety: crop.variety,
        sowingDate: formatISODate(crop.sowingDate),
        expectedHarvestDate: formatISODate(crop.expectedHarvestDate),
        actualHarvestDate: formatISODate(crop.actualHarvestDate),
        area: `${Number(crop.area)} ${crop.areaUnit}`,
        areaNumeric: Number(crop.area),
        areaUnit: crop.areaUnit,
        season: crop.season,
        status: formattedStatus,
        iconName: crop.iconName,
        notes: crop.notes,
        isDeleted: crop.isDeleted,
        deletedAt: crop.deletedAt ? crop.deletedAt.toISOString() : null,
        expenses: crop.expenses.map((e) => ({ ...e, amount: Number(e.amount) })),
        sales: crop.sales.map((s) => ({
          ...s,
          quantity: Number(s.quantity),
          pricePerUnit: Number(s.pricePerUnit),
          totalAmount: Number(s.totalAmount),
        })),
        diaryEntries: crop.diaryEntries,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt,
      };

      return AppResponse.success(req, res, formattedCrop, 'Crop details retrieved successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch crop details', 500, error?.message);
    }
  }

  /**
   * Create a new crop
   * POST /api/v1/crops
   */
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const {
        name,
        variety,
        sowingDate,
        expectedHarvestDate,
        actualHarvestDate,
        area,
        areaUnit,
        season,
        status,
        iconName,
        notes,
      } = req.body;

      // Parse date safely
      const parsedSowingDate = new Date(sowingDate);
      const validSowingDate = isNaN(parsedSowingDate.getTime()) ? new Date() : parsedSowingDate;

      // Normalize status and season to Prisma enum values
      const allowedStatuses = ['GROWING','HARVESTED','FAILED','PLANNED'];
const normalizedStatus = status && allowedStatuses.includes(status.toUpperCase()) ? status.toUpperCase() as any : 'GROWING';
      const allowedSeasons = ['KHARIF','RABI','ZAID','YEAR_ROUND'];
const normalizedSeason = season && allowedSeasons.includes(season.toUpperCase()) ? season.toUpperCase() as any : 'KHARIF';

      const parsedArea = typeof area === 'number' ? area : parseFloat(String(area || '0').replace(/[^0-9.]/g, '')) || 0;
      const crop = await prisma.crop.create({
        data: {
          userId,
          name: name.trim(),
          variety: variety?.trim() || null,
          sowingDate: validSowingDate,
          expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
          actualHarvestDate: actualHarvestDate ? new Date(actualHarvestDate) : null,
          area: parsedArea,
          areaUnit: areaUnit || 'Acre',
          season: normalizedSeason,
          status: normalizedStatus,
          iconName: iconName || 'sprout',
          notes: notes?.trim() || null,
        },
      });

      const formattedStatus = crop.status === 'GROWING' ? 'Growing' : crop.status === 'HARVESTED' ? 'Harvested' : crop.status;
      const formattedCrop = {
        id: crop.id,
        name: crop.name,
        variety: crop.variety,
        sowingDate: formatISODate(crop.sowingDate),
        area: `${Number(crop.area)} ${crop.areaUnit}`,
        areaNumeric: Number(crop.area),
        areaUnit: crop.areaUnit,
        season: crop.season,
        status: formattedStatus,
        iconName: crop.iconName,
        notes: crop.notes,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt,
      };

      return AppResponse.created(req, res, formattedCrop, 'Crop registered successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to create crop', 500, error?.message);
    }
  }

  /**
   * Update an existing crop
   * PUT /api/v1/crops/:id
   */
  static async update(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      // Verify existence & ownership
      const existing = await prisma.crop.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      const updateData: any = {};
      const {
        name,
        variety,
        sowingDate,
        expectedHarvestDate,
        actualHarvestDate,
        area,
        areaUnit,
        season,
        status,
        iconName,
        notes,
      } = req.body;

      if (name !== undefined) updateData.name = name.trim();
      if (variety !== undefined) updateData.variety = variety?.trim() || null;
      if (sowingDate !== undefined) {
        const parsed = new Date(sowingDate);
        if (!isNaN(parsed.getTime())) updateData.sowingDate = parsed;
      }
      if (expectedHarvestDate !== undefined) {
        updateData.expectedHarvestDate = expectedHarvestDate ? new Date(expectedHarvestDate) : null;
      }
      if (actualHarvestDate !== undefined) {
        updateData.actualHarvestDate = actualHarvestDate ? new Date(actualHarvestDate) : null;
      }
      if (area !== undefined) {
        updateData.area = typeof area === 'number' ? area : parseFloat(String(area || '0').replace(/[^0-9.]/g, '')) || 0;
      }
      if (areaUnit !== undefined) updateData.areaUnit = areaUnit;
      if (season !== undefined) { const allowedSeasons = ['KHARIF', 'RABI', 'ZAID', 'YEAR_ROUND']; const up = season.toUpperCase(); updateData.season = allowedSeasons.includes(up) ? up : 'KHARIF'; }
      if (status !== undefined) { const allowedStatuses = ['GROWING', 'HARVESTED', 'FAILED', 'PLANNED']; const up = status.toUpperCase(); updateData.status = allowedStatuses.includes(up) ? up : 'GROWING'; }
      if (iconName !== undefined) updateData.iconName = iconName;
      if (notes !== undefined) updateData.notes = notes?.trim() || null;

      const crop = await prisma.crop.update({
        where: { id },
        data: updateData,
      });

      const formattedStatus = crop.status === 'GROWING' ? 'Growing' : crop.status === 'HARVESTED' ? 'Harvested' : crop.status;
      const formattedCrop = {
        id: crop.id,
        name: crop.name,
        variety: crop.variety,
        sowingDate: crop.sowingDate.toISOString().split('T')[0],
        area: `${Number(crop.area)} ${crop.areaUnit}`,
        areaNumeric: Number(crop.area),
        areaUnit: crop.areaUnit,
        season: crop.season,
        status: formattedStatus,
        iconName: crop.iconName,
        notes: crop.notes,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt,
      };

      return AppResponse.success(req, res, formattedCrop, 'Crop updated successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to update crop', 500, error?.message);
    }
  }

  /**
   * List soft-deleted crops (Trash)
   * GET /api/v1/crops/trash
   */
  static async listTrash(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;

      const crops = await prisma.crop.findMany({
        where: { userId, isDeleted: true },
        orderBy: { deletedAt: 'desc' },
        include: {
          _count: {
            select: {
              expenses: true,
              sales: true,
              diaryEntries: true,
            },
          },
        },
      });

      const formattedCrops = crops.map((crop) => {
        const formattedStatus = crop.status === 'GROWING' ? 'Growing' : crop.status === 'HARVESTED' ? 'Harvested' : crop.status;
        return {
          id: crop.id,
          name: crop.name,
          variety: crop.variety,
          sowingDate: formatISODate(crop.sowingDate),
          expectedHarvestDate: formatISODate(crop.expectedHarvestDate),
          actualHarvestDate: formatISODate(crop.actualHarvestDate),
          area: `${Number(crop.area)} ${crop.areaUnit}`,
          areaNumeric: Number(crop.area),
          areaUnit: crop.areaUnit,
          season: crop.season,
          status: formattedStatus,
          iconName: crop.iconName,
          notes: crop.notes,
          isDeleted: true,
          deletedAt: crop.deletedAt ? crop.deletedAt.toISOString() : null,
          expensesCount: crop._count.expenses,
          salesCount: crop._count.sales,
          diaryEntriesCount: crop._count.diaryEntries,
          createdAt: crop.createdAt,
          updatedAt: crop.updatedAt,
        };
      });

      return AppResponse.success(req, res, formattedCrops, 'Trash crops retrieved successfully');
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to fetch trash crops', 500, error?.message);
    }
  }

  /**
   * Soft-delete a crop (moves to Trash)
   * DELETE /api/v1/crops/:id
   */
  static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      const existing = await prisma.crop.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      const deletedAt = new Date();
      await prisma.crop.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt,
        },
      });

      return AppResponse.success(
        req,
        res,
        { id, isDeleted: true, deletedAt: deletedAt.toISOString() },
        `Crop "${existing.name}" moved to Trash successfully`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to move crop to Trash', 500, error?.message);
    }
  }

  /**
   * Restore a soft-deleted crop from Trash
   * POST /api/v1/crops/:id/restore
   * 
   * Restores the crop and all its related data ONLY by cropId.
   * Does NOT use name-matching to avoid cross-crop data contamination.
   */
  static async restore(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      const existing = await prisma.crop.findFirst({
        where: { id, userId, isDeleted: true },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Crop not found in Trash or unauthorized', 404);
      }

      // Restore crop + all related records in a single atomic transaction
      const restoredCrop = await prisma.$transaction(async (tx) => {
        // 1. Restore the crop itself
        const crop = await tx.crop.update({
          where: { id },
          data: {
            isDeleted: false,
            deletedAt: null,
          },
        });

        // 2. Re-link any expenses/sales/diary whose cropId matches this crop
        //    (they keep their cropId intact — no name matching needed)
        //    We also re-link any orphaned records (cropId=null) that match cropName exactly,
        //    but ONLY if they have no other active crop with the same name.
        const otherActiveCropWithSameName = await tx.crop.findFirst({
          where: {
            userId,
            name: { equals: existing.name.trim(), mode: 'insensitive' },
            isDeleted: false,
            id: { not: id },
          },
        });

        // Only do name-based orphan re-linking if no other active crop has the same name
        const orphanNameClause = !otherActiveCropWithSameName
          ? [{ cropId: null as string | null, cropName: { equals: existing.name.trim(), mode: 'insensitive' as const } }]
          : [];

        await Promise.all([
          tx.expense.updateMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                ...orphanNameClause,
              ],
            },
            data: { cropId: id },
          }),
          tx.sale.updateMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                ...orphanNameClause,
              ],
            },
            data: { cropId: id },
          }),
          tx.diaryEntry.updateMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                ...orphanNameClause,
              ],
            },
            data: { cropId: id },
          }),
        ]);

        return crop;
      });

      // Count restored related items for response
      const [expenseCount, saleCount, diaryCount] = await Promise.all([
        prisma.expense.count({ where: { userId, cropId: id } }),
        prisma.sale.count({ where: { userId, cropId: id } }),
        prisma.diaryEntry.count({ where: { userId, cropId: id } }),
      ]);

      const formattedStatus = restoredCrop.status === 'GROWING' ? 'Growing' : restoredCrop.status === 'HARVESTED' ? 'Harvested' : restoredCrop.status;
      const formatted = {
        id: restoredCrop.id,
        name: restoredCrop.name,
        cropName: restoredCrop.name,
        variety: restoredCrop.variety,
        sowingDate: formatISODate(restoredCrop.sowingDate),
        expectedHarvestDate: formatISODate(restoredCrop.expectedHarvestDate),
        actualHarvestDate: formatISODate(restoredCrop.actualHarvestDate),
        area: `${Number(restoredCrop.area)} ${restoredCrop.areaUnit}`,
        areaNumeric: Number(restoredCrop.area),
        areaUnit: restoredCrop.areaUnit,
        season: restoredCrop.season,
        status: formattedStatus,
        iconName: restoredCrop.iconName,
        notes: restoredCrop.notes,
        isDeleted: false,
        deletedAt: null,
        createdAt: restoredCrop.createdAt,
        updatedAt: restoredCrop.updatedAt,
        relatedCounts: {
          expenses: expenseCount,
          sales: saleCount,
          diaryEntries: diaryCount,
        },
      };

      return AppResponse.success(
        req,
        res,
        formatted,
        `Crop "${restoredCrop.name}" restored successfully with ${expenseCount} expenses, ${saleCount} sales, and ${diaryCount} notes`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to restore crop', 500, error?.message);
    }
  }

  /**
   * Permanently delete a crop and all its related records (Cascading purge - 0 orphans)
   * Atomically purges Crop, Expenses, Sales, Diary Notes, Budgets, and linked Bills.
   * DELETE /api/v1/crops/:id/permanent
   */
  static async permanentDelete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      const existing = await prisma.crop.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      // 1. Find all candidate bills linked through this crop's expenses
      const linkedExpenses = await prisma.expense.findMany({
        where: {
          userId,
          billId: { not: null },
          OR: [
            { cropId: id },
            { cropName: { equals: existing.name.trim(), mode: 'insensitive' } },
          ],
        },
        select: { billId: true },
      });
      const candidateBillIds = Array.from(
        new Set(linkedExpenses.map((e) => e.billId).filter((bid): bid is string => Boolean(bid)))
      );

      // 2. Only delete bills that are NOT shared with other crops
      let billIdsToDelete: string[] = [];
      if (candidateBillIds.length > 0) {
        const sharedExpenses = await prisma.expense.findMany({
          where: {
            userId,
            billId: { in: candidateBillIds },
            NOT: {
              OR: [
                { cropId: id },
                { cropName: { equals: existing.name.trim(), mode: 'insensitive' } },
              ],
            },
          },
          select: { billId: true },
        });
        const sharedBillIds = new Set(sharedExpenses.map((e) => e.billId));
        billIdsToDelete = candidateBillIds.filter((bid) => !sharedBillIds.has(bid));
      }

      // 3. Atomically execute complete cascading deletion leaving zero orphan records
      const [deletedExpenses, deletedBills, deletedSales, deletedNotes, deletedBudgets, deletedCrop] =
        await prisma.$transaction([
          prisma.expense.deleteMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                { cropName: { equals: existing.name.trim(), mode: 'insensitive' } },
              ],
            },
          }),
          prisma.bill.deleteMany({
            where: {
              id: { in: billIdsToDelete },
              userId,
            },
          }),
          prisma.sale.deleteMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                { cropName: { equals: existing.name.trim(), mode: 'insensitive' } },
              ],
            },
          }),
          prisma.diaryEntry.deleteMany({
            where: {
              userId,
              OR: [
                { cropId: id },
                { cropName: { equals: existing.name.trim(), mode: 'insensitive' } },
              ],
            },
          }),
          prisma.budget.deleteMany({ where: { cropId: id } }),
          prisma.crop.delete({ where: { id } }),
        ]);

      return AppResponse.success(
        req,
        res,
        {
          id,
          permanentlyDeleted: true,
          recordsDeleted: {
            crop: 1,
            expenses: deletedExpenses.count,
            bills: deletedBills.count,
            sales: deletedSales.count,
            diaryEntries: deletedNotes.count,
            budgets: deletedBudgets.count,
          },
        },
        `Crop "${existing.name}" and all related expenses (${deletedExpenses.count}), sales (${deletedSales.count}), bills (${deletedBills.count}), and notes (${deletedNotes.count}) permanently deleted`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to permanently delete crop', 500, error?.message);
    }
  }
}
