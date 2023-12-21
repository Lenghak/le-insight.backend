import { Body, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { type CreateUserDTO } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { type SignTokensDTO } from "./dto/sign-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn() {
    // if (!user) throw new UnauthorizedException();
    // -> extract JWT from request's cookies
    // -> decrypt tokens
    // -> find user with the user's id from the extracted tokens
    // -> deep compare the password
    // -> if true redirect user to home page
  }

  async signUp(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.user.create(createUserDTO)[0];

    // sign accessTokens and refreshTokens
    const [accessToken, refreshToken] = await this.signTokens({
      id: user,
      email: createUserDTO.email,
    });

    console.log(accessToken, refreshToken);
    // assign new refreshTokens to the user's data

    return user;
  }

  async signOut() {
    // -> remove sessions & token from request
  }

  async signTokens(signTokensDTO: SignTokensDTO) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(signTokensDTO, {
        secret: this.config.get("ACCESS_TOKEN_SECRET"),
        expiresIn: 15 * 60,
      }),
      this.jwt.signAsync(signTokensDTO, {
        secret: this.config.get("REFRESH_TOKEN_SECRET"),
        expiresIn: 7 * 24 * 60 * 60,
      }),
    ]);

    return [accessToken, refreshToken];
  }

  async refresh() {
    return "Sending refresh token";
  }
}
