import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { MigrationModule } from "@/database/migrations/migration.module";
import { MigrationService } from "@/database/migrations/migration.service";

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(MigrationModule);

  const logger = context.get(Logger);
  const migrationService = context.get(MigrationService);

  logger.debug("Migration Started!");

  migrationService.execute().finally(() => {
    logger.debug("Migration Done Running!");
    context.close().finally(() => process.exit(0));
  });
}

bootstrap();
