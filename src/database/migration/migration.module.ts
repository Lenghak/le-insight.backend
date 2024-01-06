import { Logger, Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { MigrationService } from "./migration.service";

@Module({ imports: [DrizzleModule], providers: [Logger, MigrationService] })
export class MigrationModule {}
