import { Inject, Injectable } from "@nestjs/common";

import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import JSONAPISerializer, { type JSONAPIDocument } from "json-api-serializer";

@Injectable()
export class ArticlesSerializer {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
  ) {
    this.serializer.register("articles");
  }

  serialize(data: unknown, meta?: unknown): JSONAPIDocument {
    return this.serializer.serialize("articles", data, meta);
  }
}
