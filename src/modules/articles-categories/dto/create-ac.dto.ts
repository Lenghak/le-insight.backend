import { InsertACSchema } from "@/database/schemas/articles-categories/articles-categories.schema";

import { createZodDto } from "nestjs-zod";

export class CreateACDTO extends createZodDto(InsertACSchema) {}
