import { z } from 'zod';

const UNIT_MAP: Record<string, string> = {
  kg: 'Kg',
  quintal: 'Quintal',
  ton: 'Ton',
  bag: 'Bag',
  crate: 'Crate',
  tonne: 'Ton',
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  paid: 'PAID',
  pending: 'PENDING',
  partial: 'PARTIAL',
};

const normalizeUnit = (val: string) =>
  UNIT_MAP[val.toLowerCase()] ?? val;

const normalizePaymentStatus = (val: string) =>
  PAYMENT_STATUS_MAP[val.toLowerCase()] ?? 'PAID';

export const createSaleSchema = z.object({
  body: z.object({
    cropName: z
      .string({ required_error: 'Crop name is required' })
      .min(1, 'Crop name is required')
      .max(100),

    cropId: z.string().optional().nullable(),

    quantity: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Quantity must be a valid positive number',
      }),

    unit: z
      .string()
      .transform(normalizeUnit)
      .default('Quintal'),

    pricePerUnit: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Price per unit must be a valid positive number',
      }),

    marketName: z
      .string({ required_error: 'Market name is required' })
      .min(1, 'Market / buyer name is required')
      .max(200),

    buyerName: z.string().optional().nullable(),

    paymentStatus: z
      .string()
      .transform(normalizePaymentStatus)
      .default('PAID'),

    date: z.string({ required_error: 'Sale date is required' }),

    notes: z.string().optional().nullable(),
  }),
});

export const updateSaleSchema = z.object({
  body: z.object({
    cropName: z.string().min(1).max(100).optional(),
    cropId: z.string().optional().nullable(),
    quantity: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0)
      .optional(),
    unit: z.string().transform(normalizeUnit).optional(),
    pricePerUnit: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0)
      .optional(),
    marketName: z.string().min(1).max(200).optional(),
    buyerName: z.string().optional().nullable(),
    paymentStatus: z.string().transform(normalizePaymentStatus).optional(),
    date: z.string().optional(),
    notes: z.string().optional().nullable(),
  }),
});
