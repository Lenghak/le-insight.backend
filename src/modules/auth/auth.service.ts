import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { RefreshTokensService } from "@/modules/refresh-tokens/refresh-tokens.service";
import { type CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { UsersService } from "@/modules/users/users.service";

import bycrypt from "bcrypt";

import { type SignInDTO } from "./dto/sign-in.dto";
import { type SignTokensDTO } from "./dto/sign-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.get({
      by: "email",
      values: { email: signInDTO.email },
    });

    if (!user) throw new UnauthorizedException();

    const isPasswordMatched = await bycrypt.compare(
      (await this.hashData(signInDTO.password)).digest,
      user.encrypted_password,
    );

    if (!isPasswordMatched) throw new UnauthorizedException();

    const tokens = await this.signTokens({ id: user.id, email: user.email });

    // assign new refreshTokens to the user's data
    await this.refreshTokensService.update({
      userId: user.id,
      token: tokens.refreshToken,
    });

    return tokens;
  }

  /**
   * The signUp function checks if a user already exists, creates a new user account if they don't, signs
   * access and refresh tokens for the user, assigns the refresh token to the user's data, and returns
   * the user data and tokens.
   * @param {CreateUserDTO} createUserDTO - The `createUserDTO` parameter is an object that contains the
   * data needed to create a new user account. It typically includes properties such as `email`,
   * `password`, `name`, etc.
   * @returns an object with two properties: "data" and "tokens". The "data" property contains the user
   * object that was created, and the "tokens" property contains an object with two properties:
   * "accessToken" and "refreshToken".
   */
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    // check if user is already exist
    const existingUser = await this.userService.get({
      by: "email",
      values: {
        email: createUserDTO.email,
      },
    });

    // if user already exist -> throw conflictException
    if (existingUser) throw new ConflictException();

    // hash the password and get the salt before store in
    const { digest, salt } = await this.hashData(createUserDTO.password);

    // else create another user's account
    const user = await this.userService.create({
      ...createUserDTO,
      password: digest,
      salt: salt,
    });

    // sign accessTokens and refreshTokens
    const tokens = await this.signTokens({
      id: user[0].id,
      email: createUserDTO.email,
    });

    // assign new refreshTokens to the user's data
    await this.refreshTokensService.update({
      userId: user[0].id,
      token: tokens.refreshToken,
    });

    return {
      data: user,
      tokens,
    };
  }

  async signOut() {
    // -> remove sessions & token from request
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
  async hashData(data: string) {
    const salt = await bycrypt.genSalt(12);
    const pepper = await this.configService.get("PEPPER_SECRET");

    return {
      digest: await bycrypt.hash(data, salt + pepper),
      salt,
    };
  }
}
