import { articles } from "@/database/models/articles/articles.model";
import { sensitivities } from "@/database/models/sensitivities/sensitivities.model";

import { pgEnum, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

export const sensitivityPerspectivenessEnum = pgEnum(
  "sensitivity_perspectiveness",
  ["POSITIVE", "NEGATIVE", "NEUTRAL"],
);

export const articlesSensitivities = pgTable(
  "articles_sensitivities",
  {
    article_id: uuid("article_id")
      .notNull()
      .references(() => articles.id),
    sensitivity_id: uuid("sensitivity_id")
      .notNull()
      .references(() => sensitivities.id),
    perspectiveness: sensitivityPerspectivenessEnum("perspectiveness"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.article_id, table.sensitivity_id] }),
  }),
);
