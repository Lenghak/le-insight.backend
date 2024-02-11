import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const RequestRecoverySchema = z.object({
  email: z.string().email(),
});

export class RequestRecoveryDTO extends createZodDto(RequestRecoverySchema) {}
