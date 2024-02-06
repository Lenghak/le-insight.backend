import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Public } from "@/common/decorators/public.decorator";

import { MailService } from "./mail.service";

@ApiTags("Mail")
@Controller({
  path: "/mail",
})
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Get("/send")
  async send() {
    return this.mailService.sendMail({
      subject: "Testing",
      from: undefined,
      to: [{ address: "<johndeo@example.com>", name: "John Doe" }],
      template: "forgot-password.template.hbs",
    });
  }
}
