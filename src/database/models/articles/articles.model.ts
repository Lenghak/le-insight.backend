import { users } from "@/database/models/users/users.model";

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const articlesVisibilityEnum = pgEnum("status", [
  "DRAFT",
  "PUBLIC",
  "PRIVATE",
]);

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),

  content: text("content"),
  visibility: articlesVisibilityEnum("visibility").default("DRAFT"),

  visit_count: integer("visit_count").notNull().default(0),
  like_count: integer("like_count").notNull().default(0),
  comment_count: integer("comment_count").notNull().default(0),

  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
