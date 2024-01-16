import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { SessionsRepository } from "./sessions.repository";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [DrizzleModule],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
