import { z } from 'zod';

export const createCropSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Crop name is required' })
      .min(2, 'Crop name must be at least 2 characters')
      .max(100, 'Crop name is too long'),
    variety: z.string().optional().nullable(),
    sowingDate: z
      .string({ required_error: 'Sowing date is required' })
      .min(4, 'Please enter a valid sowing date'),
    expectedHarvestDate: z.string().optional().nullable(),
    actualHarvestDate: z.string().optional().nullable(),
    area: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Area must be a valid positive number',
      }),
    areaUnit: z.string().default('Acre'),
    season: z
      .string()
      .transform((val) => {
        const normalized = val.toUpperCase().replace(/[\s-]/g, '_');
        if (['KHARIF', 'RABI', 'ZAID', 'YEAR_ROUND'].includes(normalized)) {
          return normalized as 'KHARIF' | 'RABI' | 'ZAID' | 'YEAR_ROUND';
        }
        return 'KHARIF';
      })
      .default('KHARIF'),
    status: z
      .string()
      .transform((val) => {
        const normalized = val.toUpperCase();
        if (['GROWING', 'HARVESTED', 'FAILED', 'PLANNED'].includes(normalized)) {
          return normalized as 'GROWING' | 'HARVESTED' | 'FAILED' | 'PLANNED';
        }
        return 'GROWING';
      })
      .default('GROWING'),
    iconName: z.string().default('sprout'),
    notes: z.string().optional().nullable(),
  }),
});

export const updateCropSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    variety: z.string().optional().nullable(),
    sowingDate: z.string().min(4).optional(),
    expectedHarvestDate: z.string().optional().nullable(),
    actualHarvestDate: z.string().optional().nullable(),
    area: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Area must be a valid positive number',
      })
      .optional(),
    areaUnit: z.string().optional(),
    season: z.enum(['KHARIF', 'RABI', 'ZAID', 'YEAR_ROUND']).optional(),
    status: z
      .enum(['GROWING', 'HARVESTED', 'FAILED', 'PLANNED', 'Growing', 'Harvested'])
      .transform((val) => {
        if (val === 'Growing') return 'GROWING';
        if (val === 'Harvested') return 'HARVESTED';
        return val;
      })
      .optional(),
    iconName: z.string().optional(),
    notes: z.string().optional().nullable(),
  }),
});
