import { PaginationSchema } from "@/common/dto/pagination.dto";

import type * as userSchema from "@/database/models/users";
import {
  UserRoleSchema,
  UserSexSchema,
} from "@/database/schemas/users/users.schema";
import type {
  UserRoleType,
  UserSexType,
} from "@/database/schemas/users/users.type";
import type { DatabaseType } from "@/database/types/db.type";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const UsersListSchema = PaginationSchema.extend({
  role: UserRoleSchema.optional(),
  "sex[]": z.array(UserSexSchema).or(UserSexSchema).optional(),
});

export type UsersListRepoParams = UsersListDTO & {
  limit: number;
  offset: number;
  query?: string;
  role?: UserRoleType;
  sex?: UserSexType[];
  db?: DatabaseType | DatabaseType<typeof userSchema>;
};

export type UsersCountParams = Omit<UsersListDTO, "limit" | "offset">;

export class UsersListDTO extends createZodDto(UsersListSchema.partial()) {}
