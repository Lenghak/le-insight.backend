import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const UpdateUserSchema = z.object({
  userID: z.string().uuid().max(255),
  role: z.enum(["ADMIN", "USER", "GUEST"]).default("USER").optional(),
});

export class UpdateUserDTO extends createZodDto(UpdateUserSchema) {}
