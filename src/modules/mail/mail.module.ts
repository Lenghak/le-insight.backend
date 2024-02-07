import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { MailService } from "./mail.service";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          secure: configService.get("NODE_ENV") === "production",
          host: configService.get("MAILER_HOST"),
          port: configService.get("MAILER_PORT"),
          auth: {
            user: configService.get("MAILER_USERNAME"),
            pass: configService.get("MAILER_PASSWORD"),
          },
        },
        defaults: {
          from: configService.get("MAILER_FROM"),
        },
        template: {
          dir: join(__dirname),
          adapter: new HandlebarsAdapter({}, { inlineCssEnabled: false }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
