import { Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';

export class CropController {
  /**
   * List all crops for authenticated farmer
   * GET /api/v1/crops
   */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { status, season } = req.query;

      const where: any = { userId };
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
          sowingDate: crop.sowingDate.toISOString().split('T')[0],
          expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.toISOString().split('T')[0] : null,
          actualHarvestDate: crop.actualHarvestDate ? crop.actualHarvestDate.toISOString().split('T')[0] : null,
          area: `${Number(crop.area)} ${crop.areaUnit}`,
          areaNumeric: Number(crop.area),
          areaUnit: crop.areaUnit,
          season: crop.season,
          status: formattedStatus,
          iconName: crop.iconName,
          notes: crop.notes,
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
        sowingDate: crop.sowingDate.toISOString().split('T')[0],
        expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.toISOString().split('T')[0] : null,
        actualHarvestDate: crop.actualHarvestDate ? crop.actualHarvestDate.toISOString().split('T')[0] : null,
        area: `${Number(crop.area)} ${crop.areaUnit}`,
        areaNumeric: Number(crop.area),
        areaUnit: crop.areaUnit,
        season: crop.season,
        status: formattedStatus,
        iconName: crop.iconName,
        notes: crop.notes,
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
      const normalizedStatus = (status ? status.toUpperCase() : 'GROWING') as any;
      const normalizedSeason = (season ? season.toUpperCase() : 'KHARIF') as any;

      const crop = await prisma.crop.create({
        data: {
          userId,
          name: name.trim(),
          variety: variety?.trim() || null,
          sowingDate: validSowingDate,
          expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
          actualHarvestDate: actualHarvestDate ? new Date(actualHarvestDate) : null,
          area: Number(area),
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
      if (area !== undefined) updateData.area = Number(area);
      if (areaUnit !== undefined) updateData.areaUnit = areaUnit;
      if (season !== undefined) updateData.season = season.toUpperCase();
      if (status !== undefined) updateData.status = status.toUpperCase();
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
   * Delete a crop
   * DELETE /api/v1/crops/:id
   */
  static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.crop.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return AppResponse.error(req, res, 'Crop not found or unauthorized', 404);
      }

      await prisma.crop.delete({
        where: { id },
      });

      return AppResponse.success(
        req,
        res,
        { id },
        `Crop "${existing.name}" deleted successfully`
      );
    } catch (error: any) {
      return AppResponse.error(req, res, 'Failed to delete crop', 500, error?.message);
    }
  }
}
