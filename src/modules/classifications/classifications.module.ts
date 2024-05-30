import { Module } from "@nestjs/common";

import { LlmModule } from "@/modules/llm/llm.module";

import { ClassificationsController } from "./classifications.controller";
import { ClassificationsRepository } from "./classifications.repository";
import { ClassificationsService } from "./classifications.service";

@Module({
  imports: [LlmModule],
  controllers: [ClassificationsController],
  providers: [ClassificationsService, ClassificationsRepository],
  exports: [ClassificationsService, ClassificationsRepository],
})
export class ClassificationsModule {}
