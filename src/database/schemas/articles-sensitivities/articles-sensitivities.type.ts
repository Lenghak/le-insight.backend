import type { z } from "nestjs-zod/z";

import type {
  DeleteASSchema,
  InsertASSchema,
  SelectASSchema,
  SensitivitySentimentSchema,
  UpdateASSchema,
} from "./articles-sensitivities.schema";

export type SensitivitySentimentType = z.infer<
  typeof SensitivitySentimentSchema
>;
export type ArticlesSensitivitiesType = z.infer<typeof SelectASSchema>;

export type InsertSensitivitiesType = z.infer<typeof InsertASSchema>;
export type UpdateSensitivitiesType = z.infer<typeof UpdateASSchema>;
export type DeleteSensitivitiesType = z.infer<typeof DeleteASSchema>;
