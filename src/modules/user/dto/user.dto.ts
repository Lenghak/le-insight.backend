import { IsBoolean, IsDate, IsEnum, IsString, IsUUID } from "class-validator";

export enum UserRoleEnum {
  Admin = "Admin",
  Guest = "Guest",
  User = "User",
}

export class UserDTO {
  @IsString()
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly aud: string;

  @IsDate()
  readonly confirmedAt: Date;

  @IsString()
  readonly confirmation_token: string;

  @IsDate()
  readonly confirmation_sent_at: Date;

  @IsEnum(UserRoleEnum)
  readonly role: UserRoleEnum;

  @IsBoolean()
  readonly is_sso_user: boolean;

  @IsBoolean()
  readonly is_super_admin: boolean;

  // email: varchar("email", { length: 255 }).unique(),
  // email_confirmed_at: timestamp("email_confirmed_at", { withTimezone: true }),
  // email_change_token_new: varchar("email_change_token_new", {
  //   length: 255,
  // }).unique(),
  // email_change: varchar("email_change", { length: 255 }),
  // email_change_sent_at: timestamp("email_change_sent_at", {
  //   withTimezone: true,
  // }),
  // email_change_token_current: varchar("email_change_token_current", {
  //   length: 255,
  // })
  //   .default("")
  //   .unique(),
  // email_change_confirm_status: boolean("email_change_confirm_status").default(
  //   false,
  // ),

  // encrypted_password: varchar("encrypted_password", { length: 255 }),

  // recovery_token: varchar("recovery_token", { length: 255 }).unique(),
  // recovery_sent_at: timestamp("recovery_sent_at", { withTimezone: true }),

  // phone: text("phone").unique(),
  // phone_confirmed_at: timestamp("phone_confirmed_at", { withTimezone: true }),
  // phone_change: text("phone_change").default(""),
  // phone_change_token: varchar("phone_change_token", { length: 255 })
  //   .default("")
  //   .unique(),
  // phone_change_sent_at: timestamp("phone_change_sent_at", {
  //   withTimezone: true,
  // }),

  // reauthentication_token: varchar("reauthentication_token", {
  //   length: 255,
  // })
  //   .default("")
  //   .unique(),
  // reauthentication_sent_at: timestamp("reauthentication_sent_at", {
  //   withTimezone: true,
  // }),

  // banned_until: timestamp("banned_until", { withTimezone: true }),
  // last_sign_in_at: timestamp("last_sign_in_at", { withTimezone: true }),
  // invited_at: timestamp("invited_at", { withTimezone: true }),
  // created_at: timestamp("created_at", { withTimezone: true }),
  // updated_at: timestamp("updated_at", { withTimezone: true }),
  // deleted_at: timestamp("deleted_at", { withTimezone: true }),
}
