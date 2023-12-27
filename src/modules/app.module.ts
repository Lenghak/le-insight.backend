import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DrizzleModule } from "@/database/drizzle.module";

import { envSchema } from "@/core/env";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      validationSchema: envSchema,
      validate: envSchema.parse,
    }),
    AuthModule,
    DrizzleModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
