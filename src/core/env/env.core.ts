import { z } from "zod";

export const envSchema = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_SCHEMA: z.string().min(1),
  POSTGRES_CONNECTION_LIMIT: z.string().min(1),
  POSTGRES_SOCKET_TIMEOUT: z.string().min(1),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  PEPPER_SECRET: z.string().min(1),
});

export default () => envSchema.parse(process.env);
