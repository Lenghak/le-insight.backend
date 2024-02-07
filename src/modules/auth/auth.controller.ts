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

import { Public } from "@/common/decorators/public.decorator";
import { User } from "@/common/decorators/user.decorator";

import { FastifyRequest } from "fastify";

import { AuthService } from "./auth.service";
import { ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { SignInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import {
  type PayloadType,
  PayloadWithRefreshTokenType,
} from "./types/payload.type";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Req() req: FastifyRequest, @Body() signUpDTO: SignUpDTO) {
    return await this.authService.signUp(req, signUpDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Req() req: FastifyRequest, @Body() signInDTO: SignInDTO) {
    return this.authService.signIn(req, signInDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @Post("/sign-out")
  async signOut(@User() payload: PayloadType) {
    return this.authService.signOut({
      userID: payload.sub,
      sessionID: payload.sid,
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("refresh-token")
  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("/refresh")
  async refresh(@User() payload: PayloadWithRefreshTokenType) {
    return await this.authService.refresh(payload);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/confirm")
  async confirm(@Body() confirmEmailDTO: ConfirmEmailDTO) {
    return await this.authService.confirm(confirmEmailDTO);
  }
}
