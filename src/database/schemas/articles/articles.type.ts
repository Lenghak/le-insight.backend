import type {
  InsertArticleSchema,
  SelectArticleSchema,
} from "@/database/schemas/articles/articles.schema";

import type { z } from "nestjs-zod/z";

export type Articles = z.infer<typeof SelectArticleSchema>;
export enum ArticlesVisibilityEnum {
  "PREMIUM",
  "ARCHIVED",
  "DRAFT",
  "PUBLIC",
  "PRIVATE",
}

export type InsertArticleType = z.infer<typeof InsertArticleSchema>;
