import { Inject } from "@nestjs/common";

import { type Serializer } from "@/common/interfaces/serializer.interface";
import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import JSONAPISerializer, { type JSONAPIDocument } from "json-api-serializer";

export class AuthSerializer implements Serializer {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
  ) {
    this.serializer.register("auth");
  }

  serialize(data: unknown, meta?: unknown): JSONAPIDocument {
    return this.serializer.serialize("auth", data, meta);
  }
}
