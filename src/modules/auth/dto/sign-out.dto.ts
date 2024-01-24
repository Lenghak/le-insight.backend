import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignOutSchema = z
  .object({
    userID: z.string().uuid().max(255).trim().describe("UUID of the user"),
  })
  .required();

export class SignOutDTO extends createZodDto(SignOutSchema) {}
