import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { COMMON_PROMPT_TEMPLATE_WITH_RESPONSE } from "@/common/constants/common-rule-prompt";

import { CONTENT_ENHANCEMENT_PROMPT } from "@/modules/enhancements/contants/content-enhance-prompt";
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
    temperature: 1,
    verbose: true,
    format: "json",
  });

  constructor(private readonly llmService: LlmService) {}

  async title(
    enhancementsDTO: EnhancementsDto,
    extensions?: ContentExtentionsDto,
  ): Promise<ReadableStream<unknown> & AsyncIterable<unknown>> {
    const template = JSON.stringify([
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "Input: \n{input}",
    ]);

    const chains = PromptTemplate.fromTemplate(template)
      .pipe(this._llm)
      .pipe(new JsonOutputParser());

    const stream = await chains.stream({
      rules: JSON.stringify(
        [...(extensions?.rules ?? []), ...TITLE_GENERATION_PROMPT].flat(),
      ),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      input: enhancementsDTO.content,
    });

    return stream;
  }

  async enhance(
    enhancementsDTO: EnhancementsDto,
    extensions?: ContentExtentionsDto,
  ): Promise<ReadableStream<unknown> & AsyncIterable<unknown>> {
    if (!this._llm)
      throw new InternalServerErrorException("Llm is not initialized");

    const template = JSON.stringify([
      ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      "Input: \n{input}",
    ]);

    const chains = PromptTemplate.fromTemplate(template)
      .pipe(this._llm)
      .pipe(new JsonOutputParser());

    const stream = await chains.stream({
      rules: JSON.stringify(
        [...(extensions?.rules ?? []), ...CONTENT_ENHANCEMENT_PROMPT].flat(),
      ),
      response_format: JSON.stringify(CONTENT_GENERATION_REPONSE_FORMAT),
      input: enhancementsDTO.content,
    });

    return stream;
  }

  async grammar(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to fix the spelling and grammar from the provided input.",
        "- DO NOT MODIFY THE MEANING OF THE INPUT, JUST CORRECT THE GRAMMAR AND SPELLING.",
      ],
    });
  }

  async complete(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to auto-complete the provided input.",
        "- I want you to extend the INPUT as long as possible in a complete sentence.",
      ],
    });
  }

  async emojify(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: ["- I want you to turn each sentences from the input to emojis."],
    });
  }

  async tldr(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to summarize the INPUT as TL;DR",
        "- I want you to extend the INPUT as long as possible to at least a paragraphs.",
      ],
    });
  }

  async simplify(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to simiplify the provided content",
        "- I want you to extend the INPUT as long as possible to at least a paragraphs.",
      ],
    });
  }

  async shorten(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: ["- I want you to shorten the provided input"],
    });
  }

  async lengthen(enhancementsDTO: EnhancementsDto) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to lengthen the provided input",
        "- I want you to extend the INPUT as long as possible to at least 2 paragraphs.",
      ],
    });
  }

  async tone(
    enhancementsDTO: EnhancementsDto,
    contentOptionDto: ContentOptionDto,
  ) {
    return await this.enhance(enhancementsDTO, {
      rules: [
        "- I want you to modify the input content based on the provided tone",
        "- I want you to extend the INPUT as long as possible to at least more or equal to the input.",
        `Tone: \n${contentOptionDto.tone}`,
        // CONTENT_TONE_CHANGE_PROMPT[contentOptionDto.tone],
      ],
    });
  }
}
