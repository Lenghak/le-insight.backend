import { Injectable } from "@nestjs/common";

import { migrationClient } from "@/database/drizzle.service";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

@Injectable()
export class MigrationService {
  // Might be configured another application context from Nest JS
  async execute() {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: "migrations",
    });
  }
}
