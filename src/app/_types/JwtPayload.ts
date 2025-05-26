import { z } from "zod";

export const JwtPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
