import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const CreateSessionSchema = z.object({
  userID: z.string().uuid().max(255),
  userAgent: z.string(),
  ip: z.string().ip().max(255),
});

export class CreateSessionsDTO extends createZodDto(CreateSessionSchema) {}
