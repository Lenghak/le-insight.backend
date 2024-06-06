import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from "@nestjs/common";

import type { ContentOptionDto } from "@/modules/enhancements/dto/content-options.dto";
import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { EnhancementsService } from "@/modules/enhancements/enhancement.service";

import { FastifyReply } from "fastify";

@Controller("/enhancements")
export class EnhancementsController {
  constructor(private readonly enhancementsService: EnhancementsService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/title")
  async title(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.title(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/content")
  async content(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.enhance(enhancementsDTO, {
        rules: [
          "- I want to generate a full article from the input title.",
          "- I want you to it as much as possible with good article writing structure.",
        ],
      });

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/grammar")
  async grammar(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.grammar(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/complete")
  async complete(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.complete(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/emojify")
  async emojify(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.emojify(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/tldr")
  async tldr(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.tldr(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/simplify")
  async summarize(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.simplify(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
      res.send("Done");
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/shorten")
  async shorten(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.shorten(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/lengthen")
  async lengthen(
    @Res({ passthrough: false }) res: FastifyReply,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.lengthen(enhancementsDTO);

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      Logger.error(_err);
      res.status(500);
    } finally {
      res.raw.end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/tone/:tone")
  async tone(
    @Res({ passthrough: false }) res: FastifyReply,
    @Param() contentOptionDto: ContentOptionDto,
    @Body() enhancementsDTO: EnhancementsDto,
  ) {
    const encoder = new TextEncoder();

    try {
      const readable = await this.enhancementsService.tone(
        enhancementsDTO,
        contentOptionDto,
      );

      res.raw.writeHead(200, { "access-control-allow-origin": "*" });
      res.type("text/plain;");

      for await (const chunk of readable) {
        res.raw.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (_err) {
      Logger.error(_err);
      res.status(500);
    } finally {
      res.raw.end();
    }
  }
}
