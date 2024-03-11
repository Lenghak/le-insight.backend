import type { SelectArticleSchema } from "@/database/schemas/articles/articles.schema";

import type { z } from "nestjs-zod/z";

export type Articles = z.infer<typeof SelectArticleSchema>;
export enum ArticlesVisibilityEnum {
  "DRAFT",
  "PUBLIC",
  "PRIVATE",
}
