import { profiles } from "@/database/models";

import { createSelectSchema } from "drizzle-zod";

export const RQMinimalProfileColumn = {
  id: true,
  first_name: true,
  last_name: true,
  image_url: true,
} as const;

export const SelectProfileSchema = createSelectSchema(profiles);
export const SelectMinimalProfileSchema = SelectProfileSchema.pick(
  RQMinimalProfileColumn,
);
