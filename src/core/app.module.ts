import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { envSchema } from "@/core/env";

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
    ProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
