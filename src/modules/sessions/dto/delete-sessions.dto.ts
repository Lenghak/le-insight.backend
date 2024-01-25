import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const DeleteSessionSchema = z
  .object({
    sessionID: z.string().uuid(),
  })
  .required();

export class DeleteSessionDTO extends createZodDto(DeleteSessionSchema) {}
