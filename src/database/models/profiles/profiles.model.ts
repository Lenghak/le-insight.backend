import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sexEnum", ["MALE", "FEMALE", "RNTS"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),

  first_name: varchar("first_name", { length: 255 }).notNull().default(""),
  last_name: varchar("last_name", { length: 255 }).notNull().default(""),

  image_url: varchar("image_url"),

  bio: varchar("bio", { length: 1023 }),
  gender: varchar("gender", { length: 255 }),
  sex: sexEnum("sex").default("RNTS"),

  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
