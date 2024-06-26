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
import type { GenerateCategoriesDTO } from "@/modules/categories/dto/generate-categories.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";

import { UserRoleEnum } from "@/database/schemas/users/users.type";

import { CategoriesSerializer } from "./categories.serializer";
import { CategoriesService } from "./categories.service";

@Controller({ path: "/categories" })
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categoriesSerializer: CategoriesSerializer,
  ) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post("/")
  async create(@Body() { ...createCategoriesDto }: CreateCategoryDto) {
    return this.categoriesSerializer.serialize(
      await this.categoriesService.create(createCategoriesDto),
    );
  }

  @Public()
  @Get("/")
  async lists(@Query() { limit = 50, ...params }: GetCategoriesListDTO) {
    return await this.categoriesService.list({
      limit: limit <= 0 ? 50 : limit,
      ...params,
    });
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
    const response = await this.categoriesService.generate(
      generateCategoriesDTO,
    );

    return this.categoriesSerializer.serialize(response);
  }
}
