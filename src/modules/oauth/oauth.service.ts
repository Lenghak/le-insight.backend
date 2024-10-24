import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthRepository } from "@/modules/auth/auth.repository";
import { AuthService } from "@/modules/auth/auth.service";
import { UsersService } from "@/modules/users/users.service";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";
import type { ProviderEnumSchema } from "@/database/schemas/providers/providers.schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import type { FastifyRequest } from "fastify";
import type { z } from "nestjs-zod/z";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OAuthService {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UsersService,
    private authService: AuthService,
    private authRepository: AuthRepository,
  ) {}

  async verifyGoogleToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get("https://www.googleapis.com/oauth2/v3/tokeninfo", {
          params: { id_token: token },
        }),
      );

      const payload = response.data;

      if (payload.aud !== this.configService.get("GOOGLE_CLIENT_ID")) {
        throw new UnauthorizedException("Invalid token audience");
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: "google" as z.infer<typeof ProviderEnumSchema>,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid Google token");
    }
  }

  async verifyFacebookToken(token: string) {
    try {
      const appToken = await this.getFacebookAppToken();
      const response = await firstValueFrom(
        this.httpService.get("https://graph.facebook.com/debug_token", {
          params: {
            input_token: token,
            access_token: appToken,
          },
        }),
      );

      const { data } = response.data;

      if (data.app_id !== this.configService.get("FACEBOOK_APP_ID")) {
        throw new UnauthorizedException("Invalid token application");
      }

      if (!data.is_valid) {
        throw new UnauthorizedException("Invalid Facebook token");
      }

      const userResponse = await firstValueFrom(
        this.httpService.get("https://graph.facebook.com/me", {
          params: {
            fields: "id,name,email,picture",
            access_token: token,
          },
        }),
      );

      const userData = userResponse.data;

      return {
        email: userData.email,
        name: userData.name,
        picture: userData.picture?.data?.url,
        provider: "facebook" as z.infer<typeof ProviderEnumSchema>,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid Facebook token");
    }
  }

  async verifyGithubToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get("https://api.github.com/user", {
          headers: { Authorization: `token ${token}` },
        }),
      );

      const userData = response.data;

      const emailResponse = await firstValueFrom(
        this.httpService.get("https://api.github.com/user/emails", {
          headers: { Authorization: `token ${token}` },
        }),
      );

      const primaryEmail = emailResponse.data.find(
        (email: Record<string, unknown>) => email.primary,
      );

      return {
        email: primaryEmail?.email,
        name: userData.name,
        picture: userData.avatar_url,
        provider: "github" as z.infer<typeof ProviderEnumSchema>,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid GitHub token");
    }
  }

  private async getFacebookAppToken(): Promise<string> {
    const appId = this.configService.get("FACEBOOK_APP_ID");
    const appSecret = this.configService.get("FACEBOOK_APP_SECRET");

    const response = await firstValueFrom(
      this.httpService.get("https://graph.facebook.com/oauth/access_token", {
        params: {
          client_id: appId,
          client_secret: appSecret,
          grant_type: "client_credentials",
        },
      }),
    );

    return response.data.access_token;
  }

  async createOrUpdateUser(
    @Req() req: FastifyRequest,
    {
      email,
      name,
      picture,
      provider,
    }: {
      email: string;
      provider: z.infer<typeof ProviderEnumSchema>;
      name: string;
      picture: string;
    },
  ) {
    // check the user's exist
    const user = await this.userService.get({ by: "email", values: { email } });

    if (!user) {
      return await this.authService.signUp(req, {
        email,
        firstName: name,
        lastName: "",
        password: null,
        provider: provider,
        image_url: picture,
      });
    }

    return {
      user,
      tokens: await this.authRepository.signInTransaction(req, user),
    };
  }
}
