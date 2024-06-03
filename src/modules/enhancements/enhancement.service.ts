import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { COMMON_PROMPT_TEMPLATE_WITH_RESPONSE } from "@/common/constants/common-rule-prompt";

import {
  CONTENT_ENHANCEMENT_PROMPT,
  CONTENT_TONE_CHANGE_PROMPT,
} from "@/modules/enhancements/contants/content-enhance-prompt";
import { CONTENT_GENERATION_REPONSE_FORMAT } from "@/modules/enhancements/contants/content-generation-prompt";
import { TITLE_GENERATION_PROMPT } from "@/modules/enhancements/contants/title-generation-prompt";
import type { ContentExtentionsDto } from "@/modules/enhancements/dto/content-extentions.dto";
import type { ContentOptionDto } from "@/modules/enhancements/dto/content-options.dto";
import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { LlmService } from "@/modules/llm/llm.service";

import { Ollama } from "@langchain/community/llms/ollama";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class EnhancementsService {
  _llm: Ollama = new Ollama({
    cache: false,
    penalizeNewline: true,
    model: "phi3",
    temperature: 0,
    verbose: true,
  });

  constructor(private readonly llmService: LlmService) {}

  async title(enhancementsDTO: EnhancementsDto) {
    const llm = this.llmService.getOllamaInstance();

    const template = [
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "###Content### \n{content}",
    ].join("\n");

    const chains = PromptTemplate.fromTemplate(template)
      .pipe(llm)
      .pipe(new JsonOutputParser());

    const response = await chains.invoke({
      rules: JSON.stringify(TITLE_GENERATION_PROMPT),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      content: enhancementsDTO.content,
    });

    return response;
  }

  async content(
    enhancementsDTO: EnhancementsDto,
    extensions?: ContentExtentionsDto,
  ): Promise<ReadableStream<unknown> & AsyncIterable<unknown>> {
    if (!this._llm)
      throw new InternalServerErrorException("Llm is not initialized");

    const template = [
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "###Content### \n{content}",
    ].join("\n");

    const chains = PromptTemplate.fromTemplate(template)
      .pipe(this._llm)
      .pipe(new JsonOutputParser());

    const stream = await chains.stream({
      rules: [...(extensions?.rules ?? []), ...CONTENT_ENHANCEMENT_PROMPT].join(
        "\n",
      ),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      content: enhancementsDTO.content,
    });

    return stream;
  }

  async grammar(enhancementsDTO: EnhancementsDto) {
    return await this.content(enhancementsDTO, {
      rules: [
        "- YOUR MAIN TASK IS TO FIX THE GRAMMAR AND SPELLING BY RESEARVING USER WRITING STYLES",
        "- DO NOT MODIFY OR ENHANCE THE CONTENT, JUST CORRECT THE GRAMMAR AND SPELLING",
      ],
    });
  }

  async complete(_enhancementsDTO: EnhancementsDto) {}

  async emojify(_enhancementsDTO: EnhancementsDto) {}

  async tldr(_enhancementsDTO: EnhancementsDto) {}

  async summarize(_enhancementsDTO: EnhancementsDto) {}

  async shorten(_enhancementsDTO: EnhancementsDto) {}

  async lengthen(_enhancementsDTO: EnhancementsDto) {}

  async tone(
    enhancementsDTO: EnhancementsDto,
    contentOptionDto: ContentOptionDto,
  ) {
    return await this.content(enhancementsDTO, {
      rules: [
        `- ENHANCE THE CONTENT WITH ${contentOptionDto.tone.toUpperCase()} TONE`,
        CONTENT_TONE_CHANGE_PROMPT[contentOptionDto.tone],
      ],
    });
  }
}
