import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { DrizzleModule } from "@/database/drizzle.module";

import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokensRepository } from "./repo/refresh-tokens.repository";
import { AccessTokenStrategy } from "./strategies/access.strategy";
import { RefreshTokensStrategy } from "./strategies/refresh.strategy";

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
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
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokensStrategy,
    RefreshTokensRepository,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
