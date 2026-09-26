import { Request, Response } from 'express';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';

export class LocationController {
  /**
   * GET /api/v1/locations/districts?stateCode=MH
   * Returns list of districts
   */
  static async getDistricts(req: Request, res: Response): Promise<any> {
    try {
      const stateCode = (req.query.stateCode as string) || 'MH';

      const districts = await prisma.district.findMany({
        where: { stateCode },
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameMr: true,
          nameHi: true,
          stateCode: true,
        },
        orderBy: { nameEn: 'asc' },
      });

      return AppResponse.success(req, res, districts, 'Districts fetched successfully');
    } catch (error: any) {
      console.error('Error fetching districts:', error);
      return AppResponse.error(req, res, 'Failed to fetch districts', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/locations/districts/:districtId/talukas
   * Returns list of talukas for a specific district
   */
  static async getTalukas(req: Request, res: Response): Promise<any> {
    try {
      const { districtId } = req.params;

      if (!districtId) {
        return AppResponse.error(req, res, 'districtId is required', 400);
      }

      const talukas = await prisma.taluka.findMany({
        where: {
          OR: [
            { districtId: districtId },
            { district: { code: districtId } },
          ],
        },
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameMr: true,
          nameHi: true,
          districtId: true,
        },
        orderBy: { nameEn: 'asc' },
      });

      return AppResponse.success(req, res, talukas, 'Talukas fetched successfully');
    } catch (error: any) {
      console.error('Error fetching talukas:', error);
      return AppResponse.error(req, res, 'Failed to fetch talukas', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/locations/talukas/:talukaId/villages
   * Returns paginated and searchable list of villages for a specific taluka
   */
  static async getVillages(req: Request, res: Response): Promise<any> {
    try {
      const { talukaId } = req.params;
      const search = (req.query.search as string)?.trim();
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '100', 10)));
      const skip = (page - 1) * limit;

      if (!talukaId) {
        return AppResponse.error(req, res, 'talukaId is required', 400);
      }

      const whereClause: any = {
        OR: [
          { talukaId: talukaId },
          { taluka: { code: talukaId } },
        ],
      };

      if (search) {
        whereClause.AND = [
          {
            OR: [
              { nameEn: { contains: search, mode: 'insensitive' } },
              { nameMr: { contains: search } },
              { nameHi: { contains: search } },
            ],
          },
        ];
      }

      const [total, villages] = await Promise.all([
        prisma.village.count({ where: whereClause }),
        prisma.village.findMany({
          where: whereClause,
          select: {
            id: true,
            code: true,
            nameEn: true,
            nameMr: true,
            nameHi: true,
            talukaId: true,
          },
          take: limit,
          skip: skip,
          orderBy: { nameEn: 'asc' },
        }),
      ]);

      return AppResponse.success(
        req,
        res,
        {
          villages,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        'Villages fetched successfully'
      );
    } catch (error: any) {
      console.error('Error fetching villages:', error);
      return AppResponse.error(req, res, 'Failed to fetch villages', 500, error?.message);
    }
  }

  /**
   * GET /api/v1/locations/search?q=...&districtId=...&talukaId=...
   * Fast auto-complete / search for villages
   */
  static async searchVillages(req: Request, res: Response): Promise<any> {
    try {
      const query = (req.query.q as string)?.trim();
      const talukaId = req.query.talukaId as string;
      const districtId = req.query.districtId as string;
      const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '30', 10)));

      if (!query || query.length < 1) {
        return AppResponse.success(req, res, [], 'Search query is empty');
      }

      const whereClause: any = {
        OR: [
          { nameEn: { contains: query, mode: 'insensitive' } },
          { nameMr: { contains: query } },
          { nameHi: { contains: query } },
        ],
      };

      if (talukaId) {
        whereClause.talukaId = talukaId;
      } else if (districtId) {
        whereClause.taluka = { districtId };
      }

      const villages = await prisma.village.findMany({
        where: whereClause,
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameMr: true,
          nameHi: true,
          taluka: {
            select: {
              id: true,
              nameEn: true,
              nameMr: true,
              district: {
                select: {
                  id: true,
                  nameEn: true,
                  nameMr: true,
                },
              },
            },
          },
        },
        take: limit,
        orderBy: { nameEn: 'asc' },
      });

      return AppResponse.success(req, res, villages, 'Search results fetched');
    } catch (error: any) {
      console.error('Error searching villages:', error);
      return AppResponse.error(req, res, 'Failed to search villages', 500, error?.message);
    }
  }
}
