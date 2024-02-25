import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ConfirmEmailSchema = z.object({
  token: z.string().describe("User's Confirmation Token"),
});

export class ConfirmEmailDTO extends createZodDto(ConfirmEmailSchema) {}
