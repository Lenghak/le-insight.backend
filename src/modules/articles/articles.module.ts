import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { AuthSerializer } from "@/modules/auth/auth.serializer";

import { ArticlesController } from "./articles.controller";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesSerializer } from "./articles.serializer";
import { ArticlesService } from "./articles.service";

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesRepository,
    ArticlesService,
    jsonAPISerializerProvider,
    ArticlesSerializer,
    AuthSerializer,
  ],
  exports: [ArticlesService],
})
export class ArticlesModules {}
