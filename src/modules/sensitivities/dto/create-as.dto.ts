import { InsertASSchema } from "@/database/schemas/articles-sensitivities/articles-sensitivities.schema";

import { createZodDto } from "nestjs-zod";

export class CreateASDTO extends createZodDto(InsertASSchema) {}
