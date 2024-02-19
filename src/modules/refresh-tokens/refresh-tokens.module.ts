import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { DrizzleModule } from "@/database/drizzle.module";

import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { RefrehsTokensSerializer } from "./refresh-tokens.serializer";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  imports: [DrizzleModule],
  providers: [
    RefreshTokensRepository,
    RefreshTokensService,
    jsonAPISerializerProvider,
    RefrehsTokensSerializer,
  ],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
