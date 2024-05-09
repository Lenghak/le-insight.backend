import { articles } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectArticleSchema = createSelectSchema(articles);

export const InsertArticleSchema = createInsertSchema(articles).pick({
  preview_title: true,
  preview_description: true,
  content_html: true,
  content_plain_text: true,
  user_id: true,
  visibility: true,
});

export const UpdateArticleSchema = SelectArticleSchema.omit({
  user_id: true,
  created_at: true,
}).partial();

export const DeleteArticleSchema = SelectArticleSchema.pick({
  id: true,
});
