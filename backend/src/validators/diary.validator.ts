import { z } from 'zod';

export const createDiarySchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Note content is required' })
      .min(1, 'Content cannot be empty')
      .max(5000, 'Content is too long'),
    crop: z.string().optional().nullable(),
    cropId: z.string().optional().nullable(),
    date: z.string({ required_error: 'Date is required' }),
    source: z
      .enum(['TEXT', 'VOICE', 'text', 'voice'])
      .transform((v) => v.toUpperCase() as 'TEXT' | 'VOICE')
      .default('TEXT'),
    audioUrl: z.string().url().optional().nullable(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const updateDiarySchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    crop: z.string().optional().nullable(),
    cropId: z.string().optional().nullable(),
    date: z.string().optional(),
    source: z
      .enum(['TEXT', 'VOICE', 'text', 'voice'])
      .transform((v) => v.toUpperCase() as 'TEXT' | 'VOICE')
      .optional(),
    audioUrl: z.string().url().optional().nullable(),
    tags: z.array(z.string()).optional(),
  }),
});
