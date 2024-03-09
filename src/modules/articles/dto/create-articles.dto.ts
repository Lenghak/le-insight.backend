import { InsertArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";

export class CreateArticlesDTO extends createZodDto(InsertArticleSchema) {}
