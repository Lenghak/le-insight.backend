import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import validateEnv from "./core/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      load: [validateEnv],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
