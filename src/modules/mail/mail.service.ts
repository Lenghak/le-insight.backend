import { BadGatewayException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { MailerService } from "@nestjs-modules/mailer";

import { type MailerDTO } from "./mail.dto.";

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(mailerDTO: MailerDTO) {
    try {
      return await this.mailerService.sendMail({
        from: mailerDTO.from ?? {
          address: this.configService.get("MAILER_FROM") ?? "",
          name: this.configService.get("APP_NAME") ?? "",
        },
        to: mailerDTO.to,
        subject: mailerDTO.subject,
        template: "mail.template.hbs",
        context: {
          title: mailerDTO.title,
          description: mailerDTO.description,
          link: mailerDTO.link,
          label: mailerDTO.label,
        },
      });
    } catch (err) {
      Logger.error(err);
      throw new BadGatewayException("Failed to Send Email");
    }
  }
}
