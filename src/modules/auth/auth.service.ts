import { Body, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "@/modules/user/user.service";

import { type CreateUserDTO } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
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
    const user = await this.user.create(createUserDTO);

    // const [accessToken, refreshToken] = this.signTokens();
    // sign accessTokens and refreshTokens
    // assign new refreshTokens to the user's data

    return user;
  }

  async signOut() {
    // -> remove sessions & token from request
  }

  async getRefreshToken() {}

  async refresh() {}

  async signTokens(sub: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub,
          email,
        },
        { secret: this.config.get("ACCESS_TOKEN_SECRET"), expiresIn: 15 * 60 },
      ),
      this.jwt.signAsync(
        {
          sub,
          email,
        },
        {
          secret: this.config.get("REFRESH_TOKEN_SECRET"),
          expiresIn: 7 * 24 * 60 * 60,
        },
      ),
    ]);

    console.log(accessToken, refreshToken);
    return { accessToken, refreshToken };
  }
}
