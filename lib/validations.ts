import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  baseUnit: z.enum(["g", "mL", "item"]),
  stockQuantity: z.coerce.number().nonnegative(),
  pricePerBaseUnit: z.coerce.number().positive()
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
