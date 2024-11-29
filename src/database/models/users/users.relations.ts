import { articles } from "@/database/models/articles/articles.model";
import { profiles } from "@/database/models/profiles/profiles.model";
import { providers } from "@/database/models/providers/providers.model";
import { users } from "@/database/models/users/users.model";

import { relations } from "drizzle-orm";

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.profile_id],
    references: [profiles.id],
  }),
  articles: many(articles),
  providers: many(providers),
}));
