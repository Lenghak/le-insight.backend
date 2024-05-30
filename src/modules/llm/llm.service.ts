import { Injectable } from "@nestjs/common";

import type { GetModelDto } from "@/modules/llm/dto/get-model.dto";

import { Ollama } from "@langchain/community/llms/ollama";

@Injectable()
export class LlmService {
  _ollamaInstance: Ollama | undefined = undefined;
  _currentOllamaModel: string | undefined = undefined;

  getOllamaInstance(getModelDto?: GetModelDto) {
    if (
      !this._ollamaInstance ||
      getModelDto?.model !== this._currentOllamaModel
    ) {
      this._currentOllamaModel = getModelDto?.model;
      this._ollamaInstance = new Ollama({
        model: getModelDto?.model ?? "phi3",
        format: "json",
        temperature: 0,
      });
    }
    return this._ollamaInstance;
  }
}
