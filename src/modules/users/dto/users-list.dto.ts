import { PaginationSchema } from "@/common/dto/pagination.dto";

import {
  UserRoleSchema,
  UserSexSchema,
} from "@/database/schemas/users/users.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const UsersListSchema = PaginationSchema.extend({
  role: UserRoleSchema.optional(),
  "sex[]": z.array(UserSexSchema).or(UserSexSchema).optional(),
});

export class UsersListDTO extends createZodDto(UsersListSchema.partial()) {}
