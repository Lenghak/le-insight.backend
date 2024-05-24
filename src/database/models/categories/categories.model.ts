import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categoriesStatusEnum = pgEnum("category_status", [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "REVOKED",
]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 100 }),
  assigned_count: integer("assigned_count").default(0),
  generated_count: integer("generated_count").default(0),
  status: categoriesStatusEnum("category_status").default("INACTIVE"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
