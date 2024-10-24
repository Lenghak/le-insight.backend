import { providers } from "@/database/models/providers";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const ProviderEnumSchema = z.enum([
  "credential",
  "google",
  "github",
  "facebook",
]);

export const SelectProviderSchema = createSelectSchema(providers);

export const InsertProvidersSchema = createInsertSchema(providers);

export const UpdateProvidersSchema = SelectProviderSchema.omit({
  id: true,
  created_at: true,
}).partial();

export const DeleteProvidersSchema = SelectProviderSchema.pick({
  id: true,
});
