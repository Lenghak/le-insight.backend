import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { DrizzleModule } from "@/database/drizzle.module";

import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [DrizzleModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, jsonAPISerializerProvider],
  exports: [UsersService],
})
export class UsersModule {}
