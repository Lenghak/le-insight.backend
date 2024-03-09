import { type z } from "nestjs-zod/z";

import { type SelectRefreshTokenSchema } from "./refresh-tokens.schema";

export type RefreshTokens = z.infer<typeof SelectRefreshTokenSchema>;
