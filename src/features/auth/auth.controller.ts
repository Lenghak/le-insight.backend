import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller({ path: "/auth" })
export class AuthController {
  @Get()
  getHello(): Record<string, any> {
    return {
      message: "Authentication",
    };
  }
}
