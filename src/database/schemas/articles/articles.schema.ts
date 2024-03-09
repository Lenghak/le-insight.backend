import { articles } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectArticleSchema = createSelectSchema(articles);

export const InsertArticleSchema = createInsertSchema(articles).pick({
  content: true,
  user_id: true,
  visibility: true,
});

export const UpdateArticleSchema = SelectArticleSchema.partial();

export const DeleteArticleSchema = SelectArticleSchema.pick({
  id: true,
});
