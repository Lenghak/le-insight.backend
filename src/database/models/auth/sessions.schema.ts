import {
  index,
  inet,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    factor_id: uuid("factor_id"),
    not_after: timestamp("not_after", { withTimezone: true }),
    refreshed_at: timestamp("refreshed_at", {
      withTimezone: true,
    }).defaultNow(),
    user_agent: text("user_agent"),
    ip: inet("ip"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    sessions_not_after_idx: index("sessions_not_after_idx")
      .on(table.not_after)
      .desc(),
    sessions_user_id_idx: index("sessions_user_id_idx").on(table.user_id),
    user_id_created_at_idx: index("user_id_created_at_idx").on(
      table.user_id,
      table.created_at,
    ),
  }),
);
