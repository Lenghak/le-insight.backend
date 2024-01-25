import { z } from "nestjs-zod/z";

export const PayloadSchema = z
  .object({
    sub: z.string().uuid(),
    sid: z.string().uuid(),
    email: z.string().email(),
    iat: z.number(),
    exp: z.number(),
  })
  .required();

export const PayloadWithRefreshTokenSchema = PayloadSchema.extend({
  rt: z.string(),
}).required();

export type PayloadType = z.infer<typeof PayloadSchema>;

export type PayloadWithRefreshTokenType = z.infer<
  typeof PayloadWithRefreshTokenSchema
>;
