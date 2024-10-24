import { Inject, Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { ProfilesService } from "@/modules/profiles/profiles.service";
import { ProvidersService } from "@/modules/providers/providers.service";
import { RefreshTokensService } from "@/modules/refresh-tokens/refresh-tokens.service";
import { SessionsService } from "@/modules/sessions/sessions.service";
import { UsersService } from "@/modules/users/users.service";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import { type Users } from "@/database/schemas/users/users.type";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import bcrypt from "bcrypt";
import { FastifyRequest } from "fastify";

import { type SignTokensDTO } from "./dto/sign-token.dto";
import { SignUpDTO } from "./dto/sign-up.dto";

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER) private readonly db: PostgresJsDatabase,
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly providersService: ProvidersService,
  ) {}

  /**
   * The `signUpTransaction` function creates a new user account with a profile, session, and tokens, and
   * returns the user and tokens.
   * @param {FastifyRequest} req - The `req` parameter is an object that represents the HTTP request made
   * to the server. It contains information such as the request headers, IP address, and user agent.
   * @param {SignUpDTO} signUpDTO - The `signUpDTO` parameter is an object that contains the data needed
   * to sign up a user. It typically includes properties such as `firstName`, `lastName`, `email`, and
   * `password`.
   * @returns an object that contains the `user` and `tokens` properties.
   */
  async signUpTransaction(@Req() req: FastifyRequest, signUpDTO: SignUpDTO) {
    const hashed = signUpDTO.password
      ? await this.hashData(signUpDTO.password)
      : null;

    return await this.db.transaction(async (tx) => {
      const profile = (
        await this.profilesService.create({
          createProfilesDTO: {
            firstName: signUpDTO.firstName,
            lastName: signUpDTO.lastName,
            image_url: signUpDTO.image_url ?? undefined,
          },
          db: tx,
        })
      )[0];

      const user = (
        await this.usersService.create(
          {
            email: signUpDTO.email,
            firstName: signUpDTO.firstName,
            lastName: signUpDTO.lastName,
            encrypted_password: hashed?.digest,
            salt: hashed?.salt,
            profile_id: profile.id,
          },
          tx,
        )
      )[0];

      await this.providersService.create({
        provider: signUpDTO.provider,
        user_id: user.id,
      });

      const session = (
        await this.sessionsService.create(
          {
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? "",
            userID: user.id,
          },
          tx,
        )
      )[0];

      const tokens = await this.signTokens({
        userID: user.id,
        email: user.email as string,
        role: user.role ?? "GUEST",
        sessionID: session.id,
      });

      await this.refreshTokensService.create(
        {
          sessionID: session.id,
          userID: user.id,
          token: tokens.refreshToken,
        },
        tx,
      );

      return {
        user,
        tokens: {
          ...tokens,
        },
      };
    });
  }

  /**
   * The `signInTransaction` function signs in a user by creating a session, generating tokens, and
   * creating a refresh token, all within a database transaction.
   * @param {FastifyRequest} req - The `req` parameter is of type `FastifyRequest`, which represents the
   * incoming HTTP request object.
   * @param {Users} user - The `user` parameter is an object of type `Users`. It represents the user who
   * is signing in.
   * @returns a Promise that resolves to the tokens generated during the sign-in transaction.
   */
  async signInTransaction(@Req() req: FastifyRequest, user: Partial<Users>) {
    return await this.db.transaction(async (tx) => {
      const session = (
        await this.sessionsService.create(
          {
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? "",
            userID: user.id ?? "",
          },
          tx,
        )
      )[0];

      const tokens = await this.signTokens({
        userID: user.id ?? "",
        email: user.email as string,
        role: user.role ?? "GUEST",
        sessionID: session.id,
      });

      await this.refreshTokensService.create(
        {
          sessionID: session.id,
          token: tokens.refreshToken,
          userID: user.id ?? "",
        },
        tx,
      );

      return tokens;
    });
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
      this.jwtService.signAsync(
        {
          sub: signTokensDTO.userID,
          sid: signTokensDTO.sessionID,
          role: signTokensDTO.role,
          email: signTokensDTO.email,
        },
        {
          secret: this.configService.get("ACCESS_TOKEN_SECRET"),
          expiresIn: 15 * 60,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: signTokensDTO.userID,
          sid: signTokensDTO.sessionID,
          role: signTokensDTO.role,
          email: signTokensDTO.email,
        },
        {
          secret: this.configService.get("REFRESH_TOKEN_SECRET"),
          expiresIn: 3 * 24 * 60 * 60,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * The function `hashData` takes a string as input, generates a salt and pepper using bcrypt and a
   * configuration service, and returns the hashed data.
   * @param {string} data - The `data` parameter is a string that represents the data that you want to
   * hash.
   * @param defaultSalt
   * @returns a promise that resolves to the hashed data.
   */
  async hashData(data: string, defaultSalt?: string) {
    const salt = defaultSalt ?? (await bcrypt.genSalt(12));
    const pepper = await this.configService.get("PEPPER_SECRET");

    return {
      digest: await bcrypt.hash(data, salt + pepper),
      salt,
    };
  }
}
