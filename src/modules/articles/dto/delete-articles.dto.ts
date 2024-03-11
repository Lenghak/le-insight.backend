import { DeleteArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";

export class DeleteArticlesDTO extends createZodDto(DeleteArticleSchema) {}
