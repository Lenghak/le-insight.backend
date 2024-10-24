import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthModule } from "@/modules/auth/auth.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { ProvidersModule } from "@/modules/providers/provider.module";
import { RefreshTokensModule } from "@/modules/refresh-tokens/refresh-tokens.module";
import { SessionsModule } from "@/modules/sessions/sessions.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

@Module({
  imports: [
    DrizzleModule,
    ProfilesModule,
    HttpModule,
    UsersModule,
    SessionsModule,
    JwtModule,
    RefreshTokensModule,
    ProvidersModule,
    AuthModule,
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
