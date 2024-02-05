import { CacheKey } from "@nestjs/cache-manager";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Public } from "@/common/decorators/public.decorator";

import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller({ path: "/users" })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @CacheKey("users")
  @Get("/")
  async lists() {
    return {
      data: await this.userService.getAll(),
    };
  }

  @Public()
  @CacheKey("user")
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
}
