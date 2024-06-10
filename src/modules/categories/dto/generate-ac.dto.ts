import { InsertACSchema } from "@/database/schemas/articles-categories/articles-categories.schema";
import { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GenerateACSchema = z.object({
  article: SelectArticleSchema,
  category_id: InsertACSchema.shape.category_id.optional(),
});

export const RegenerateACSchema = z.object({
  article_id: SelectArticleSchema.shape.id,
});

export class GenerateACDTO extends createZodDto(GenerateACSchema) {}

export class RegenerateACDTO extends createZodDto(RegenerateACSchema) {}
