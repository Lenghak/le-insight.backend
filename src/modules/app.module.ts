import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DrizzleModule } from "@/core/database/drizzle.module";

import validateEnv from "../core/env";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      load: [validateEnv],
    }),
    AuthModule,
    DrizzleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
