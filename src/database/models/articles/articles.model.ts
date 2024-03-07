import { users } from "@/database/models/users/users.model";

import { integer, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),

  content: jsonb("content").$type<string[]>().notNull(),

  visit_count: integer("visit_count").notNull().default(0),
  like_count: integer("like_count").notNull().default(0),
  comment_count: integer("comment_count").notNull().default(0),

  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
