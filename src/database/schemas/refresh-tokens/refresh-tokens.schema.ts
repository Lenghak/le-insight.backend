import { refreshTokens } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectRefreshTokenSchema = createSelectSchema(refreshTokens);

export const InsertRefreshTokenSchema = createInsertSchema(refreshTokens);
