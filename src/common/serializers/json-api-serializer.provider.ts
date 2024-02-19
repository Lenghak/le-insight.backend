import Serializer from "json-api-serializer";

export const JSON_API_SERIALIZER = "JSON_API_SERIALIZER";

const serializer = new Serializer({
  convertCase: "snake_case",
  id: "id",
  topLevelMeta: (_: unknown, extraData: Record<string, unknown>) => ({
    ...extraData,
  }),
});

export const jsonAPISerializerProvider = {
  provide: JSON_API_SERIALIZER,
  useFactory: () => {
    return serializer;
  },
  export: [JSON_API_SERIALIZER],
};
