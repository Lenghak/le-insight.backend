import { articlesSensitivities } from "@/database/models/articles-sensitivities";
import { sensitivities } from "@/database/models/sensitivities/sensitivities.model";

import { relations } from "drizzle-orm";

export const sensitivitiesRelations = relations(sensitivities, ({ many }) => ({
  article_sensitivities: many(articlesSensitivities),
}));
