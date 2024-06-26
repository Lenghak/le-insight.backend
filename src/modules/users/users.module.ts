import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { DrizzleModule } from "@/database/drizzle.module";

import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@Module({
  imports: [DrizzleModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    jsonAPISerializerProvider,
    UsersSerializer,
  ],
  exports: [UsersService],
})
export class UsersModule {}
