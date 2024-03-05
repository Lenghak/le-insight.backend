import { Controller, Post, UseGuards } from "@nestjs/common";

import { Roles } from "@/common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";

import { UserRoleEnum } from "@/database/schemas/auth/users/users.type";

@Controller({ path: "/articles" })
export class ArticlesController {
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post("/")
  async getCloudAuthToken() {
    return "This is visible in admin";
  }
}
