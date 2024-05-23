import { InsertArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";

const CreateArticlesSchema = InsertArticleSchema;

export class CreateArticlesDTO extends createZodDto(CreateArticlesSchema) {}
