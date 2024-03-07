import { articlesCategories } from "@/database/models/articles-categories/articles-categories.model";
import { categories } from "@/database/models/categories/categories.model";

import { relations } from "drizzle-orm";

export const categoriesRelations = relations(categories, ({ many }) => ({
  article_categories: many(articlesCategories),
}));
