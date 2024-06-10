import { GenerateSensitivitiesResponseSchema } from "@/modules/sensitivities/dto/generate-sensitivities.dto";

import { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ApplyASSchema = z.object({
  article: SelectArticleSchema,
  sensitivities: GenerateSensitivitiesResponseSchema.shape.sensitivities,
});

export class ApplyASDTO extends createZodDto(ApplyASSchema) {}
