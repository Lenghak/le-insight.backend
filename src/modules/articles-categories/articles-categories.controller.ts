import { Body, Controller, Post } from "@nestjs/common";

import { ArticlesCategoriesService } from "@/modules/articles-categories/articles-categories.service";
import type { ApplyACDTO } from "@/modules/articles-categories/dto/apply-ac.dto";
import type { GenerateACDTO } from "@/modules/articles-categories/dto/generate-ac.dto";

@Controller("/articles-categories")
export class ArticlesCategoriesController {
  constructor(private readonly acService: ArticlesCategoriesService) {}

  @Post("/apply")
  async apply(@Body() { article, categories }: ApplyACDTO) {
    return await this.acService.apply({ article, categories });
  }

  @Post("/generate")
  async regenerate(@Body() generateACDto: GenerateACDTO) {
    return this.acService.regenerate(generateACDto);
  }
}
