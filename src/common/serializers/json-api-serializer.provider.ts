import { type FactoryProvider, Scope } from "@nestjs/common";

import Serializer from "json-api-serializer";

export const JSON_API_SERIALIZER = "JSON_API_SERIALIZER";

const serializer = new Serializer({
  convertCase: "snake_case",
  id: "id",
  topLevelMeta: (_: unknown, extraData: Record<string, unknown>) => ({
    ...extraData,
  }),
});

export const jsonAPISerializerProvider: FactoryProvider<typeof serializer> = {
  provide: JSON_API_SERIALIZER,
  useFactory: () => {
    return serializer;
  },
  scope: Scope.DEFAULT,
};
