import { PaginationSchema } from "@/common/dto/pagination.dto";

import { SelectUserSchema } from "@/database/schemas/auth/users/users.schema";

import { createZodDto } from "nestjs-zod";

export const UsersListSchema = PaginationSchema.merge(SelectUserSchema).extend(
  {},
);

export class UsersListDTO extends createZodDto(UsersListSchema) {}
