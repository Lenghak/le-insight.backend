import { Controller, Get, Param } from "@nestjs/common";

@Controller({ path: "/profiles" })
export class ProfilesController {
  @Get("/{id}")
  async get(@Param() id: string) {
    return id;
  }
}
