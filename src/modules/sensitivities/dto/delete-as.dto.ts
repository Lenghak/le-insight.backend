import { InsertASSchema } from "@/database/schemas/articles-sensitivities/articles-sensitivities.schema";

import { createZodDto } from "nestjs-zod";

export class DeleteASDTO extends createZodDto(
  InsertASSchema.partial().required({ article_id: true }),
) {}
