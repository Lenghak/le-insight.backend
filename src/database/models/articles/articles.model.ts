import { users } from "@/database/models/users/users.model";

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const articlesVisibilityEnum = pgEnum("status", [
  "DRAFT",
  "PUBLIC",
  "PRIVATE",
  "PREMIUM",
  "ARCHIVED",
]);

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),

  thumbnail: varchar("thumbnail"),

  preview_title: varchar("preview_title", { length: 1024 }),
  preview_description: varchar("preview_description", { length: 2024 }),

  content_html: text("content_html"),
  content_plain_text: text("content_plain_text"),

  visibility: articlesVisibilityEnum("visibility").default("DRAFT"),

  visit_count: integer("visit_count").notNull().default(0),
  like_count: integer("like_count").notNull().default(0),
  comment_count: integer("comment_count").notNull().default(0),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
