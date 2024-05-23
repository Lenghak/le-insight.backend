import type { z } from "nestjs-zod/z";

import type {
  DeleteACSchema,
  InsertACSchema,
  SelectACSchema,
  UpdateACSchema,
} from "./articles-categories.schema";

export type CategoriesType = z.infer<typeof SelectACSchema>;

export type InsertCategoriesType = z.infer<typeof InsertACSchema>;
export type UpdateCategoriesType = z.infer<typeof UpdateACSchema>;
export type DeleteCategoriesType = z.infer<typeof DeleteACSchema>;
