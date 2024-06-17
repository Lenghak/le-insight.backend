import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ContentExtentionsSchema = z
  .object({
    rules: z.array(z.string()),
    template: z.array(z.string()),
  })
  .partial();

export class ContentExtentionsDto extends createZodDto(
  ContentExtentionsSchema,
) {}
