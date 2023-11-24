import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
