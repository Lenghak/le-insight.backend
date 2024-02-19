import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { MailModule } from "@/modules/mail/mail.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { RefreshTokensModule } from "@/modules/refresh-tokens/refresh-tokens.module";
import { SessionsModule } from "@/modules/sessions/sessions.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { MailSerializer } from "../mail/mail.serializer";
import { RefrehsTokensSerializer } from "../refresh-tokens/refresh-tokens.serializer";
import { SessionsSerializer } from "../sessions/sessions.serializer";
import { UsersSerializer } from "../users/users.serializer";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthSerializer } from "./auth.serializer";
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
    jsonAPISerializerProvider,
    AuthSerializer,
    MailSerializer,
    SessionsSerializer,
    RefrehsTokensSerializer,
    UsersSerializer,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
