import { UpdateCategoriesSchema } from "@/database/schemas/categories/categories.schema";

import { createZodDto } from "nestjs-zod";

export class UpdateCategoryDto extends createZodDto(UpdateCategoriesSchema) {}
