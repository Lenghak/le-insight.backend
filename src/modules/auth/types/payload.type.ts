import { z } from "nestjs-zod/z";

export const PayLoadSchema = z
  .object({
    sub: z.string().uuid(),
    sid: z.string().uuid(),
    email: z.string().email(),
    iat: z.number(),
    exp: z.number(),
  })
  .required();

export type PayLoadType = z.infer<typeof PayLoadSchema>;
