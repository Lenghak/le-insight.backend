import { articles } from "@/database/models/articles/articles.model";
import { sensitivities } from "@/database/models/sensitivities/sensitivities.model";

import { relations } from "drizzle-orm";

import { articlesSensitivities } from "./articles-sensitivities.model";

export const articlesSensitivitiesRelations = relations(
  articlesSensitivities,
  ({ one }) => ({
    article: one(articles, {
      fields: [articlesSensitivities.article_id],
      references: [articles.id],
    }),
    sensitivity: one(sensitivities, {
      fields: [articlesSensitivities.sensitivity_id],
      references: [sensitivities.id],
    }),
  }),
);
