import { InsertProvidersSchema } from "@/database/schemas/providers/providers.schema";

import { createZodDto } from "nestjs-zod";

export const CreateProviderSchema = InsertProvidersSchema;

export class CreateProvidersDTO extends createZodDto(CreateProviderSchema) {}
