import { Module } from "@nestjs/common";

import { ArticlesController } from "./articles.controller";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesService } from "./articles.service";

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesRepository, ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModules {}
