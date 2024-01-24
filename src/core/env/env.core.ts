import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  PEPPER_SECRET: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),

  HOSTNAME: z.string().min(1),
  PORT: z.string().min(1),

  REDIS_HOSTNAME: z.string().min(1),
  REDIS_PASSWORD: z.string().nullable(),
  REDIS_PORT: z.string().min(1),
  REDIS_TTL: z.string().min(1),
  REDIS_TLS: z.string().nullable(),
});

export default () => envSchema.parse(process.env);
