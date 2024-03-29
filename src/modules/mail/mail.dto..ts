import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const MailAddress = z.object({
  name: z.string().min(1),
  address: z.string().email(),
});

export const MailSchema = z.object({
  from: MailAddress.or(z.undefined()),
  to: z.array(MailAddress),
  subject: z.string(),
  title: z.string(),
  description: z.string(),
  label: z.string(),
  link: z.string().url(),
});

export class MailerDTO extends createZodDto(MailSchema) {}
