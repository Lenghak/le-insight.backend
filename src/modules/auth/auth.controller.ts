import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";

import { FastifyRequest } from "fastify";

import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/sign-in.dto";
import { SignOutDTO } from "./dto/sign-out.dto";
import { SignUpDTO } from "./dto/sign-up.dto";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Req() req: FastifyRequest, @Body() signUpDTO: SignUpDTO) {
    return await this.auth.signUp(req, signUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Body() signInDTO: SignInDTO) {
    return this.auth.signIn(signInDTO);
  }

  @Post("/sign-out")
  @ApiParam({ name: "userID" })
  async signOut(@Param("userID") signOutDTO: SignOutDTO) {
    return await this.auth.signOut(signOutDTO);
  }
}
