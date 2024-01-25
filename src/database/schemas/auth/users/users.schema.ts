import { users } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectUserSchema = createSelectSchema(users);

export const InsertUserSchema = createInsertSchema(users);
