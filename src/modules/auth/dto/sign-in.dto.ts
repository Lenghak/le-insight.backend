import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignInSchema = z
  .object({
    email: z.string().email().max(255).describe("A valid email address"),
    password: z
      .password()
      .min(8)
      .max(255)
      .describe("8 characters long password "),
  })
  .required();

export class SignInDTO extends createZodDto(SignInSchema) {}
