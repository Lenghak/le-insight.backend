import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserService } from "./user.service";

@ApiTags("Users")
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/users")
  async lists() {
    return {
      data: await this.userService.findAll(),
    };
  }
}
