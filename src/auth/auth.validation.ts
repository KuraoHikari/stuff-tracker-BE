import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(4).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });
}
