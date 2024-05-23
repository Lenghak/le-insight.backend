import { Module } from "@nestjs/common";

import { ArticlesCategoriesController } from "@/modules/articles-categories/articles-categories.controller";
import { ArticlesCategoriesRepository } from "@/modules/articles-categories/articles-categories.repository";
import { ArticlesCategoriesService } from "@/modules/articles-categories/articles-categories.service";
import { ArticlesModules } from "@/modules/articles/articles.module";
import { CategoriesModule } from "@/modules/categories/categories.module";

import { DrizzleModule } from "@/database/drizzle.module";

@Module({
  imports: [DrizzleModule, ArticlesModules, CategoriesModule],
  controllers: [ArticlesCategoriesController],
  providers: [ArticlesCategoriesRepository, ArticlesCategoriesService],
  exports: [ArticlesCategoriesRepository, ArticlesCategoriesService],
})
export class ArticlesCategoriesModule {}
