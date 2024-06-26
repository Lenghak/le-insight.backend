import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { MailProcessor } from "./mail.processor";
import { MailSerializer } from "./mail.serializer";
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
    BullModule.registerQueue({
      name: "mail",
    }),
  ],
  providers: [
    MailService,
    MailProcessor,
    jsonAPISerializerProvider,
    MailSerializer,
  ],
  exports: [MailService],
})
export class MailModule {}
