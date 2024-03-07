import { refreshTokens } from "@/database/models/refresh-tokens/refresh-tokens.model";
import { sessions } from "@/database/models/sessions/sessions.model";
import { users } from "@/database/models/users/users.model";

import { relations } from "drizzle-orm";

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  token_user: one(users, {
    fields: [refreshTokens.user_id],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [refreshTokens.session_id],
    references: [sessions.id],
  }),
}));
