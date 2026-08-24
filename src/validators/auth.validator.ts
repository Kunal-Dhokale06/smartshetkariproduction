import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .regex(/^\+?[0-9\s-]+$/, 'Please enter a valid phone number format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    name: z
      .string({ required_error: 'Farmer name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name is too long'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),
    village: z.string().optional(),
    taluka: z.string().optional(),
    district: z.string().optional(),
    state: z.string().default('Maharashtra'),
    landArea: z.number().positive('Land area must be greater than 0').optional(),
    landAreaUnit: z.string().default('Acre'),
    language: z.enum(['en', 'mr', 'hi']).default('mr'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string({ required_error: 'Phone number or email is required' })
      .min(3, 'Identifier is too short'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional().or(z.literal('')),
    village: z.string().optional(),
    taluka: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    landArea: z.number().positive().optional(),
    landAreaUnit: z.string().optional(),
    language: z.enum(['en', 'mr', 'hi']).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});
