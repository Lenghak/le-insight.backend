import type {
  InsertArticleSchema,
  SelectArticleSchema,
} from "@/database/schemas/articles/articles.schema";

import type { z } from "nestjs-zod/z";

export type Articles = z.infer<typeof SelectArticleSchema>;
export type ArticlesVisibilityType = z.infer<
  typeof SelectArticleSchema.shape.visibility
>;

export type InsertArticleType = z.infer<typeof InsertArticleSchema>;
