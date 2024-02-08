import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ConfirmEmailSchema = z.object({
  email: z.string().email().describe("User's email address"),
  token: z.string().describe("User's Confirmation Token"),
});

export class ConfirmEmailDTO extends createZodDto(ConfirmEmailSchema) {}
