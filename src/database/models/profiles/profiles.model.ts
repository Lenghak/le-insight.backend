import {
  bigint,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sexEnum", ["MALE", "FEMALE", "RNTS"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),

  first_name: varchar("first_name", { length: 255 }).notNull().default(""),
  last_name: varchar("last_name", { length: 255 }).notNull().default(""),

  image_url: varchar("image_url"),
  birthday: timestamp("birthday"),

  bio: varchar("bio", { length: 1023 }),
  gender: varchar("gender", { length: 255 }),
  sex: sexEnum("sex").default("RNTS"),
  following_count: bigint("following_count", { mode: "number" }).default(0),
  follower_count: bigint("follower_count", { mode: "number" }).default(0),
  public_post_count: bigint("public_post_count", { mode: "number" }).default(0),
  private_post_count: bigint("private_post_count", { mode: "number" }).default(
    0,
  ),
  draft_post_count: bigint("draft_post_count", { mode: "number" }).default(0),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
