import { Module } from "@nestjs/common";

import { ArticlesCategoriesRepository } from "@/modules/articles-categories/articles-categories.repository";
import { ArticlesCategoriesService } from "@/modules/articles-categories/articles-categories.service";

import { DrizzleModule } from "@/database/drizzle.module";

@Module({
  imports: [DrizzleModule],
  providers: [ArticlesCategoriesRepository, ArticlesCategoriesService],
  exports: [ArticlesCategoriesRepository, ArticlesCategoriesService],
})
export class ArticlesCategoriesModule {}
