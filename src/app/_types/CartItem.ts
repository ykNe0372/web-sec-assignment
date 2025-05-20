import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1), // 1文字以上
  quantity: z.number().min(0), // 0以上
});

export type CartItem = z.infer<typeof cartItemSchema>;
