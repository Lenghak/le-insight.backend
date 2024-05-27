import { profiles } from "@/database/models";
import * as profileSchema from "@/database/models/profiles";

import { createSelectSchema } from "drizzle-zod";

export const RQMinimalProfileColumns = {
  id: true,
  first_name: true,
  last_name: true,
  image_url: true,
} as const;

export const RQMinimalProfileSelectColumns = {
  id: profileSchema.profiles.id,
  first_name: profileSchema.profiles.first_name,
  last_name: profileSchema.profiles.last_name,
  image_url: profileSchema.profiles.image_url,
} as const;

export const SelectProfileSchema = createSelectSchema(profiles);
export const SelectMinimalProfileSchema = SelectProfileSchema.pick(
  RQMinimalProfileColumns,
);
