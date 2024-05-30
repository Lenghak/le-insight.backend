import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GenerateCategoriesSchema = z.object({
  article: z.string(),
});

export const GenerateCategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      label: z.string(),
      rate: z.number(),
    }),
  ),
  sensitivity: z.object({
    label: z.string(),
    rate: z.number(),
  }),
});

export type GenerateCategoriesResponseType = z.infer<
  typeof GenerateCategoriesResponseSchema
>;

export class GenerateCategoriesDTO extends createZodDto(
  GenerateCategoriesSchema,
) {}
