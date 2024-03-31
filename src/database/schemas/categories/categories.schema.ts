import { categories } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectCategoriesSchema = createSelectSchema(categories);

export const InsertCategoriesSchema = createInsertSchema(categories).pick({
  label: true,
  user_id: true,
});

export const UpdateCategoriesSchema = SelectCategoriesSchema.omit({
  user_id: true,
  created_at: true,
}).partial();

export const DeleteCategoriesSchema = SelectCategoriesSchema.pick({
  id: true,
});
