import { Injectable } from "@nestjs/common";

import type { GetModelDto } from "@/modules/llm/dto/get-model.dto";

import { Ollama } from "@langchain/community/llms/ollama";

@Injectable()
export class LlmService {
  _llmInstances = new Map<string, Ollama>();

  getOllamaInstance(
    getModelDto: GetModelDto = { model: "llama3.2", name: "llama3.2" },
    ollama?: Ollama,
  ) {
    if (
      !this._llmInstances.size ||
      !this._llmInstances.has(getModelDto.name ?? getModelDto.model)
    ) {
      this._llmInstances.set(
        getModelDto.name ?? getModelDto.model,
        ollama ??
          new Ollama({
            model: getModelDto.model,
            format: "json",
            temperature: 0,
            cache: false,
            verbose: true,
          }),
      );
    }

    return (
      this._llmInstances.get(getModelDto.model) ??
      ollama ??
      new Ollama({
        model: getModelDto.model,
        format: "json",
        temperature: 0,
        cache: false,
        verbose: true,
      })
    );
  }
}
