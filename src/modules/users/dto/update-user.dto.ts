import { UpdateUserSchema } from "@/database/schemas/auth/users/users.schema";

import { createZodDto } from "nestjs-zod";

export class UpdateUserDTO extends createZodDto(UpdateUserSchema) {}
