import { Injectable } from "@nestjs/common";

import { COMMON_PROMPT_TEMPLATE } from "@/common/constants/common-rule-prompt";

import { CONTENT_GENERATION_REPONSE_FORMAT } from "@/modules/enhancements/contants/content-generation-prompt";
import { TITLE_GENERATION_PROMPT } from "@/modules/enhancements/contants/title-generation-prompt";
import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import { LlmService } from "@/modules/llm/llm.service";

import { PromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class EnhancementsService {
  constructor(private readonly llmService: LlmService) {}

  async title(enhancementsDTO: EnhancementsDto) {
    const llm = this.llmService.getOllamaInstance();

    const template = [
      ...COMMON_PROMPT_TEMPLATE,
      "###Content### \n{content}",
    ].join("\n");

    const chains = PromptTemplate.fromTemplate(template).pipe(llm);

    const response = await chains.invoke({
      rules: JSON.stringify(TITLE_GENERATION_PROMPT),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      content: enhancementsDTO.content,
    });

    return JSON.parse(response);
  }

  async content(_enhancementsDTO: EnhancementsDto) {}

  async grammar(_enhancementsDTO: EnhancementsDto) {}

  async complete(_enhancementsDTO: EnhancementsDto) {}

  async emojify(_enhancementsDTO: EnhancementsDto) {}

  async tldr(_enhancementsDTO: EnhancementsDto) {}

  async summarize(_enhancementsDTO: EnhancementsDto) {}

  async shorten(_enhancementsDTO: EnhancementsDto) {}

  async lengthen(_enhancementsDTO: EnhancementsDto) {}

  async tone(_enhancementsDTO: EnhancementsDto) {}
}
