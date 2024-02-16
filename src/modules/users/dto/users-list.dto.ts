import { PaginationSchema } from "@/common/dto/pagination.dto";

import { createZodDto } from "nestjs-zod";

export const UsersListSchema = PaginationSchema.extend({});

export class UsersListDTO extends createZodDto(UsersListSchema) {}
