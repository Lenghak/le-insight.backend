import { articlesCategories } from "@/database/models/articles-categories";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectACSchema = createSelectSchema(articlesCategories);

export const InsertACSchema = createInsertSchema(articlesCategories);

export const UpdateACSchema = SelectACSchema.omit({
  article_id: true,
}).partial();

export const DeleteACSchema = SelectACSchema;
