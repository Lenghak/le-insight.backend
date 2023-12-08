import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDTO } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    const user = this.auth.signUp(createUserDTO);
    return user;
  }

  @Post("/sign-in")
  async signIn() {
    return this.auth.signIn();
  }

  @Post("/sign-out")
  async signOut() {
    return await this.auth.signOut();
  }

  @Post("/refresh")
  async refresh() {
    return await this.auth.refresh();
  }
}
