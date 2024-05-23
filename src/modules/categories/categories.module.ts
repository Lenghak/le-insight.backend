import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { ArticlesCategoriesModule } from "@/modules/articles-categories/articles-categories.module";
import { CategoriesRepository } from "@/modules/categories/categories.repository";
import { CategoriesSerializer } from "@/modules/categories/categories.serializer";

import { DrizzleModule } from "@/database/drizzle.module";

import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";

@Module({
  imports: [DrizzleModule, HttpModule, ArticlesCategoriesModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    jsonAPISerializerProvider,
    CategoriesSerializer,
  ],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
