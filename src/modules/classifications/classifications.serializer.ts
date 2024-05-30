import { Inject, Injectable } from "@nestjs/common";

import { type Serializer } from "@/common/interfaces/serializer.interface";
import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import JSONAPISerializer from "json-api-serializer";

@Injectable()
export class ClassificationsSerializer implements Serializer {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
  ) {
    this.serializer.register("classification");
  }

  serialize(data: unknown, meta?: unknown) {
    return this.serializer.serialize("classification", data, meta);
  }
}
