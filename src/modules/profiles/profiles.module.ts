import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { DrizzleModule } from "@/database/drizzle.module";

import { ProfilesRepository } from "./profiles.repository";
import { ProfileSerializer } from "./profiles.serializer";
import { ProfilesService } from "./profiles.service";

@Module({
  imports: [DrizzleModule],
  providers: [
    ProfilesRepository,
    ProfilesService,
    jsonAPISerializerProvider,
    ProfileSerializer,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
