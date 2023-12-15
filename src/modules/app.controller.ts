import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("App")
@Controller({ path: "/api" })
export class AppController {
  constructor() {}

  @Get("/")
  getHello() {
    return { message: "Welcome to Le-Insight API" };
  }
}
