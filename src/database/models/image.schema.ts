import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const images = pgTable(
  "images",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),

    height: integer("image_height").notNull(),
    width: integer("image_width").notNull(),
    url: integer("image_url").notNull(),

    alt_description: varchar("alt_description", { length: 255 }).notNull(),
    blurhash: varchar("blurhash", { length: 255 }),

    created_at: timestamp("created_at", { withTimezone: true }),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    images_idx: index("images_idx").onOnly(table.id),
  }),
);
