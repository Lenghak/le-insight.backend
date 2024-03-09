import { InsertUserSchema } from "@/database/schemas/users/users.schema";

import { createZodDto } from "nestjs-zod";

export class CreateUserDTO extends createZodDto(InsertUserSchema) {}
