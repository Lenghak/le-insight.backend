import { type JSONAPIDocument } from "json-api-serializer";

export interface Serializer {
  serialize(data: unknown, meta?: unknown): JSONAPIDocument;
}
