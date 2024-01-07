import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test", "stage"]),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  PEPPER_SECRET: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
});

export default () => envSchema.parse(process.env);
