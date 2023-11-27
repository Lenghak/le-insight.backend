import { Body, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "@/modules/user/user.service";

import { type CreateUserDTO } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
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
    return await this.user.create(createUserDTO);
  }

  async signOut() {
    // -> remove sessions & token from request
  }

  async refresh() {}
}
