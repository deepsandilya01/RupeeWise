import { z } from 'zod';

export const createTransactionSchema = z.object({
  title: z
    .string({ required_error: 'Title or merchant name is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters'),
  amount: z.coerce
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be greater than zero'),
  type: z
    .string({ required_error: 'Transaction type is required' })
    .toLowerCase()
    .refine((val) => ['income', 'expense'].includes(val), {
      message: 'Transaction type must be either income or expense',
    }),
  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(1, 'Category cannot be empty')
    .max(80, 'Category cannot exceed 80 characters'),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => (val ? new Date(val) : new Date())),
  paymentMethod: z
    .enum(['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Cash', 'Other'])
    .optional()
    .default('UPI'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().default(''),
});

export const updateTransactionSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    amount: z.coerce.number().positive().optional(),
    type: z
      .string()
      .toLowerCase()
      .refine((val) => ['income', 'expense'].includes(val), {
        message: 'Transaction type must be either income or expense',
      })
      .optional(),
    category: z.string().trim().min(1).max(80).optional(),
    date: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .transform((val) => (val ? new Date(val) : undefined)),
    paymentMethod: z
      .enum(['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Cash', 'Other'])
      .optional(),
    description: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
  );

export const bulkImportSchema = z.object({
  transactions: z
    .array(createTransactionSchema)
    .min(1, 'At least one valid transaction must be provided for import')
    .max(500, 'Cannot import more than 500 transactions at once'),
});

export const queryTransactionSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'title', 'category', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
