import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import { ArticlesCategoriesService } from "@/modules/articles-categories/articles-categories.service";
import type { ApplyACDTO } from "@/modules/articles-categories/dto/apply-ac.dto";
import type { GenerateACDTO } from "@/modules/articles-categories/dto/generate-ac.dto";
import type { ArticlesListDTO } from "@/modules/articles/dto/articles-list.dto";

@Controller("/articles-categories")
export class ArticlesCategoriesController {
  constructor(private readonly acService: ArticlesCategoriesService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("/")
  async list(@Query() params: ArticlesListDTO) {
    const articles = await this.acService.list(params);
    return articles;
  }

  @Post("/apply")
  async apply(@Body() { article, categories }: ApplyACDTO) {
    return await this.acService.apply({ article, categories });
  }

  @Post("/regenerate")
  async regenerate(@Body() generateACDto: GenerateACDTO) {
    return this.acService.regenerate(generateACDto);
  }
}
