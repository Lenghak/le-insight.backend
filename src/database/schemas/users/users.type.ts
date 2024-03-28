import { type z } from "nestjs-zod/z";

import { type SelectUserSchema, type UserRoleSchema } from "./users.schema";

export type Users = z.infer<typeof SelectUserSchema>;

export enum UserRoleEnum {
  ADMIN = "ADMIN",
  GUEST = "GUEST",
  USER = "USER",
}

export type UserRoleType = z.infer<typeof UserRoleSchema>;
