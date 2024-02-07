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
          title: "Le_Insight | Reset Password",
          description:
            "Thank you for signing up for Le-Insight. You can reset your password by follow the link below.",
          link: "https://le-insight.vercel.app",
          label: "Reset Password",
        },
      });
    } catch (err) {
      Logger.error(err);
      throw new BadGatewayException("Failed to Send Email");
    }
  }
}
