import type {
  SelectMinimalProfileSchema,
  SelectProfileSchema,
} from "@/database/schemas/profiles/profiles.schema";

import type { z } from "nestjs-zod/z";

export type SelectProfileType = z.infer<typeof SelectProfileSchema>;
export type SelectMinimalProfileType = z.infer<
  typeof SelectMinimalProfileSchema
>;
