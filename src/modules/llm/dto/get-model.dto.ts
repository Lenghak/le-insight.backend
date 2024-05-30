import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ModelEnumSchema = z.enum([
  "llama2",
  "llama3",
  "llama3:text",
  "llama3:70b",
  "mistral",
  "mixstral",
  "phi3",
  "phi3:mini-128k",
  "phi3:medium",
]);

export type ModelEnumType = z.infer<typeof ModelEnumSchema>;

export const GetModelSchema = z.object({
  model: ModelEnumSchema.optional(),
});

export class GetModelDto extends createZodDto(GetModelSchema) {}
