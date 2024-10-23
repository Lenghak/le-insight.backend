import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const OAuthSchema = z
  .object({
    provider: z.enum(["google", "github", "facebook"]),
    accessToken: z.string().min(8),
  })
  .required();

export class OAuthDto extends createZodDto(OAuthSchema) {}
