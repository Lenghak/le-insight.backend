import { users } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const SelectUserSchema = createSelectSchema(users);

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

export const UpdateUserSchema = SelectUserSchema.partial()
  .omit({
    created_at: true,
  })
  .required({ id: true });
