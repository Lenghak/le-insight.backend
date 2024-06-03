import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import type { ContentOptionDto } from "@/modules/enhancements/dto/content-options.dto";
import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { EnhancementsService } from "@/modules/enhancements/enhancement.service";

import { FastifyReply } from "fastify";

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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/grammar")
  async grammar(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    res.header("Cache-Control", "no-cache");
    res.header("Connection", "keep-alive");
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.grammar(enhancementsDTO);
      for await (const chunk of readable) {
        res.raw.write(encoder.encode(`${chunk}`));
      }
    } catch (_err) {
      res.status(500).raw.end();
    } finally {
      res.raw.end();
    }
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
    @Res({ passthrough: true }) res: FastifyReply,
    @Param() contentOptionDto: ContentOptionDto,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    res.header("Cache-Control", "no-cache");
    res.header("Connection", "keep-alive");
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.tone(
        enhancementsDTO,
        contentOptionDto,
      );
      for await (const chunk of readable) {
        res.raw.write(encoder.encode(`${chunk}`));
      }
    } catch (_err) {
      res.status(500).raw.end();
    } finally {
      res.raw.end();
    }
  }
}
