import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { SeederModule } from "@/database/seeder/seeder.module";
import { SeederService } from "@/database/seeder/seeder.service";

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(SeederModule);
  const logger = context.get(Logger);
  const seederService = context.get(SeederService);

  await seederService
    .seed()
    .finally(() => logger.debug("Seeding Done Running!"));

  await context.close();
}
bootstrap();
