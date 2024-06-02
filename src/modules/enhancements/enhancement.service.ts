import { Injectable } from "@nestjs/common";

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

import { PromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class EnhancementsService {
  constructor(private readonly llmService: LlmService) {}

  _llm = this.llmService.getOllamaInstance();

  async title(enhancementsDTO: EnhancementsDto) {
    const template = [
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "###Content### \n{content}",
    ].join("\n");

    const chains = PromptTemplate.fromTemplate(template).pipe(this._llm);

    const response = await chains.invoke({
      rules: JSON.stringify(TITLE_GENERATION_PROMPT),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      content: enhancementsDTO.content,
    });

    return JSON.parse(response);
  }

  async content(
    enhancementsDTO: EnhancementsDto,
    extensions?: ContentExtentionsDto,
  ) {
    const template = [
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "###Content### \n{content}",
    ].join("\n");

    const chains = PromptTemplate.fromTemplate(template).pipe(this._llm);

    const response = await chains.invoke({
      rules: JSON.stringify([
        ...(extensions?.rules ?? []),
        ...CONTENT_ENHANCEMENT_PROMPT,
      ]),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      content: enhancementsDTO.content,
    });

    return JSON.parse(response);
  }

  async grammar(_enhancementsDTO: EnhancementsDto) {}

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
