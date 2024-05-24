import { InsertACSchema } from "@/database/schemas/articles-categories/articles-categories.schema";

import { createZodDto } from "nestjs-zod";

export class DeleteACDTO extends createZodDto(
  InsertACSchema.partial().required({ article_id: true }),
) {}
