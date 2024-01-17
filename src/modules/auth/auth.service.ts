import {
  ConflictException,
  Injectable,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { ProfilesService } from "@/modules/profiles/profiles.service";
import { RefreshTokensService } from "@/modules/refresh-tokens/refresh-tokens.service";
import { UsersService } from "@/modules/users/users.service";

import bycrypt from "bcrypt";
import { FastifyRequest } from "fastify";

import { SessionsService } from "../sessions/sessions.service";
import { type SignInDTO } from "./dto/sign-in.dto";
import { type SignOutDTO } from "./dto/sign-out.dto";
import { type SignTokensDTO } from "./dto/sign-token.dto";
import { SignUpDTO } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.usersService.get({
      by: "email",
      values: { email: signInDTO.email },
    });

    if (!user?.id) throw new UnauthorizedException();

    const isPasswordMatched = await bycrypt.compare(
      signInDTO.password,
      user.encrypted_password,
    );

    if (!isPasswordMatched) throw new UnauthorizedException();

    const tokens = await this.signTokens({ id: user.id, email: user.email });

    // assign new refreshTokens to the user's data
    await this.refreshTokensService.update({
      userID: user.id,
      token: tokens.refreshToken,
    });

    return tokens;
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

    const { digest, salt } = await this.hashData(signUpDTO.password);

    const profile = await this.profilesService.create({
      createProfilesDTO: {
        firstName: signUpDTO.firstName,
        lastName: signUpDTO.lastName,
      },
    });

    const user = await this.usersService.create({
      ...signUpDTO,
      profileID: profile[0].id,
      password: digest,
      salt: salt,
    });

    const session = await this.sessionsService.create({
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      userID: user[0].id,
    });

    const tokens = await this.signTokens({
      id: user[0].id,
      email: signUpDTO.email,
    });

    await this.refreshTokensService.update({
      userID: user[0].id,
      token: tokens ? tokens.refreshToken : "",
      sessionID: session[0].id,
    });

    return {
      data: user,
      // tokens,
    };
  }

  async signOut(signOutDTO: SignOutDTO) {
    // -> remove sessions & token from request
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    return await this.refreshTokensService.delete(signOutDTO);
  }

  /**
   * The function `signTokens` asynchronously signs access and refresh tokens using JWT with different
   * secrets and expiration times.
   * @param {SignTokensDTO} signTokensDTO - The `signTokensDTO` parameter is an object that contains
   * the data needed to sign the tokens. It likely includes information such as the user's ID or
   * username, and any additional data required for token generation.
   * @returns an array containing the access token and refresh token.
   */
  async signTokens(signTokensDTO: SignTokensDTO) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(signTokensDTO, {
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
        expiresIn: 15 * 60,
      }),
      this.jwtService.signAsync(signTokensDTO, {
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
        expiresIn: 7 * 24 * 60 * 60,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * The function `hashData` takes a string as input, generates a salt and pepper using bcrypt and a
   * configuration service, and returns the hashed data.
   * @param {string} data - The `data` parameter is a string that represents the data that you want to
   * hash.
   * @returns a promise that resolves to the hashed data.
   */
  async hashData(data: string, defaultSalt?: string) {
    const salt = defaultSalt ?? (await bycrypt.genSalt(12));
    const pepper = await this.configService.get("PEPPER_SECRET");

    return {
      digest: await bycrypt.hash(data, salt + pepper),
      salt,
    };
  }
}
