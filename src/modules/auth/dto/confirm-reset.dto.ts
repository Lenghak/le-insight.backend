import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const ConfirmResetSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

export class ConfirmResetDTO extends createZodDto(ConfirmResetSchema) {}
