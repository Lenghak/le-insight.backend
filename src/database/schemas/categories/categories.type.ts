import type {
  DeleteCategoriesSchema,
  InsertCategoriesSchema,
  UpdateCategoriesSchema,
} from "@/database/schemas/categories/categories.schema";

import type { z } from "nestjs-zod/z";

export type InsertCategoriesType = z.infer<typeof InsertCategoriesSchema>;
export type UpdateCategoriesType = z.infer<typeof UpdateCategoriesSchema>;
export type DeleteCategoriesType = z.infer<typeof DeleteCategoriesSchema>;
