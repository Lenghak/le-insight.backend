import { GenerateCategoriesSchema } from "@/modules/categories/dto/generate-categories.dto";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ClassifySensitivitiesSchema = GenerateCategoriesSchema.extend({
  sensitivities: z.array(z.string().nullable()),
});

export class ClassifySensitiviesDto extends createZodDto(
  ClassifySensitivitiesSchema,
) {}
