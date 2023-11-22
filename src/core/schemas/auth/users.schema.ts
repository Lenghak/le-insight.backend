import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Role
 */
const USER_ROLE = ["GUEST", "USER", "ADMIN"] as const;

/**
 * User model
 */
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").unique().primaryKey().defaultRandom(),

    aud: varchar("aud", { length: 255 }),

    confirmed_at: timestamp("confirmed_at", { withTimezone: true }),
    confirmation_token: varchar("confirmation_token", { length: 255 }).unique(),
    confirmation_sent_at: timestamp("confirmation_sent_at", {
      withTimezone: true,
    }),

    role: varchar("role", { enum: USER_ROLE, length: 255 }).default("GUEST"),
    is_sso_user: boolean("is_sso_user").notNull().default(false),
    is_super_admin: boolean("is_super_admin").default(false),

    email: varchar("email", { length: 255 }).unique(),
    email_confirmed_at: timestamp("email_confirmed_at", { withTimezone: true }),
    email_change_token_new: varchar("email_change_token_new", {
      length: 255,
    }).unique(),
    email_change: varchar("email_change", { length: 255 }),
    email_change_sent_at: timestamp("email_change_sent_at", {
      withTimezone: true,
    }),
    email_change_token_current: varchar("email_change_token_current", {
      length: 255,
    })
      .default("")
      .unique(),
    email_change_confirm_status: boolean("email_change_confirm_status").default(
      false,
    ),

    encrypted_password: varchar("encrypted_password", { length: 255 }),

    recovery_token: varchar("recovery_token", { length: 255 }).unique(),
    recovery_sent_at: timestamp("recovery_sent_at", { withTimezone: true }),

    phone: text("phone").unique(),
    phone_confirmed_at: timestamp("phone_confirmed_at", { withTimezone: true }),
    phone_change: text("phone_change").default(""),
    phone_change_token: varchar("phone_change_token", { length: 255 })
      .default("")
      .unique(),
    phone_change_sent_at: timestamp("phone_change_sent_at", {
      withTimezone: true,
    }),

    reauthentication_token: varchar("reauthentication_token", {
      length: 255,
    })
      .default("")
      .unique(),
    reauthentication_sent_at: timestamp("reauthentication_sent_at", {
      withTimezone: true,
    }),

    banned_until: timestamp("banned_until", { withTimezone: true }),
    last_sign_in_at: timestamp("last_sign_in_at", { withTimezone: true }),
    invited_at: timestamp("invited_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }),
    updated_at: timestamp("updated_at", { withTimezone: true }),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    users_email_idx: index("users_instance_id_email_idx").on(table.email),
  }),
);