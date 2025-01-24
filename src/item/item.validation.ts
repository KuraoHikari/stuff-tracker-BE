// Import Zod library for schema validation
import { z, ZodType } from 'zod';

// Regular expression to validate CUID format
const cuidRegex = /^c[^\s-]{8,}$/;

// Define the ItemValidation class
export class ItemValidation {
  // Define the CREATE validation schema
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100), // Name is required, min 1 and max 100 characters
    description: z.string().max(255).optional(), // Description is optional, max 255 characters
    purchasePrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Purchase price can be a string or number, optional
      .optional(),
    sellPrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Sell price can be a string or number, optional
      .optional(),
    estimatedValue: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Estimated value can be a string or number, optional
      .optional(),
    purchaseDate: z
      .union([z.string().transform((val) => new Date(val)), z.date()]) // Purchase date can be a string or date, optional
      .optional(),
    expiredDate: z
      .union([z.string().transform((val) => new Date(val)), z.date()]) // Expired date can be a string or date, optional
      .optional(),
    categoryId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Category ID must be a valid CUID, optional
      .optional(),
    image: z.string().url().optional(), // Image URL is optional
    conditionId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Condition ID must be a valid CUID, optional
      .optional(),
    statusId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Status ID must be a valid CUID, optional
      .optional(),
    locationId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Location ID must be a valid CUID, optional
      .optional(),
  });

  // Define the UPDATE validation schema
  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(), // Name is optional, min 1 and max 100 characters
    description: z.string().max(255).optional(), // Description is optional, max 255 characters
    purchasePrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Purchase price can be a string or number, optional
      .optional(),
    sellPrice: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Sell price can be a string or number, optional
      .optional(),
    estimatedValue: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()]) // Estimated value can be a string or number, optional
      .optional(),
    purchaseDate: z
      .union([z.string().transform((val) => new Date(val)), z.date()]) // Purchase date can be a string or date, optional
      .optional(),
    expiredDate: z
      .union([z.string().transform((val) => new Date(val)), z.date()]) // Expired date can be a string or date, optional
      .optional(),
    categoryId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Category ID must be a valid CUID, optional
      .optional(),
    image: z.string().url().optional(), // Image URL is optional
    conditionId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Condition ID must be a valid CUID, optional
      .optional(),
    statusId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Status ID must be a valid CUID, optional
      .optional(),
    locationId: z
      .string()
      .refine((val) => cuidRegex.test(val), { message: 'Invalid CUID' }) // Location ID must be a valid CUID, optional
      .optional(),
  });
}
