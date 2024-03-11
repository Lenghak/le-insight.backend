import { PaginationSchema } from "@/common/dto/pagination.dto";

import { createZodDto } from "nestjs-zod";

export const ArticlesListSchema = PaginationSchema.extend({});

export class ArticlesListDTO extends createZodDto(ArticlesListSchema) {}
