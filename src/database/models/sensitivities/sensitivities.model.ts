import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sensitivityStatusEnum = pgEnum("sensitivity_status", [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "REVOKED",
]);

export const sensitivityAgeRangeEnum = pgEnum("sensitivity_age_range", [
  "GENERAL_AUDIENCE",
  "TEENAGERS",
  "YOUNG_ADULTS",
  "ADULTS",
  "MATURE_ADULTS",
]);

export const sensitivities = pgTable("sensitivities", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 100 }),
  assigned_count: integer("assigned_count").default(0),
  generated_count: integer("generated_count").default(0),
  status: sensitivityStatusEnum("sensitivity_status").default("INACTIVE"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
