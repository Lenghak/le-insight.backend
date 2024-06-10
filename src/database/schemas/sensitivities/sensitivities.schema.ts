import { sensitivities } from "@/database/models";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "nestjs-zod/z";

export const SensitivitiesStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "REVOKED",
]);

export const SensitivityAgeRangeEnum = z.enum([
  "GENERAL_AUDIENCE",
  "TEENAGERS",
  "YOUNG_ADULTS",
  "ADULTS",
  "MATURE_ADULTS",
]);

export const SensitivitiyTypeEnum = z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]);

export const SelectSensitivitiesSchema = createSelectSchema(sensitivities);

export const InsertSensitivitiesSchema = createInsertSchema(sensitivities).pick(
  {
    label: true,
  },
);

export const UpdateSensitivitiesSchema = SelectSensitivitiesSchema.omit({
  id: true,
  created_at: true,
}).partial();

export const DeleteSensitivitiesSchema = SelectSensitivitiesSchema.pick({
  id: true,
});
