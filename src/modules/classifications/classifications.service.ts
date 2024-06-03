import { Injectable } from "@nestjs/common";

import { COMMON_PROMPT_TEMPLATE_WITH_RESPONSE } from "@/common/constants/common-rule-prompt";

import type { GenerateCategoriesResponseType } from "@/modules/categories/dto/generate-categories.dto";
import {
  CATEGORIES_RESPONSE_FORMAT,
  CATEGORIES_RULE,
} from "@/modules/classifications/constants/categories-classifications-prompt";
import {
  SENSITIVITIES_RESPONSE_FORMAT,
  SENSITIVITIES_RULE,
} from "@/modules/classifications/constants/sensitivities-classifications-prompt";
import type { GetModelDto } from "@/modules/llm/dto/get-model.dto";
import { LlmService } from "@/modules/llm/llm.service";

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

import type { ClassifyCategoriesDto } from "./dto/classify-categories.dto";
import type { ClassifySensitiviesDto } from "./dto/classify-sensitivity.dto";

@Injectable()
export class ClassificationsService {
  constructor(private readonly llmService: LlmService) {}

  async generate(
    classifyCategoriesDto: ClassifyCategoriesDto,
    model?: GetModelDto,
  ): Promise<GenerateCategoriesResponseType> {
    const promptTemplate = PromptTemplate.fromTemplate(
      [
        "###Categories### \n{categories}",
        "###Article### \n{article}",
        ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      ].join("\n"),
    );

    const llm = this.llmService.getOllamaInstance(model);

    const response = await promptTemplate
      .pipe(llm)
      .pipe(new JsonOutputParser())
      .invoke({
        rules: [
          ...CATEGORIES_RULE,
          "- YOU MUST OUTPUT ONLY THE CATEGORIES FROM THE PROVIDED CATEGORIES",
        ].join("\n"),
        article: JSON.stringify(classifyCategoriesDto.article),
        categories: classifyCategoriesDto.categories.join("\n"),
        response_format: JSON.stringify(CATEGORIES_RESPONSE_FORMAT),
      });

    return response;
  }

  async sensitize(
    classifySensitiviteisDto: ClassifySensitiviesDto,
    model?: GetModelDto,
  ) {
    const llm = this.llmService.getOllamaInstance(model);

    const chains = PromptTemplate.fromTemplate(
      [
        ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
        "###Sensitivities### \n{sensitivities}",
        "###Article### \n{article}",
      ].join("\n"),
    )
      .pipe(llm)
      .pipe(new JsonOutputParser());

    const response = await chains.invoke({
      rules: JSON.stringify(SENSITIVITIES_RULE),
      article: classifySensitiviteisDto.article,
      response_format: JSON.stringify(SENSITIVITIES_RESPONSE_FORMAT),
      sensitivities: JSON.stringify(["positive", "neutral", "negative"]),
    });

    return response;
  }
}
