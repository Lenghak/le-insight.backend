import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DrizzleModule } from "@/database/drizzle.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [DrizzleModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
