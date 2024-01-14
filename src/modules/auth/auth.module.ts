import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { DrizzleModule } from "@/database/drizzle.module";

import { ProfilesModule } from "../profiles/profiles.module";
import { RefreshTokensModule } from "../refresh-tokens/refresh-tokens.module";
import { SessionsModule } from "../sessions/sessions.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/access.strategy";
import { RefreshTokensStrategy } from "./strategies/refresh.strategy";

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    ProfilesModule,
    RefreshTokensModule,
    SessionsModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: 15 * 60 * 1000,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokensStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
