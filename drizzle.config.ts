import env from "@/core/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "src/database/models/**/*.model.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env().DATABASE_URL,
  },
  strict: true,
  verbose: true,
} satisfies Config;
