import env from "@/core/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/**/*.schema.ts",
  out: "./migrations",
  driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    connectionString: env().DATABASE_URL,
  },
  strict: true,
  verbose: true,
} satisfies Config;
