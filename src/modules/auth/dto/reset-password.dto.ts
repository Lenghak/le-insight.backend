import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ResetPasswordSchema = z
  .object({
    userID: z.string().uuid(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    token: z.string(),
  })
  .refine(
    ({ confirmPassword, password }) => confirmPassword === password,
    "Passwords does not match",
  );

export class ResetPasswordDTO extends createZodDto(ResetPasswordSchema) {}
