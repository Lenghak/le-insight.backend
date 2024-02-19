import { Inject } from "@nestjs/common";

import { type Serializer } from "@/common/interfaces/serializer.interface";
import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import JSONAPISerializer from "json-api-serializer";

export class ProfileSerializer implements Serializer {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
  ) {
    this.serializer.register("profile");
  }
  serialize(data: unknown, meta?: unknown): JSONAPISerializer.JSONAPIDocument {
    return this.serializer.serialize("profile", data, meta);
  }
}
