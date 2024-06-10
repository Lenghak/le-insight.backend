import { articles } from "@/database/models/articles/articles.model";
import { sensitivities } from "@/database/models/sensitivities/sensitivities.model";

import { pgEnum, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

export const sensitivitySentimentEnum = pgEnum("sensitivity_sentiment", [
  "POSITIVE",
  "NEGATIVE",
  "NEUTRAL",
  "MIXED",
]);

export const articlesSensitivities = pgTable(
  "articles_sensitivities",
  {
    article_id: uuid("article_id")
      .notNull()
      .references(() => articles.id),
    sensitivity_id: uuid("sensitivity_id")
      .notNull()
      .references(() => sensitivities.id),
    sentiment: sensitivitySentimentEnum("sentiment"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.article_id, table.sensitivity_id] }),
  }),
);
