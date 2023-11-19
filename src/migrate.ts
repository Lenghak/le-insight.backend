import { migrationClient } from "@/core/database/drizzle.provider";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

await migrate(drizzle(migrationClient), { migrationsFolder: "migrations" });
