import type {
  DeleteCategoriesSchema,
  InsertCategoriesSchema,
  SelectCategoriesSchema,
  UpdateCategoriesSchema,
} from "@/database/schemas/categories/categories.schema";

import type { z } from "nestjs-zod/z";

export type CategoriesType = z.infer<typeof SelectCategoriesSchema>;

export type InsertCategoriesType = z.infer<typeof InsertCategoriesSchema>;
export type UpdateCategoriesType = z.infer<typeof UpdateCategoriesSchema>;
export type DeleteCategoriesType = z.infer<typeof DeleteCategoriesSchema>;
