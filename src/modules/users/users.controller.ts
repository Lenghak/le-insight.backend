import { CacheKey } from "@nestjs/cache-manager";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("/")
  @CacheKey("users")
  async lists() {
    return {
      data: await this.userService.getAll(),
    };
  }

  @Get("/:id")
  @CacheKey("user")
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
}
