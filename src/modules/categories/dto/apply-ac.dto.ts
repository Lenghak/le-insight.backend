import { GenerateCategoriesResponseSchema } from "@/modules/categories/dto/generate-categories.dto";

import { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ApplyACSchema = z.object({
  article: SelectArticleSchema,
  categories: GenerateCategoriesResponseSchema.shape.categories,
});

export class ApplyACDTO extends createZodDto(ApplyACSchema) {}
