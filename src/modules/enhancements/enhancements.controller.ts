import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { ContentOptionDto } from "@/modules/enhancements/dto/content-options.dto";
import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { EnhancementsService } from "@/modules/enhancements/enhancement.service";

@Controller("/enhancements")
export class EnhancementsController {
  constructor(private readonly enhancementsService: EnhancementsService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/title")
  async title(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.title(enhancementsDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/content")
  async content(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.content(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/grammer")
  async grammar(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.grammar(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/complete")
  async complete(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.complete(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/emojify")
  async emojify(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.emojify(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/tldr")
  async tldr(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.tldr(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/summarize")
  async summarize(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.summarize(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/shorten")
  async shorten(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.shorten(enhancementsDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/lengthen")
  async lengthen(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.lengthen(enhancementsDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/tone/:tone")
  async tone(
    @Param() contentOptionDto: ContentOptionDto,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    return await this.enhancementsService.tone(
      enhancementsDTO,
      contentOptionDto,
    );
  }
}
