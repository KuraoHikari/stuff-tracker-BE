import { z, ZodType } from 'zod';

export class LocationValidation {
  static readonly CREATE_LOCATION: ZodType = z.object({
    name: z.string().min(4).max(100),
    address: z.string().min(4).max(100).optional(),
    latitude: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    longitude: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
  });

  static readonly UPDATE_LOCATION: ZodType = z.object({
    name: z.string().min(4).max(100).optional(),
    address: z.string().min(4).max(100).optional(),
    latitude: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
    longitude: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .optional(),
  });
}
