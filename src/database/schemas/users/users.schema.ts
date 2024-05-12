import { users } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const RQUsersColumns = {
  id: true,
  profile_id: true,
  phone: true,
  email: true,
  role: true,
  banned_at: true,
  banned_until: true,
  deleted_at: true,
  invited_at: true,
  confirmed_at: true,
  confirmation_sent_at: true,
  created_at: true,
  updated_at: true,
} as const;

export const SelectUserSchema = createSelectSchema(users);
export const SelectUserForClientSchema = SelectUserSchema.pick(RQUsersColumns);

export const InsertUserSchema = createInsertSchema(users)
  .pick({
    email: true,
    encrypted_password: true,
    salt: true,
    profile_id: true,
    confirmation_sent_at: true,
    confirmation_token: true,
  })
  .extend({
    firstName: z.string().max(255),
    lastName: z.string().max(255),
  });

export const UpdateUserSchema = SelectUserSchema.extend({
  banned_at: z.date(),
  banned_until: z.date(),
})
  .partial()
  .omit({
    created_at: true,
  })
  .required({ id: true });

export const UserRoleSchema = z.enum(["ADMIN", "GUEST", "USER"]);
export const UserSexSchema = z.enum(["MALE", "FEMALE", "RNTS"]);
