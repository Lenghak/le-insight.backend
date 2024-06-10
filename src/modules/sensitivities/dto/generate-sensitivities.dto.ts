import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GenerateSensitivitiesSchema = z.object({
  article: z.string(),
});

export const GenerateSensitivitiesResponseSchema = z.object({
  sensitivities: z.array(
    z.object({
      label: z.string(),
      rate: z.number(),
    }),
  ),
});

export type GenerateSensitivitiesResponseType = z.infer<
  typeof GenerateSensitivitiesResponseSchema
>;

export class GenerateSensitivitiesDTO extends createZodDto(
  GenerateSensitivitiesSchema,
) {}
