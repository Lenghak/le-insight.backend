import { articles } from "@/database/models/articles/articles.model";
import { categories } from "@/database/models/categories/categories.model";

import { relations } from "drizzle-orm";

import { articlesCategories } from "./articles-categories.model";

export const articlesCategoriesRelations = relations(
  articlesCategories,
  ({ one }) => ({
    article: one(articles, {
      fields: [articlesCategories.article_id],
      references: [articles.id],
    }),
    category: one(categories, {
      fields: [articlesCategories.category_id],
      references: [categories.id],
    }),
  }),
);
