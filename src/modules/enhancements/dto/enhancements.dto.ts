import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const enhancementsSchema = z.object({
  content: z.string().min(1).max(2000),
});

export class EnhancementsDto extends createZodDto(enhancementsSchema) {}
