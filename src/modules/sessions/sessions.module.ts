import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { SessionsRepository } from "./sessions.repository";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [DrizzleModule],
  providers: [SessionsRepository, SessionsService],
  exports: [SessionsService],
})
export class SerssionModule {}
