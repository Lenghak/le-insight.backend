import { Logger, Module } from "@nestjs/common";

import { DrizzleModule } from "../drizzle.module";
import { SeederService } from "./seeder.service";

@Module({
  imports: [DrizzleModule],
  providers: [Logger, SeederService],
})
export class SeederModule {}
