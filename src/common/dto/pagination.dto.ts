import { z } from "nestjs-zod/z";

export const PaginationSchema = z.object({
  limit: z
    .number({ coerce: true })
    .positive()
    .max(50)
    .optional()
    .default(50)
    .describe("Number of item per page"),
  page: z
    .number({ coerce: true })
    .positive()
    .optional()
    .default(1)
    .describe("Page offseting data"),
  q: z.string().optional().describe("Search string"),
});
