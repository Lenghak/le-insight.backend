import { SelectCategoriesSchema } from "@/database/schemas/categories/categories.schema";

import { createZodDto } from "nestjs-zod";

const CreateCategorySchema = SelectCategoriesSchema.pick({
  label: true,
  status: true,
  is_archived: true,
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
