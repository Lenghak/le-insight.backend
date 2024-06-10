import { Injectable } from "@nestjs/common";

import {
  COMMON_PROMPT_TEMPLATE,
  COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
  COMMON_RESPONSE,
} from "@/common/constants/common-rule-prompt";

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
import type { GenerateSensitivitiesResponseType } from "@/modules/sensitivities/dto/generate-sensitivities.dto";

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

import type { ClassifyCategoriesDto } from "./dto/classify-categories.dto";
import type { ClassifySensitiviesDto } from "./dto/classify-sensitivity.dto";

@Injectable()
export class ClassificationsService {
  constructor(private readonly llmService: LlmService) {}

  async categorize(
    classifyCategoriesDto: ClassifyCategoriesDto,
    model?: GetModelDto,
  ): Promise<GenerateCategoriesResponseType> {
    const promptTemplate = PromptTemplate.fromTemplate(
      `${[
        ...COMMON_PROMPT_TEMPLATE,
        "\n+ Classify the following article: \n{article}",
        "\n+ Select categories from the following list: \n[{categories}]",
        ...COMMON_RESPONSE,
      ]}`,
    );

    const llm = this.llmService.getOllamaInstance(model);
    const categories = classifyCategoriesDto.categories.join(", ");

    const response = await promptTemplate
      .pipe(llm)
      .pipe(new JsonOutputParser())
      .invoke({
        rules: [...CATEGORIES_RULE].join("\n"),
        article: classifyCategoriesDto.article,
        categories: categories,
        response_format: JSON.stringify(CATEGORIES_RESPONSE_FORMAT),
      });

    return response;
  }

  async sensitize(
    classifySensitiviteisDto: ClassifySensitiviesDto,
    model?: GetModelDto,
  ): Promise<GenerateSensitivitiesResponseType> {
    const llm = this.llmService.getOllamaInstance(model);

    const chains = PromptTemplate.fromTemplate(
      `${[
        "+ Sensitize the following article: \n{article}",
        "+ Select sensitivities from the following list: \n{sensitivities}",
        ...COMMON_PROMPT_TEMPLATE_WITH_RESPONSE,
      ].join("\n")}`,
    )
      .pipe(llm)
      .pipe(new JsonOutputParser());

    const response = await chains.invoke({
      rules: JSON.stringify(SENSITIVITIES_RULE),
      article: classifySensitiviteisDto.article,
      response_format: JSON.stringify(SENSITIVITIES_RESPONSE_FORMAT),
      sensitivities: classifySensitiviteisDto.sensitivities.join(", "),
    });

    console.log(response);

    return response;
  }
}
