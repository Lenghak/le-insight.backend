import { Module } from "@nestjs/common";

import { LlmModule } from "@/modules/llm/llm.module";

import { EnhancementsService } from "./enhancement.service";
import { EnhancementsController } from "./enhancements.controller";

@Module({
  imports: [LlmModule],
  controllers: [EnhancementsController],
  providers: [EnhancementsService],
  exports: [EnhancementsService],
})
export class EnhancementsModule {}
