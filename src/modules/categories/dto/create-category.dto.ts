import { SelectCategoriesSchema } from "@/database/schemas/categories/categories.schema";

import { createZodDto } from "nestjs-zod";

export class CreateCategoryDto extends createZodDto(
  SelectCategoriesSchema.pick({
    label: true,
    status: true,
    is_archived: true,
  }),
) {}
