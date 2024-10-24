import { addresses } from "@/database/models/address";
import { providers } from "@/database/models/providers/providers.model";

import { relations } from "drizzle-orm";

export const providersRelations = relations(providers, ({ many }) => ({
  provider_user: many(addresses),
}));
