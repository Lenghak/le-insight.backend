import { type z } from "nestjs-zod/z";

import { type SelectUserSchema } from "./users.schema";

export type Users = z.infer<typeof SelectUserSchema>;

export enum UserRoleEnum {
  ADMIN = "ADMIN",
  GUEST = "GUEST",
  USER = "USER",
}
