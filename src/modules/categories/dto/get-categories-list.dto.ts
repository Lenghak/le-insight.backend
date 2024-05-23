import { PaginationSchema } from "@/common/dto/pagination.dto";

import { SelectCategoriesSchema } from "@/database/schemas/categories/categories.schema";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GetCategoriesListSchema = PaginationSchema.extend(
  SelectCategoriesSchema.shape,
).partial();

export const GetCategoriesListParamsSchema = PaginationSchema.omit({
  page: true,
})
  .extend({
    limit: z.number(),
    offset: z.number(),
    status: SelectCategoriesSchema.shape.status.optional(),
  })
  .partial();

export type GetCategoriesListParams = z.infer<
  typeof GetCategoriesListParamsSchema
>;

export class GetCategoriesListDTO extends createZodDto(
  GetCategoriesListSchema,
) {}
