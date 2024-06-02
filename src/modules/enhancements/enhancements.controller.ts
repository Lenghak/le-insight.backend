import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { EnhancementsService } from "@/modules/enhancements/enhancement.service";

@Controller("/enhancements")
export class EnhancementsController {
  constructor(private readonly enhancementsService: EnhancementsService) {}

  @Public()
  @Post("/title")
  async title(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.title(enhancementsDTO);
  }

  @Post("/content")
  async content(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.content(enhancementsDTO);
  }

  @Post("/grammer")
  async grammar(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.grammar(enhancementsDTO);
  }

  @Post("/complete")
  async complete(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.complete(enhancementsDTO);
  }

  @Post("/emojify")
  async emojify(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.emojify(enhancementsDTO);
  }

  @Post("/tldr")
  async tldr(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.tldr(enhancementsDTO);
  }

  @Post("/summarize")
  async summarize(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.summarize(enhancementsDTO);
  }

  @Post("/shorten")
  async shorten(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.shorten(enhancementsDTO);
  }

  @Post("/lengthen")
  async lengthen(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.lengthen(enhancementsDTO);
  }

  @Post("/tone")
  async tone(@Body() enhancementsDTO: EnhancementsDto) {
    return await this.enhancementsService.tone(enhancementsDTO);
  }
}
