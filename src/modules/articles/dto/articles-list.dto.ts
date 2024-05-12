import { PaginationSchema } from "@/common/dto/pagination.dto";

import { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ArticlesListSchema = PaginationSchema.extend({
  status: SelectArticleSchema.shape.visibility.optional(),
});

export class ArticlesListDTO extends createZodDto(ArticlesListSchema) {}

export const GetArticlesListParamsSchema = PaginationSchema.omit({
  page: true,
}).extend({
  limit: z.number(),
  offset: z.number(),
  status: SelectArticleSchema.shape.visibility.optional(),
});

export type GetArticlesListParamsType = z.infer<
  typeof GetArticlesListParamsSchema
>;
