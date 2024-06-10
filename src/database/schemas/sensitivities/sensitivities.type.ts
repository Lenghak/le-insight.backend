import type { z } from "nestjs-zod/z";

import type {
  DeleteSensitivitiesSchema,
  InsertSensitivitiesSchema,
  SelectSensitivitiesSchema,
  SensitivitiesStatusSchema,
  UpdateSensitivitiesSchema,
} from "./sensitivities.schema";

export type SensitivitiesType = z.infer<typeof SelectSensitivitiesSchema>;

export type InsertSensitivitiesType = z.infer<typeof InsertSensitivitiesSchema>;
export type UpdateSensitivitiesType = z.infer<typeof UpdateSensitivitiesSchema>;
export type DeleteSensitivitiesType = z.infer<typeof DeleteSensitivitiesSchema>;
export type SensitivitiesStatusType = z.infer<typeof SensitivitiesStatusSchema>;
