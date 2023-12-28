import { relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { images } from "./image.schema";

export const sexEnum = pgEnum("sexEnum", ["male", "female", "rather not say"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),

  first_name: varchar("first_name", { length: 255 }).notNull().default(""),
  last_name: varchar("last_name", { length: 255 }).notNull().default(""),

  image_id: uuid("image_id").references(() => images.id),

  bio: varchar("bio", { length: 1023 }),
  gender: varchar("gender", { length: 255 }),
  sex: sexEnum("sex"),
});

export const profileRelations = relations(profiles, ({ one }) => ({
  image_avatar: one(images, {
    fields: [profiles.image_id],
    references: [images.id],
  }),
}));
