import { SelectSensitivitiesSchema } from "@/database/schemas/sensitivities/sensitivities.schema";

import { createZodDto } from "nestjs-zod";

const CreateSensitivitiesSchema = SelectSensitivitiesSchema.pick({
  label: true,
  status: true,
});

export class CreateSensitivitiesDto extends createZodDto(
  CreateSensitivitiesSchema,
) {}
