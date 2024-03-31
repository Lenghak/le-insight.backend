import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GenerateCategoriesSchema = z.object({
  article: z.string(),
});

export class GenerateCategoriesDTO extends createZodDto(
  GenerateCategoriesSchema,
) {}
