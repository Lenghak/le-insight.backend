import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ContentToneEnumSchema = z.enum([
  "academic",
  "business",
  "casual",
  "childfriendly",
  "conversational",
  "emotional",
  "humorous",
  "informative",
  "inspirational",
  "memeified",
  "narrative",
  "objective",
  "persuasive",
  "poetic",
]);

export const ContentOptionsSchema = z.object({
  tone: ContentToneEnumSchema,
});

export class ContentOptionDto extends createZodDto(ContentOptionsSchema) {}
