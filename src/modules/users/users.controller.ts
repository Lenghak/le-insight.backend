import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UpdateUserDTO } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UsersController {
  constructor(private user: UsersService) {}

  @Get("/")
  async lists() {
    return {
      data: await this.user.findAll(),
    };
  }

  @Patch("/:id")
  async modify(@Param() id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return {
      param: {
        id,
      },
      dto: updateUserDTO,
    };
  }
}
