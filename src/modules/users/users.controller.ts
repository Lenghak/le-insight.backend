import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { RequestUpdateUserDTO } from "@/modules/users/dto/update-user.dto";

import { UsersListDTO } from "./dto/users-list.dto";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@Controller({ path: "/users" })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersSerializer: UsersSerializer,
  ) {}

  @Public()
  @Get("/")
  async lists(@Query() usersListDTO: UsersListDTO) {
    const users = await this.usersService.list({
      ...usersListDTO,

      "sex[]":
        typeof usersListDTO === "string"
          ? [usersListDTO["sex[]"]]
          : usersListDTO["sex[]"],
    });

    return {
      data: users.data,
      meta: {
        pagination: users.meta,
      },
    };
  }

  @Public()
  @Get("/:id")
  async getByID(@Param("id") id: ParseUUIDPipe) {
    return this.usersSerializer.serialize(
      await this.usersService.get({
        by: "id",
        values: {
          id,
        },
      }),
    );
  }

  @Public()
  @Get("/total")
  async total() {
    return this.usersSerializer.serialize(await this.usersService.count());
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/:id")
  async edit(
    @Param("id") id: ParseUUIDPipe,
    @Body() updateUserDTO: RequestUpdateUserDTO,
  ) {
    return this.usersSerializer.serialize(
      await this.usersService.update({
        id: id as unknown as string,
        ...updateUserDTO,
      }),
    );
  }
}
