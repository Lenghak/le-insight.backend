import { type Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { RequestUpdateUserDTO } from "@/modules/users/dto/update-user.dto";

import type { FastifyRequest } from "fastify";

import { UsersListDTO } from "./dto/users-list.dto";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@Controller({ path: "/users" })
export class UsersController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    @Req() request: FastifyRequest,
    @Param("id") id: ParseUUIDPipe,
    @Body() updateUserDTO: RequestUpdateUserDTO,
  ) {
    const response = this.usersSerializer.serialize(
      await this.usersService.update({
        ...updateUserDTO,
        id: id as unknown as string,
        banned_at: updateUserDTO?.banned_at
          ? new Date(updateUserDTO?.banned_at)
          : undefined,
        banned_until: updateUserDTO?.banned_until
          ? new Date(updateUserDTO?.banned_until)
          : undefined,
      }),
    );

    await this.cacheManager.store.mdel(
      ...(((await this.cacheManager.store.mget(
        "/v1/api/users/*",
      )) as string[]) ?? []),
    );

    return response;
  }
}
