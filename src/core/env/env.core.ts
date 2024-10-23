import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  PEPPER_SECRET: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),

  COOKIE_SECRET: z.string().min(1),

  SESSION_SECRET: z.string().min(1),
  SESSION_SALT: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  AI_URL: z.string().url(),
  HOST_URL: z.string().min(1),
  PORT: z.string().min(1),

  REDIS_URL: z.string().url(),
  REDIS_TTL: z.string().min(1),

  MAILER_HOST: z.string().min(1),
  MAILER_PORT: z.string().min(1),
  MAILER_USERNAME: z.string().min(1),
  MAILER_PASSWORD: z.string().min(1),
  MAILER_FROM: z.string().min(1),

  QUEUE_HOST: z.string().min(1),
  QUEUE_USERNAME: z.string().optional(),
  QUEUE_PASSWORD: z.string().optional(),
  QUEUE_PORT: z.string().min(1),

  PORTIVE_API_KEY: z.string().min(1),
});

export default (() => envSchema.parse(process.env))();
