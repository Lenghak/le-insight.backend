import { UpdateArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";

export class UpdateArticlesDTO extends createZodDto(UpdateArticleSchema) {}
