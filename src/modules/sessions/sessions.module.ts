import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { DrizzleModule } from "@/database/drizzle.module";

import { SessionsRepository } from "./sessions.repository";
import { SessionsSerializer } from "./sessions.serializer";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [DrizzleModule],
  providers: [
    SessionsService,
    SessionsRepository,
    jsonAPISerializerProvider,
    SessionsSerializer,
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
