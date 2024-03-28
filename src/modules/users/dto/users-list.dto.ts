import { PaginationSchema } from "@/common/dto/pagination.dto";

import { UserRoleSchema } from "@/database/schemas/users/users.schema";

import { createZodDto } from "nestjs-zod";

export const UsersListSchema = PaginationSchema.extend({
  role: UserRoleSchema.optional(),
});

export class UsersListDTO extends createZodDto(UsersListSchema) {}
