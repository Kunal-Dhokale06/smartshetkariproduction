import { Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatEntry(entry: any) {
  return {
    id: entry.id,
    content: entry.content,
    crop: entry.cropName || 'General',
    cropId: entry.cropId,
    date: formatDate(entry.date),
    dateISO: entry.date.toISOString(),
    source: entry.source === 'VOICE' ? 'voice' : 'text',
    audioUrl: entry.audioUrl,
    tags: entry.tags || [],
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

export class DiaryController {
  /** GET /api/v1/diary — list all entries newest first */
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { crop, limit } = req.query as Record<string, string>;

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
      if (crop) where.cropName = { contains: crop, mode: 'insensitive' };

      const entries = await prisma.diaryEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit ? parseInt(limit, 10) : undefined,
      });

      return AppResponse.success(
        req, res,
        { items: entries.map(formatEntry), count: entries.length },
        'Diary entries retrieved'
      );
    } catch (err: any) {
      return AppResponse.error(req, res, 'Failed to fetch diary entries', 500, err?.message);
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const entry = await prisma.diaryEntry.findFirst({ where: { id, userId } });
      if (!entry) return AppResponse.error(req, res, 'Diary entry not found', 404);
      return AppResponse.success(req, res, formatEntry(entry), 'Diary entry retrieved');
    } catch (err: any) {
      return AppResponse.error(req, res, 'Failed to fetch diary entry', 500, err?.message);
    }
  }

  /** POST /api/v1/diary */
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { content, crop, cropId, date, source, audioUrl, tags } = req.body;

      // Auto-link crop if name provided
      let linkedCropId = cropId || null;
      if (!linkedCropId && crop) {
        const found = await prisma.crop.findFirst({
          where: { userId, name: { equals: crop.trim(), mode: 'insensitive' } },
        });
        if (found) linkedCropId = found.id;
      }

      const parsedDate = new Date(date);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const entry = await prisma.diaryEntry.create({
        data: {
          userId,
          cropId: linkedCropId,
          cropName: crop ? crop.trim() : 'General',
          content: content.trim(),
          date: validDate,
          source: (source || 'TEXT') as any,
          audioUrl: audioUrl || null,
          tags: Array.isArray(tags) ? tags : [],
        },
      });

      return AppResponse.created(req, res, formatEntry(entry), 'Diary entry saved');
    } catch (err: any) {
      return AppResponse.error(req, res, 'Failed to save diary entry', 500, err?.message);
    }
  }

  /** PUT /api/v1/diary/:id */
  static async update(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.diaryEntry.findFirst({ where: { id, userId } });
      if (!existing) return AppResponse.error(req, res, 'Diary entry not found', 404);

      const { content, crop, cropId, date, source, audioUrl, tags } = req.body;

      let linkedCropId = cropId !== undefined ? (cropId || null) : existing.cropId;
      if (!linkedCropId && crop) {
        const found = await prisma.crop.findFirst({
          where: { userId, name: { equals: crop.trim(), mode: 'insensitive' } },
        });
        if (found) linkedCropId = found.id;
      }

      const parsedDate = date ? new Date(date) : null;
      const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : existing.date;

      const updated = await prisma.diaryEntry.update({
        where: { id },
        data: {
          content: content ? content.trim() : existing.content,
          cropName: crop ? crop.trim() : existing.cropName,
          cropId: linkedCropId,
          date: validDate,
          source: source ? (source as any) : existing.source,
          audioUrl: audioUrl !== undefined ? (audioUrl || null) : existing.audioUrl,
          tags: Array.isArray(tags) ? tags : existing.tags,
        },
      });

      return AppResponse.success(req, res, formatEntry(updated), 'Diary entry updated');
    } catch (err: any) {
      return AppResponse.error(req, res, 'Failed to update diary entry', 500, err?.message);
    }
  }

  /** DELETE /api/v1/diary/:id */
  static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const existing = await prisma.diaryEntry.findFirst({ where: { id, userId } });
      if (!existing) return AppResponse.error(req, res, 'Diary entry not found', 404);
      await prisma.diaryEntry.delete({ where: { id } });
      return AppResponse.success(req, res, { id }, 'Diary entry deleted');
    } catch (err: any) {
      return AppResponse.error(req, res, 'Failed to delete diary entry', 500, err?.message);
    }
  }
}
