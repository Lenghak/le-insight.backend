import { createZodDto } from "nestjs-zod";

import { CreateRefreshTokensSchema } from "./create-refresh-tokens.dto";

export class UpdateRefreshTokensDTO extends createZodDto(
  CreateRefreshTokensSchema.partial({ sessionID: true }),
) {}
