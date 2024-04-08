import { UpdateUserSchema } from "@/database/schemas/users/users.schema";

import { createZodDto } from "nestjs-zod";

export class UpdateUserDTO extends createZodDto(
  UpdateUserSchema.omit({ id: true })
    .partial()
    .extend(UpdateUserSchema.pick({ id: true }).shape),
) {}
export class RequestUpdateUserDTO extends createZodDto(
  UpdateUserSchema.omit({ id: true }).partial(),
) {}
