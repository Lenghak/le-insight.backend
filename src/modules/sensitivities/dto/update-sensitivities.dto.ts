import { UpdateSensitivitiesSchema } from "@/database/schemas/sensitivities/sensitivities.schema";

import { createZodDto } from "nestjs-zod";

export class UpdateSensitivitiesDto extends createZodDto(
  UpdateSensitivitiesSchema,
) {}
