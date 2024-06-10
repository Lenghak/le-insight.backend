import { PaginationSchema } from "@/common/dto/pagination.dto";

import { SelectSensitivitiesSchema } from "@/database/schemas/sensitivities/sensitivities.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GetSensitivitiesListSchema = PaginationSchema.extend(
  SelectSensitivitiesSchema.shape,
).partial();

export const GetSensitivitiesListParamsSchema = PaginationSchema.omit({
  page: true,
})
  .extend({
    limit: z.number(),
    offset: z.number(),
    status: SelectSensitivitiesSchema.shape.status.optional(),
  })
  .partial();

export type GetSensitivitiesListParams = z.infer<
  typeof GetSensitivitiesListParamsSchema
>;

export class GetSensitivitiesListDTO extends createZodDto(
  GetSensitivitiesListSchema,
) {}
