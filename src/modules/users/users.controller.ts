import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UsersController {
  constructor(private user: UsersService) {}

  @Get("/")
  async lists() {
    return {
      data: await this.user.getAll(),
    };
  }
}
