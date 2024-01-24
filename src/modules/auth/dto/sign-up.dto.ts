import { SignInSchema } from "@/modules/auth/dto/sign-in.dto";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignUpSchema = SignInSchema.extend({
  firstName: z.string().max(255),
  lastName: z.string().max(255),
}).required();

export class SignUpDTO extends createZodDto(SignUpSchema) {}
