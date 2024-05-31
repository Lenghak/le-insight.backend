import { Injectable } from "@nestjs/common";

import type { EnhancementsDto } from "@/modules/enhancements/dto/enhancements.dto";
import type { LlmService } from "@/modules/llm/llm.service";

import { PromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class EnhancementsService {
  constructor(private readonly llmService: LlmService) {}

  async title(_enhancementsDTO: EnhancementsDto) {
    const llm = this.llmService.getOllamaInstance();
    const chains = PromptTemplate.fromTemplate("").pipe(llm);
    const response = await chains.invoke({});
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
