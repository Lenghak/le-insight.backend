import { migrationClient } from "@/database/drizzle.service";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

await migrate(drizzle(migrationClient), { migrationsFolder: "migrations" });
