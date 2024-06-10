import { InsertASSchema } from "@/database/schemas/articles-sensitivities/articles-sensitivities.schema";
import { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GenerateASSchema = z.object({
  article: SelectArticleSchema,
  sensitivity_id: InsertASSchema.shape.sensitivity_id.optional(),
  sentiment: InsertASSchema.shape.sentiment,
});

export const RegenerateASSchema = z.object({
  article_id: SelectArticleSchema.shape.id,
});

export class GenerateASDTO extends createZodDto(GenerateASSchema) {}

export class RegenerateASDTO extends createZodDto(RegenerateASSchema) {}
