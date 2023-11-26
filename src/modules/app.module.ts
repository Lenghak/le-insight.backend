import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DrizzleModule } from "@/database/drizzle.module";

import { envSchema } from "../core/env";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      validationSchema: envSchema,
      validate: envSchema.parse,
    }),
    AuthModule,
    DrizzleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
