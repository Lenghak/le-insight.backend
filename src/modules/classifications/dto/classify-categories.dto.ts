import { GenerateCategoriesSchema } from "@/modules/categories/dto/generate-categories.dto";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ClassifyCategoriesSchema = GenerateCategoriesSchema.extend({
  categories: z.array(
    z.object({
      label: z.string().nullable(),
    }),
  ),
});

export class ClassifyCategoriesDto extends createZodDto(
  ClassifyCategoriesSchema,
) {}
