import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { FastifyRequest } from "fastify";

import { OAuthService } from "./oauth.service";

@Controller("oauth")
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Public()
  @Post("google/verify")
  async verifyGoogle(@Req() req: FastifyRequest, @Body("token") token: string) {
    try {
      const userData = await this.oauthService.verifyGoogleToken(token);

      const user = await this.oauthService.createOrUpdateUser(req, userData);

      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid Google token");
    }
  }

  @Public()
  @Post("facebook/verify")
  async verifyFacebook(
    @Req() req: FastifyRequest,
    @Body("token") token: string,
  ) {
    try {
      const userData = await this.oauthService.verifyFacebookToken(token);
      const user = await this.oauthService.createOrUpdateUser(req, userData);

      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid Facebook token");
    }
  }

  @Public()
  @Post("github/verify")
  async verifyGithub(@Req() req: FastifyRequest, @Body("token") token: string) {
    try {
      const userData = await this.oauthService.verifyGithubToken(token);
      const user = await this.oauthService.createOrUpdateUser(req, userData);
      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid GitHub token");
    }
  }
}
