import { users } from "@/database/models/users/users.model";

import { inet, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  not_after: timestamp("not_after", { withTimezone: true }),
  refreshed_at: timestamp("refreshed_at", {
    withTimezone: true,
  }).defaultNow(),
  user_agent: text("user_agent"),
  ip: inet("ip"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
