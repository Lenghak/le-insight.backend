import { articlesCategories } from "@/database/models/articles-categories/articles-categories.model";
import { articles } from "@/database/models/articles/articles.model";
import { users } from "@/database/models/users/users.model";

import { relations } from "drizzle-orm";

export const articlesRelations = relations(articles, ({ one, many }) => ({
  article_author: one(users, {
    fields: [articles.user_id],
    references: [users.id],
  }),
  article_categories: many(articlesCategories),
}));
