import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { ClassificationsModule } from "@/modules/classifications/classifications.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { CategoriesController } from "./sensitivities.controller";
import { SensitivitiesRepository } from "./sensitivities.repository";
import { SensitivitiesSerializer } from "./sensitivities.serializer";
import { SensitivitiesService } from "./sensitivities.service";

@Module({
  imports: [DrizzleModule, HttpModule, ClassificationsModule],
  controllers: [CategoriesController],
  providers: [
    SensitivitiesService,
    SensitivitiesRepository,
    jsonAPISerializerProvider,
    SensitivitiesSerializer,
  ],
  exports: [SensitivitiesService, SensitivitiesRepository],
})
export class SensitivitiesModule {}
