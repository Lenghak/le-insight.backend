import { categories } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const CategoriesStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "REVOKED",
]);

export const SelectCategoriesSchema = createSelectSchema(categories);

export const InsertCategoriesSchema = createInsertSchema(categories).pick({
  label: true,
});

export const UpdateCategoriesSchema = SelectCategoriesSchema.omit({
  created_at: true,
}).partial();

export const DeleteCategoriesSchema = SelectCategoriesSchema.pick({
  id: true,
});
