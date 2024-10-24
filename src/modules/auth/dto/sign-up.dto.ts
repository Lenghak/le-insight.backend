import { SignInSchema } from "@/modules/auth/dto/sign-in.dto";

import { ProviderEnumSchema } from "@/database/schemas/providers/providers.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignUpSchema = SignInSchema.extend({
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  provider: ProviderEnumSchema,
  password: SignInSchema.shape.password.nullable(),
  image_url: z.string().url().nullable().optional(),
}).required();

export class SignUpDTO extends createZodDto(SignUpSchema) {}
