import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("providerEnum", [
  "credential",
  "google",
  "github",
  "facebook",
]);

export const providers = pgTable("providers", {
  id: uuid("id").primaryKey().defaultRandom(),

  provider: providerEnum("provider").default("credential"),

  user_id: varchar("user_id", { length: 255 }),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
