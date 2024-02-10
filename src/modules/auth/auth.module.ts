import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { MailModule } from "@/modules/mail/mail.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { RefreshTokensModule } from "@/modules/refresh-tokens/refresh-tokens.module";
import { SessionsModule } from "@/modules/sessions/sessions.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/access.strategy";
import { RefreshTokensStrategy } from "./strategies/refresh.strategy";

@Module({
  imports: [
    DrizzleModule,
    MailModule,
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
          expiresIn: 3 * 60 * 1000,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AccessTokenStrategy,
    RefreshTokensStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
