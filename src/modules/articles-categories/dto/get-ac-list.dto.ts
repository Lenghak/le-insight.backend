import { SelectACSchema } from "@/database/schemas/articles-categories/articles-categories.schema";

import { createZodDto } from "nestjs-zod";

export class GetACListDTO extends createZodDto(SelectACSchema.partial()) {}
