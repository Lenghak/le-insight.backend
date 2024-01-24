import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const CreateRefreshTokensSchema = z
  .object({
    token: z.string(),
    userID: z.string().uuid().max(255),
    sessionID: z.string().uuid().max(255),
  })
  .required();

export class CreateRefreshTokensDTO extends createZodDto(
  CreateRefreshTokensSchema,
) {}
