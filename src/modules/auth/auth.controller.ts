import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { FastifyRequest } from "fastify";

import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { type PayloadType } from "./types/payload.type";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Req() req: FastifyRequest, @Body() signUpDTO: SignUpDTO) {
    return await this.authService.signUp(req, signUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Req() req: FastifyRequest, @Body() signInDTO: SignInDTO) {
    return this.authService.signIn(req, signInDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard("jwt-access"))
  @Post("/sign-out")
  async signOut(@Req() req: FastifyRequest) {
    return this.authService.signOut({
      userID: (req["user"] as PayloadType).sub,
      sessionID: (req["user"] as PayloadType).sid,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("/refresh")
  async refresh(@Req() req: FastifyRequest) {
    return await this.authService.refresh(req);
  }
}
