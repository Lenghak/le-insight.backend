import { GenerateCategoriesResponseSchema } from "@/modules/categories/dto/generate-categories.dto";

import { InsertArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";

const CreateArticlesSchema = InsertArticleSchema.extend({
  categories: GenerateCategoriesResponseSchema.shape.categories,
});

export class CreateArticlesDTO extends createZodDto(CreateArticlesSchema) {}
