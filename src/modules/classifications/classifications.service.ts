import { Injectable, Logger } from "@nestjs/common";

import type { GenerateCategoriesResponseType } from "@/modules/categories/dto/generate-categories.dto";
import {
  CATEGORIES_RESPONSE_FORMAT,
  CATEGORIES_RULE,
} from "@/modules/classifications/constants/categories-classifications-template";
import {
  SENSITIVITIES_RESPONSE_FORMAT,
  SENSITIVITIES_RULE,
} from "@/modules/classifications/constants/sensitivities-classifications-template";
import type { GetModelDto } from "@/modules/llm/dto/get-model.dto";
import { LlmService } from "@/modules/llm/llm.service";

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
      "###RULES### {rules} \n###Response Format### \n{response_format} \n###Categories### \n{categories} \n###Article### \n{article}",
    );

    const llm = this.llmService.getOllamaInstance(model);

    // Logger.debug(classifyCategoriesDto);
    const input = await promptTemplate.formatPromptValue({
      rules: CATEGORIES_RULE,
      article: JSON.stringify(classifyCategoriesDto.article),
      categories: JSON.stringify(classifyCategoriesDto.categories),
      response_format: JSON.stringify(CATEGORIES_RESPONSE_FORMAT),
    });

    Logger.debug("Classification Input: ", input.value);

    const response = await llm.invoke(input.value);

    Logger.debug("Reponse:", response);

    return JSON.parse(response);
  }

  async sensitize(
    classifySensitiviteisDto: ClassifySensitiviesDto,
    model?: GetModelDto,
  ) {
    const llm = this.llmService.getOllamaInstance(model);

    const chains = PromptTemplate.fromTemplate(
      "###RULES### {rules} \n###Response Format### \n{response_format} \n###Sensitivities### \n{sensitivities} \n###Article### \n{article}",
    ).pipe(llm);

    const response = await chains.invoke({
      rules: JSON.stringify(SENSITIVITIES_RULE),
      article: classifySensitiviteisDto.article,
      response_format: JSON.stringify(SENSITIVITIES_RESPONSE_FORMAT),
      sensitivities: JSON.stringify(["positive", "neutral", "negative"]),
    });

    return JSON.parse(response);
  }
}
