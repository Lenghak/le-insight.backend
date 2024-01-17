// import '../base'
import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sessions } from "./sessions.schema";
import { users } from "./users.schema";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").unique().primaryKey().defaultRandom(),
    token: varchar("token", { length: 255 }),
    user_id: uuid("user_id")
      .unique()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    revoked: boolean("revoked").default(false),
    // have no idea what is parent
    parent: varchar("parent", { length: 255 }),
    session_id: uuid("session_id")
      .unique()
      .references(() => sessions.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    refresh_tokens_user_idx: index("user_idx").on(table.user_id),
    refresh_tokens_updated_at_idx: index("updated_at_idx")
      .on(table.updated_at)
      .desc(),
    refresh_tokens_session_id_revoked_idx: index(
      "refresh_tokens_session_id_revoked_idx",
    ).on(table.session_id, table.revoked),
  }),
);
