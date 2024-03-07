import { sessions } from "@/database/models/sessions/sessions.model";
import { users } from "@/database/models/users/users.model";

import { relations } from "drizzle-orm";

export const sessionRelations = relations(sessions, ({ one }) => ({
  session_user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));
