import { addresses } from "@/database/models/address";
import { profiles } from "@/database/models/profiles/profiles.model";

import { relations } from "drizzle-orm";

export const profilesRelations = relations(profiles, ({ one }) => ({
  profile_location: one(addresses, {
    fields: [profiles.location_id],
    references: [addresses.id],
  }),
}));
