import { Process, Processor } from "@nestjs/bull";
import { BadGatewayException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bull";

import { type MailerDTO } from "./mail.dto.";

@Processor({ name: "mail" })
export class MailProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @Process("send")
  async send(job: Job<MailerDTO>) {
    try {
      return await this.mailerService.sendMail({
        from: job.data.from ?? {
          address: this.configService.get("MAILER_FROM") ?? "",
          name: this.configService.get("APP_NAME") ?? "",
        },
        to: job.data.to,
        subject: job.data.subject,
        template: "mail.template.hbs",
        context: {
          subject: job.data.subject,
          title: job.data.title,
          description: job.data.description,
          link: job.data.link,
          label: job.data.label,
        },
      });
    } catch (err) {
      Logger.error(err);
      throw new BadGatewayException("Failed to Send Email");
    }
  }
}
