import { UserRoleSchema } from "@/database/schemas/users/users.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignTokensSchema = z
  .object({
    userID: z.string().uuid(),
    sessionID: z.string().uuid(),
    email: z.string().email().max(255),
    role: UserRoleSchema,
  })
  .required();

export class SignTokensDTO extends createZodDto(SignTokensSchema) {}
