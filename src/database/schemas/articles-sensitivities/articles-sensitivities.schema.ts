import { articlesSensitivities } from "@/database/models/articles-sensitivities";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const SensitivitySentimentSchema = z.enum([
  "POSITIVE",
  "NEGATIVE",
  "NEUTRAL",
  "MIXED",
]);

export const SelectASSchema = createSelectSchema(articlesSensitivities);

export const InsertASSchema = createInsertSchema(articlesSensitivities);

export const UpdateASSchema = SelectASSchema.omit({
  article_id: true,
}).partial();

export const DeleteASSchema = SelectASSchema;
