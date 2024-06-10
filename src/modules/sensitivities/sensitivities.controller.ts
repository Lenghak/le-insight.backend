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

import type { CreateSensitivitiesDto } from "@/modules/sensitivities/dto/create-sensitivities.dto";
import type { GenerateSensitivitiesDTO } from "@/modules/sensitivities/dto/generate-sensitivities.dto";
import type { GetSensitivitiesListDTO } from "@/modules/sensitivities/dto/get-sensitivities-list.dto";
import type { UpdateSensitivitiesDto } from "@/modules/sensitivities/dto/update-sensitivities.dto";

import { UserRoleEnum } from "@/database/schemas/users/users.type";

import { SensitivitiesSerializer } from "./sensitivities.serializer";
import { SensitivitiesService } from "./sensitivities.service";

@Controller({ path: "/sensitivities" })
export class CategoriesController {
  constructor(
    private readonly sensitivitiesService: SensitivitiesService,
    private readonly sensitivitiesSerializer: SensitivitiesSerializer,
  ) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post("/")
  async create(@Body() { ...createSensitivitiesDto }: CreateSensitivitiesDto) {
    return this.sensitivitiesSerializer.serialize(
      await this.sensitivitiesService.create(createSensitivitiesDto),
    );
  }

  @Public()
  @Get("/")
  async lists(@Query() { limit = 50, ...params }: GetSensitivitiesListDTO) {
    return await this.sensitivitiesService.list({
      limit: limit <= 0 ? 50 : limit,
      ...params,
    });
  }

  @Public()
  @Get("/:id")
  async get(@Param("id") id: ParseUUIDPipe) {
    return this.sensitivitiesSerializer.serialize(
      await this.sensitivitiesService.get({ by: "id", values: { id } }),
    );
  }

  @Patch("/:id")
  async edit(
    @Param("id") id: ParseUUIDPipe,
    @Body() updateSensitivitiesDto: UpdateSensitivitiesDto,
  ) {
    return this.sensitivitiesSerializer.serialize(
      await this.sensitivitiesService.update(
        id as unknown as string,
        updateSensitivitiesDto,
      ),
    );
  }

  @Delete("/:id")
  async delete(@Param("id") id: ParseUUIDPipe) {
    return this.sensitivitiesSerializer.serialize(
      await this.sensitivitiesService.delete({ id: id as unknown as string }),
    );
  }

  @Public()
  @Post("/generate")
  async generate(@Body() generateSensitivitiesDTO: GenerateSensitivitiesDTO) {
    const response = await this.sensitivitiesService.generate(
      generateSensitivitiesDTO,
    );

    return this.sensitivitiesSerializer.serialize(response);
  }
}
