import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const CreateProfileSchema = z.object({
  firstName: z.string().max(255),
  lastName: z.string().max(255).nullable(),
  imageID: z.string().uuid().max(255).optional(),
  bio: z.string().uuid().max(1024).optional(),
  gender: z.string().max(255).optional(),
  sex: z.enum(["MALE", "FEMALE", "RNTS"]).default("RNTS").optional(),
});

export class CreateProfileDTO extends createZodDto(CreateProfileSchema) {}
