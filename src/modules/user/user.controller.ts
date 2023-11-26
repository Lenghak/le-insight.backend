import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserService } from "./user.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UserController {
  constructor(private user: UserService) {}

  @Get("/")
  async lists() {
    return {
      data: await this.user.findAll(),
    };
  }
}
