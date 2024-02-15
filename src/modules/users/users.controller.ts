import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Public } from "@/common/decorators/public.decorator";

import { UsersListDTO } from "./dto/users-list.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Get("/")
  async lists(@Query() usersListDTO: UsersListDTO) {
    return {
      data: await this.userService.getAll(usersListDTO),
    };
  }

  @Public()
  @Get("/:id")
  async getByID(@Param("id") id: string) {
    return {
      data: await this.userService.get({
        by: "id",
        values: {
          id,
        },
      }),
    };
  }

  @Public()
  @Get("/total")
  async total() {
    return {
      data: await this.userService.total(),
    };
  }
}
