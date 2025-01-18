import { z, ZodType } from 'zod';

export class ItemValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional(),
    purchasePrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    sellPrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    estimatedValue: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    purchaseDate: z.date().optional(),
    categoryId: z.string().optional(),
    image: z.string().url().optional(),
    conditionId: z.string().optional(),
    statusId: z.string().optional(),
    locationId: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(255).optional(),
    purchasePrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    sellPrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    estimatedValue: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    purchaseDate: z.date().optional(),
    categoryId: z.string().optional(),
    image: z.string().url().optional(),
    conditionId: z.string().optional(),
    statusId: z.string().optional(),
    locationId: z.string().optional(),
  });
}
