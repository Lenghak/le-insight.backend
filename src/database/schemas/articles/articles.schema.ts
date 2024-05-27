import { articles } from "@/database/models";
import * as articleSchema from "@/database/models/articles";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const RQPreviewArticlesColumns = {
  id: true,
  user_id: true,
  comment_count: true,
  like_count: true,
  preview_description: true,
  thumbnail: true,
  preview_title: true,
  visibility: true,
  created_at: true,
  visit_count: true,
  updated_at: true,
} as const;

export const RQPreviewArticlesSelectColumns = {
  id: articleSchema.articles.id,
  user_id: articleSchema.articles.user_id,
  comment_count: articleSchema.articles.comment_count,
  like_count: articleSchema.articles.like_count,
  preview_description: articleSchema.articles.preview_description,
  thumbnail: articleSchema.articles.thumbnail,
  preview_title: articleSchema.articles.preview_title,
  visibility: articleSchema.articles.visibility,
  created_at: articleSchema.articles.created_at,
  visit_count: articleSchema.articles.visit_count,
  updated_at: articleSchema.articles.updated_at,
} as const;

export const SelectArticleSchema = createSelectSchema(articles);
export const SelectPreviewArticleSchema = SelectArticleSchema.pick(
  RQPreviewArticlesColumns,
);

export const InsertArticleSchema = createInsertSchema(articles).pick({
  preview_title: true,
  preview_description: true,
  content_html: true,
  content_plain_text: true,
  content_editor: true,
  user_id: true,
  visibility: true,
  thumbnail: true,
});

export const UpdateArticleSchema = SelectArticleSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
}).partial();

export const DeleteArticleSchema = SelectArticleSchema.pick({
  id: true,
});
