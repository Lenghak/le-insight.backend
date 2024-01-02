import { migrationClient } from "@/database/drizzle.service";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { exit } from "process";

// Might be configure another application context from Nest JS
migrate(drizzle(migrationClient), { migrationsFolder: "migrations" })
  .then((_) => {
    console.log("Migration Done!");
    exit(0);
  })
  .catch((err) => {
    console.error(err);
    exit(1);
  });
