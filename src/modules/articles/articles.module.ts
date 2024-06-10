import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { AuthSerializer } from "@/modules/auth/auth.serializer";
import { CategoriesModule } from "@/modules/categories/categories.module";
import { SensitivitiesModule } from "@/modules/sensitivities/sensitivities.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { ArticlesController } from "./articles.controller";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesSerializer } from "./articles.serializer";
import { ArticlesService } from "./articles.service";

@Module({
  imports: [DrizzleModule, UsersModule, CategoriesModule, SensitivitiesModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesRepository,
    ArticlesService,
    jsonAPISerializerProvider,
    ArticlesSerializer,
    AuthSerializer,
  ],
  exports: [ArticlesService, ArticlesRepository, ArticlesSerializer],
})
export class ArticlesModules {}
