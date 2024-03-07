import { articles } from "@/database/models/articles/articles.model";
import { categories } from "@/database/models/categories/categories.model";

import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

export const articlesCategories = pgTable(
  "articles_categories",
  {
    article_id: uuid("article_id")
      .notNull()
      .references(() => articles.id),
    category_id: uuid("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.article_id, table.category_id] }),
  }),
);
