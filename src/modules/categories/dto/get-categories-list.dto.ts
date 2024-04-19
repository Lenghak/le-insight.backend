import { PaginationSchema } from "@/common/dto/pagination.dto";

import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const GetCategoriesListSchema = PaginationSchema;
export const GetCategoriesListParamsSchema = PaginationSchema.omit({
  page: true,
}).extend({
  limit: z.number(),
  offset: z.number(),
});

export type GetCategoriesListParams = z.infer<
  typeof GetCategoriesListParamsSchema
>;

export class GetCategoriesListDTO extends createZodDto(
  GetCategoriesListSchema,
) {}
