import { Body, Controller, Post, Query } from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { GenerateCategoriesDTO } from "@/modules/categories/dto/generate-categories.dto";
import { ClassificationsService } from "@/modules/classifications/classifications.service";
import type { GetModelDto } from "@/modules/llm/dto/get-model.dto";

@Controller("/classifications")
export class ClassificationsController {
  constructor(private readonly classificationService: ClassificationsService) {}

  @Public()
  @Post("/generate")
  async generate(
    @Body() generateCategoriesDTO: GenerateCategoriesDTO,
    @Query() model: GetModelDto,
  ) {
    return await this.classificationService.generate(
      {
        article: generateCategoriesDTO.article,
        categories: [],
      },
      model,
    );
  }

  @Public()
  @Post("/sensitize")
  async sensitize(
    @Body() generateCategoriesDTO: GenerateCategoriesDTO,
    @Query() model: GetModelDto,
  ) {
    return await this.classificationService.generate(
      {
        article: generateCategoriesDTO.article,
        categories: [],
      },
      model,
    );
  }
}
