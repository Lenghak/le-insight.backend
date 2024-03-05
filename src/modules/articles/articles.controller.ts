import {
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthSerializer } from "@/modules/auth/auth.serializer";

import { createAuthToken } from "@portive/auth";

@Controller({ path: "/articles" })
export class ArticlesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authSerializer: AuthSerializer,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("/cloud")
  async getCloudAuthToken() {
    if (!this.configService.get("PORTIVE_API_KEY"))
      throw new InternalServerErrorException("Cannot Connect to Portive Cloud");

    const token = createAuthToken(
      this.configService.get("PORTIVE_API_KEY") ?? "",
      {
        expiresIn: "24h",
        maxFileBytes: 5 * 1000 * 1000,
      },
    );

    return this.authSerializer.serialize(token);
  }
}
