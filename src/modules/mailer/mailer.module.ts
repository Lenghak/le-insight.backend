import { Module } from "@nestjs/common";

import { MailerController } from "./mailer.controller";
import { MailerService } from "./mailer.service";
import { MailerView } from "./mailer.view";

@Module({
  controllers: [MailerController],
  providers: [MailerService, MailerView],
})
export class MailerModule {}
