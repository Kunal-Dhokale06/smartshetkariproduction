import { z } from 'zod';

const CATEGORY_MAP: Record<string, string> = {
  fertilizer: 'FERTILIZER',
  seeds: 'SEEDS',
  pesticide: 'PESTICIDE',
  labor: 'LABOR',
  irrigation: 'IRRIGATION',
  machinery: 'MACHINERY',
  transport: 'TRANSPORT',
  other: 'OTHER',
};

const PAYMENT_MAP: Record<string, string> = {
  cash: 'CASH',
  upi: 'UPI',
  credit: 'CREDIT',
  bank_transfer: 'BANK_TRANSFER',
  other: 'OTHER',
};

export const createExpenseSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Expense title is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(150, 'Title is too long'),
    amount: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Amount must be a valid positive number',
      }),
    category: z
      .string()
      .transform((val) => CATEGORY_MAP[val.toLowerCase()] || 'OTHER')
      .default('OTHER'),
    crop: z.string().min(1).optional().nullable(),
    cropId: z.string().optional().nullable(),
    date: z.string({ required_error: 'Expense date is required' }),
    paymentMode: z
      .string()
      .optional()
      .transform((val) => (val ? PAYMENT_MAP[val.toLowerCase()] || 'CASH' : 'CASH'))
      .default('CASH'),
    vendorName: z.string().optional().nullable(),
    receiptUrl: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150).optional(),
    amount: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Amount must be a valid positive number',
      })
      .optional(),
    category: z
      .string()
      .transform((val) => CATEGORY_MAP[val.toLowerCase()] || 'OTHER')
      .optional(),
    crop: z.string().min(1).optional(),
    cropId: z.string().optional().nullable(),
    date: z.string().optional(),
    paymentMode: z
      .string()
      .transform((val) => (val ? PAYMENT_MAP[val.toLowerCase()] || 'CASH' : 'CASH'))
      .optional(),
    vendorName: z.string().optional().nullable(),
    receiptUrl: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});
