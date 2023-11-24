import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { imagesTable } from "./image.schema";

export const profileTable = pgTable("profiles", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),

  first_name: varchar("first_name", { length: 255 }).notNull().default(""),
  last_name: varchar("last_name", { length: 255 }).notNull().default(""),

  image_id: uuid("images_id").references(() => imagesTable.id),
});
