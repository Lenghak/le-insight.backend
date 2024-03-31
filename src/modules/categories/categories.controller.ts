import { HttpService } from "@nestjs/axios";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import type { GenerateCategoriesDTO } from "@/modules/categories/dto/generate-categories.dto";

import { env } from "@/core/env";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";

@Controller({
  path: "/categories",
})
export class CategoriesController {
  constructor(private readonly httpService: HttpService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/generate")
  async generate(
    @Body() generateCategoriesDTO: GenerateCategoriesDTO,
  ): Promise<Observable<AxiosResponse<Record<string, unknown>>>> {
    const categories = this.httpService.post(
      env.AI_HOSTNAME + "/categories/generate",
      generateCategoriesDTO,
    );

    return categories;
  }
}
