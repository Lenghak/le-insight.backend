import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDTO } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { SignInDTO } from "./dto/sign-in.dto";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    return await this.auth.signUp(createUserDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Body() signInDTO: SignInDTO) {
    return this.auth.signIn(signInDTO);
  }

  @Post("/sign-out")
  async signOut() {
    return await this.auth.signOut();
  }
}
