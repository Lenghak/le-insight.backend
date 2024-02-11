import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

import { SignUpSchema } from "./sign-up.dto";

export const RequestConfirmSchema = SignUpSchema.omit({
  password: true,
}).extend({
  token: z.string().optional(),
});

export class RequestConfirmDTO extends createZodDto(RequestConfirmSchema) {}
