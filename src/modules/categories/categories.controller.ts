import { HttpService } from "@nestjs/axios";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";
import { Roles } from "@/common/decorators/roles.decorator";

import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type {
  GenerateCategoriesDTO,
  GenerateCategoriesResponseType,
} from "@/modules/categories/dto/generate-categories.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";

import { UserRoleEnum } from "@/database/schemas/users/users.type";

import env from "@/core/env";
import type { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";

import { CategoriesSerializer } from "./categories.serializer";
import { CategoriesService } from "./categories.service";

@Controller({ path: "/categories" })
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categoriesSerializer: CategoriesSerializer,
    private readonly httpService: HttpService,
  ) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post("/")
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesSerializer.serialize(
      await this.categoriesService.create(createCategoryDto),
    );
  }

  @Public()
  @Get("/")
  async lists(@Query() params: GetCategoriesListDTO) {
    return await this.categoriesService.list(params);
  }

  @Public()
  @Get("/:id")
  async get(@Param("id") id: ParseUUIDPipe) {
    return this.categoriesSerializer.serialize(
      await this.categoriesService.get({ by: "id", values: { id } }),
    );
  }

  @Patch("/:id")
  async edit(
    @Param("id") id: ParseUUIDPipe,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesSerializer.serialize(
      await this.categoriesService.update(
        id as unknown as string,
        updateCategoryDto,
      ),
    );
  }

  @Delete("/:id")
  async delete(@Param("id") id: ParseUUIDPipe) {
    return this.categoriesSerializer.serialize(
      await this.categoriesService.delete({ id: id as unknown as string }),
    );
  }

  @Public()
  @Post("/generate")
  async generate(@Body() generateCategoriesDTO: GenerateCategoriesDTO) {
    const categories = await firstValueFrom<
      AxiosResponse<GenerateCategoriesResponseType, unknown>
    >(
      this.httpService.post(
        "/categories/generate",
        {
          article: generateCategoriesDTO.article,
        },
        {
          baseURL: env().AI_HOSTNAME,
        },
      ),
    );

    return this.categoriesSerializer.serialize(categories.data);
  }
}
