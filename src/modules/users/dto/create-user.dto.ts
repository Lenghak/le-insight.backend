import { SignInSchema } from "@/modules/auth/dto/sign-in.dto";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const CreateUserSchema = SignInSchema.extend({
  firstName: z.string().max(255).trim(),
  lastName: z.string().max(255).trim(),
  salt: z.string().max(255),
  profileID: z.string().uuid().max(255),
});

export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
