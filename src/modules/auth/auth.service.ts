import {
  ConflictException,
  Injectable,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import { RefreshTokensService } from "@/modules/refresh-tokens/refresh-tokens.service";
import { UsersService } from "@/modules/users/users.service";

import bycrypt from "bcrypt";
import { FastifyRequest } from "fastify";

import { SessionsService } from "../sessions/sessions.service";
import { AuthRepository } from "./auth.repository";
import { type SignInDTO } from "./dto/sign-in.dto";
import { type SignOutDTO } from "./dto/sign-out.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { type PayloadWithRefreshTokenType } from "./types/payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly authRepository: AuthRepository,
  ) {}

  async signIn(@Req() req: FastifyRequest, signInDTO: SignInDTO) {
    const user = await this.usersService.get({
      by: "email",
      values: { email: signInDTO.email },
    });

    if (!user?.id) throw new UnauthorizedException();

    const isPasswordMatched = await bycrypt.compare(
      signInDTO.password,
      user.encrypted_password as string,
    );

    if (!isPasswordMatched) throw new UnauthorizedException();

    // assign new refreshTokens to the user's data
    const tokens = await this.authRepository.signInTransaction(req, user);

    return {
      data: tokens,
    };
  }

  /**
   * The signUp function checks if a user already exists, creates a new user account if they don't, signs
   * access and refresh tokens for the user, assigns the refresh token to the user's data, and returns
   * the user data and tokens.
   * @param {SignUpDTO} signUpDTO - The `signUpDTO` parameter is an object that contains the
   * data needed to create a new user account. It typically includes properties such as `email`,
   * `password`, `name`, etc.
   * @returns an object with two properties: "data" and "tokens". The "data" property contains the user
   * object that was created, and the "tokens" property contains an object with two properties:
   * "accessToken" and "refreshToken".
   */
  async signUp(@Req() req: FastifyRequest, signUpDTO: SignUpDTO) {
    const existingUser = await this.usersService.get({
      by: "email",
      values: {
        email: signUpDTO.email,
      },
    });

    if (existingUser) throw new ConflictException();

    const user = await this.authRepository.signUpTransaction(req, {
      email: signUpDTO.email,
      firstName: signUpDTO.firstName,
      lastName: signUpDTO.lastName,
      password: signUpDTO.password,
    });

    return {
      data: user,
    };
  }

  async signOut(signOutDTO: SignOutDTO) {
    // -> remove sessions & token from request
    return {
      data: (
        await this.sessionsService.delete({
          sessionID: signOutDTO.sessionID,
        })
      )[0],
    };
  }

  async refresh(@Req() req: FastifyRequest) {
    const payload = req["user"] as PayloadWithRefreshTokenType;

    if (!payload?.rt) throw new UnauthorizedException();

    const user = await this.usersService.get({
      by: "id",
      values: {
        id: payload.sub,
      },
    });

    if (!user) throw new UnauthorizedException("User not found");

    const refreshToken = await this.refreshTokensService.get({
      by: "session_id",
      values: {
        session_id: payload.sid,
      },
    });

    if (!refreshToken?.token)
      return new UnauthorizedException("Session Expired");

    const isRefreshTokenMatch = await bycrypt.compare(
      payload.rt,
      refreshToken.token,
    );

    if (!isRefreshTokenMatch) return new UnauthorizedException();

    const tokens = await this.authRepository.signTokens({
      email: user.email ?? "",
      userID: user.id,
      sessionID: refreshToken.session_id ?? "",
    });

    await this.refreshTokensService.update({
      token: tokens.refreshToken,
      userID: user.id,
      sessionID: refreshToken.session_id ?? "",
    });

    return {
      data: tokens,
    };
  }
}
